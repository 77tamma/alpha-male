const { connect, evaluate, sleep } = require('./cdp.cjs');
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/preview.html'}); await sleep(8000);
  const r=await evaluate(cdp,`(async()=>{
    await document.fonts.ready;
    const loaded=[...document.fonts].map(f=>({fam:f.family,wt:f.weight,status:f.status}));
    return {
      count:document.fonts.size,
      loaded,
      checkAB:document.fonts.check('400 40px "Archivo Black"'),
      checkJB:document.fonts.check('500 11px "JetBrains Mono"'),
      checkMA:document.fonts.check('400 18px "Manrope"'),
      displayVar:getComputedStyle(document.documentElement).getPropertyValue('--display').trim()
    };})()`);
  console.log(JSON.stringify(r,null,1));
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
