const { connect, evaluate, shot, setViewport, sleep } = require('./cdp.cjs');
const URL = 'http://localhost:8899/';
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/shots';

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');

  // ---------------- FLICK TEST against the taller hero
  await setViewport(cdp, 1440, 900, false);
  await cdp.send('Page.navigate', { url: URL });
  await sleep(4500);
  console.log('FLICK TEST (need >=5 consecutive full steps at 120px, and no band skippable at 360px)\n');
  for (const step of [120, 240, 360]) {
    await evaluate(cdp, `window.scrollTo(0,0)`); await sleep(900);
    const log = [];
    const count = step === 120 ? 40 : step === 240 ? 20 : 14;
    for (let i = 0; i < count; i++) {
      await evaluate(cdp, `window.scrollBy(0, ${step})`);
      await sleep(340);
      log.push(await evaluate(cdp, `[...document.querySelectorAll('.band')].map(b=>+(+getComputedStyle(b).opacity).toFixed(2))`));
    }
    const holds = [0,1,2,3].map(bi => { let best=0,cur=0; for(const r of log){ if(r[bi]>=0.95){cur++;best=Math.max(best,cur);} else cur=0; } return best; });
    const ever  = [0,1,2,3].map(bi => log.some(r => r[bi] >= 0.95));
    const ok = step===120 ? holds.every(h=>h>=5) : ever.every(Boolean);
    console.log(`  ${step}px: holds=[${holds.join(', ')}]  reachedFull=[${ever.join(', ')}]  ${ok?'PASS':'FAIL'}`);
  }

  // ---------------- HOLD, longer press
  await cdp.send('Page.navigate', { url: URL }); await sleep(4000);
  const bx = await evaluate(cdp, `(() => { document.querySelector('#scent').scrollIntoView({behavior:'instant',block:'center'});
    return new Promise(r=>setTimeout(()=>{const e=document.getElementById('dropbox').getBoundingClientRect();
    r({x:Math.round(e.x+e.width/2),y:Math.round(e.y+e.height/2)});},700)); })()`);
  const readP = () => evaluate(cdp, `+(+getComputedStyle(document.getElementById('dropbox')).getPropertyValue('--p')||0).toFixed(3)`);

  await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:bx.x,y:bx.y,button:'left',clickCount:1});
  await sleep(700); const held = await readP();
  await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:bx.x,y:bx.y,button:'left',clickCount:1});
  await sleep(250); const easing = await readP();
  await sleep(1500); const settled = await readP();
  console.log(`\nHOLD: after 700ms press p=${held}; 250ms after release p=${easing} (must be between 0 and ${held}); after 1.75s p=${settled}`);
  console.log(`  eases back rather than snapping: ${(+easing > 0 && +easing < +held) ? 'PASS' : 'FAIL'}`);

  // hold to completion
  await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:bx.x,y:bx.y,button:'left',clickCount:1});
  await sleep(5000);
  await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:bx.x,y:bx.y,button:'left',clickCount:1});
  await sleep(2200);
  const done = await evaluate(cdp, `({done:document.getElementById('dropbox').classList.contains('done'),
    hint:document.getElementById('hint').textContent,
    lit:[...document.querySelectorAll('#notes li')].filter(l=>l.classList.contains('lit')).length})`);
  console.log(`  completion: ${JSON.stringify(done)}  ${done.done && done.lit===3 ? 'PASS':'FAIL'}`);
  await shot(cdp, OUT + '/hold-complete.png');

  // ---------------- CONTRAST re-check
  const contrast = await evaluate(cdp, `(() => {
    function lum(c){const [r,g,b]=c.match(/\\d+/g).map(Number).slice(0,3).map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*r+0.7152*g+0.0722*b;}
    function ratio(f,b){const a=lum(f),c=lum(b);const hi=Math.max(a,c),lo=Math.min(a,c);return (hi+0.05)/(lo+0.05);}
    const out={};const probe=(sel,label)=>{const e=document.querySelector(sel);if(!e)return;const s=getComputedStyle(e);
      let bg='rgb(10,7,8)';let p=e;while(p){const pb=getComputedStyle(p).backgroundColor;if(pb&&pb!=='rgba(0, 0, 0, 0)'){bg=pb;break;}p=p.parentElement;}
      out[label]={ratio:+ratio(s.color,bg).toFixed(2),size:parseFloat(s.fontSize)};};
    probe('.fine','footer fine print');probe('.lede','section lede');probe('.step p','step body');
    probe('.q .a p','faq answer');probe('.foot a','footer link');probe('.notes .lab','note label');
    probe('.nav__link','nav link');probe('.price__u','price unit');probe('.step__n','step number');
    return out;})()`);
  console.log('\nCONTRAST:');
  let cFail = 0;
  for (const k in contrast){const c=contrast[k];const need=c.size>=24?3:4.5;
    if(c.ratio<need)cFail++;
    console.log(`  ${k.padEnd(20)} ${String(c.ratio).padStart(6)}:1 (${c.size}px) ${c.ratio>=need?'PASS':'FAIL needs '+need}`);}

  // ---------------- console errors + final screenshots
  const errs = cdp.events.filter(e=>e.method==='Log.entryAdded'&&e.params.entry.level==='error').map(e=>e.params.entry.text);
  console.log('\nCONSOLE ERRORS:', errs.length?errs:'none');

  await evaluate(cdp,`window.scrollTo(0,0)`); await sleep(1200);
  await shot(cdp, OUT+'/final-top.png');
  const range = await evaluate(cdp,`document.getElementById('hero-sec').offsetHeight - window.innerHeight`);
  await evaluate(cdp,`window.scrollTo(0,${Math.round(range*0.6)})`); await sleep(1300);
  await shot(cdp, OUT+'/final-band2.png');
  await evaluate(cdp,`window.scrollTo(0,${range})`); await sleep(1300);
  await shot(cdp, OUT+'/final-settle.png');
  await evaluate(cdp,`document.querySelector('#product').scrollIntoView({behavior:'instant',block:'start'})`); await sleep(1300);
  await shot(cdp, OUT+'/final-product.png');
  await evaluate(cdp,`document.querySelector('#faq').scrollIntoView({behavior:'instant',block:'start'})`); await sleep(1200);
  await shot(cdp, OUT+'/final-faq.png');

  console.log(`\nCONTRAST FAILURES: ${cFail}`);
  cdp.close();
})().catch(e=>{console.error('FAIL',e);process.exit(1);});
