const { connect, evaluate, shot, setViewport, sleep } = require('./cdp.cjs');
const URL = 'http://localhost:8899/';
const OUT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne/review/shots';

(async () => {
  const cdp = await connect();
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable');
  await setViewport(cdp, 1440, 900, false);

  // 1. reduced motion ON at load
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion', value:'reduce' }] });
  await cdp.send('Page.navigate', { url: URL }); await sleep(3800);
  const rm = await evaluate(cdp, `({
    videoRequested: !!document.getElementById('hero').src,
    staticHero: getComputedStyle(document.querySelector('.static-hero')).display !== 'none',
    notesAllLit: [...document.querySelectorAll('#notes li')].every(l=>l.classList.contains('lit')),
    holdDone: document.getElementById('dropbox').classList.contains('done'),
    envOn: document.getElementById('env').classList.contains('on'),
    motes: document.querySelectorAll('.mote').length,
    entrancesShown: [...document.querySelectorAll('.stg')].every(e=>getComputedStyle(e.children[0]).opacity === '1')
  })`);
  console.log('REDUCED MOTION on:', JSON.stringify(rm,null,1));
  await shot(cdp, OUT+'/final-reduced-motion.png');

  // 2. flip it OFF mid-session, scrub must re-arm and pins must lift
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion', value:'no-preference' }] });
  await sleep(3000);
  const off = await evaluate(cdp, `({
    videoRequested: !!document.getElementById('hero').src,
    posterSet: !!document.getElementById('poster').style.backgroundImage,
    bandKPinned: [...document.querySelectorAll('.band')].map(b=>b.style.getPropertyValue('--k')).filter(Boolean).length
  })`);
  console.log('REDUCED MOTION flipped off:', JSON.stringify(off), off.videoRequested ? '(scrub re-armed)' : '(FAILED to re-arm)');

  // 3. complete without the video
  await cdp.send('Emulation.setEmulatedMedia', { features: [] });
  await cdp.send('Network.setBlockedURLs', { urls: ['*hero-scrub.mp4'] });
  await cdp.send('Page.navigate', { url: URL }); await sleep(6500);
  const nv = await evaluate(cdp, `({
    failed: document.getElementById('stage').classList.contains('video-failed'),
    posterVisible: document.getElementById('poster').classList.contains('in'),
    ringReplaced: !document.getElementById('ring') && !!document.querySelector('.chev'),
    ctaPresent: !!document.querySelector('.band .btn'),
    scrollHeight: document.documentElement.scrollHeight
  })`);
  console.log('VIDEO BLOCKED:', JSON.stringify(nv));
  await shot(cdp, OUT+'/final-no-video.png');
  await cdp.send('Network.setBlockedURLs', { urls: [] });

  // 4. every entrance actually plays
  await cdp.send('Page.navigate', { url: URL }); await sleep(3500);
  await evaluate(cdp, `document.querySelector('#how').scrollIntoView({behavior:'instant',block:'center'})`);
  await sleep(1800);
  const ent = await evaluate(cdp, `({
    stepsIn: [...document.querySelectorAll('.step')].filter(s=>s.classList.contains('in')).length,
    stepIconsDrawn: [...document.querySelectorAll('.step__icon .dr')].every(p=>getComputedStyle(p).strokeDashoffset === '0px'),
    stgIn: [...document.querySelectorAll('.stg')].filter(s=>s.classList.contains('in')).length
  })`);
  console.log('ENTRANCES:', JSON.stringify(ent));

  // 5. stagger delays retired (hover on 2nd/3rd item must not lag)
  await sleep(1800);
  const delays = await evaluate(cdp, `[...document.querySelectorAll('#how .stg > *')].map(e=>getComputedStyle(e).transitionDelay)`);
  console.log('STAGGER DELAYS after entrance (all should be 0s):', JSON.stringify(delays));

  // 6. letter tails not clipped in the split headlines
  const tails = await evaluate(cdp, `(() => {
    const el = document.querySelector('.band .e-settle');
    if(!el) return 'n/a';
    const w = el.querySelector('.w');
    return w ? { overflow: getComputedStyle(w).overflow, height: Math.round(w.getBoundingClientRect().height) } : 'none';
  })()`);
  console.log('SPLIT WORD SPANS:', JSON.stringify(tails));

  cdp.close();
})().catch(e=>{console.error('FAIL',e);process.exit(1);});
