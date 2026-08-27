const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  for (const [w,h] of [[1440,900],[1920,1080],[375,812]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<500});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5500);
    await evaluate(cdp,`document.getElementById('scent').scrollIntoView({behavior:'instant',block:'center'})`);
    await sleep(2000);
    const st=await evaluate(cdp,`(()=>{const v=document.getElementById('scentLoop');
      const f=document.querySelector('.scent__film').getBoundingClientRect();
      return {sec:document.getElementById('scent').offsetHeight,
        filmW:Math.round(f.width), filmH:Math.round(f.height),
        vidPaused:v.paused, vidT:+v.currentTime.toFixed(2), ready:v.readyState,
        vidW:v.videoWidth, vidH:v.videoHeight,
        notes:document.querySelectorAll('#scent .notes li').length,
        overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
    console.log(String(w).padStart(4)+'x'+h, JSON.stringify(st));
    await shot(cdp,`${OUT}/scent-${w}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,120)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
