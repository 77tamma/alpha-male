const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  for (const [w,h] of [[1440,900],[3440,1440],[2560,1080],[1280,800],[375,812]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<500});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5000);
    await evaluate(cdp,`document.getElementById('how').scrollIntoView({behavior:'instant',block:'center'})`);
    await sleep(1500);
    const st=await evaluate(cdp,`(()=>{const f=document.querySelector('.loud__film').getBoundingClientRect();
      return {sec:document.getElementById('how').offsetHeight,
        filmW:Math.round(f.width), filmH:Math.round(f.height),
        fillsWidth: Math.abs(f.width - window.innerWidth) < 2,
        vidPaused:document.getElementById('coupleLoop').paused,
        overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
    console.log(String(w).padStart(4)+'x'+h, JSON.stringify(st));
    await shot(cdp,`${OUT}/wide-${w}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
