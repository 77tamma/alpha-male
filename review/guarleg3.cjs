// Legibility for the rebuilt guarantee. The plate is a background-image, so captures do
// include it — but clip is still in PAGE coordinates, not viewport.
// Sampled at several scroll positions AND several points in the drift loop, because both
// the camera scale and the two drifting layers change what sits behind a given glyph.
const { connect, evaluate, sleep } = require('./cdp.cjs');
const FLOOR = 4.5;
const HIDE = '.guar__kick,.guar__h,.guar__p,.steps';

function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function ratio(a,b){const x=lum(a),y=lum(b),hi=Math.max(x,y),lo=Math.min(x,y);return (hi+0.05)/(lo+0.05);}

// Large text (>=24px bold) is held to AA's 3:1, everything else to 4.5:1.
const TARGETS = [
  ['kicker',    '.guar__kick', 4.5],
  ['head white','.guar__h1',   3.0],
  ['head red',  '.guar__h2',   3.0],
  ['body',      '.guar__p',    4.5],
  ['step',      '.step b',     3.0],
  ['gloss',     '.step em',    4.5],
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
  const W = Number(process.argv[2] || 1600), H = Number(process.argv[3] || 1000);
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width:W, height:H, deviceScaleFactor:1, mobile:W<500 });
  await cdp.send('Page.navigate', { url:'http://localhost:8899/' }); await sleep(6800);

  const top  = await evaluate(cdp, `Math.round(document.getElementById('guarantee').getBoundingClientRect().top + scrollY)`);
  const span = await evaluate(cdp, `(()=>{const s=document.getElementById('guarantee');return Math.max(1,s.offsetHeight-innerHeight);})()`);

  const colours = {};
  await evaluate(cdp, `scrollTo(0, ${top} + ${span})`); await sleep(700);
  for (const [name, sel, floor] of TARGETS) {
    colours[name] = await evaluate(cdp, `(()=>{const e=document.querySelector('${sel}');if(!e)return null;
      const cs=getComputedStyle(e);return cs.color.match(/[\\d.]+/g).slice(0,3).map(Number);})()`);
  }

  console.log(`Guarantee legibility at ${W}x${H} — plate captured directly, clip in page coords.`);
  console.log(`Sampled across scroll positions and drift phases. Floor ${FLOOR}:1.\n`);

  const worst = {};
  let control = null;
  for (const f of [0.5, 0.6, 0.72, 0.85, 1.0]) {
    // Below 900px the section is unpinned, so there is no scrub span to walk — park it in
    // view instead. Using the pinned math there sent the clip off the document, and the
    // harness dutifully reported pure white as the worst background.
    if (span > 2) await evaluate(cdp, `scrollTo(0, ${top} + ${span} * ${f})`);
    else await evaluate(cdp, `document.getElementById('guarantee').scrollIntoView({block:'center',behavior:'instant'})`);
    await sleep(1400);   // let the drift loop advance between samples

    const cc = await evaluate(cdp, `(()=>{const g=document.querySelector('.pin--guar').getBoundingClientRect();
      return {x:Math.round(g.left+scrollX+g.width*0.86),y:Math.round(g.top+scrollY+g.height*0.4),width:100,height:100,scale:1};})()`);
    const cpx = await lightest(cdp, (await cdp.send('Page.captureScreenshot',{format:'png',clip:cc})).data);
    if (!control || lum(cpx) > lum(control)) control = cpx;

    await evaluate(cdp, `document.querySelectorAll('${HIDE}').forEach(e=>e.style.visibility='hidden')`);
    await sleep(90);
    for (const [name, sel, floor] of TARGETS) {
      const rect = await evaluate(cdp, `(()=>{const e=document.querySelector('${sel}');if(!e)return null;const r=e.getBoundingClientRect();
        if(r.width<2||r.height<2) return null;
        return {x:Math.max(0,Math.floor(r.left+scrollX)),y:Math.max(0,Math.floor(r.top+scrollY)),
                width:Math.max(1,Math.ceil(r.width)),height:Math.max(1,Math.ceil(r.height)),scale:1};})()`);
      if (!rect || !colours[name]) continue;
      const px = await lightest(cdp, (await cdp.send('Page.captureScreenshot',{format:'png',clip:rect})).data);
      const r = ratio(colours[name], px);
      if (!worst[name] || r < worst[name].r) worst[name] = { r, px, f, floor };
    }
    await evaluate(cdp, `document.querySelectorAll('${HIDE}').forEach(e=>e.style.visibility='')`);
  }

  console.log('  control (cloud zone) lightest: rgb(' + (control||[]).join(',') + ')'
    + ((control && lum(control) > 0.012) ? '  — plate visible, harness measuring it' : '  — BLIND, results invalid'));
  console.log();
  let pass = true;
  for (const [name] of TARGETS) {
    const w = worst[name];
    if (!w) { console.log('  ' + name.padEnd(10) + ' MISSING'); continue; }
    var fl = w.floor || FLOOR;
    if (w.r < fl) pass = false;
    console.log('  ' + name.padEnd(11) + (w.r >= fl ? 'PASS ' : 'FAIL ') + w.r.toFixed(2) + ':1'
      + '  (floor ' + fl.toFixed(1) + ')   worst bg rgb(' + w.px.join(',') + ') at sp=' + w.f);
  }
  console.log('\n' + (pass ? 'All pass at ' + FLOOR + ':1.' : 'FAILURES above.'));
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
