const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  const g=await evaluate(cdp,`(()=>{const s=document.getElementById('scent');
    return {track:s.offsetHeight, top:Math.round(s.getBoundingClientRect().top+scrollY)};})()`);
  const span=g.track-900;
  console.log('track',g.track,'span',span);
  for (const f of [0,0.2,0.4,0.6,0.8,1.0]) {
    await evaluate(cdp,`window.scrollTo(0,${Math.round(g.top+span*f)})`); await sleep(1300);
    const st=await evaluate(cdp,`(()=>{const s=document.getElementById('scent'),v=document.getElementById('scentScrub');
      const p=document.querySelector('.pin--scent').getBoundingClientRect();
      return {sp:getComputedStyle(s).getPropertyValue('--sp').trim(),
        t:+v.currentTime.toFixed(2), dur:+(v.duration||0).toFixed(2), ready:v.readyState,
        src:(v.src||'').slice(0,5), pinTop:Math.round(p.top), pinW:Math.round(p.width),
        notes:[...document.querySelectorAll('#scent .sn li')].map(n=>+(+getComputedStyle(n).opacity).toFixed(2)),
        overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
    console.log('f='+f, JSON.stringify(st));
    if(f===0.4||f===0.8) await shot(cdp,`${OUT}/scrub-${Math.round(f*100)}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,120)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
