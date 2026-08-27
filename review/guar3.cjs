// The guarantee, rebuilt: half the height, the page's own smoke instead of a flat red
// field, and the promise carried by a figure rather than by a punchline.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;

/* ---------- markup ---------- */
const G0 = s.indexOf('<section class="sec guar" id="guarantee">');
const G1 = s.indexOf('\n</section>', G0) + '\n</section>'.length;
if (G0 < 0 || G1 < 10) { console.error('guarantee anchors missing'); process.exit(1); }

const GUAR = `<section class="sec guar" id="guarantee">
  <video class="guar__vid" id="guarSmoke" muted loop playsinline preload="none"
         aria-hidden="true" tabindex="-1"></video>
  <div class="guar__veil" aria-hidden="true"></div>

  <div class="wrap guar__in">
    <div class="guar__l">
      <p class="eyebrow guar__kick"><svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>The guarantee</p>
      <h2 class="guar__h">Commitment issues?</h2>
      <p class="guar__p">Take Alpha Male home and see how things go. You have a full 365 days to decide if it deserves a permanent spot in your routine. If you&#8217;re not satisfied, we&#8217;ll refund your purchase. No hassle. No awkward breakup.</p>
    </div>

    <div class="guar__r">
      <div class="guar__fig">
        <b class="guar__n">365</b>
        <span class="guar__unit">Days to<br>change your mind</span>
      </div>
      <p class="guar__cap">Take your time.</p>
      <ul class="guar__list">
        <li><b>Full refund</b><span>We&#8217;ve got you covered.</span></li>
        <li><b>No awkward breakup</b><span>Just tell us it didn&#8217;t work out.</span></li>
      </ul>
    </div>
  </div>
</section>`;
s = s.slice(0, G0) + GUAR + s.slice(G1);

/* ---------- css ---------- */
const C0 = s.indexOf('/* ------------------------------------------------- the guarantee');
const CEND = `@media (prefers-reduced-motion:reduce){
  .guar__num,.guar__ring,.guar__sweep{animation:none}
  .guar__num{opacity:.075}
  .guar__sweep{display:none}
  .guar__ring{opacity:.16;transform:scale(2)}
  .guar .gd{transition:none;stroke-dashoffset:0}
  .guar__kick,.guar__h,.guar__p,.guar__row li{opacity:1;transform:none;transition:none}
}`;
const C1 = s.indexOf(CEND, C0) + CEND.length;
if (C0 < 0 || C1 < CEND.length) { console.error('guarantee css anchors missing'); process.exit(1); }

const CSS = `/* ------------------------------------------------- the guarantee
   The red field was a second visual language on a page that already had one, and it cost
   a full viewport of height to say three things. This is the page's own dark ground and
   the page's own smoke, in roughly half the height: the argument sits on the left, the
   number that settles it sits on the right, and the two read in one glance rather than
   one scroll. */
.guar{position:relative;overflow:hidden;isolation:isolate;background:var(--canvas);
  padding-top:clamp(62px,7vw,104px);padding-bottom:clamp(62px,7vw,104px)}

/* The plate is smoke-bed.mp4, sourced at runtime from the copy the product module already
   loaded — the ambient fixed layer is running smoke-loop.mp4, and reusing that file here
   would play the same footage twice at two scales and read as a double exposure. */
.guar__vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;
  opacity:0;transition:opacity 1.4s var(--ease);
  /* smoke gathers on the right; the reading column keeps a near-black ground, so contrast
     is bought by composition rather than by dimming the picture until it is not a picture */
  -webkit-mask-image:radial-gradient(88% 104% at 79% 50%,#000 0%,#000 34%,rgba(0,0,0,.55) 62%,rgba(0,0,0,0) 88%);
          mask-image:radial-gradient(88% 104% at 79% 50%,#000 0%,#000 34%,rgba(0,0,0,.55) 62%,rgba(0,0,0,0) 88%)}
.guar__vid.on{opacity:.62}
.guar__veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:
  linear-gradient(90deg,rgba(10,7,8,.94) 0%,rgba(10,7,8,.72) 26%,rgba(10,7,8,.16) 54%,rgba(10,7,8,0) 76%),
  linear-gradient(180deg,var(--canvas) 0%,rgba(10,7,8,0) 16%,rgba(10,7,8,0) 84%,var(--canvas) 100%)}

.guar__in{position:relative;z-index:2;display:grid;
  grid-template-columns:minmax(0,1.02fr) minmax(0,.86fr);
  gap:clamp(30px,5vw,88px);align-items:center}

.guar__kick{margin:0;color:var(--accent)}
.guar__h{font-family:var(--display);font-weight:400;margin:14px 0 0;color:var(--text-primary);
  font-size:clamp(30px,3.6vw,58px);line-height:1.02;letter-spacing:-.025em;max-width:14ch}
.guar__p{color:var(--text-secondary);margin:18px 0 0;max-width:46ch;
  font-size:clamp(15px,1.25vw,18px);line-height:1.6}

/* the figure is the promise: solid ink at real size, not a ghost watermark */
.guar__fig{display:flex;align-items:baseline;gap:clamp(12px,1.4vw,22px);width:max-content;
  max-width:100%;padding-bottom:14px;border-bottom:1px solid var(--accent)}
.guar__n{font-family:var(--display);font-weight:400;color:var(--text-primary);
  font-size:clamp(62px,7.6vw,132px);line-height:.8;letter-spacing:-.045em;
  font-variant-numeric:tabular-nums}
.guar__unit{font-family:var(--mono);font-size:clamp(10px,.86vw,12.5px);letter-spacing:.22em;
  text-transform:uppercase;color:var(--text-secondary);line-height:1.5}
.guar__cap{margin:12px 0 0;font-family:var(--mono);font-size:clamp(10px,.84vw,12px);
  letter-spacing:.2em;text-transform:uppercase;color:var(--text-dim)}

.guar__list{list-style:none;margin:clamp(20px,2.4vw,32px) 0 0;padding:0;display:grid;
  gap:clamp(13px,1.5vw,20px)}
.guar__list li{padding-top:13px;border-top:1px solid var(--panel-line)}
.guar__list li:first-child{border-top-color:rgba(237,28,36,.42)}
.guar__list b{display:block;font-family:var(--display);font-weight:400;
  color:var(--text-primary);font-size:clamp(16px,1.45vw,21px);line-height:1.15;
  letter-spacing:-.008em;margin-bottom:5px}
.guar__list span{display:block;color:var(--text-secondary);
  font-size:clamp(13px,1.05vw,15.5px);line-height:1.45}

/* arrival, on the page's own observer rather than a bespoke one */
.guar__l>*,.guar__r>*{opacity:0;transform:translateY(16px);
  transition:opacity .75s var(--ease),transform .85s cubic-bezier(.22,.61,.36,1)}
.guar.in .guar__l>*,.guar.in .guar__r>*{opacity:1;transform:none}
.guar.in .guar__h{transition-delay:.07s}
.guar.in .guar__p{transition-delay:.14s}
.guar.in .guar__cap{transition-delay:.1s}
.guar.in .guar__list{transition-delay:.18s}

@media (max-width:900px){
  .guar__in{grid-template-columns:1fr;gap:clamp(26px,6vw,40px)}
  .guar__h{max-width:none}
  .guar__vid{-webkit-mask-image:none;mask-image:none}
  .guar__vid.on{opacity:.42}
  .guar__veil{background:linear-gradient(180deg,var(--canvas) 0%,rgba(10,7,8,.62) 22%,
              rgba(10,7,8,.62) 78%,var(--canvas) 100%)}
}
@media (prefers-reduced-motion:reduce){
  .guar__l>*,.guar__r>*{opacity:1;transform:none;transition:none}
  .guar__vid{transition:none}
}`;
s = s.slice(0, C0) + CSS + s.slice(C1);

/* ---------- js: borrow the already-loaded plate, and only while it is on screen ---------- */
const JS = `
/* ------------------------------------------------ the guarantee plate
   Its source is taken from the product module's video element rather than written as a
   path: the preview build inlines every occurrence of an asset path as its own base64
   copy, so naming the file twice would bake a second megabyte into the artifact. */
(function guaranteePlate(){
  var vid = document.getElementById('guarSmoke');
  var sec = document.getElementById('guarantee');
  var src = document.getElementById('smokeBed');
  if (!vid || !sec || !src) return;
  var started = false;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) {
        if (!started) {
          started = true;
          vid.src = src.currentSrc || src.getAttribute('src');
          vid.load();
          vid.addEventListener('playing', function(){ vid.classList.add('on'); }, {once:true});
        }
        var q = vid.play(); if (q && q.catch) q.catch(function(){});
      } else if (started) { vid.pause(); }
    });
  }, {rootMargin:'200px 0px'});
  io.observe(sec);
  document.addEventListener('visibilitychange', function(){
    if (!started) return;
    if (document.hidden) vid.pause();
    else { var q = vid.play(); if (q && q.catch) q.catch(function(){}); }
  });
})();
`;
const ANCHOR = '/* ------------------------------------------------------ small helpers */';
if (s.indexOf(ANCHOR) < 0) { console.error('js anchor missing'); process.exit(1); }
s = s.replace(ANCHOR, JS + '\n' + ANCHOR);

fs.writeFileSync(p, s);
console.log('guarantee rebuilt; net ' + (s.length - t0) + ' bytes');
