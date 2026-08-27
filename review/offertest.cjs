const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length = 0;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: 'http://localhost:8899/' }); await sleep(6500);
  await evaluate(cdp, `document.getElementById('get').scrollIntoView({block:'center',behavior:'instant'})`);
  await sleep(1800);

  console.log(JSON.stringify(await evaluate(cdp, `(()=>{
    const T=[...document.querySelectorAll('#get .tier')];
    const r=e=>{const b=e.getBoundingClientRect();return [Math.round(b.left),Math.round(b.width),Math.round(b.height)]};
    return {
      order:T.map(t=>t.dataset.buy),
      geom:T.map(r),
      best:(()=>{const b=document.querySelector('.tier--best');const cs=getComputedStyle(b);
        return {border:cs.borderColor,shadow:cs.boxShadow.slice(0,40),
                price:getComputedStyle(b.querySelector('.tier__p')).fontSize,
                flagTop:Math.round(b.querySelector('.tier__flag').getBoundingClientRect().top - b.getBoundingClientRect().top)}})(),
      plainPrice:getComputedStyle(document.querySelector('#get .tier:not(.tier--best) .tier__p')).fontSize,
      h2:document.querySelector('#get h2').innerText,
      sub:document.querySelector('#get .sub').innerText.slice(0,60),
      note:document.querySelector('.close__note').innerText.replace(/\\n/g,' | '),
      soon:(()=>{const e=document.querySelector('.close__soon');return {hidden:e.hidden,text:e.textContent}})(),
      soonCls:[...document.querySelectorAll('#get .tier')].map(t=>t.className),
      overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`), null, 1));

  await shot(cdp, `${OUT}/offer.png`);

  // hover the best-value card and confirm it actually changes
  const before = await evaluate(cdp, `(()=>{const b=document.querySelector('.tier--best');const cs=getComputedStyle(b);
    return {bg:cs.backgroundColor,tr:cs.transform,sh:cs.boxShadow.length}})()`);
  const box = await evaluate(cdp, `(()=>{const b=document.querySelector('.tier--best').getBoundingClientRect();
    return [Math.round(b.left+b.width/2),Math.round(b.top+b.height/2)]})()`);
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box[0], y: box[1] });
  await sleep(700);
  const after = await evaluate(cdp, `(()=>{const b=document.querySelector('.tier--best');const cs=getComputedStyle(b);
    return {bg:cs.backgroundColor,tr:cs.transform,sh:cs.boxShadow.length}})()`);
  console.log('hover before:', JSON.stringify(before));
  console.log('hover after :', JSON.stringify(after));
  console.log('changed:', before.bg !== after.bg || before.tr !== after.tr);
  await shot(cdp, `${OUT}/offer-hover.png`);

  const errs = cdp.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
  console.log('errors:', errs.length ? errs.map(e => e.params.entry.text.slice(0, 120)) : 'none');
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
