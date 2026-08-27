const { connect, evaluate, sleep } = require('./cdp.cjs');
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  for (const [w,h] of [[1280,800],[1440,900],[1920,1080],[2560,1080]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(4000);
    const top=await evaluate(cdp,`document.getElementById('product').getBoundingClientRect().top+scrollY`);
    await evaluate(cdp,`window.scrollTo(0,${Math.round(top+600)})`); await sleep(900);
    const r=await evaluate(cdp,`(()=>[...document.querySelectorAll('.slam')].map(s=>{
      const rg=document.createRange();rg.selectNodeContents(s);
      const rects=[...rg.getClientRects()].filter(r=>r.height>4);
      const lines=[];rects.forEach(r=>{const L=lines.find(l=>Math.abs(l.top-r.top)<6);
        if(L){L.w=Math.max(L.w,r.right-L.left)}else lines.push({top:r.top,left:r.left,w:r.width})});
      return {txt:s.textContent.slice(0,22),lines:lines.length,
              w:Math.round(Math.max(...lines.map(l=>l.w))),
              col:Math.round(document.querySelector('.pin__copy').getBoundingClientRect().width)};
    }))()`);
    console.log(w+'x'+h, JSON.stringify(r));
  }
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
