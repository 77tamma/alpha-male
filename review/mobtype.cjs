// Mobile typography and rhythm, rebuilt as one system.
//
// Measured problem: every headline clamp() is written for desktop — clamp(28px,3.6vw,48px)
// yields 14px from its viewport term at 390px, so every headline on the page collapses onto
// its own floor. Desktop headline:body is 3.3x; mobile was 1.6x, which is why nothing reads
// as a headline and the sections stop feeling distinct from one another.
//
// Below 900px the page gets its own scale, driven by vw so it actually responds to the
// screen, with one value per role rather than a different floor per section.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* ---------- 1. the three benefit descriptions come back ---------- */
rep('  .beat p{display:none}\n', '');
rep('  .beat h3{font-size:16.5px}',
`  .beat h3{font-size:17.5px;margin-bottom:5px}
  /* these were hidden on phones — the three descriptions are the only place the benefits
     are actually explained, so the phone was losing the argument, not just some words */
  .beat p{display:block;font-size:14px;line-height:1.55;color:var(--text-secondary);
    margin:0;max-width:46ch}
  .beat{padding:14px 0 4px}`);

/* ---------- 2. one mobile type scale ---------- */
const ANCHOR = '/* ======================================================== MOBILE MOTION';
rep(ANCHOR, `/* ========================================================= MOBILE TYPE
   Every headline on the page is sized clamp(N, ~4vw, M). At 390px the viewport term lands
   near 14px, so all of them bottom out on their floor and the hierarchy flattens: measured,
   desktop runs 3.3x body at the headline, mobile ran 1.6x. One scale here, by role, driven
   by a viewport term that actually engages at phone widths. */
@media (max-width:900px){
  .h,
  .loud .h,
  .close h2,
  .guar__h,
  .scent__head,
  .static-hero h1{
    font-size:clamp(30px,8.4vw,40px);line-height:1.05;letter-spacing:-.022em}

  .lede,.sub,.static-hero .sub,.close .sub,.guar__p{
    font-size:16.5px;line-height:1.58}

  /* the eyebrow keeps its own smaller step so it never competes with the headline */
  .eyebrow,.kicker,.guar__kick{font-size:11.5px;letter-spacing:.2em}

  /* one rhythm: the same air above and below every unpinned section */
  .sec{padding:clamp(58px,15vw,92px) var(--gut)}
  .loud-sec{padding-bottom:clamp(34px,9vw,52px)}
  .static-hero{padding-bottom:clamp(40px,10vw,60px)}
}

${ANCHOR}`);

/* the scent head had its own mobile size and cap that now fights the shared scale */
rep('  .scent__head{font-size:clamp(20px,5.4vw,28px);max-width:none}',
    '  .scent__head{max-width:none}');
rep('  .loud .h{max-width:none;font-size:clamp(26px,7.2vw,38px)}',
    '  .loud .h{max-width:none}');
rep('  .guar__h{font-size:clamp(26px,7.6vw,42px)}', '');
rep('  .guar__p{font-size:14px;line-height:1.65}', '');
rep('  .static-hero h1{font-family:var(--display);font-weight:400;margin:0;\n    font-size:clamp(30px,7.8vw,48px);line-height:1.05;letter-spacing:-.005em;',
    '  .static-hero h1{font-family:var(--display);font-weight:400;margin:0;\n    line-height:1.05;letter-spacing:-.005em;');
rep('  .static-hero .sub{margin:18px 0 28px;color:var(--text-secondary);max-width:34ch;\n    font-size:18px;line-height:1.5;text-shadow:var(--tshadow)}',
    '  .static-hero .sub{margin:18px 0 28px;color:var(--text-secondary);max-width:34ch;\n    text-shadow:var(--tshadow)}');

fs.writeFileSync(p, s);
console.log('mobile type system; net ' + (s.length - t0) + ' bytes');
