const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  await evaluate(cdp,`document.getElementById('how').scrollIntoView({behavior:'instant',block:'center'})`);
  await sleep(1600);
  const g=await evaluate(cdp,`(()=>{const f=document.querySelector('.loud__film').getBoundingClientRect();
    const c=document.querySelector('.loud__copy').getBoundingClientRect();
    const b=document.querySelector('.beats').getBoundingClientRect();
    return {sec:document.getElementById('how').offsetHeight,
      film:[Math.round(f.x),Math.round(f.y),Math.round(f.width),Math.round(f.height)],
      copy:[Math.round(c.x),Math.round(c.y),Math.round(c.width),Math.round(c.height)],
      beats:[Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)],
      beatsInsideFilm: b.top < f.bottom};})()`);
  console.log(JSON.stringify(g));
  await shot(cdp,`${OUT}/look.png`);
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
