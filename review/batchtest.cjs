const { connect, evaluate, shot, sleep } = require('./cdp.cjs');
const OUT='C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/final';
(async()=>{
  const cdp=await connect(); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  cdp.events.length=0;
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:'http://localhost:8899/'}); await sleep(6000);
  const st=await evaluate(cdp,`(()=>{
    const secs=[...document.querySelectorAll('section')].map(s=>s.id||s.className.split(' ')[0]);
    const row=document.getElementById('revs');
    const packs=[...document.querySelectorAll('.pack')].map(p=>({
      buy:p.dataset.buy, price:p.querySelector('.pack__p').textContent,
      w:Math.round(p.getBoundingClientRect().width),
      qSize:getComputedStyle(p.querySelector('.pack__q')).fontSize,
      uSize:getComputedStyle(p.querySelector('.pack__u')).fontSize}));
    return {sections:secs, hasInside:!!document.getElementById('inside'),
      reviews:document.querySelectorAll('.rev').length,
      rowOverflow:row?row.scrollWidth>row.clientWidth:null,
      oneRow:row?getComputedStyle(row).gridAutoFlow:null,
      packs, headline:document.querySelector('#proof .h').textContent.trim().slice(0,40),
      dot:getComputedStyle(document.querySelector('.spot__dot')).width,
      overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth};})()`);
  console.log(JSON.stringify(st,null,1));
  await evaluate(cdp,`document.getElementById('proof').scrollIntoView({behavior:'instant',block:'start'})`);
  await sleep(1400); await shot(cdp,`${OUT}/reviews.png`);
  // page the row
  await evaluate(cdp,`document.querySelector('.revs__btn[data-rev="1"]').click()`);
  await sleep(1200);
  const after=await evaluate(cdp,`(()=>{const r=document.getElementById('revs');
    return {scrollLeft:Math.round(r.scrollLeft), max:Math.round(r.scrollWidth-r.clientWidth),
      prevEnabled:!document.querySelector('.revs__btn[data-rev="-1"]').disabled};})()`);
  console.log('after paging', JSON.stringify(after));
  await shot(cdp,`${OUT}/reviews-paged.png`);
  const errs=cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error');
  console.log('errors:',errs.length?errs.map(e=>e.params.entry.text.slice(0,110)):'none');
  cdp.close();
})().catch(e=>{console.error(e);process.exit(1);});
