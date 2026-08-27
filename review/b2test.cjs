const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  const st=await evaluate(cdp,`(()=>{
    const b=document.querySelector('.band h1');
    return {sections:[...document.querySelectorAll('section')].map(s=>s.id||s.className.split(' ')[1]||s.className.split(' ')[0]),
      bandCase:getComputedStyle(b).textTransform, bandSize:getComputedStyle(b).fontSize,
      subSize:getComputedStyle(document.querySelector('.band .sub')).fontSize,
      loudHead:document.querySelector('.loud .h').textContent.trim(),
      revHead:document.querySelector('#proof .h').innerHTML.indexOf('<br>')>0,
      badLinks:[...document.querySelectorAll('a[href^="#"]')].filter(a=>a.getAttribute('href')!=='#'&&!document.querySelector(a.getAttribute('href'))).map(a=>a.getAttribute('href')),
      overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
  console.log(JSON.stringify(st,null,1));
  await evaluate(cdp,`document.getElementById('guarantee').scrollIntoView({behavior:'instant',block:'center'})`);
  await sleep(2200);
  const g=await evaluate(cdp,`(()=>{const s=document.getElementById('guarantee');
    const tick=document.querySelector('.gd--tick');
    return {inClass:s.className.indexOf('in')>=0, tickOffset:getComputedStyle(tick).strokeDashoffset,
      anims:document.getAnimations().filter(a=>{try{return a.effect.target.closest('.guar')}catch(e){return false}}).length};})()`);
  console.log('guarantee', JSON.stringify(g));
  await shot(cdp,`${OUT}/guar.png`);
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
