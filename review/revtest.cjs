const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length = 0;
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: 'http://localhost:8899/' }); await sleep(6500);
  await evaluate(cdp, `document.getElementById('proof').scrollIntoView({block:'start',behavior:'instant'})`);
  await sleep(1500);

  console.log('before:', JSON.stringify(await evaluate(cdp, `(()=>{
    const revs=[...document.querySelectorAll('.rev')];
    return {n:revs.length,
      clipped:revs.filter(r=>r.classList.contains('rev--clip')).length,
      buttons:document.querySelectorAll('.rev__more').length,
      heights:revs.map(r=>Math.round(r.getBoundingClientRect().height)),
      quoteH:revs.map(r=>{const q=r.querySelector('blockquote');return [q.clientHeight,q.scrollHeight]})};})()`)));

  await shot(cdp, `${OUT}/revs-closed.png`);

  // open the first card that has a control
  await evaluate(cdp, `document.querySelector('.rev__more').click()`);
  await sleep(900);
  console.log('after :', JSON.stringify(await evaluate(cdp, `(()=>{
    const f=document.querySelector('.rev.open'); const q=f&&f.querySelector('blockquote');
    const b=f&&f.querySelector('.rev__more');
    const sibs=[...document.querySelectorAll('.rev')].map(r=>Math.round(r.getBoundingClientRect().height));
    return {opened:!!f, label:b&&b.textContent, aria:b&&b.getAttribute('aria-expanded'),
      full:f&&f.style.getPropertyValue('--full'),
      quoteVisible:q&&q.clientHeight, quoteFull:q&&q.scrollHeight, heights:sibs};})()`)));
  await shot(cdp, `${OUT}/revs-open.png`);

  // and close again
  await evaluate(cdp, `document.querySelector('.rev.open .rev__more').click()`);
  await sleep(900);
  console.log('closed:', JSON.stringify(await evaluate(cdp, `(()=>{const b=document.querySelector('.rev__more');
    return {anyOpen:!!document.querySelector('.rev.open'), label:b.textContent, aria:b.getAttribute('aria-expanded')};})()`)));

  const errs = cdp.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
  console.log('errors:', errs.length ? errs.map(e => e.params.entry.text.slice(0, 120)) : 'none');
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
