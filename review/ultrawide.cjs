const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/uw';
require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{
  const cdp=await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  for (const [w,h] of [[2560,1080],[3440,1440],[2000,765]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5000);
    const range=await evaluate(cdp,`document.getElementById('hero-sec').offsetHeight - window.innerHeight`);
    await evaluate(cdp,`window.scrollTo(0,${range})`); await sleep(1500);
    const info=await evaluate(cdp,`(()=>{
      const v=document.getElementById('hero');
      const r=v.getBoundingClientRect();
      const vw=v.videoWidth, vh=v.videoHeight;
      const boxA=r.width/r.height, vidA=vw/vh;
      const scale = boxA > vidA ? r.width/vw : r.height/vh;
      const drawnW = vw*scale, drawnH = vh*scale;
      return {viewport:innerWidth+'x'+innerHeight, aspect:+(innerWidth/innerHeight).toFixed(2),
        videoAspect:+(vidA).toFixed(3),
        croppedVertically: Math.round(drawnH - r.height), croppedHorizontally: Math.round(drawnW - r.width),
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth};
    })()`);
    console.log(JSON.stringify(info));
    await shot(cdp,`${OUT}/settle-${w}x${h}.png`);
  }
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
