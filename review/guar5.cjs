// The guarantee returns to red, but the red is not a flat panel: the page's own smoke moves
// inside it, and every line wipes up off the scroll rather than being simply present.
// Layout and type are untouched — those were working.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* ---------- ground ---------- */
rep(`.guar{position:relative;overflow:hidden;isolation:isolate;background:var(--canvas);
  padding-top:clamp(62px,7vw,104px);padding-bottom:clamp(62px,7vw,104px)}`,
`/* Red, but not a flat field — that was the version that read as a different website. The
   page's own smoke moves inside the colour on soft-light, so the surface has the same
   weather as every other section, and the copy arrives off the scroll rather than sitting
   there fully formed. The red is deeper than the accent because white type has to live on
   it: #ED1C24 gives white only 4.4:1, this clears 6. */
.guar{position:relative;overflow:hidden;isolation:isolate;
  --gred:#C4141B;
  background:radial-gradient(128% 108% at 26% 42%,#D0161E 0%,#B70F17 44%,#8A0910 100%);
  padding-top:clamp(62px,7vw,104px);padding-bottom:clamp(62px,7vw,104px)}`);

/* ---------- the plate now lives inside the colour ---------- */
rep(`.guar__vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;
  opacity:0;transition:opacity 1.4s var(--ease);`,
`/* soft-light rather than normal: the clip stops being a picture of smoke and becomes
   tonal weather in the red, which is also what stops its bright core reading as a flame */
.guar__vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;
  mix-blend-mode:soft-light;
  transform:scale(1.35) translateY(-6%);
  opacity:0;transition:opacity 1.6s var(--ease);`);
rep('.guar__vid.on{opacity:.66}', '.guar__vid.on{opacity:.85}');

/* ---------- veil: seat the seams, leave the field alone ---------- */
rep(`.guar__veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:
  linear-gradient(90deg,rgba(10,7,8,1) 0%,rgba(10,7,8,.985) 30%,rgba(10,7,8,.72) 52%,rgba(10,7,8,.16) 74%,rgba(10,7,8,0) 88%),
  linear-gradient(180deg,var(--canvas) 0%,rgba(10,7,8,0) 18%,rgba(10,7,8,0) 82%,var(--canvas) 100%)}`,
`.guar__veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:
  /* a shade of depth under the copy so white type never sits on the brightest red */
  linear-gradient(90deg,rgba(96,7,12,.55) 0%,rgba(96,7,12,.34) 34%,rgba(96,7,12,.1) 58%,rgba(96,7,12,0) 78%),
  /* and the seams: black at both edges, so the colour arrives and leaves without a hard cut */
  linear-gradient(180deg,var(--canvas) 0%,rgba(10,7,8,.34) 9%,rgba(10,7,8,0) 22%,
                  rgba(10,7,8,0) 78%,rgba(10,7,8,.34) 91%,var(--canvas) 100%)}`);

/* ---------- colours for the inverted ground ---------- */
rep('.guar__kick{margin:0;color:var(--accent)}',
    '.guar__kick{margin:0;color:#fff;opacity:.95}');
rep(`.guar__h{font-family:var(--display);font-weight:400;margin:14px 0 0;color:var(--text-primary);`,
    `.guar__h{font-family:var(--display);font-weight:400;margin:14px 0 0;color:#fff;`);
rep(`.guar__p{color:var(--text-secondary);margin:18px 0 0;max-width:46ch;`,
    `.guar__p{color:rgba(255,255,255,.93);margin:18px 0 0;max-width:46ch;`);
rep(`.guar__fig{display:flex;align-items:baseline;gap:clamp(12px,1.4vw,22px);width:max-content;
  max-width:100%;padding-bottom:13px;border-bottom:1px solid var(--accent)}`,
`.guar__fig{display:flex;align-items:baseline;gap:clamp(12px,1.4vw,22px);width:max-content;
  max-width:100%;padding-bottom:13px;border-bottom:1px solid rgba(255,255,255,.55)}`);
rep(`.guar__n{font-family:var(--display);font-weight:400;color:var(--text-primary);`,
    `.guar__n{font-family:var(--display);font-weight:400;color:#fff;`);
rep(`.guar__unit>b{display:block;font-family:var(--mono);font-weight:500;
  font-size:clamp(10.5px,.9vw,13px);letter-spacing:.24em;text-transform:uppercase;
  color:var(--text-primary);margin-bottom:5px}
.guar__unit>span{display:block;font-size:clamp(13px,1.05vw,15.5px);line-height:1.4;
  color:var(--text-secondary)}`,
`.guar__unit>b{display:block;font-family:var(--mono);font-weight:500;
  font-size:clamp(10.5px,.9vw,13px);letter-spacing:.24em;text-transform:uppercase;
  color:#fff;margin-bottom:5px}
.guar__unit>span{display:block;font-size:clamp(13px,1.05vw,15.5px);line-height:1.4;
  color:rgba(255,255,255,.9)}`);
rep(`.guar__list li{padding-top:13px;border-top:1px solid var(--panel-line)}
.guar__list li:first-child{border-top-color:rgba(237,28,36,.42)}`,
`.guar__list li{padding-top:13px;border-top:1px solid rgba(255,255,255,.32)}
.guar__list li:first-child{border-top-color:rgba(255,255,255,.62)}`);
rep(`.guar__list b{display:block;font-family:var(--display);font-weight:400;
  color:var(--text-primary);font-size:clamp(16px,1.45vw,21px);line-height:1.15;`,
`.guar__list b{display:block;font-family:var(--display);font-weight:400;
  color:#fff;font-size:clamp(16px,1.45vw,21px);line-height:1.15;`);
rep(`.guar__list span{display:block;color:var(--text-secondary);
  font-size:clamp(13px,1.05vw,15.5px);line-height:1.45}`,
`.guar__list span{display:block;color:rgba(255,255,255,.9);
  font-size:clamp(13px,1.05vw,15.5px);line-height:1.45}`);

/* the local scrims were there to protect type from smoke on black; on red they only muddy it */
rep(`.guar__r{position:relative;isolation:isolate}
.guar__r::before{content:"";position:absolute;z-index:-1;pointer-events:none;
  inset:-22% -20% -24% -26%;
  background:radial-gradient(72% 64% at 44% 50%,
    rgba(10,7,8,.95) 0%,rgba(10,7,8,.9) 44%,rgba(10,7,8,.56) 70%,rgba(10,7,8,0) 100%)}
`, '');

/* ---------- the reveal, driven by scroll ---------- */
rep(`/* arrival, on the page's own observer rather than a bespoke one */
.guar__l>*,.guar__r>*{opacity:0;transform:translateY(16px);
  transition:opacity .75s var(--ease),transform .85s cubic-bezier(.22,.61,.36,1)}
.guar.in .guar__l>*,.guar.in .guar__r>*{opacity:1;transform:none}
.guar.in .guar__h{transition-delay:.07s}
.guar.in .guar__p{transition-delay:.14s}
.guar.in .guar__list{transition-delay:.18s}`,
`/* Every line wipes up off --g, the scroll progress published on the section. Tied to the
   scrollbar rather than to a timer, so it reads as the reader uncovering the promise —
   and it stays in step if they scroll back up. The page drives its hero and its product
   module the same way; this is that grammar applied to a static section.
   opacity outruns the wipe (x1.7) so nothing appears as a hard-edged sliver. */
.guar__l>*,.guar__r>*{
  --a:0;--ramp:.30;
  --r:clamp(0,(var(--g,0) - var(--a)) / var(--ramp),1);
  opacity:clamp(0,calc(var(--r) * 1.7),1);
  transform:translate3d(0,calc((1 - var(--r)) * 18px),0);
  clip-path:inset(calc((1 - var(--r)) * -40%) -12% calc((1 - var(--r)) * 88%) -4%)}
.guar__h{--a:.06}
.guar__p{--a:.13}
.guar__r .guar__fig{--a:.10}
.guar__list{--a:.19}
/* the figure drifts against the scroll, so the field has depth rather than one flat plane */
.guar__n{transform:translate3d(0,calc(var(--g,0) * -10px),0)}`);

rep(`@media (prefers-reduced-motion:reduce){
  .guar__l>*,.guar__r>*{opacity:1;transform:none;transition:none}
  .guar__vid{transition:none}
}`,
`@media (prefers-reduced-motion:reduce){
  .guar__l>*,.guar__r>*{opacity:1;transform:none;clip-path:none}
  .guar__n{transform:none}
  .guar__vid{transition:none}
}`);

/* mobile: the plate has no clear column to respect on red */
rep(`  /* no room for a clear column at this width, so the plate drops and the copy carries its
     own ground. The kicker is brand red, which tops out at 4.58:1 on this canvas — any lift
     at all from the smoke puts it under AA, so it needs near-pure canvas beneath it. */
  .guar__vid{-webkit-mask-image:none;mask-image:none}
  .guar__vid.on{opacity:.36}
  .guar__l{position:relative;isolation:isolate}
  .guar__l::before{content:"";position:absolute;z-index:-1;pointer-events:none;
    inset:-16% -14% -18% -16%;
    background:radial-gradient(80% 72% at 50% 46%,
      rgba(10,7,8,.98) 0%,rgba(10,7,8,.95) 52%,rgba(10,7,8,.62) 76%,rgba(10,7,8,0) 100%)}`,
`  .guar__vid{-webkit-mask-image:none;mask-image:none}
  .guar__vid.on{opacity:.7}`);

/* ---------- publish --g ---------- */
const JS = `
/* ------------------------------------------------ guarantee scroll progress
   One custom property on the section; every reveal in the CSS is a clamp() on it. No
   animation loop, and the copy stays locked to the scrollbar in both directions. */
(function guaranteeProgress(){
  var sec = document.getElementById('guarantee');
  if (!sec) return;
  var raf = 0;
  function tick(){
    raf = 0;
    var r = sec.getBoundingClientRect(), vh = window.innerHeight || 1;
    /* 0 as the section's top clears the fold, 1 by the time it is comfortably in frame */
    var span = vh * 0.62 + r.height * 0.38;
    var p = (vh - r.top) / span;
    sec.style.setProperty('--g', (p < 0 ? 0 : p > 1 ? 1 : p).toFixed(4));
  }
  function onScroll(){ if (!raf) raf = requestAnimationFrame(tick); }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(tick);
  tick();
})();
`;
const ANCHOR = '/* ------------------------------------------------------ small helpers */';
if (s.indexOf(ANCHOR) < 0) { console.error('js anchor missing'); process.exit(1); }
s = s.replace(ANCHOR, JS + '\n' + ANCHOR);

fs.writeFileSync(p, s);
console.log('guarantee back to red, revealed on scroll; net ' + (s.length - t0) + ' bytes');
