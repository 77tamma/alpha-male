const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  for (const [w,h,m] of [[375,812,true],[900,900,false],[1920,1080,false]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:m});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5000);
    await evaluate(cdp,`document.getElementById('how').scrollIntoView({behavior:'instant',block:'start'})`);
    await sleep(1500);
    const st=await evaluate(cdp,`(()=>{const t=document.getElementById('how');
      return {trackH:t.offsetHeight, pinPos:getComputedStyle(t.querySelector('.pin--loud')).position,
        beats:[...document.querySelectorAll('.beat')].map(b=>+getComputedStyle(b).opacity.slice(0,3)),
        cols:getComputedStyle(document.querySelector('.beats')).gridTemplateColumns,
        overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
    console.log(w+'x'+h, JSON.stringify(st));
    await shot(cdp,`${OUT}/loudm-${w}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,120)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
