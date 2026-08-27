const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  const g=await evaluate(cdp,`(()=>{const h=document.getElementById('how');
    const f=h.querySelector('.loud__film');
    return {track:h.offsetHeight, filmH:Math.round(f.getBoundingClientRect().height),
      sticky:getComputedStyle(f).position,
      top:Math.round(h.getBoundingClientRect().top+scrollY)};})()`);
  console.log('geom', JSON.stringify(g));
  const span=g.track-g.filmH;
  for (const f of [0,0.12,0.26,0.40,0.54,0.68,0.82,1.0]) {
    const stick=(900-g.filmH)/2;
    await evaluate(cdp,`window.scrollTo(0,${Math.round(g.top - stick + span*f)})`); await sleep(950);
    const st=await evaluate(cdp,`(()=>{const h=document.getElementById('how');
      const cs=getComputedStyle(document.querySelector('.beats'),'::after');
      const nums=cs.transform.replace(/[^0-9.,-]/g,String.fromCharCode(0x27,0x27).slice(0,0)).split(String.fromCharCode(44));
      return {p:+getComputedStyle(h).getPropertyValue('--p').trim(),
        railX:nums.length>4?Math.round(+nums[4]):null, railOp:+(+cs.opacity).toFixed(2),
        beats:[...document.querySelectorAll('.beat')].map(b=>+(+getComputedStyle(b).opacity).toFixed(2)),
        filmTop:Math.round(document.querySelector('.loud__film').getBoundingClientRect().top)};})()`);
    console.log('f='+String(f).padEnd(5), JSON.stringify(st));
    if(f===0.26||f===0.54||f===0.82) await shot(cdp,`${OUT}/lock-${Math.round(f*100)}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
