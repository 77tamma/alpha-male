const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5000);
  const top=await evaluate(cdp,`document.getElementById('how').getBoundingClientRect().top+scrollY`);
  console.log('how top', top);
  for (const off of [-700,-200,200,600,1000]) {
    await evaluate(cdp,`window.scrollTo(0,${Math.round(top+off)})`); await sleep(900);
    const st=await evaluate(cdp,`(()=>{const h=document.getElementById('how');
      const its=[...document.querySelectorAll('.mech__item')];
      return {p:getComputedStyle(h).getPropertyValue('--p').trim(),
        y:its.map(i=>Math.round(i.getBoundingClientRect().top)),
        w:Math.round(document.querySelector('.mech').getBoundingClientRect().width),
        wrapW:Math.round(document.querySelector('#how .wrap').getBoundingClientRect().width),
        formulaOpacity:[...document.querySelectorAll('.formula span,.formula i')].map(s=>+getComputedStyle(s).opacity.slice(0,4)),
        overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
    console.log('off='+off, JSON.stringify(st));
  }
  await evaluate(cdp,`window.scrollTo(0,${Math.round(top+300)})`); await sleep(1200);
  await shot(cdp,`${OUT}/mech-motion.png`);
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,120)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
