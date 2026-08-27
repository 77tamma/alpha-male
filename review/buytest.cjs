const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';

const PROBE = `(()=>{
  const out={};
  document.querySelectorAll('.buy').forEach(function(b){
    const id=b.id||'?';
    const opts=[...b.querySelectorAll('.opt')];
    out[id]={
      n:opts.length,
      sel:opts.map(o=>o.classList.contains('is-sel')),
      checked:(b.querySelector('.opt__in:checked')||{}).value,
      dotBg:opts.map(o=>getComputedStyle(o.querySelector('.opt__dot')).backgroundColor),
      cardBg:opts.map(o=>getComputedStyle(o).backgroundColor),
      trust:b.querySelectorAll('.trust li').length,
      cta:(function(){const c=b.querySelector('.cta');return c?{txt:c.querySelector('.cta__t').textContent,
        dis:c.getAttribute('aria-disabled'),w:Math.round(c.getBoundingClientRect().width),
        h:Math.round(c.getBoundingClientRect().height)}:null})(),
      soon:(function(){const e=b.querySelector('.buy__soon');return e?{hidden:e.hidden,t:e.textContent}:null})(),
      widest:Math.max(...opts.map(o=>Math.round(o.getBoundingClientRect().width))),
      overlap:(function(){ // do any two cards overlap horizontally?
        const r=opts.map(o=>o.getBoundingClientRect()).sort((a,b)=>a.left-b.left);
        for(let i=1;i<r.length;i++) if(r[i].left < r[i-1].right-1) return true;
        return false})()
    };
  });
  out.overflowX=document.documentElement.scrollWidth-document.documentElement.clientWidth;
  return out;})()`;

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length = 0;

  for (const w of [1440, 1920, 2560, 1100, 820, 390]) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: w < 500 ? 844 : 1000, deviceScaleFactor: 1, mobile: w < 500 });
    if (w === 1440) { await cdp.send('Page.navigate', { url: 'http://localhost:8899/' }); await sleep(6500); }
    await evaluate(cdp, `scrollTo(0,document.body.scrollHeight)`); await sleep(1600);
    const r = await evaluate(cdp, PROBE);
    console.log('--- ' + w + ' overflowX=' + r.overflowX);
    for (const k of ['buyModule', 'buyClose']) if (r[k]) console.log('   ' + k + ' ' + JSON.stringify(r[k]));
    if (w === 1440) await shot(cdp, `${OUT}/buy-close.png`);
  }

  // selection behaviour
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await evaluate(cdp, `document.getElementById('get').scrollIntoView({block:'center',behavior:'instant'})`);
  await sleep(1200);
  await evaluate(cdp, `document.querySelector('#buyClose .opt .opt__in').click()`);
  await sleep(700);
  console.log('after selecting 1 bottle:', JSON.stringify(await evaluate(cdp, `(()=>{
    const opts=[...document.querySelectorAll('#buyClose .opt')];
    return {sel:opts.map(o=>o.classList.contains('is-sel')),
      checked:document.querySelector('#buyClose .opt__in:checked').value,
      dot0:getComputedStyle(opts[0].querySelector('.opt__dot')).backgroundColor,
      dot1:getComputedStyle(opts[1].querySelector('.opt__dot')).backgroundColor,
      card0:getComputedStyle(opts[0]).borderColor};})()`)));
  await shot(cdp, `${OUT}/buy-sel1.png`);

  const errs = cdp.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error');
  console.log('errors:', errs.length ? errs.map(e => e.params.entry.text.slice(0, 130)) : 'none');
  cdp.close();
})().catch(e => { console.error(e); process.exit(1); });
