const { connect, evaluate, sleep, shot } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  for (const [w,h] of [[1280,700],[1440,900],[1920,1080],[3440,1440],[2560,1080],[1100,650]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(4500);
    await evaluate(cdp,`document.getElementById('how').scrollIntoView({behavior:'instant',block:'center'})`);
    await sleep(1200);
    const st=await evaluate(cdp,`(()=>{
      const f=document.querySelector('.loud__film').getBoundingClientRect();
      const c=document.querySelector('.loud__copy').getBoundingClientRect();
      const b=document.querySelector('.beats').getBoundingClientRect();
      return {film:Math.round(f.height), copyBottom:Math.round(c.bottom-f.top),
        beatsTop:Math.round(b.top-f.top), gap:Math.round(b.top-c.bottom),
        collides: c.bottom > b.top,
        beatsBottomInside: b.bottom <= f.bottom + 1,
        headSize:getComputedStyle(document.querySelector('.loud .h')).fontSize,
        overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
    console.log(String(w).padStart(4)+'x'+h, JSON.stringify(st));
    await shot(cdp,`${OUT}/ov-${w}x${h}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
