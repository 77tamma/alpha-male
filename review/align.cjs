// Where does each section's content actually start and end? The reviews look inset
// against the modules above; find out by how much and why.
const { connect, evaluate, sleep } = require('./cdp.cjs');

const PROBE = `(()=>{
  const R=e=>{const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.right),Math.round(r.width)]};
  const rows=[];
  const add=(label,sel)=>{const e=document.querySelector(sel);if(!e){rows.push([label,'MISSING']);return}
    const cs=getComputedStyle(e);
    rows.push([label,R(e),'maxW='+cs.maxWidth,'padL='+cs.paddingLeft]);};
  add('hero band copy','.band .wrap, .band__in, .band .sub');
  add('product wrap','#product .wrap');
  add('scent ui','.scent__ui');
  add('scent left col','.sn--l');
  add('scent head','.scent__head');
  add('how/loud copy','.loud__copy');
  add('proof wrap','#proof .wrap');
  add('proof head','#proof .h');
  add('revs row','.revs');
  add('first review','.rev');
  add('guarantee in','.guar__in');
  add('get wrap','#get .wrap');
  return {gut:getComputedStyle(document.documentElement).getPropertyValue('--gut'),
          vw:innerWidth, rows};})()`;

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  for (const w of [1440, 1920, 2560]) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: false });
    if (w === 1440) { await cdp.send('Page.navigate', { url: 'http://localhost:8899/' }); await sleep(5500); }
    await evaluate(cdp, `scrollTo(0,0)`); await sleep(400);
    // walk the page so every observer has fired and every pin has laid out
    await evaluate(cdp, `scrollTo(0,document.body.scrollHeight)`); await sleep(1200);
    await evaluate(cdp, `scrollTo(0,0)`); await sleep(600);
    const r = await evaluate(cdp, PROBE);
    console.log('=== ' + w + 'px   gut=' + r.gut.trim());
    r.rows.forEach(x => console.log('  ' + JSON.stringify(x)));
  }
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
