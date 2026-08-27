const { connect, evaluate, sleep } = require('./cdp.cjs');
const fs=require('fs');
function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function ratio(a,b){const x=lum(a),y=lum(b),hi=Math.max(x,y),lo=Math.min(x,y);return (hi+0.05)/(lo+0.05);}
const SEC=[180,168,172];
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(5000);
  const range=await evaluate(cdp,`document.getElementById('hero-sec').offsetHeight - window.innerHeight`);
  const {a,b}=await evaluate(cdp,`(()=>{const x=document.querySelectorAll('.band')[3];return{a:+x.dataset.a,b:+x.dataset.b}})()`);
  for (const frac of [0.65,0.9]) {
    const p=a+(b-a)*frac;
    await evaluate(cdp,`window.scrollTo(0,${Math.round(range*p)})`); await sleep(1100);
    const boxes=await evaluate(cdp,`[...document.querySelectorAll('.band')[3].querySelectorAll('.band__col')].map((c,i)=>{const r=c.getBoundingClientRect();return{i,x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),px:Math.round(r.x+scrollX),py:Math.round(r.y+scrollY)}})`);
    await evaluate(cdp,`document.querySelectorAll('.band')[3].querySelectorAll('h1,h2,.sub,.kicker,.spec,.btn,.settle-logo').forEach(e=>e.style.visibility='hidden')`);
    await sleep(300);
    for(const bx of boxes){
      const s=await cdp.send('Page.captureScreenshot',{format:'png',clip:{x:bx.px,y:bx.py,width:bx.w,height:bx.h,scale:1},captureBeyondViewport:false});
      fs.writeFileSync(`shots/diag-p${frac}-col${bx.i}.png`,Buffer.from(s.data,'base64'));
      const px=await evaluate(cdp,`(async()=>{const img=new Image();img.src='data:image/png;base64,${s.data}';await img.decode();
        const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);
        const d=x.getImageData(0,0,c.width,c.height).data;const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
        let w=-1,q=null,wx=0,wy=0;
        for(let i=0;i<d.length;i+=4){const L=0.2126*f(d[i])+0.7152*f(d[i+1])+0.0722*f(d[i+2]);
          if(L>w){w=L;q=[d[i],d[i+1],d[i+2]];const n=i/4;wx=n%c.width;wy=Math.floor(n/c.width);}}
        return {q,wx,wy,W:c.width,H:c.height};})()`);
      console.log(`p=${frac} col${bx.i} box(x=${bx.x},y=${bx.y},w=${bx.w},h=${bx.h}) worst rgb(${px.q.join(',')}) at ${px.wx},${px.wy} of ${px.W}x${px.H}  sub=${ratio(SEC,px.q).toFixed(2)}:1`);
    }
    await evaluate(cdp,`document.querySelectorAll('.band')[3].querySelectorAll('h1,h2,.sub,.kicker,.spec,.btn,.settle-logo').forEach(e=>e.style.visibility='')`);
  }
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
