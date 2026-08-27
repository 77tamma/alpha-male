const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  const top=await evaluate(cdp,`document.getElementById('how').getBoundingClientRect().top+scrollY`);
  const H=await evaluate(cdp,`document.getElementById('how').offsetHeight`);
  console.log('section height', H);
  for (const f of [0.05,0.20,0.30,0.40,0.55,0.75]) {
    await evaluate(cdp,`window.scrollTo(0,${Math.round(top - 700 + (H+700)*f)})`); await sleep(1000);
    const st=await evaluate(cdp,`(()=>{const h=document.getElementById('how');
      const cs=getComputedStyle(document.querySelector('.beats'),'::after');
      return {p:getComputedStyle(h).getPropertyValue('--p').trim(),
        railX:cs.transform, railOpacity:+cs.opacity,
        beats:[...document.querySelectorAll('.beat')].map(b=>+(+getComputedStyle(b).opacity).toFixed(2)),
        headTop:Math.round(document.querySelector('.loud .h').getBoundingClientRect().top - document.querySelector('.loud__film').getBoundingClientRect().top),
        headSize:getComputedStyle(document.querySelector('.loud .h')).fontSize};})()`);
    console.log('p='+f, JSON.stringify(st));
    await shot(cdp,`${OUT}/rail-${Math.round(f*100)}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
