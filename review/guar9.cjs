// Sentence case, centred, a red gloss under each step, and smoke that clears as the reader
// finishes the scroll — so the frame ends on clean type with nothing competing.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* ---------- 1. the steps gain a gloss each, and the arrows become their own items ---------- */
const ARROW = '<li class="steps__arrow" aria-hidden="true"><svg viewBox="0 0 22 10" fill="none"><path d="M0 5h18M13.4 1l4.6 4-4.6 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></li>';
// search for the closing tag FROM the opening one — the scent module ships an <ol> earlier
// in the document and a bare indexOf('</ol>') finds that one instead
const ROW_I = s.indexOf('          <ol class="steps__row">');
if (ROW_I < 0) { console.error('steps row not found'); process.exit(1); }
const OLD_ROW = s.slice(ROW_I, s.indexOf('</ol>', ROW_I) + 5);
s = s.replace(OLD_ROW, `          <ol class="steps__row">
            <li class="step"><b>Don&#8217;t love it.</b><em>Any reason</em></li>
            ${ARROW}
            <li class="step"><b>Tell us.</b><em>No hassle</em></li>
            ${ARROW}
            <li class="step"><b>Get refunded.</b><em>No hard feelings</em></li>
          </ol>`);

/* ---------- 2. sentence case, centred ---------- */
rep(`.guar__in{width:100%;max-width:calc(1800px - var(--gut) * 2);margin:0 auto;
  padding:0 var(--gut);text-align:left}`,
`.guar__in{width:100%;max-width:calc(1800px - var(--gut) * 2);margin:0 auto;
  padding:0 var(--gut);text-align:center}`);
rep('opacity:clamp(0,calc(var(--r) * 1.8),1);\n  transform:translate3d(calc((1 - var(--r)) * -22px),0,0)}',
    'opacity:clamp(0,calc(var(--r) * 1.8),1);\n  transform:translate3d(0,calc((1 - var(--r)) * 18px),0)}');

rep(`.guar__kick{--a:.08;display:inline-flex;align-items:center;gap:11px;margin:0 0 clamp(16px,2.4vh,26px);`,
    `.guar__kick{--a:.08;display:inline-flex;align-items:center;gap:11px;margin:0 auto clamp(16px,2.4vh,26px);`);
rep(`.guar__h{margin:0;font-family:var(--display);font-weight:400;
  font-size:clamp(28px,4.5vw,70px);line-height:1.0;letter-spacing:-.022em;
  text-transform:uppercase;max-width:min(1180px,74%)}`,
`/* sentence case, like every other headline on the page — the caps version was the one
   thing in this section speaking a different language */
.guar__h{margin:0 auto;font-family:var(--display);font-weight:400;
  font-size:clamp(29px,4.6vw,74px);line-height:1.02;letter-spacing:-.024em;
  max-width:min(1240px,88%)}`);
rep(`.guar__p{--a:.28;color:var(--text-secondary);margin:clamp(18px,2.6vh,30px) 0 0;
  font-size:clamp(14px,1.28vw,19px);line-height:1.72;max-width:min(62ch,70%);`,
`.guar__p{--a:.28;color:var(--text-secondary);margin:clamp(18px,2.6vh,30px) auto 0;
  font-size:clamp(14px,1.28vw,19px);line-height:1.72;max-width:min(64ch,84%);`);

rep('.steps{margin:clamp(26px,4vh,52px) 0 0;max-width:min(1340px,76%)}',
    '.steps{margin:clamp(26px,4vh,52px) auto 0;max-width:min(1400px,94%)}');
rep(`.steps__row{list-style:none;display:flex;flex-wrap:nowrap;align-items:center;
  gap:clamp(8px,1.3vw,22px);margin:0;padding:0}
.step{display:flex;align-items:center;gap:clamp(8px,1.3vw,22px)}`,
`.steps__row{list-style:none;display:flex;flex-wrap:nowrap;align-items:flex-start;
  justify-content:center;gap:clamp(10px,1.7vw,32px);margin:0;padding:0}
/* each step is a stack: the instruction, and the reassurance directly under it */
.step{display:flex;flex-direction:column;align-items:center;gap:5px}
.step em{font-style:normal;font-family:var(--mono);color:var(--accent);
  font-size:clamp(9.5px,.86vw,12.5px);letter-spacing:.16em;text-transform:lowercase;
  text-shadow:0 1px 10px rgba(0,0,0,.92)}
.steps__arrow{display:flex;align-items:center;color:var(--accent);
  height:calc(clamp(15px,2.1vw,35px) * 1.05)}
.steps__arrow svg{width:clamp(18px,2.2vw,34px);height:auto}`);
rep(`.step b{font-family:var(--display);font-weight:400;text-transform:uppercase;white-space:nowrap;`,
    `.step b{font-family:var(--display);font-weight:400;white-space:nowrap;`);
// the old inline arrow rule is dead now that arrows are list items
rep(`.step__arrow{display:flex;align-items:center;color:var(--accent)}
.step__arrow svg{width:clamp(18px,2.2vw,34px);height:auto}
`, '');
rep('.step:nth-child(1){--a:.40}\n.step:nth-child(2){--a:.53}\n.step:nth-child(3){--a:.66}',
    '.steps__row .step:nth-child(1){--a:.42}\n.steps__row .step:nth-child(3){--a:.55}\n.steps__row .step:nth-child(5){--a:.68}');

/* ---------- 3. the plate swirls, then clears ---------- */
rep(`.guar__sky{position:absolute;inset:0;overflow:hidden;z-index:0}`,
`/* The cloud owns the frame while the reader is descending, then lifts — by the end of the
   scrub it is gone entirely and the promise sits on clean black. That is also what lets it
   be this heavy in the first place: nothing has to stay readable through it at the end. */
.guar__sky{position:absolute;inset:0;overflow:hidden;z-index:0;
  opacity:clamp(0,(.92 - var(--sp,0)) / .34,1)}`);
rep('.guar__plate--a{animation:guarDriftA 26s ease-in-out infinite}',
    '.guar__plate--a{animation:guarDriftA 22s ease-in-out infinite}');
rep('.guar__plate--b{opacity:.62;mix-blend-mode:screen;\n  animation:guarDriftB 37s ease-in-out infinite}',
    '.guar__plate--b{opacity:.72;mix-blend-mode:screen;\n  animation:guarDriftB 31s ease-in-out infinite}');
rep('.guar__plate--c{opacity:.4;mix-blend-mode:screen;\n  animation:guarDriftC 53s ease-in-out infinite}',
    '.guar__plate--c{opacity:.55;mix-blend-mode:screen;\n  animation:guarDriftC 43s ease-in-out infinite}');
// wider arcs and real rotation, so it swirls rather than slides
rep(`@keyframes guarDriftA{
  0%,100%{transform:translate3d(-5%,1.8%,0) scale(1.06)}
  50%    {transform:translate3d(5%,-2.6%,0) scale(1.16)}}
@keyframes guarDriftB{
  0%,100%{transform:translate3d(8%,-2.4%,0) scale(1.36) rotate(.9deg)}
  50%    {transform:translate3d(-8%,2.6%,0) scale(1.2) rotate(-.8deg)}}
@keyframes guarDriftC{
  0%,100%{transform:translate3d(-3%,-3.2%,0) scale(1.5) rotate(-1.1deg)}
  50%    {transform:translate3d(4%,3%,0) scale(1.62) rotate(1deg)}}`,
`@keyframes guarDriftA{
  0%,100%{transform:translate3d(-6%,2.4%,0) scale(1.08) rotate(-2.4deg)}
  33%    {transform:translate3d(3%,-3.4%,0) scale(1.2) rotate(1.6deg)}
  66%    {transform:translate3d(6%,2%,0) scale(1.12) rotate(3deg)}}
@keyframes guarDriftB{
  0%,100%{transform:translate3d(9%,-3%,0) scale(1.4) rotate(3.2deg)}
  33%    {transform:translate3d(-4%,3.4%,0) scale(1.24) rotate(-2deg)}
  66%    {transform:translate3d(-9%,-1.6%,0) scale(1.34) rotate(-3.6deg)}}
@keyframes guarDriftC{
  0%,100%{transform:translate3d(-4%,-3.6%,0) scale(1.54) rotate(-4deg)}
  33%    {transform:translate3d(5%,3.4%,0) scale(1.7) rotate(2.6deg)}
  66%    {transform:translate3d(1%,-2%,0) scale(1.6) rotate(4.4deg)}}`);

/* centred copy means a centred veil again, and it can be lighter now the plate clears */
rep(`  linear-gradient(90deg,rgba(6,4,5,.98) 0%,rgba(6,4,5,.97) 52%,rgba(6,4,5,.9) 68%,
                  rgba(6,4,5,.52) 80%,rgba(6,4,5,.12) 91%,rgba(6,4,5,0) 100%),`,
`  radial-gradient(72% 78% at 50% 50%,rgba(6,4,5,.9) 0%,rgba(6,4,5,.84) 42%,
                  rgba(6,4,5,.5) 72%,rgba(6,4,5,.12) 100%),`);
rep("  background:url('assets/guar-plate.jpg') 74% 50%/cover no-repeat}",
    "  background:url('assets/guar-plate.jpg') 56% 50%/cover no-repeat}");
rep('  transform-origin:78% 44%}', '  transform-origin:52% 44%}');

/* ---------- 4. mobile ---------- */
rep(`  .steps__row{flex-wrap:wrap;flex-direction:column;align-items:flex-start;gap:10px}
  .step{gap:12px}`,
`  .steps__row{flex-wrap:wrap;flex-direction:column;align-items:center;gap:14px}
  .steps__arrow{transform:rotate(90deg);height:auto}`);
rep('  .guar__kick,.guar__h1,.guar__h2,.guar__p,.step{opacity:1;transform:none}\n  .steps__fill{transform:scaleX(1)}',
    '  .guar__kick,.guar__h1,.guar__h2,.guar__p,.step{opacity:1;transform:none}\n  .steps__fill{transform:scaleX(1)}\n  .guar__sky{opacity:1}');

fs.writeFileSync(p, s);
console.log('guarantee: sentence case, centred, glosses added, plate clears; net ' + (s.length - t0) + ' bytes');
