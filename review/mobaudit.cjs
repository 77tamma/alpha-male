// Full mobile audit: walk the page at phone width and report, per section, whether it
// overflows, whether its scroll-progress variable actually moves, and whether its film runs.
const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final/';

(async () => {
  const W = Number(process.argv[2] || 390), H = Number(process.argv[3] || 844);
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length = 0;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width:W, height:H, deviceScaleFactor:2, mobile:true });
  await cdp.send('Page.navigate', { url: process.argv[4] || 'http://localhost:8899/' });
  await sleep(7000);

  const meta = await evaluate(cdp, `(()=>({
    docH: document.documentElement.scrollHeight,
    vw: innerWidth, vh: innerHeight,
    sections: [...document.querySelectorAll('section')].map(s=>({
      id: s.id || s.className.split(' ')[1],
      top: Math.round(s.getBoundingClientRect().top + scrollY),
      h: Math.round(s.offsetHeight),
      pos: getComputedStyle(s).position
    }))
  }))()`);
  console.log('viewport ' + meta.vw + 'x' + meta.vh + '   document ' + meta.docH + 'px');
  console.log('sections:');
  meta.sections.forEach(s => console.log('   ' + s.id.padEnd(10) + ' top=' + String(s.top).padStart(6) + '  h=' + String(s.h).padStart(5)));

  // walk the whole page and watch every progress variable + every video
  console.log('\nscroll walk — progress vars and film state:');
  const VARS = ['--k','--t','--sp','--p'];
  const seen = {};
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((meta.docH - meta.vh) * (i / steps));
    await evaluate(cdp, `scrollTo(0, ${y})`);
    await sleep(240);
    const snap = await evaluate(cdp, `(()=>{
      const out = {};
      document.querySelectorAll('section').forEach(s=>{
        const id = s.id || s.className.split(' ')[1];
        const cs = getComputedStyle(s);
        ${JSON.stringify(VARS)}.forEach(v=>{
          const val = cs.getPropertyValue(v).trim();
          if (val !== '') out[id + v] = parseFloat(val);
        });
      });
      out.__ovf = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      out.__vids = [...document.querySelectorAll('video')].map(v=>
        (v.id||'?') + ':' + (v.readyState>0 ? (v.paused?'paused':'playing') : 'unloaded'));
      return out;})()`);
    for (const k of Object.keys(snap)) {
      if (k.startsWith('__')) continue;
      if (!seen[k]) seen[k] = { min: Infinity, max: -Infinity };
      seen[k].min = Math.min(seen[k].min, snap[k]);
      seen[k].max = Math.max(seen[k].max, snap[k]);
    }
    if (snap.__ovf > 0) console.log('   OVERFLOW ' + snap.__ovf + 'px at y=' + y);
    if (i === steps) console.log('   videos at end: ' + JSON.stringify(snap.__vids));
  }

  console.log('\nprogress variables (range over the whole page):');
  Object.keys(seen).sort().forEach(k=>{
    const r = seen[k], moved = (r.max - r.min) > 0.05;
    console.log('   ' + k.padEnd(20) + (moved ? 'MOVES ' : 'STUCK ') + r.min.toFixed(3) + ' → ' + r.max.toFixed(3));
  });

  // anything wider than the viewport?
  console.log('\nelements wider than the viewport:');
  await evaluate(cdp, `scrollTo(0,0)`); await sleep(400);
  const wide = await evaluate(cdp, `(()=>{
    const bad=[]; const vw=innerWidth;
    document.querySelectorAll('body *').forEach(e=>{
      const r=e.getBoundingClientRect();
      if (r.width > vw + 2 && r.height > 4 && getComputedStyle(e).position!=='fixed'){
        bad.push((e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.split(' ').filter(Boolean).slice(0,2).join('.'):e.tagName)+' w='+Math.round(r.width));
      }});
    return [...new Set(bad)].slice(0,14);})()`);
  console.log(wide.length ? wide.map(w=>'   '+w).join('\n') : '   none');

  const errs = cdp.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
  console.log('\nerrors: ' + (errs.length ? errs.map(e=>e.params.entry.text.slice(0,120)).join(' | ') : 'none'));
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
