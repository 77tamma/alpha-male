const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/uw';
(async()=>{
  const cdp=await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  for (const [w,h] of [[2560,1080],[3440,1440],[2000,765],[1920,1080],[1440,900]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(4500);
    const range=await evaluate(cdp,`document.getElementById('hero-sec').offsetHeight - window.innerHeight`);
    await evaluate(cdp,`window.scrollTo(0,${range})`); await sleep(1400);
    const info=await evaluate(cdp,`(()=>{
      const v=document.getElementById('hero'), r=v.getBoundingClientRect();
      const fit=getComputedStyle(v).objectFit;
      const vw=v.videoWidth||1920, vh=v.videoHeight||1080;
      const boxA=r.width/r.height, vidA=vw/vh;
      let scale;
      if(fit==='contain') scale = boxA > vidA ? r.height/vh : r.width/vw;
      else                scale = boxA > vidA ? r.width/vw  : r.height/vh;
      return {viewport:innerWidth+'x'+innerHeight, aspect:+(innerWidth/innerHeight).toFixed(2), objectFit:fit,
        lostTop_Bottom: Math.max(0,Math.round(vh*scale - r.height)),
        lostLeft_Right: Math.max(0,Math.round(vw*scale - r.width)),
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth};
    })()`);
    console.log(JSON.stringify(info));
    await shot(cdp,`${OUT}/fixed-${w}x${h}.png`);
  }
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
