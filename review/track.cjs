const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5000);
  const geom=await evaluate(cdp,`(()=>{const t=document.getElementById('product');
    return {trackH:t.offsetHeight, vh:innerHeight, docH:document.body.scrollHeight,
            overflowX: document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
  console.log('geom',JSON.stringify(geom));
  const top=await evaluate(cdp,`document.getElementById('product').getBoundingClientRect().top + window.scrollY`);
  const span=geom.trackH-geom.vh;
  for (const f of [0,0.25,0.5,0.75,1]) {
    await evaluate(cdp,`window.scrollTo(0,${Math.round(top+span*f)})`); await sleep(1100);
    const st=await evaluate(cdp,`(()=>{const t=document.getElementById('product');
      const cs=getComputedStyle(t); const v=document.getElementById('smokeBed');
      const slams=[...t.querySelectorAll('.slam')].map(s=>+getComputedStyle(s).opacity.slice(0,4));
      return {t:cs.getPropertyValue('--t').trim(), slams,
              vidPaused:v?v.paused:null, vidT:v?+v.currentTime.toFixed(2):null,
              lede:+getComputedStyle(t.querySelector('.lede')).opacity.slice(0,4)};})()`);
    console.log('f='+f, JSON.stringify(st));
    await shot(cdp,`${OUT}/prod-${String(Math.round(f*100)).padStart(3,'0')}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('console errors:', errs.length?errs.map(e=>e.params.entry.text):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
