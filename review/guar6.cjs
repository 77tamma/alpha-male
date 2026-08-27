// The guarantee, rebuilt as a locked scrubbed module: same architecture as the hero and the
// scent film, the copy from the screenshot, centred on one axis, and no ornament behind it.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;

/* ---------- markup ---------- */
const G0 = s.indexOf('<section class="sec guar" id="guarantee">');
const G1 = s.indexOf('\n</section>', G0) + '\n</section>'.length;
if (G0 < 0 || G1 < 10) { console.error('guarantee anchors missing'); process.exit(1); }

const GUAR = `<section class="track track--guar" id="guarantee">
  <div class="pin pin--guar">
    <video class="guar__vid" id="guarScrub" poster="assets/guar-poster.jpg"
           muted playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
    <div class="guar__veil" aria-hidden="true"></div>

    <div class="guar__ui">
      <p class="eyebrow guar__kick"><svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>The guarantee</p>
      <h2 class="guar__h">We can&#8217;t<br>guarantee the girl.</h2>
      <p class="guar__p">But we can stand behind the cologne. Try Alpha Male with confidence &#8212; if you are not happy for any reason, we refund your money. No questions asked.</p>
      <ul class="guar__row">
        <li><b>365 days</b><span>To change your mind</span></li>
        <li><b>Full refund</b><span>No commitments</span></li>
        <li><b>No questions</b><span>We mean it</span></li>
      </ul>
    </div>
  </div>
</section>`;
s = s.slice(0, G0) + GUAR + s.slice(G1);

/* ---------- css ---------- */
const C0 = s.indexOf('/* ------------------------------------------------- the guarantee');
const CEND = `@media (prefers-reduced-motion:reduce){
  .guar__l>*,.guar__r>*{opacity:1;transform:none;clip-path:none}
  .guar__n{transform:none}
  .guar__vid{transition:none}
}`;
const C1 = s.indexOf(CEND, C0) + CEND.length;
if (C0 < 0 || C1 < CEND.length) { console.error('guarantee css anchors missing'); process.exit(1); }

const CSS = `/* ------------------------------------------------- the guarantee
   The page opens on a scrubbed film and it closes on one. The camera cranes down from
   overhead through the cloud bank to eye level, driven entirely by the reader's scroll —
   the frame is locked while it happens, so the descent is something he performs rather
   than watches. The copy is one centred axis, staged off the same progress value.
   No colour field, no ornament, no numeral doing scenery. */
.track--guar{--fh:min(clamp(480px,42vw,880px),76vh);
  position:relative;height:230vh;background:var(--canvas)}
.pin--guar{position:sticky;top:calc((100vh - var(--fh)) / 2);height:var(--fh);
  overflow:hidden;background:#000}
.guar__vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:50% 50%}
/* the copy sits centre; the film is seated everywhere except the outer edges, so the type
   never has to fight a billow */
.guar__veil{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(78% 86% at 50% 52%,rgba(7,4,5,.9) 0%,rgba(7,4,5,.82) 42%,
                  rgba(7,4,5,.42) 70%,rgba(7,4,5,.12) 100%),
  linear-gradient(180deg,var(--canvas) 0%,rgba(7,4,5,.34) 9%,rgba(7,4,5,.1) 22%,
                  rgba(7,4,5,.1) 78%,rgba(7,4,5,.34) 91%,var(--canvas) 100%)}

.guar__ui{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center;
  padding:clamp(40px,6vh,72px) var(--gut)}

/* every line arrives off --sp, the same progress that drives the film */
.guar__kick,.guar__h,.guar__p,.guar__row li{
  --a:0;--ramp:.16;
  --r:clamp(0,(var(--sp,0) - var(--a)) / var(--ramp),1);
  opacity:clamp(0,calc(var(--r) * 1.7),1);
  transform:translate3d(0,calc((1 - var(--r)) * 16px),0)}
.guar__kick{--a:.06;margin:0 0 clamp(14px,2vh,22px);justify-content:center;
  text-shadow:0 1px 12px rgba(0,0,0,.9)}
.guar__h{--a:.12;font-family:var(--display);font-weight:400;margin:0;
  color:var(--text-primary);font-size:clamp(34px,4.6vw,74px);line-height:1.02;
  letter-spacing:-.028em;
  text-shadow:0 2px 30px rgba(0,0,0,.94),0 1px 4px rgba(0,0,0,.85)}
.guar__p{--a:.22;color:var(--text-secondary);max-width:56ch;
  margin:clamp(18px,2.6vh,28px) auto 0;
  font-size:clamp(15px,1.3vw,19px);line-height:1.6;
  text-shadow:0 2px 18px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.88)}

.guar__row{list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  gap:clamp(20px,3vw,54px);margin:clamp(30px,4.4vh,52px) 0 0;padding:0;
  width:100%;max-width:860px;text-align:left}
.guar__row li{padding-top:14px;border-top:1px solid rgba(244,239,235,.28)}
.guar__row li:nth-child(1){--a:.32}
.guar__row li:nth-child(2){--a:.38}
.guar__row li:nth-child(3){--a:.44}
.guar__row li:first-child{border-top-color:var(--accent)}
.guar__row b{display:block;font-family:var(--display);font-weight:400;
  color:var(--text-primary);font-size:clamp(17px,1.6vw,24px);line-height:1.14;
  letter-spacing:-.01em;margin-bottom:6px;
  text-shadow:0 2px 20px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.88)}
.guar__row span{display:block;font-family:var(--mono);
  font-size:clamp(9.5px,.85vw,11.5px);letter-spacing:.18em;text-transform:uppercase;
  color:var(--text-secondary);text-shadow:0 1px 12px rgba(0,0,0,.92)}

@media (max-width:900px){
  .track--guar{height:auto;--fh:auto}
  .pin--guar{position:static;height:auto;aspect-ratio:4/5}
  .guar__ui{padding:clamp(34px,9vw,56px) var(--gut)}
  .guar__h{font-size:clamp(28px,7.4vw,40px)}
  .guar__row{grid-template-columns:1fr;gap:0;max-width:420px}
  .guar__row li{padding:12px 0;opacity:1;transform:none}
  .guar__kick,.guar__h,.guar__p{opacity:1;transform:none}
  .guar__veil{background:radial-gradient(96% 74% at 50% 50%,rgba(7,4,5,.9) 0%,
    rgba(7,4,5,.82) 46%,rgba(7,4,5,.5) 100%),
    linear-gradient(180deg,var(--canvas) 0%,rgba(7,4,5,.2) 14%,
                    rgba(7,4,5,.2) 86%,var(--canvas) 100%)}
}
@media (prefers-reduced-motion:reduce){
  .guar__kick,.guar__h,.guar__p,.guar__row li{opacity:1;transform:none}
}`;
s = s.slice(0, C0) + CSS + s.slice(C1);

/* ---------- js: replace the looping-plate loader with a scrubber ---------- */
const J0 = s.indexOf('/* ------------------------------------------------ the guarantee plate');
const J1 = s.indexOf('})();', s.indexOf('guaranteePlate')) + 5;
if (J0 < 0 || J1 < 5) { console.error('guaranteePlate block missing'); process.exit(1); }
const JS = `/* ------------------------------------------------ the guarantee film
   Scrubbed, not played — the same mechanism as the hero and the scent module. Fetched as a
   Blob first because seeking a streaming <video> stalls on unbuffered ranges, with the
   direct-assign guard for the artifact build where the source is already a data: URI and a
   strict connect-src refuses to fetch it. */
(function(){
  var sec = document.getElementById('guarantee'), v = document.getElementById('guarScrub');
  if (!sec || !v) return;
  var SRC = 'assets/guar-scrub.mp4';
  var loaded = false, seeking = false, want = 0, shown = 0, raf = null, live = false;

  function progress(){
    var r = sec.getBoundingClientRect();
    var span = Math.max(1, sec.offsetHeight - window.innerHeight);
    return Math.min(1, Math.max(0, -r.top / span));
  }
  function step(){
    raf = null;
    if (!loaded || !v.duration) return;
    var pr = progress();
    sec.style.setProperty('--sp', pr.toFixed(4));
    want = pr * v.duration;
    shown += (want - shown) * 0.18;
    if (Math.abs(want - shown) < 0.008) shown = want;
    if (!seeking && Math.abs(v.currentTime - shown) > 0.012){
      seeking = true;
      try { v.currentTime = shown; } catch(e){ seeking = false; }
    }
    if (live && Math.abs(want - shown) > 0.004) kick();
  }
  function kick(){ if (raf === null) raf = requestAnimationFrame(step); }
  v.addEventListener('seeked', function(){ seeking = false; kick(); });

  function load(){
    if (loaded) return; loaded = true;
    if (SRC.slice(0,5) === 'data:'){
      v.src = SRC;
      v.addEventListener('loadeddata', function(){ shown = progress()*(v.duration||1); kick(); }, {once:true});
      v.load(); return;
    }
    fetch(SRC).then(function(r){ return r.blob(); }).then(function(b){
      v.src = URL.createObjectURL(b);
      v.addEventListener('loadeddata', function(){ shown = progress()*(v.duration||1); kick(); }, {once:true});
      v.load();
    }).catch(function(){ v.src = SRC; v.load(); });
  }

  window.addEventListener('scroll', kick, {passive:true});
  window.addEventListener('resize', kick);
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      es.forEach(function(e){ live = e.isIntersecting; if (live){ load(); kick(); } });
    }, {rootMargin:'400px 0px'}).observe(sec);
  } else { load(); }
})();`;
s = s.slice(0, J0) + JS + s.slice(J1);

/* the standalone --g publisher is redundant now that --sp drives the section */
const P0 = s.indexOf('/* ------------------------------------------------ guarantee scroll progress');
if (P0 >= 0) {
  const P1 = s.indexOf('})();', s.indexOf('guaranteeProgress')) + 5;
  s = s.slice(0, P0) + s.slice(P1);
}

fs.writeFileSync(p, s);
console.log('guarantee rebuilt as a scrubbed module; net ' + (s.length - t0) + ' bytes');
