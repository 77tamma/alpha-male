const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  const top=await evaluate(cdp,`document.getElementById('how').getBoundingClientRect().top+scrollY`);
  await evaluate(cdp,`window.scrollTo(0,${Math.round(top+250)})`); await sleep(1600);
  const st=await evaluate(cdp,`(()=>{
    const anim=document.getAnimations().filter(a=>{try{return a.effect.target.closest('.fig')}catch(e){return false}});
    return {p:getComputedStyle(document.getElementById('how')).getPropertyValue('--p').trim(),
      sparks:document.querySelectorAll('.fig__sparks i').length,
      animations:anim.length, names:[...new Set(anim.map(a=>a.animationName))],
      imgOpacity:+getComputedStyle(document.querySelector('.fig__img')).opacity,
      imgW:Math.round(document.querySelector('.fig__img').getBoundingClientRect().width),
      overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
  console.log(JSON.stringify(st,null,1));
  for (const i of [0,1,2]) {
    await sleep(1100);
    const m=await evaluate(cdp,`(()=>{const a=[...document.querySelectorAll('.fig__sparks i')].slice(0,3);
      return a.map(e=>{const t=getComputedStyle(e);return t.transform.slice(0,30)+' op='+(+t.opacity).toFixed(2);});})()`);
    console.log('t+'+i+'s', JSON.stringify(m));
    await shot(cdp,`${OUT}/spark-${i}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,120)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
