// Mobile fix.
//
// The page's motion is published by pinned tracks as scroll progress (--t, --sp, --p) and
// consumed by clamp() in CSS. Below 900px those tracks unpin — correctly, sticky pinning on
// a phone is miserable — but the CSS kept reading the same values. Once a track is unpinned,
// "progress through the pinned stretch" no longer maps to "what the reader can see", so the
// gates either fire long after the content has been scrolled past or never usefully at all.
// Measured: the product buy box at 0.56, the closing buy box and the scent headline at 0.00
// while fully on screen.
//
// The rule below 900px is therefore: nothing is gated on scroll progress. Every progress
// reveal resolves to its final state, and motion comes from entering the viewport instead,
// which is the right idiom for a phone anyway.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* ---------- 1. one shared source string for the smoke loop ----------
   The guarantee borrowed its plate from the ambient layer's element, but startEnv() never
   downloads that file on a phone — so the guarantee had no smoke on mobile at all. Both now
   read one variable, so the build still inlines the file exactly once. */
rep(`var BUY_URL   = '';`, `var SMOKE_SRC = 'assets/smoke-loop.mp4';   /* one literal: the build inlines it once */\n\nvar BUY_URL   = '';`);
rep(`  envVideo.src='assets/smoke-loop.mp4';`, `  envVideo.src=SMOKE_SRC;`);
rep(`  function begin(){
    if (started) return;
    var url = src.currentSrc || src.getAttribute('src');
    if (!url) return;                       // ambient clip has not loaded yet
    started = true;`,
`  function begin(){
    if (started) return;
    /* prefer the ambient element's resolved source (already warm in cache on desktop), but
       fall back to the shared literal — on a phone the ambient layer is never loaded */
    var url = src.currentSrc || src.getAttribute('src') || SMOKE_SRC;
    if (!url) return;
    started = true;`);
// the guarantee no longer needs the ambient element to exist
rep(`  var sec = document.getElementById('guarantee'), v = document.getElementById('guarLoop'),
      src = document.getElementById('envVideo');
  if (!sec || !v || !src) return;`,
`  var sec = document.getElementById('guarantee'), v = document.getElementById('guarLoop'),
      src = document.getElementById('envVideo') || {};
  if (!sec || !v) return;`);

/* ---------- 2. the mobile rule ---------- */
const ANCHOR = '/* ==================================================== REDUCED MOTION */';
if (s.indexOf(ANCHOR) < 0) { console.error('reduced-motion anchor missing'); process.exit(1); }
s = s.replace(ANCHOR, `/* ======================================================== MOBILE MOTION
   Below 900px every track unpins, so a progress value meaning "how far through the pinned
   stretch" stops corresponding to anything the reader can see. Every progress-driven reveal
   is resolved to its final state here, and motion is handed to the viewport observer
   instead — content rises as it arrives, which is what a phone wants. */
@media (max-width:900px){
  .slam,
  .pin__copy .lede,.pin__copy .price,.pin__copy .buy,
  .scent__head,.sn li,
  .guar__kick,.guar__h1,.guar__h2,.guar__p,.step,.steps__arrow{
    --s:1;--hs:1;--sv:1;--r:1;--kc:1}
  .pin__copy .buy,.scent__head,.sn li,.slam,
  .pin__copy .lede,.pin__copy .price{opacity:1}

  /* the phone's own reveal: it fires on entering view, not on track progress */
  .m-rise{opacity:0;transform:translateY(18px);
    transition:opacity .7s var(--ease),transform .8s cubic-bezier(.22,.61,.36,1)}
  .m-rise.in{opacity:1;transform:none}
}
@media (max-width:900px) and (prefers-reduced-motion:reduce){
  .m-rise{opacity:1;transform:none;transition:none}
}

${ANCHOR}`);

/* ---------- 3. wire the phone reveal ---------- */
rep(`/* ------------------------------------------------- environment layer */`,
`/* --------------------------------------------- phone reveal on arrival
   On a phone the scroll-progress reveals are switched off in CSS, so these elements get the
   page's ordinary enter-the-viewport treatment instead. Desktop is untouched. */
(function mobileReveal(){
  if (!window.matchMedia('(max-width:900px)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  var sel = '#buyModule,#buyClose,.scent__head,.sn li,.pin__copy .lede,.slam,' +
            '.guar__h,.guar__p,.steps__row,.loud__copy';
  var els = [].slice.call(document.querySelectorAll(sel));
  if (!els.length) return;
  els.forEach(function(e, i){
    e.classList.add('m-rise');
    e.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){ io.observe(e); });
})();

/* ------------------------------------------------- environment layer */`);

fs.writeFileSync(p, s);
console.log('mobile motion fixed; net ' + (s.length - t0) + ' bytes');
