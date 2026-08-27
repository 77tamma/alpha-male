const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  const top=await evaluate(cdp,`document.getElementById('how').getBoundingClientRect().top+scrollY`);
  await evaluate(cdp,`window.scrollTo(0,${Math.round(top+250)})`); await sleep(1500);
  const st=await evaluate(cdp,`(()=>{
    const anim=document.getAnimations().filter(a=>{try{return a.effect.target.closest&&a.effect.target.closest('.cut')}catch(e){return false}});
    return {p:getComputedStyle(document.getElementById('how')).getPropertyValue('--p').trim(),
      runningAnimations:anim.length,
      names:[...new Set(anim.map(a=>a.animationName))],
      liquidOpacity:+getComputedStyle(document.querySelector('.cut__liquid')).opacity,
      molOpacity:+getComputedStyle(document.querySelector('.cut__mol')).opacity,
      numOpacity:[...document.querySelectorAll('.cut__num .t')].map(t=>+getComputedStyle(t).opacity.slice(0,4)),
      overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
  console.log(JSON.stringify(st,null,1));
  // three frames a second apart prove the loop is actually moving
  for (const i of [0,1,2]) {
    await sleep(1000);
    const pos=await evaluate(cdp,`(()=>{const w=document.querySelector('.cut__wave--a');
      const m=document.querySelector('.cut__mol .m');
      const d=document.querySelector('.cut__drop');
      return {wave:getComputedStyle(w).transform.slice(0,34), mol:getComputedStyle(m).transform.slice(0,34),
              dropOpacity:+getComputedStyle(d).opacity.slice(0,4)};})()`);
    console.log('t+'+i+'s', JSON.stringify(pos));
    await shot(cdp,`${OUT}/live-${i}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,120)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
