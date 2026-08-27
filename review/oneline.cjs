const { connect, evaluate, sleep } = require('./cdp.cjs');
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  for (const [w,h] of [[1100,650],[1280,700],[1440,900],[1920,1080],[2560,1080],[3440,1440]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(4500);
    await evaluate(cdp,`document.getElementById('how').scrollIntoView({behavior:'instant',block:'center'})`);
    await sleep(1100);
    const r=await evaluate(cdp,`(()=>{const f=document.querySelector('.formula');
      const cs=getComputedStyle(f);const lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.4;
      const b=f.getBoundingClientRect();
      const film=document.querySelector('.loud__film').getBoundingClientRect();
      const copy=document.querySelector('.loud__copy').getBoundingClientRect();
      const beats=document.querySelector('.beats').getBoundingClientRect();
      return {formulaLines:Math.max(1,Math.round(b.height/lh)), formulaW:Math.round(b.width),
        formulaRightPct:Math.round((b.right-film.left)/film.width*100),
        fontSize:cs.fontSize,
        gap:Math.round(beats.top-copy.bottom), collides:copy.bottom>beats.top,
        overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
    console.log(String(w).padStart(4)+'x'+h, JSON.stringify(r));
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
