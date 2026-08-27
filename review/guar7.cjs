// The guarantee: a locked frame the reader descends through, built without video.
//
// The camera move is scroll-driven CSS over the approved plate. The cloud movement is two
// copies of that plate drifting past each other at different rates and speeds, screened
// together — where they overlap the vapour brightens and separates, which reads as cloud
// moving rather than a photograph sliding. That keeps the atmosphere simple by construction:
// there is only ever one frame's worth of cloud in it.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;

/* ---------- markup ---------- */
const G0 = s.indexOf('<section class="sec guar" id="guarantee">');
const G1 = s.indexOf('\n</section>', G0) + '\n</section>'.length;
if (G0 < 0 || G1 < 10) { console.error('guarantee markup anchors missing'); process.exit(1); }

const GUAR = `<section class="track track--guar" id="guarantee">
  <div class="pin pin--guar">
    <div class="guar__sky" aria-hidden="true">
      <div class="guar__cam">
        <span class="guar__plate guar__plate--a"></span>
        <span class="guar__plate guar__plate--b"></span>
      </div>
    </div>
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
   The page opens on a locked scrubbed frame and it closes on one. Here the frame holds
   while the reader's scroll cranes the camera down through the cloud and the promise
   assembles line by line — the descent is something he performs, not something he watches.
   No video: the camera is a transform on --sp, and the cloud moves because two copies of
   one plate drift past each other and screen together. Simple by construction, because
   there is only ever one frame's worth of cloud in the section. */
.track--guar{--fh:min(clamp(460px,40vw,820px),74vh);
  position:relative;height:220vh;background:var(--canvas)}
.pin--guar{position:sticky;top:calc((100vh - var(--fh)) / 2);height:var(--fh);
  overflow:hidden;background:#000}

.guar__sky{position:absolute;inset:0;overflow:hidden;z-index:0}
/* the camera: tight and high at the top of the track, settled by the bottom */
.guar__cam{position:absolute;inset:0;
  transform:translate3d(0,calc(var(--sp,0) * 5% - 2.5%),0)
            scale(calc(1.46 - .4 * var(--sp,0)));
  transform-origin:50% 42%}
.guar__plate{position:absolute;inset:-12%;
  background:url('assets/guar-plate.jpg') 50% 50%/cover no-repeat}
.guar__plate--a{animation:guarDriftA 54s ease-in-out infinite}
/* the second copy is larger, slower and screened, so the overlap between the two keeps
   changing — that changing overlap is what reads as cloud rather than a sliding still */
.guar__plate--b{opacity:.42;mix-blend-mode:screen;
  animation:guarDriftB 79s ease-in-out infinite}
@keyframes guarDriftA{
  0%,100%{transform:translate3d(-2.2%,.6%,0) scale(1.05)}
  50%    {transform:translate3d(2.2%,-.9%,0) scale(1.1)}}
@keyframes guarDriftB{
  0%,100%{transform:translate3d(3.4%,-.8%,0) scale(1.32) rotate(.4deg)}
  50%    {transform:translate3d(-3.4%,.9%,0) scale(1.24) rotate(-.3deg)}}

/* the copy sits centre, so the plate is seated hardest there and left alone at the edges */
.guar__veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:
  radial-gradient(76% 84% at 50% 50%,rgba(7,4,5,.92) 0%,rgba(7,4,5,.86) 40%,
                  rgba(7,4,5,.46) 70%,rgba(7,4,5,.1) 100%),
  linear-gradient(180deg,var(--canvas) 0%,rgba(7,4,5,.4) 8%,rgba(7,4,5,.08) 21%,
                  rgba(7,4,5,.08) 79%,rgba(7,4,5,.4) 92%,var(--canvas) 100%)}

.guar__ui{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center;
  padding:clamp(36px,5.5vh,66px) var(--gut)}

/* every line arrives off the same progress that drives the camera */
.guar__kick,.guar__h,.guar__p,.guar__row li{
  --a:0;--ramp:.17;
  --r:clamp(0,(var(--sp,0) - var(--a)) / var(--ramp),1);
  opacity:clamp(0,calc(var(--r) * 1.7),1);
  transform:translate3d(0,calc((1 - var(--r)) * 16px),0)}
.guar__kick{--a:.10;margin:0 0 clamp(13px,1.9vh,20px);justify-content:center;
  text-shadow:0 1px 12px rgba(0,0,0,.9)}
.guar__h{--a:.17;font-family:var(--display);font-weight:400;margin:0;
  color:var(--text-primary);font-size:clamp(32px,4.4vw,70px);line-height:1.02;
  letter-spacing:-.028em;
  text-shadow:0 2px 30px rgba(0,0,0,.94),0 1px 4px rgba(0,0,0,.86)}
.guar__p{--a:.27;color:var(--text-secondary);max-width:54ch;
  margin:clamp(16px,2.4vh,26px) auto 0;
  font-size:clamp(15px,1.28vw,18.5px);line-height:1.6;
  text-shadow:0 2px 18px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.9)}

.guar__row{list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  gap:clamp(18px,3vw,52px);margin:clamp(26px,4vh,48px) 0 0;padding:0;
  width:100%;max-width:820px;text-align:left}
.guar__row li{padding-top:13px;border-top:1px solid rgba(244,239,235,.3)}
.guar__row li:nth-child(1){--a:.37}
.guar__row li:nth-child(2){--a:.43}
.guar__row li:nth-child(3){--a:.49}
.guar__row li:first-child{border-top-color:var(--accent)}
.guar__row b{display:block;font-family:var(--display);font-weight:400;
  color:var(--text-primary);font-size:clamp(16px,1.5vw,23px);line-height:1.14;
  letter-spacing:-.01em;margin-bottom:6px;
  text-shadow:0 2px 20px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.9)}
.guar__row span{display:block;font-family:var(--mono);
  font-size:clamp(9.5px,.84vw,11.5px);letter-spacing:.18em;text-transform:uppercase;
  color:var(--text-secondary);text-shadow:0 1px 12px rgba(0,0,0,.94)}

@media (max-width:900px){
  .track--guar{height:auto;--fh:auto}
  .pin--guar{position:static;height:auto;aspect-ratio:4/5}
  .guar__cam{transform:none}
  .guar__ui{padding:clamp(32px,8vw,54px) var(--gut)}
  .guar__h{font-size:clamp(27px,7vw,38px)}
  .guar__row{grid-template-columns:1fr;gap:0;max-width:400px}
  .guar__row li{padding:11px 0}
  .guar__kick,.guar__h,.guar__p,.guar__row li{opacity:1;transform:none}
  .guar__veil{background:radial-gradient(96% 72% at 50% 50%,rgba(7,4,5,.92) 0%,
    rgba(7,4,5,.86) 46%,rgba(7,4,5,.56) 100%),
    linear-gradient(180deg,var(--canvas) 0%,rgba(7,4,5,.18) 13%,
                    rgba(7,4,5,.18) 87%,var(--canvas) 100%)}
}
@media (prefers-reduced-motion:reduce){
  .guar__kick,.guar__h,.guar__p,.guar__row li{opacity:1;transform:none}
  .guar__plate--a,.guar__plate--b{animation:none}
  .guar__cam{transform:scale(1.1)}
}`;
s = s.slice(0, C0) + CSS + s.slice(C1);

/* ---------- js ---------- */
// drop the looping-plate loader
const J0 = s.indexOf('/* ------------------------------------------------ the guarantee plate');
if (J0 >= 0) {
  const J1 = s.indexOf('})();', s.indexOf('guaranteePlate')) + 5;
  s = s.slice(0, J0) + s.slice(J1);
}
// and replace the --g publisher with one that publishes --sp over the pinned stretch
const P0 = s.indexOf('/* ------------------------------------------------ guarantee scroll progress');
if (P0 < 0) { console.error('progress publisher missing'); process.exit(1); }
const P1 = s.indexOf('})();', s.indexOf('guaranteeProgress')) + 5;
const JS = `/* ------------------------------------------------ guarantee scroll progress
   One value on the section drives everything: the camera transform and every line of the
   copy are clamp() expressions on --sp. Same publisher the scent film uses, minus the video. */
(function guaranteeProgress(){
  var sec = document.getElementById('guarantee');
  if (!sec) return;
  var raf = 0;
  function step(){
    raf = 0;
    var r = sec.getBoundingClientRect();
    var span = Math.max(1, sec.offsetHeight - window.innerHeight);
    var p = -r.top / span;
    sec.style.setProperty('--sp', (p < 0 ? 0 : p > 1 ? 1 : p).toFixed(4));
  }
  function kick(){ if (!raf) raf = requestAnimationFrame(step); }
  window.addEventListener('scroll', kick, {passive:true});
  window.addEventListener('resize', kick);
  step();
})();`;
s = s.slice(0, P0) + JS + s.slice(P1);

fs.writeFileSync(p, s);
console.log('guarantee rebuilt: scroll-driven descent, drifting plate; net ' + (s.length - t0) + ' bytes');
