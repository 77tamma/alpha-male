// Click the hero CTA the way a person does — a real mouse event at its coordinates, which
// respects pointer-events. A JS .click() bypasses pointer-events and passes on a button
// nobody can actually press.
const { connect, evaluate, sleep } = require('./cdp.cjs');

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length = 0;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width:1600, height:1000, deviceScaleFactor:1, mobile:false });
  await cdp.send('Page.navigate', { url: process.argv[2] || 'http://localhost:8899/' }); await sleep(6800);

  // scroll to where the settle band's CTA is on screen
  const hero = await evaluate(cdp, `document.getElementById('hero-sec').offsetHeight`);
  await evaluate(cdp, `scrollTo(0, ${hero} - window.innerHeight - 40)`);
  await sleep(1600);

  const info = await evaluate(cdp, `(()=>{const b=document.querySelector('.settle-cta .btn');
    if(!b) return null; const r=b.getBoundingClientRect();
    const cx=Math.round(r.left+r.width/2), cy=Math.round(r.top+r.height/2);
    const hit=document.elementFromPoint(cx,cy);
    return {x:cx,y:cy,w:Math.round(r.width),h:Math.round(r.height),
      onScreen: r.top>0 && r.bottom<innerHeight,
      hitTarget: hit ? (hit.className||hit.tagName)+'' : 'none',
      hitIsButton: !!(hit && hit.closest && hit.closest('.settle-cta')),
      pe:getComputedStyle(b).pointerEvents, href:b.getAttribute('href')};})()`);
  console.log('button: ' + JSON.stringify(info));
  if (!info || !info.onScreen) { console.log('NOT ON SCREEN — adjust scroll'); cdp.close(); return; }

  const before = await evaluate(cdp, `Math.round(scrollY)`);
  await cdp.send('Input.dispatchMouseEvent', { type:'mousePressed', x:info.x, y:info.y, button:'left', clickCount:1 });
  await cdp.send('Input.dispatchMouseEvent', { type:'mouseReleased', x:info.x, y:info.y, button:'left', clickCount:1 });
  await sleep(2200);

  const after = await evaluate(cdp, `(()=>{const g=document.getElementById('get').getBoundingClientRect();
    return {scrollY:Math.round(scrollY), offerTop:Math.round(g.top),
      landed: Math.abs(g.top) < 140, hash:location.hash};})()`);
  console.log('before scrollY=' + before);
  console.log('after  ' + JSON.stringify(after));
  console.log(after.landed ? 'REAL CLICK LANDS ON THE OFFER' : 'REAL CLICK DID NOT NAVIGATE');

  const errs = cdp.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
  console.log('errors:', errs.length ? errs.map(e => e.params.entry.text.slice(0,120)) : 'none');
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
