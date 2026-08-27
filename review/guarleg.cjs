// Worst-frame legibility for the guarantee, using the corrected method: clip PER element,
// hide the glyphs so the plate behind is what gets sampled, score against each element's
// OWN colour, and sample several points in the smoke loop rather than one frame.
const { connect, evaluate, sleep } = require('./cdp.cjs');
const FLOOR = 4.5;   // body-size text, so AA proper rather than the large-text 3:1
const HIDE = '.guar__kick,.guar__h,.guar__p,.guar__n,.guar__unit,.guar__list';

function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function ratio(a,b){const x=lum(a),y=lum(b),hi=Math.max(x,y),lo=Math.min(x,y);return (hi+0.05)/(lo+0.05);}

async function lightest(cdp, b64) {
  return evaluate(cdp, `(async () => {
    const img = new Image(); img.src = 'data:image/png;base64,${b64}'; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d'); x.drawImage(img,0,0);
    const d = x.getImageData(0,0,c.width,c.height).data;
    const f = v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); };
    let worst = -1, px = null;
    for (let i=0;i<d.length;i+=4){
      const L = 0.2126*f(d[i]) + 0.7152*f(d[i+1]) + 0.0722*f(d[i+2]);
      if (L > worst){ worst = L; px = [d[i],d[i+1],d[i+2]]; }
    }
    return px;
  })()`);
}

const TARGETS = [
  ['kicker',   '.guar__kick'],
  ['headline', '.guar__h'],
  ['body',     '.guar__p'],
  ['365',      '.guar__n'],
  ['DAYS',     '.guar__unit > b'],
  ['gloss',    '.guar__unit > span'],
  ['item head','.guar__list b'],
  ['item gloss','.guar__list span'],
];

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width:1920, height:1000, deviceScaleFactor:1, mobile:false });
  await cdp.send('Page.navigate', { url:'http://localhost:8899/' }); await sleep(6500);
  await evaluate(cdp, `document.getElementById('guarantee').scrollIntoView({block:'center',behavior:'instant'})`);
  await sleep(3000);

  const colours = {};
  for (const [name, sel] of TARGETS) {
    colours[name] = await evaluate(cdp, `(()=>{const e=document.querySelector('${sel}');if(!e)return null;
      const cs=getComputedStyle(e);const m=cs.color.match(/[\\d.]+/g).slice(0,3).map(Number);
      const op=parseFloat(cs.opacity);return op<1?m.map(v=>Math.round(v*op)):m;})()`);
  }

  console.log('Guarantee legibility — glyphs hidden, lightest pixel behind each element, own colour.');
  console.log('Sampled at four points across the smoke loop. Floor ' + FLOOR + ':1.\n');

  const worstOf = {};
  for (const t of [0.4, 2.1, 3.8, 5.5]) {
    await evaluate(cdp, `(()=>{const v=document.getElementById('guarSmoke');if(v&&v.duration)v.currentTime=${t};})()`);
    await sleep(600);
    await evaluate(cdp, `document.querySelectorAll('${HIDE}').forEach(e=>e.style.visibility='hidden')`);
    await sleep(120);
    for (const [name, sel] of TARGETS) {
      const rect = await evaluate(cdp, `(()=>{const e=document.querySelector('${sel}');if(!e)return null;
        const r=e.getBoundingClientRect();
        return {x:Math.max(0,Math.floor(r.left)),y:Math.max(0,Math.floor(r.top)),
                width:Math.max(1,Math.ceil(r.width)),height:Math.max(1,Math.ceil(r.height)),scale:1};})()`);
      if (!rect || !colours[name]) continue;
      const shot = await cdp.send('Page.captureScreenshot', { format:'png', clip:rect });
      const px = await lightest(cdp, shot.data);
      const r = ratio(colours[name], px);
      if (!worstOf[name] || r < worstOf[name].r) worstOf[name] = { r, px, t };
    }
    await evaluate(cdp, `document.querySelectorAll('${HIDE}').forEach(e=>e.style.visibility='')`);
  }

  let pass = true;
  for (const [name] of TARGETS) {
    const w = worstOf[name];
    if (!w) { console.log('  ' + name.padEnd(11) + ' MISSING'); continue; }
    const ok = w.r >= FLOOR;
    if (!ok) pass = false;
    console.log('  ' + name.padEnd(11) + (ok ? 'PASS ' : 'FAIL ') + w.r.toFixed(2) + ':1'
      + '   lightest bg rgb(' + w.px.join(',') + ') at t=' + w.t + 's');
  }
  console.log('\n' + (pass ? 'All pass at ' + FLOOR + ':1.' : 'FAILURES above.'));
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
