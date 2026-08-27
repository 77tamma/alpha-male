const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  for (const [w,h] of [[3440,1440],[1920,1080],[375,812]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<500});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5500);
    const g=await evaluate(cdp,`(()=>{const s=document.getElementById('scent');
      return {track:s.offsetHeight, top:Math.round(s.getBoundingClientRect().top+scrollY)};})()`);
    const span=Math.max(1,g.track-h);
    await evaluate(cdp,`window.scrollTo(0,${Math.round(g.top+span*0.7)})`); await sleep(1800);
    const st=await evaluate(cdp,`(()=>{const v=document.getElementById('scentScrub');
      const p=document.querySelector('.pin--scent').getBoundingClientRect();
      return {pinW:Math.round(p.width), fillsWidth:Math.abs(p.width-innerWidth)<2,
        pinTop:Math.round(p.top), t:+v.currentTime.toFixed(2),
        overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
    console.log(String(w).padStart(4)+'x'+h, JSON.stringify(st));
    await shot(cdp,`${OUT}/scrubw-${w}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
