const { connect, evaluate, sleep } = require('./cdp.cjs');
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8911/'}); await sleep(9000);
  const g=await evaluate(cdp,`(()=>{const s=document.getElementById('scent');return {track:s.offsetHeight,top:Math.round(s.getBoundingClientRect().top+scrollY)};})()`);
  const span=g.track-900;
  for (const f of [0.25,0.6,0.95]) {
    await evaluate(cdp,`window.scrollTo(0,${Math.round(g.top+span*f)})`); await sleep(1500);
    const st=await evaluate(cdp,`(()=>{const v=document.getElementById('scentScrub');
      return {t:+v.currentTime.toFixed(2),dur:+(v.duration||0).toFixed(2),ready:v.readyState,src:(v.src||'').slice(0,5)};})()`);
    console.log('f='+f, JSON.stringify(st));
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
