const { connect, evaluate, sleep } = require('./cdp.cjs');
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  for (const [w,h] of [[1440,900],[1920,1080]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(4500);
    await evaluate(cdp,`document.getElementById('how').scrollIntoView({behavior:'instant',block:'center'})`);
    await sleep(1100);
    const r=await evaluate(cdp,`(()=>{const e=document.querySelector('.loud .h');
      const cs=getComputedStyle(e); const lh=parseFloat(cs.lineHeight);
      const b=e.getBoundingClientRect();
      const mk=e.querySelector('.h__mark').getBoundingClientRect();
      const copy=document.querySelector('.loud__copy').getBoundingClientRect();
      const f=document.querySelector('.formula').getBoundingClientRect();
      return {fontSize:cs.fontSize,lineHeight:cs.lineHeight,hHeight:Math.round(b.height),
        lines:Math.round(b.height/lh), hWidth:Math.round(b.width),
        copyWidth:Math.round(copy.width), markW:Math.round(mk.width), markH:Math.round(mk.height),
        formulaH:Math.round(f.height), 
        copyH:Math.round(copy.height)};})()`);
    console.log(w+'x'+h, JSON.stringify(r));
  }
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
