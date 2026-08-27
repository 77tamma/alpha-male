const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/preview.html'}); await sleep(9000);
  const st=await evaluate(cdp,`(()=>{const v=document.getElementById('hero');
    return {videoSrcType:(v.src||'').slice(0,12), duration:v.duration||0, readyState:v.readyState,
      ready:v.classList.contains? document.getElementById('hero-sec').className : '',
      fontsLoaded:document.fonts?document.fonts.status:'n/a',
      display:getComputedStyle(document.querySelector('.band h1')).fontFamily.split(',')[0],
      mono:getComputedStyle(document.querySelector('.kicker')).fontFamily.split(',')[0]};})()`);
  console.log('hero',JSON.stringify(st));
  const range=await evaluate(cdp,`document.getElementById('hero-sec').offsetHeight-window.innerHeight`);
  await evaluate(cdp,`window.scrollTo(0,${Math.round(range)})`); await sleep(1600);
  const t=await evaluate(cdp,`+document.getElementById('hero').currentTime.toFixed(2)`);
  console.log('scrubbed to end, currentTime=',t);
  await shot(cdp,`${OUT}/prev-hero.png`);
  const top=await evaluate(cdp,`document.getElementById('product').getBoundingClientRect().top+scrollY`);
  await evaluate(cdp,`window.scrollTo(0,${Math.round(top+1350*0.8)})`); await sleep(1800);
  const pr=await evaluate(cdp,`(()=>{const p=document.getElementById('product');const v=document.getElementById('smokeBed');
    return {t:getComputedStyle(p).getPropertyValue('--t').trim(), vidPaused:v.paused, vidT:+v.currentTime.toFixed(2)};})()`);
  console.log('product',JSON.stringify(pr));
  await shot(cdp,`${OUT}/prev-product.png`);
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('console errors:', errs.length?errs.map(e=>e.params.entry.text):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
