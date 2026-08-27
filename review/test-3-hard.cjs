const { connect, evaluate, shot, setViewport, sleep } = require('./cdp.cjs');
const URL = 'http://localhost:8899/';
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/shots';

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  // =============================================== 1. THE FLICK TEST
  await setViewport(cdp, 1440, 900, false);
  await cdp.send('Page.navigate', { url: URL });
  await sleep(4500);

  for (const step of [120, 240, 360]) {
    await evaluate(cdp, `window.scrollTo(0,0)`);
    await sleep(900);
    const log = [];
    const count = step === 120 ? 28 : step === 240 ? 14 : 10;
    for (let i = 0; i < count; i++) {
      await evaluate(cdp, `window.scrollBy(0, ${step})`);
      await sleep(380);
      const r = await evaluate(cdp, `[...document.querySelectorAll('.band')].map(b=>+(+getComputedStyle(b).opacity).toFixed(2))`);
      log.push(r);
    }
    // how many consecutive steps does each band hold >=0.95 ?
    const holds = [0,1,2,3].map(bi => {
      let best = 0, cur = 0;
      for (const row of log) { if (row[bi] >= 0.95) { cur++; best = Math.max(best, cur); } else cur = 0; }
      return best;
    });
    const everFull = [0,1,2,3].map(bi => log.some(row => row[bi] >= 0.95));
    console.log(`FLICK ${step}px: consecutive-full-steps per band = [${holds.join(', ')}]   reachedFull = [${everFull.join(', ')}]`);
  }

  // ================================ 2. WORST-FRAME LEGIBILITY AUDIT
  // hide the glyphs, screenshot the real composited page, find the lightest pixel
  // under each band's text box. Conservative: hiding glyphs also removes their shadow.
  const bandProbe = [
    { i: 0, p: 0.10 }, { i: 1, p: 0.35 }, { i: 2, p: 0.60 }, { i: 3, p: 0.90 }
  ];
  const range = await evaluate(cdp, `document.getElementById('hero-sec').offsetHeight - window.innerHeight`);
  console.log('\nWORST-FRAME LEGIBILITY (needs >= 3.5:1):');
  for (const bp of bandProbe) {
    await evaluate(cdp, `window.scrollTo(0, ${Math.round(range * bp.p)})`);
    await sleep(1100);
    const box = await evaluate(cdp, `(() => {
      const b = document.querySelectorAll('.band')[${bp.i}];
      const col = b.querySelector('.band__col');
      const r = col.getBoundingClientRect();
      return {x:Math.max(0,Math.round(r.x)),y:Math.max(0,Math.round(r.y)),w:Math.round(r.width),h:Math.round(r.height)};
    })()`);
    // hide glyphs only
    await evaluate(cdp, `(() => {
      const b = document.querySelectorAll('.band')[${bp.i}];
      b.querySelectorAll('h1,h2,.sub,.kicker,.spec,.btn').forEach(e=>e.style.visibility='hidden');
    })()`);
    await sleep(300);
    const r = await cdp.send('Page.captureScreenshot', { format: 'png', clip: { x: box.x, y: box.y, width: Math.max(8,box.w), height: Math.max(8,box.h), scale: 1 } });
    require('fs').writeFileSync(`${OUT}/audit-band${bp.i}.png`, Buffer.from(r.data, 'base64'));
    await evaluate(cdp, `(() => {
      const b = document.querySelectorAll('.band')[${bp.i}];
      b.querySelectorAll('h1,h2,.sub,.kicker,.spec,.btn').forEach(e=>e.style.visibility='');
    })()`);
    console.log(`  band ${bp.i}: captured text zone ${box.w}x${box.h} at (${box.x},${box.y})`);
  }

  // ================================= 3. REDUCED MOTION, BOTH DIRECTIONS
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await cdp.send('Page.navigate', { url: URL });
  await sleep(3500);
  const rm = await evaluate(cdp, `(() => {
    const v=document.getElementById('hero');
    return {
      videoRequested: !!v.src,
      staticHeroVisible: getComputedStyle(document.querySelector('.static-hero')).display !== 'none',
      notesLit: [...document.querySelectorAll('#notes li')].every(li=>li.classList.contains('lit')),
      envOn: document.getElementById('env').classList.contains('on'),
      motesPresent: document.querySelectorAll('.mote').length
    };
  })()`);
  console.log('\nREDUCED MOTION (loaded with it on):', JSON.stringify(rm));
  await shot(cdp, OUT + '/reduced-motion.png');

  // flip it OFF mid-session, scrub must re-arm
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await sleep(2500);
  const rmOff = await evaluate(cdp, `(() => {
    const v=document.getElementById('hero');
    return { videoRequestedAfterFlipOff: !!v.src, posterSet: !!document.getElementById('poster').style.backgroundImage };
  })()`);
  console.log('REDUCED MOTION flipped OFF mid-session:', JSON.stringify(rmOff));

  // ======================================= 4. COMPLETE WITHOUT THE VIDEO
  await cdp.send('Emulation.setEmulatedMedia', { features: [] });
  await cdp.send('Network.setBlockedURLs', { urls: ['*hero-scrub.mp4'] });
  await cdp.send('Page.navigate', { url: URL });
  await sleep(6000);
  const noVid = await evaluate(cdp, `(() => ({
    stageFailed: document.getElementById('stage').classList.contains('video-failed'),
    posterShown: document.getElementById('poster').classList.contains('in'),
    ringGone: !document.getElementById('ring'),
    bandsPresent: document.querySelectorAll('.band').length,
    ctaClickable: !!document.querySelector('.band .btn')
  }))()`);
  console.log('\nVIDEO BLOCKED:', JSON.stringify(noVid));
  await shot(cdp, OUT + '/no-video.png');
  await cdp.send('Network.setBlockedURLs', { urls: [] });

  // ============================== 5. THE HOLD, WITH REAL MOUSE EVENTS
  await cdp.send('Page.navigate', { url: URL });
  await sleep(4000);
  const bx = await evaluate(cdp, `(() => {
    document.querySelector('#scent').scrollIntoView({behavior:'instant',block:'center'});
    return new Promise(r=>setTimeout(()=>{
      const e=document.getElementById('dropbox').getBoundingClientRect();
      r({x:Math.round(e.x+e.width/2),y:Math.round(e.y+e.height/2)});
    },600));
  })()`);
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: bx.x, y: bx.y, button: 'left', clickCount: 1 });
  await sleep(400);
  const partial = await evaluate(cdp, `+(+getComputedStyle(document.getElementById('dropbox')).getPropertyValue('--p')||0).toFixed(2)`);
  // release early: must ease back, never snap
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: bx.x, y: bx.y, button: 'left', clickCount: 1 });
  await sleep(500);
  const eased = await evaluate(cdp, `+(+getComputedStyle(document.getElementById('dropbox')).getPropertyValue('--p')||0).toFixed(2)`);
  // now hold to completion
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: bx.x, y: bx.y, button: 'left', clickCount: 1 });
  await sleep(1600);
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: bx.x, y: bx.y, button: 'left', clickCount: 1 });
  await sleep(1800);
  const done = await evaluate(cdp, `(() => ({
    doneClass: document.getElementById('dropbox').classList.contains('done'),
    hint: document.getElementById('hint').textContent,
    lit: [...document.querySelectorAll('#notes li')].filter(li=>li.classList.contains('lit')).length
  }))()`);
  console.log('\nHOLD INTERACTION: after 400ms hold p=' + partial + ', after early release p=' + eased + ' (must be lower, not 0 instantly)');
  console.log('HOLD COMPLETED:', JSON.stringify(done));
  await shot(cdp, OUT + '/hold-done.png');

  // ================================================= 6. CONTRAST CHECKS
  const contrast = await evaluate(cdp, `(() => {
    function lum(c){const [r,g,b]=c.match(/\\d+/g).map(Number).slice(0,3).map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*r+0.7152*g+0.0722*b;}
    function ratio(fg,bg){const a=lum(fg),b=lum(bg);const hi=Math.max(a,b),lo=Math.min(a,b);return (hi+0.05)/(lo+0.05);}
    const out={};
    const probe=(sel,label)=>{const e=document.querySelector(sel);if(!e)return;const s=getComputedStyle(e);
      let bg='rgb(10,7,8)';let p=e;while(p){const pb=getComputedStyle(p).backgroundColor;if(pb&&pb!=='rgba(0, 0, 0, 0)'){bg=pb;break;}p=p.parentElement;}
      out[label]={color:s.color,bg:bg,ratio:+ratio(s.color,bg).toFixed(2),size:s.fontSize};};
    probe('.fine','footer fine print');
    probe('.lede','section lede');
    probe('.step p','step body');
    probe('.q .a p','faq answer');
    probe('.foot a','footer link');
    probe('.notes .lab','note label');
    probe('.nav__link','nav link');
    return out;
  })()`);
  console.log('\nCONTRAST (body text needs 4.5:1, large text 3:1):');
  for (const k in contrast) {
    const c = contrast[k];
    const need = parseFloat(c.size) >= 24 ? 3 : 4.5;
    console.log(`  ${k.padEnd(20)} ${String(c.ratio).padStart(6)}:1  (${c.size})  ${c.ratio >= need ? 'PASS' : 'FAIL  <-- needs ' + need}`);
  }

  cdp.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
