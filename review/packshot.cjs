const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  const top=await evaluate(cdp,`document.getElementById('product').getBoundingClientRect().top+scrollY`);
  await evaluate(cdp,`window.scrollTo(0,${Math.round(top+1000)})`); await sleep(1600);
  await shot(cdp,`${OUT}/pack-new.png`);
  // hotspot visibility
  const d=await evaluate(cdp,`(()=>{const s=document.querySelector('.spot__dot');
    const cs=getComputedStyle(s), a=getComputedStyle(s,'::after'), b=getComputedStyle(s,'::before');
    return {size:cs.width, shadow:cs.boxShadow.slice(0,60),
      ringAfter:a.animationName+' '+a.animationDuration+' border '+a.borderTopWidth,
      ringBefore:b.animationName+' '+b.animationDuration+' delay '+b.animationDelay};})()`);
  console.log('hotspot', JSON.stringify(d,null,1));
  await evaluate(cdp,`document.getElementById('scent').scrollIntoView({behavior:'instant',block:'center'})`);
  await sleep(1600); await shot(cdp,`${OUT}/scent-bright.png`);
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
