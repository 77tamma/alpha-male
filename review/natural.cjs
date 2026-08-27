// Two fixes.
//
// 1. The hero's "Get Alpha Male" was inside .bands, which is pointer-events:none — the whole
//    band layer is click-through so the caption text never eats hero scroll. The button was
//    therefore unclickable. (A JS .click() bypasses pointer-events, which is why it passed
//    a test and failed in a browser.)
//
// 2. The guarantee's cloud was three copies of ONE STILL, mirrored, rotated and screened.
//    That is a graphic effect, and it read as one — everything else on this page is real
//    footage. It becomes the page's own ambient clip instead, wiped left to right.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* ---------- 1. the band CTA becomes clickable ---------- */
rep('.bands{position:absolute;inset:0;pointer-events:none}',
`.bands{position:absolute;inset:0;pointer-events:none}
/* the band layer is click-through so caption text never intercepts hero scroll — but the
   button inside it has to be reachable */
.settle-cta,.settle-cta .btn{pointer-events:auto}`);

/* ---------- 2. a real plate, wiped left to right ---------- */
rep(`    <div class="guar__sky" aria-hidden="true">
      <div class="guar__cam">
        <span class="guar__plate guar__plate--a"></span>
        <span class="guar__plate guar__plate--b"></span>
        <span class="guar__plate guar__plate--c"></span>
      </div>
    </div>`,
`    <div class="guar__sky" aria-hidden="true">
      <video class="guar__vid" id="guarLoop" muted loop playsinline
             preload="none" aria-hidden="true" tabindex="-1"></video>
    </div>`);

const C0 = s.indexOf('.guar__sky::after{');
const C1 = s.indexOf('.guar__veil{position:absolute');
if (C0 < 0 || C1 < 0) { console.error('sky css anchors missing'); process.exit(1); }
s = s.slice(0, C0) + `/* The page's own ambient crimson smoke, the same clip the fixed environment layer runs
   everywhere else — so this section is breathing the identical air rather than wearing a
   picture of it. It plays; it is not scrubbed. Scroll drives only the wipe.
   The wipe is a soft diagonal that clears from the left, because that is the direction the
   eye is already travelling when it reaches the copy. */
.guar__sky{position:absolute;inset:0;overflow:hidden;z-index:0;
  --wipe:calc(var(--sp,0) * 152% - 30%);
  -webkit-mask-image:linear-gradient(97deg,
    rgba(0,0,0,0) 0%,rgba(0,0,0,0) var(--wipe),
    #000 calc(var(--wipe) + 40%),#000 100%);
          mask-image:linear-gradient(97deg,
    rgba(0,0,0,0) 0%,rgba(0,0,0,0) var(--wipe),
    #000 calc(var(--wipe) + 40%),#000 100%);
  opacity:clamp(0,(1 - var(--sp,0)) / .1,1)}
.guar__vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:50% 50%;opacity:0;transition:opacity 1.2s var(--ease);
  /* a slow settle rather than a crane: the clip already carries its own motion */
  transform:scale(calc(1.16 - .12 * var(--sp,0)));
  filter:brightness(1.28) saturate(1.04)}
.guar__vid.on{opacity:.9}

` + s.slice(C1);

/* the tint, the camera wrapper and the three drift keyframes all go with the stills */
const K0 = s.indexOf('@keyframes guarDriftA{');
const K1 = s.indexOf('/* dark under the copy', K0) >= 0 ? s.indexOf('/* dark under the copy', K0) : s.indexOf('.guar__veil{', K0);
if (K0 >= 0 && K1 > K0) s = s.slice(0, K0) + s.slice(K1);
['.guar__cam{position:absolute;inset:0;\n  transform:translate3d(0,calc(var(--sp,0) * 5% - 2.5%),0)\n            scale(calc(1.44 - .38 * var(--sp,0)));\n  transform-origin:52% 44%}\n'].forEach(b => { if (s.indexOf(b) >= 0) s = s.replace(b, ''); });
s = s.replace(/\.guar__plate[^\n]*\n(?:[^\n]*\n)?/g, m => m.indexOf('guar__plate') >= 0 && m.indexOf('{') >= 0 ? '' : m);
s = s.replace('  .guar__cam{transform:scale(1.12)}\n', '');
s = s.replace('  .guar__cam{transform:none}\n', '');
s = s.replace('  .guar__plate--a,.guar__plate--b,.guar__plate--c{animation:none}\n', '');
s = s.replace('  .guar__cam{transform:scale(1.1)}\n', '');

/* ---------- js: borrow the ambient clip, and duck the ambient layer while we use it ---------- */
rep(`(function guaranteeProgress(){`,
`/* The same file is already playing on the fixed environment layer; running both at once
   would show the identical footage twice at two scales and read as a double exposure. The
   ambient layer ducks while this section is on screen. Its source is read off that element
   rather than written as a path, so the build does not inline a second copy. */
(function guaranteeLoop(){
  var sec = document.getElementById('guarantee'), v = document.getElementById('guarLoop'),
      src = document.getElementById('envVideo');
  if (!sec || !v || !src) return;
  var started = false;
  function begin(){
    if (started) return;
    var url = src.currentSrc || src.getAttribute('src');
    if (!url) return;                       // ambient clip has not loaded yet
    started = true;
    v.src = url;
    v.addEventListener('playing', function(){ v.classList.add('on'); }, {once:true});
    v.load();
  }
  new IntersectionObserver(function(es){
    es.forEach(function(e){
      document.body.classList.toggle('guar-lock', e.isIntersecting);
      if (e.isIntersecting){ begin(); var q = v.play(); if (q && q.catch) q.catch(function(){}); }
      else if (started) v.pause();
    });
  }, {rootMargin:'300px 0px'}).observe(sec);
  document.addEventListener('visibilitychange', function(){
    if (!started) return;
    if (document.hidden) v.pause();
    else { var q = v.play(); if (q && q.catch) q.catch(function(){}); }
  });
})();

(function guaranteeProgress(){`);

rep('.env.on .env__video{opacity:.30}',
    '.env.on .env__video{opacity:.30}\n/* ducked while the guarantee is running the same clip at its own scale */\nbody.guar-lock .env__video{opacity:.04}');

fs.writeFileSync(p, s);
console.log('band CTA clickable, guarantee uses the ambient clip; net ' + (s.length - t0) + ' bytes');
