const { connect, evaluate, sleep } = require('./cdp.cjs');
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8911/'}); await sleep(9000);
  const st=await evaluate(cdp,`(()=>{const v=document.getElementById('hero');const s=document.getElementById('stage')||document.querySelector('.stage');
    return {stageClass:document.querySelector('.stage')?document.querySelector('.stage').className:'?',
            heroSecClass:document.getElementById('hero-sec').className,
            videoSrc:(v.src||'').slice(0,12), readyState:v.readyState,
            videoFailed:!!document.querySelector('.video-failed'),
            videoReady:!!document.querySelector('.video-ready')};})()`);
  console.log(JSON.stringify(st,null,1));
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded');
  console.log('log entries:'); errs.slice(0,6).forEach(e=>console.log('  ['+e.params.entry.level+']',e.params.entry.text.slice(0,160)));
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
