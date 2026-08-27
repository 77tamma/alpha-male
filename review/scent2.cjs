// The Scent becomes a scrubbed, pinned, full-bleed module — the same architecture as the
// hero: scroll position drives the video's currentTime, so the reader unscrews the cap.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- markup ---------- */
const S = s.indexOf('<section class="sec" id="scent">');
const E = s.indexOf('\n</section>', S) + '\n</section>'.length;
if (S < 0 || E < 0) { console.error('scent anchors not found'); process.exit(1); }

const SECTION = `<section class="track track--scent" id="scent">
  <div class="pin pin--scent">
    <video class="scent__vid" id="scentScrub" poster="assets/scent-poster.jpg"
           muted playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
    <div class="scent__veil" aria-hidden="true"></div>

    <div class="scent__ui">
      <div class="scent__copy">
        <p class="eyebrow"><svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>The scent</p>
        <h2 class="h">Open it and it opens.</h2>
      </div>

      <ul class="notes">
        <li><span class="lab">Opening</span><span class="val">Bergamot, Pepper</span></li>
        <li><span class="lab">Heart</span><span class="val">Sichuan Pepper, Lavender, Vetiver, Patchouli, Geranium, Elemi</span></li>
        <li><span class="lab">Base</span><span class="val">Ambroxan, Cedar, Labdanum</span></li>
      </ul>
    </div>
  </div>
</section>`;

s = s.slice(0, S) + SECTION + s.slice(E);

/* ---------- css ---------- */
const C0 = s.indexOf('/* ------------------------------------------------- the scent film */');
const C1 = s.indexOf('.notes{', C0);
if (C0 < 0 || C1 < 0) { console.error('css anchors not found'); process.exit(1); }

const CSS = `/* ------------------------------------------------- the scent film
   Same architecture as the hero: a tall track, a sticky pin, and the scroll position
   driving the video's currentTime rather than its playback. The reader unscrews the cap
   by scrolling. Full-bleed at every width, so it matches the two modules above it. */
.track--scent{--warm-deep:#070405;position:relative;height:260vh;background:var(--warm-deep)}
.pin--scent{position:sticky;top:0;height:100vh;overflow:hidden;background:#000}
.scent__vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:50% 42%}
.scent__veil{position:absolute;inset:0;pointer-events:none;background:
  linear-gradient(180deg,rgba(7,4,5,.72) 0%,rgba(7,4,5,.18) 16%,rgba(7,4,5,0) 34%,
                  rgba(7,4,5,.55) 68%,rgba(7,4,5,.88) 90%,var(--warm-deep) 100%),
  linear-gradient(90deg,rgba(7,4,5,.62) 0%,rgba(7,4,5,.20) 34%,rgba(7,4,5,0) 62%)}

.scent__ui{position:absolute;inset:0;z-index:2;max-width:1800px;margin-inline:auto;
  padding:clamp(74px,9vh,120px) var(--gut) clamp(28px,4vh,54px);
  display:flex;flex-direction:column;justify-content:space-between}
.scent__copy{max-width:min(46%,620px)}
.track--scent .h{font-size:clamp(26px,3.4vw,52px);line-height:1.06;
  text-shadow:0 2px 30px rgba(0,0,0,.94),0 1px 4px rgba(0,0,0,.85)}
.track--scent .eyebrow{color:var(--accent);text-shadow:0 1px 12px rgba(0,0,0,.9)}

/* the notes arrive one tier at a time as the cap comes off */
.track--scent .notes{list-style:none;margin:0;padding:0;max-width:min(52%,720px);
  border-top:0}
.track--scent .notes li{display:grid;grid-template-columns:clamp(74px,7vw,104px) 1fr;
  gap:clamp(10px,1.4vw,22px);align-items:baseline;
  padding:clamp(10px,1.5vh,16px) 0;border-top:1px solid rgba(244,239,235,.22);
  --nd:0;
  --n:clamp(0,(var(--sp,0) - .30 - var(--nd)*.16)*7,1);
  opacity:var(--n);transform:translate3d(calc((1 - var(--n)) * -18px),0,0)}
.track--scent .notes li:nth-child(2){--nd:1}
.track--scent .notes li:nth-child(3){--nd:2}
.track--scent .notes li:first-child{border-top-color:var(--accent)}
.track--scent .lab{font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--accent);text-shadow:0 1px 10px rgba(0,0,0,.9)}
.track--scent .val{font-size:clamp(14px,1.24vw,19px);line-height:1.4;color:#E8E0E1;
  text-shadow:0 2px 20px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.85)}

@media (max-width:900px){
  .track--scent{height:auto}
  .pin--scent{position:static;height:auto;aspect-ratio:3/4}
  .scent__ui{position:absolute;padding-top:clamp(52px,12vw,86px)}
  .scent__copy{max-width:none}
  .track--scent .notes{max-width:none}
  .track--scent .notes li{opacity:1;transform:none;
    grid-template-columns:64px 1fr;padding:9px 0}
  .track--scent .val{font-size:13.5px}
}
@media (prefers-reduced-motion:reduce){
  .track--scent .notes li{opacity:1;transform:none}
}
`;

s = s.slice(0, C0) + CSS + s.slice(C1);

/* ---------- js: swap the play-on-view module for a scrubber ---------- */
const J0 = s.indexOf('  /* ---- the scent film: decode and play only while it is on screen ---- */');
const J1 = s.indexOf('  /* ---- the mechanism section publishes its own scroll progress ---- */');
if (J0 < 0 || J1 < 0) { console.error('js anchors not found'); process.exit(1); }

const JS = `  /* ---- the scent film is SCRUBBED, not played: scroll drives currentTime ----
     Same approach as the hero. The video is fetched as a Blob first, because seeking a
     streaming <video> stalls on ranges the browser has not buffered, which shows up as a
     scrub that sticks. Seeks are gated so they can never overlap, and the displayed time
     is eased toward the target so a fast flick glides instead of stepping. */
  (function(){
    var sec=document.getElementById('scent'), v=document.getElementById('scentScrub');
    if(!sec||!v) return;
    var SRC='assets/scent-scrub.mp4';
    var loaded=false, seeking=false, want=0, shown=0, raf=null, live=false;

    function progress(){
      var r=sec.getBoundingClientRect();
      var span=Math.max(1, sec.offsetHeight - window.innerHeight);
      return Math.min(1, Math.max(0, -r.top / span));
    }
    function step(){
      raf=null;
      if(!loaded || !v.duration) return;
      want=progress()*v.duration;
      shown += (want-shown)*0.18;
      if(Math.abs(want-shown)<0.008) shown=want;
      if(!seeking && Math.abs(v.currentTime-shown)>0.012){
        seeking=true;
        try{ v.currentTime=shown; }catch(e){ seeking=false; }
      }
      if(live && Math.abs(want-shown)>0.004) kick();
    }
    function kick(){ if(raf===null) raf=requestAnimationFrame(step); }
    v.addEventListener('seeked',function(){ seeking=false; kick(); });

    function load(){
      if(loaded) return; loaded=true;
      fetch(SRC).then(function(r){ return r.blob(); }).then(function(b){
        v.src=URL.createObjectURL(b);
        v.addEventListener('loadeddata',function(){ shown=progress()*(v.duration||1); kick(); },{once:true});
        v.load();
      }).catch(function(){ v.src=SRC; v.load(); });
    }

    window.addEventListener('scroll',kick,{passive:true});
    window.addEventListener('resize',kick);
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        es.forEach(function(e){ live=e.isIntersecting; if(live){ load(); kick(); } });
      },{rootMargin:'400px 0px'}).observe(sec);
    } else { load(); }
  })();

`;

s = s.slice(0, J0) + JS + s.slice(J1);

/* publish the section's own progress for the note reveals */
s = s.replace('      want=progress()*v.duration;',
              '      var pr=progress();\n      sec.style.setProperty(\'--sp\',pr.toFixed(4));\n      want=pr*v.duration;');

fs.writeFileSync(p, s);
console.log('scent is now a pinned, scrubbed, full-bleed module');
