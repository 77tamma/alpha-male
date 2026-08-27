// Desktop vs phone, element by element: what disappears, what changes size, and how much
// air each section carries. Everything is keyed on a stable path so the two runs line up.
const { connect, evaluate, sleep } = require('./cdp.cjs');
const fs = require('fs');

const COLLECT = `(()=>{
  const path = e => {
    const bits = [];
    let n = e;
    while (n && n.tagName && bits.length < 4){
      let b = n.tagName.toLowerCase();
      if (n.id) { bits.unshift('#'+n.id); break; }
      const c = (typeof n.className === 'string' ? n.className : '').split(' ').filter(Boolean)
                 .filter(x => x !== 'in' && x !== 'on' && x !== 'm-rise' && x !== 'is-sel');
      if (c.length) b += '.' + c.slice(0,2).join('.');
      bits.unshift(b);
      n = n.parentElement;
    }
    return bits.join('>');
  };
  const out = {};
  document.querySelectorAll('section, section *, footer, footer *').forEach(e=>{
    const cs = getComputedStyle(e);
    const txt = (e.childNodes.length && [...e.childNodes].some(n=>n.nodeType===3 && n.textContent.trim()))
                ? e.textContent.trim().slice(0,44) : '';
    if (!txt && !/^(IMG|VIDEO|svg)$/i.test(e.tagName)) return;
    const k = path(e) + (txt ? '::' + txt.slice(0,22) : '');
    if (out[k]) return;
    out[k] = {
      shown: cs.display !== 'none' && cs.visibility !== 'hidden',
      fs: Math.round(parseFloat(cs.fontSize) * 10) / 10,
      lh: cs.lineHeight,
      sec: (e.closest('section') ? (e.closest('section').id || e.closest('section').className.split(' ')[1]) : 'footer'),
      txt
    };
  });
  // section rhythm
  const secs = {};
  document.querySelectorAll('section').forEach(s=>{
    const cs = getComputedStyle(s);
    secs[s.id || s.className.split(' ')[1]] = {
      h: Math.round(s.offsetHeight),
      padT: Math.round(parseFloat(cs.paddingTop)),
      padB: Math.round(parseFloat(cs.paddingBottom))
    };
  });
  return {out, secs};
})()`;

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  const grab = async (w, h, mobile) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width:w, height:h, deviceScaleFactor:1, mobile });
    await cdp.send('Page.navigate', { url: process.argv[2] || 'http://localhost:8899/' });
    await sleep(6500);
    // walk the page so observers fire and everything reaches its resting state
    const dh = await evaluate(cdp, `document.documentElement.scrollHeight`);
    for (let y = 0; y < dh; y += Math.round(h * 0.8)) { await evaluate(cdp, `scrollTo(0,${y})`); await sleep(130); }
    await evaluate(cdp, `scrollTo(0,0)`); await sleep(500);
    return evaluate(cdp, COLLECT);
  };

  const D = await grab(1600, 1000, false);
  const M = await grab(390, 844, true);
  cdp.close();

  console.log('=== TEXT PRESENT ON DESKTOP, GONE ON MOBILE ===');
  let missing = 0;
  Object.keys(D.out).forEach(k=>{
    const d = D.out[k], m = M.out[k];
    if (!d.shown || !d.txt) return;
    if (!m || !m.shown) { missing++; console.log('   [' + d.sec + '] ' + d.txt + '\n        ' + k.split('::')[0]); }
  });
  if (!missing) console.log('   none');

  console.log('\n=== TYPE SCALE: mobile / desktop ratio (sorted, worst first) ===');
  const rows = [];
  Object.keys(D.out).forEach(k=>{
    const d = D.out[k], m = M.out[k];
    if (!d.shown || !m || !m.shown || !d.txt) return;
    if (!d.fs || !m.fs) return;
    rows.push({ sec:d.sec, txt:d.txt.slice(0,32), d:d.fs, m:m.fs, r:m.fs/d.fs });
  });
  rows.sort((a,b)=>a.r-b.r);
  rows.slice(0,16).forEach(r=>console.log('   ' + String(r.r.toFixed(2)).padStart(5) + '  ' +
    String(r.d).padStart(5) + ' → ' + String(r.m).padStart(5) + '   [' + r.sec + '] ' + r.txt));
  console.log('   ...');
  rows.slice(-6).forEach(r=>console.log('   ' + String(r.r.toFixed(2)).padStart(5) + '  ' +
    String(r.d).padStart(5) + ' → ' + String(r.m).padStart(5) + '   [' + r.sec + '] ' + r.txt));

  console.log('\n=== SECTION RHYTHM ===');
  console.log('   ' + 'section'.padEnd(11) + 'desktop h / padT / padB      mobile h / padT / padB');
  Object.keys(D.secs).forEach(k=>{
    const d = D.secs[k], m = M.secs[k] || {};
    console.log('   ' + k.padEnd(11) +
      String(d.h).padStart(6) + ' / ' + String(d.padT).padStart(4) + ' / ' + String(d.padB).padStart(4) +
      '        ' + String(m.h).padStart(5) + ' / ' + String(m.padT).padStart(4) + ' / ' + String(m.padB).padStart(4));
  });

  fs.writeFileSync('review/work/compare.json', JSON.stringify({D,M}, null, 1));
  console.log('\nfull data → review/work/compare.json');
})().catch(e => { console.error(e); process.exit(1); });
