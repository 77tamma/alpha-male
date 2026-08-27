const { connect, evaluate, sleep } = require('./cdp.cjs');
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  for (const [w,h] of [[1440,900],[1280,800],[1920,1080],[2560,1080]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
    await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(4000);
    const r=await evaluate(cdp,`(()=>{
      const out=[];
      document.querySelectorAll('#bands .band').forEach((b,i)=>{
        const el=b.querySelector('h1 .sharp')||b.querySelector('h1')||b.querySelector('h2');
        const col=b.querySelector('.band__col');
        const rng=document.createRange(); rng.selectNodeContents(el);
        const rects=[...rng.getClientRects()].filter(r=>r.height>4);
        // merge rects that share a line
        const lines=[]; rects.forEach(r=>{const L=lines.find(l=>Math.abs(l.top-r.top)<6);
          if(L){L.left=Math.min(L.left,r.left);L.right=Math.max(L.right,r.right);}
          else lines.push({top:r.top,left:r.left,right:r.right});});
        const widest=Math.max(...lines.map(l=>l.right-l.left));
        out.push({band:i, lines:lines.length, widest:Math.round(widest),
                  colW:Math.round(col.getBoundingClientRect().width),
                  fs:Math.round(parseFloat(getComputedStyle(el).fontSize))});
      });
      return {vp:innerWidth+'x'+innerHeight, out};
    })()`);
    console.log(r.vp, JSON.stringify(r.out));
  }
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
