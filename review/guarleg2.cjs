// Worst-frame legibility for the guarantee.
//
// Two corrections. First: captureScreenshot clip is in PAGE coordinates, not viewport —
// every clip was offset by the scroll position and sampled the wrong band entirely.
// Second: CDP's captureScreenshot does NOT composite a <video>
// layer in this environment — a control probe taken in the middle of the smoke's own
// territory came back as pure canvas, so the first run of this test was a false pass on
// every element. The fix is to swap the <video> for a <canvas> carrying the SAME class,
// with the current frame drawn into it. Canvas is a replaced element, so object-fit,
// mask-image and opacity all still apply: the browser does the real compositing, and the
// result is capturable.
const { connect, evaluate, sleep } = require('./cdp.cjs');
const FLOOR = 4.5;
const HIDE = '.guar__kick,.guar__h,.guar__p,.guar__n,.guar__unit,.guar__list';

function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function ratio(a,b){const x=lum(a),y=lum(b),hi=Math.max(x,y),lo=Math.min(x,y);return (hi+0.05)/(lo+0.05);}

const SHIM = t => `(()=>{
  var v=document.getElementById('guarSmoke');
  if(!v||!v.videoWidth) return 'novideo';
  v.currentTime=${t};
  return new Promise(res=>{
    var go=function(){
      var old=document.getElementById('guarShim'); if(old) old.remove();
      var c=document.createElement('canvas');
      c.width=v.videoWidth; c.height=v.videoHeight;
      c.getContext('2d').drawImage(v,0,0);
      c.className=v.className; c.id='guarShim';
      v.parentNode.insertBefore(c,v);
      v.style.display='none';
      res('ok '+v.videoWidth+'x'+v.videoHeight);
    };
    if(Math.abs(v.currentTime-${t})<0.05) setTimeout(go,120);
    else v.addEventListener('seeked',function(){setTimeout(go,60);},{once:true});
  });})()`;

const TARGETS = [
  ['kicker',    '.guar__kick'],
  ['headline',  '.guar__h'],
  ['body',      '.guar__p'],
  ['365',       '.guar__n'],
  ['DAYS',      '.guar__unit > b'],
  ['gloss',     '.guar__unit > span'],
  ['item head', '.guar__list b'],
  ['item gloss','.guar__list span'],
];

async function lightest(cdp, b64) {
  return evaluate(cdp, `(async () => {
    const img = new Image(); img.src = 'data:image/png;base64,${b64}'; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d'); x.drawImage(img,0,0);
    const d = x.getImageData(0,0,c.width,c.height).data;
    const f = v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); };
    let worst=-1, px=null;
    for (let i=0;i<d.length;i+=4){
      const L=0.2126*f(d[i])+0.7152*f(d[i+1])+0.0722*f(d[i+2]);
      if (L>worst){ worst=L; px=[d[i],d[i+1],d[i+2]]; }
    }
    return px;
  })()`);
}

(async () => {
  const W = Number(process.argv[2] || 1920), H = Number(process.argv[3] || 1000);
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width:W, height:H, deviceScaleFactor:1, mobile:W<500 });
  await cdp.send('Page.navigate', { url:'http://localhost:8899/' }); await sleep(6500);
  await evaluate(cdp, `document.getElementById('guarantee').scrollIntoView({block:'center',behavior:'instant'})`);
  await sleep(3200);

  const colours = {};
  for (const [name, sel] of TARGETS) {
    colours[name] = await evaluate(cdp, `(()=>{const e=document.querySelector('${sel}');if(!e)return null;
      const cs=getComputedStyle(e);const m=cs.color.match(/[\\d.]+/g).slice(0,3).map(Number);
      const op=parseFloat(cs.opacity);return op<1?m.map(v=>Math.round(v*op)):m;})()`);
  }

  console.log(`Guarantee legibility at ${W}x${H} — video shimmed to canvas so the plate is really composited.`);
  console.log(`Lightest pixel behind each element, scored against its own colour. Floor ${FLOOR}:1.\n`);

  const worst = {};
  let control = null;
  for (const t of [0.3, 1.6, 2.9, 4.2, 5.5, 6.6]) {
    const ok = await evaluate(cdp, SHIM(t));
    if (typeof ok === 'string' && ok.indexOf('ok') !== 0) { console.log('  shim failed: ' + ok); break; }

    // control: the smoke's own territory must NOT read as bare canvas, or the harness is blind
    const cc = await evaluate(cdp, `(()=>{const g=document.getElementById('guarantee').getBoundingClientRect();
      return {x:Math.round(g.left+scrollX+g.width*0.80),y:Math.round(g.top+scrollY+g.height*0.34),width:110,height:110,scale:1};})()`);
    const cpx = await lightest(cdp, (await cdp.send('Page.captureScreenshot',{format:'png',clip:cc})).data);
    if (!control || lum(cpx) > lum(control)) control = cpx;

    await evaluate(cdp, `document.querySelectorAll('${HIDE}').forEach(e=>e.style.visibility='hidden')`);
    await sleep(90);
    for (const [name, sel] of TARGETS) {
      const rect = await evaluate(cdp, `(()=>{const e=document.querySelector('${sel}');if(!e)return null;const r=e.getBoundingClientRect();
        return {x:Math.max(0,Math.floor(r.left+scrollX)),y:Math.max(0,Math.floor(r.top+scrollY)),
                width:Math.max(1,Math.ceil(r.width)),height:Math.max(1,Math.ceil(r.height)),scale:1};})()`);
      if (!rect || !colours[name]) continue;
      const px = await lightest(cdp, (await cdp.send('Page.captureScreenshot',{format:'png',clip:rect})).data);
      const r = ratio(colours[name], px);
      if (!worst[name] || r < worst[name].r) worst[name] = { r, px, t };
    }
    await evaluate(cdp, `document.querySelectorAll('${HIDE}').forEach(e=>e.style.visibility='')`);
  }

  console.log('  control (smoke zone) lightest: rgb(' + (control||[]).join(',') + ')'
    + ((control && lum(control) > 0.012) ? '  — plate is visible, harness is measuring it' : '  — STILL BLIND, results invalid'));
  console.log();
  let pass = true;
  for (const [name] of TARGETS) {
    const w = worst[name];
    if (!w) { console.log('  ' + name.padEnd(11) + ' MISSING'); continue; }
    if (w.r < FLOOR) pass = false;
    console.log('  ' + name.padEnd(11) + (w.r >= FLOOR ? 'PASS ' : 'FAIL ') + w.r.toFixed(2) + ':1'
      + '   worst bg rgb(' + w.px.join(',') + ') at t=' + w.t + 's');
  }
  console.log('\n' + (pass ? 'All pass at ' + FLOOR + ':1.' : 'FAILURES above.'));
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
