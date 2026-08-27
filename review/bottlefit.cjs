const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  for (const [w,h] of [[1440,900],[1920,1080],[3440,1440]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5500);
    const g=await evaluate(cdp,`(()=>{const s=document.getElementById('scent');return {track:s.offsetHeight,top:Math.round(s.getBoundingClientRect().top+scrollY)};})()`);
    const span=Math.max(1,g.track-h);
    await evaluate(cdp,`window.scrollTo(0,${Math.round(g.top+span*0.85)})`); await sleep(1600);
    const st=await evaluate(cdp,`(()=>{const v=document.getElementById('scentScrub');
      const p=document.querySelector('.pin--scent').getBoundingClientRect();
      // how much of the video is actually shown, given contain
      const scale=Math.min(p.width/v.videoWidth, p.height/v.videoHeight);
      return {pinW:Math.round(p.width),pinH:Math.round(p.height),
        shownW:Math.round(v.videoWidth*scale), shownH:Math.round(v.videoHeight*scale),
        fullFrameVisible: Math.round(v.videoHeight*scale) <= p.height+1,
        t:+v.currentTime.toFixed(2), overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
    console.log(String(w).padStart(4)+'x'+h, JSON.stringify(st));
    await shot(cdp,`${OUT}/fit-${w}.png`);
  }
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
