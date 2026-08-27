const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8911/'}); await sleep(10000);
  const range=await evaluate(cdp,`document.getElementById('hero-sec').offsetHeight-window.innerHeight`);
  console.log('--- hero scrub under CSP ---');
  for (const [n,f] of [['01',0],['02',0.32],['03',0.60],['04',1.0]]) {
    await evaluate(cdp,`window.scrollTo(0,${Math.round(range*f)})`); await sleep(1500);
    const t=await evaluate(cdp,`+document.getElementById('hero').currentTime.toFixed(2)`);
    console.log('  p='+f+'  currentTime='+t);
    await shot(cdp,`${OUT}/csp-hero-${n}.png`);
  }
  console.log('--- product module under CSP ---');
  const top=await evaluate(cdp,`document.getElementById('product').getBoundingClientRect().top+scrollY`);
  await evaluate(cdp,`window.scrollTo(0,${Math.round(top+990*0.75)})`); await sleep(1800);
  const pr=await evaluate(cdp,`(()=>{const p=document.getElementById('product'),v=document.getElementById('smokeBed');
    return {t:getComputedStyle(p).getPropertyValue('--t').trim(), bedPaused:v.paused, bedT:+v.currentTime.toFixed(2),
            shotLoaded:document.querySelector('.rig__unit').naturalWidth};})()`);
  console.log('  '+JSON.stringify(pr));
  await shot(cdp,`${OUT}/csp-product.png`);
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:', errs.length? errs.map(e=>e.params.entry.text.slice(0,100)) : 'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
