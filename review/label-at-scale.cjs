const { connect, evaluate, sleep } = require('./cdp.cjs');
const fs = require('fs');
(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5000);
  const range = await evaluate(cdp,`document.getElementById('hero-sec').offsetHeight - window.innerHeight`);
  await evaluate(cdp,`window.scrollTo(0, ${'${range}'})`.replace('${range}', range));
  await sleep(1500);
  // full settle, exactly as a visitor sees it
  let s = await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.writeFileSync('scale-settle.png', Buffer.from(s.data,'base64'));
  // and the bottle's label at 1:1, no magnification
  const box = await evaluate(cdp,`(()=>{const r=document.getElementById('stage').getBoundingClientRect();
     return {x:Math.round(r.x+scrollX), y:Math.round(r.y+scrollY)};})()`);
  s = await cdp.send('Page.captureScreenshot',{format:'png',
    clip:{x:box.x+600,y:box.y+250,width:240,height:520,scale:1},captureBeyondViewport:false});
  fs.writeFileSync('scale-label.png', Buffer.from(s.data,'base64'));
  console.log('captured at real page scale');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
