const { connect, evaluate, sleep } = require('./cdp.cjs');
const fs = require('fs');
(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  const qs = process.argv[2] || '';
  const out = process.argv[3] || 'composite.png';
  await cdp.send('Page.navigate',{url:'http://localhost:8899/_work/composite.html'+qs});
  await sleep(4000);
  const t = await evaluate(cdp,'document.title');
  const shot = await cdp.send('Page.captureScreenshot',{format:'png',clip:{x:0,y:0,width:1920,height:1080,scale:1},captureBeyondViewport:false});
  fs.writeFileSync(out, Buffer.from(shot.data,'base64'));
  console.log('title:'+t+'  ->  '+out);
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
