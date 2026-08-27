// Find everything that is invisible on a phone at the moment it is on screen.
// The cause is structural: below 900px the tracks unpin, so a progress value that means
// "how far through the pinned stretch" no longer maps to "what the reader can see".
const { connect, evaluate, sleep } = require('./cdp.cjs');

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width:390, height:844, deviceScaleFactor:2, mobile:true });
  await cdp.send('Page.navigate', { url: process.argv[2] || 'http://localhost:8899/' });
  await sleep(7000);

  const docH = await evaluate(cdp, `document.documentElement.scrollHeight`);
  const vh = await evaluate(cdp, `innerHeight`);
  const worst = {};

  for (let y = 0; y <= docH - vh; y += 220) {
    await evaluate(cdp, `scrollTo(0, ${y})`);
    await sleep(200);
    const hidden = await evaluate(cdp, `(()=>{
      const out=[];
      document.querySelectorAll('section *').forEach(e=>{
        const r=e.getBoundingClientRect();
        // only things actually inside the viewport right now
        if (r.bottom < 40 || r.top > innerHeight - 40 || r.width < 8 || r.height < 8) return;
        const cs=getComputedStyle(e);
        if (cs.visibility==='hidden' || cs.display==='none') return;
        const op=parseFloat(cs.opacity);
        if (op >= 0.85) return;
        if (!e.textContent.trim() && !e.querySelector('img,video,svg')) return;   // ignore pure decoration
        const sec=e.closest('section');
        out.push({sel:(e.className&&typeof e.className==='string'?'.'+e.className.split(' ').filter(Boolean).slice(0,2).join('.'):e.tagName),
                  sec:(sec?(sec.id||sec.className.split(' ')[1]):'?'), op:+op.toFixed(2)});
      });
      return out;})()`);
    hidden.forEach(h => {
      const key = h.sec + ' ' + h.sel;
      if (!worst[key] || h.op < worst[key]) worst[key] = h.op;
    });
  }

  console.log('On screen but invisible at some point during a normal phone scroll:\n');
  const keys = Object.keys(worst).sort();
  if (!keys.length) console.log('   none');
  keys.forEach(k => console.log('   ' + k.padEnd(46) + 'min opacity ' + worst[k].toFixed(2)));
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
