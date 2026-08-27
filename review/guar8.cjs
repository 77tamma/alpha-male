// The guarantee, redesigned to the screenshot: left-aligned promise, a two-tone caps
// headline, and the three steps revealed one at a time by a red rule that travels above
// them as the reader scrolls. The plate gets to be genuinely present, because moving the
// copy left frees the right half of the frame for it.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;

/* ---------- markup ---------- */
const G0 = s.indexOf('<section class="track track--guar" id="guarantee">');
const G1 = s.indexOf('\n</section>', G0) + '\n</section>'.length;
if (G0 < 0 || G1 < 10) { console.error('guarantee markup anchors missing'); process.exit(1); }

const ARROW = '<span class="step__arrow" aria-hidden="true"><svg viewBox="0 0 22 10" fill="none"><path d="M0 5h18M13.4 1l4.6 4-4.6 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

const GUAR = `<section class="track track--guar" id="guarantee">
  <div class="pin pin--guar">
    <div class="guar__sky" aria-hidden="true">
      <div class="guar__cam">
        <span class="guar__plate guar__plate--a"></span>
        <span class="guar__plate guar__plate--b"></span>
        <span class="guar__plate guar__plate--c"></span>
      </div>
    </div>
    <div class="guar__veil" aria-hidden="true"></div>

    <div class="guar__ui">
      <div class="guar__in">
        <p class="guar__kick"><svg class="guar__chev" viewBox="0 0 20 10" fill="none" aria-hidden="true"><path d="M1 1l4 4-4 4M9 1l4 4-4 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>The Alpha Male promise</p>

        <h2 class="guar__h"><span class="guar__h1">Not feeling it?</span><span class="guar__h2">We can handle rejection.</span></h2>

        <p class="guar__p">If Alpha Male isn&#8217;t for you &#8212; for any reason &#8212; just tell us.<br>
          We&#8217;ll happily refund your purchase.<br>
          No convincing. No awkward conversation. No hard feelings.</p>

        <div class="steps">
          <div class="steps__rail" aria-hidden="true"><span class="steps__fill"></span></div>
          <ol class="steps__row">
            <li class="step"><b>Don&#8217;t love it.</b></li>
            <li class="step">${ARROW}<b>Tell us.</b></li>
            <li class="step">${ARROW}<b>Get refunded.</b></li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</section>`;
s = s.slice(0, G0) + GUAR + s.slice(G1);

/* ---------- css ---------- */
const C0 = s.indexOf('/* ------------------------------------------------- the guarantee');
const CEND = `@media (prefers-reduced-motion:reduce){
  .guar__kick,.guar__h,.guar__p,.guar__row li{opacity:1;transform:none}
  .guar__plate--a,.guar__plate--b{animation:none}
  .guar__cam{transform:scale(1.1)}
}`;
const C1 = s.indexOf(CEND, C0) + CEND.length;
if (C0 < 0 || C1 < CEND.length) { console.error('guarantee css anchors missing'); process.exit(1); }

const CSS = `/* ------------------------------------------------- the guarantee
   The page opens on a locked frame and closes on one. Here the frame holds while the
   reader's scroll cranes the camera down through the cloud, the promise assembles, and a
   red rule travels above the three steps — uncovering them one at a time, so the way out
   is something he walks rather than reads.
   The copy sits left, which is what lets the plate be genuinely present on the right
   instead of being dimmed into a texture. */
.track--guar{--fh:min(clamp(520px,46vw,900px),82vh);
  position:relative;height:260vh;background:var(--canvas)}
.pin--guar{position:sticky;top:calc((100vh - var(--fh)) / 2);height:var(--fh);
  overflow:hidden;background:#000}

.guar__sky{position:absolute;inset:0;overflow:hidden;z-index:0}
.guar__cam{position:absolute;inset:0;
  transform:translate3d(0,calc(var(--sp,0) * 5% - 2.5%),0)
            scale(calc(1.44 - .38 * var(--sp,0)));
  transform-origin:66% 42%}
.guar__plate{position:absolute;inset:-14%;
  background:url('assets/guar-plate.jpg') 50% 50%/cover no-repeat}
.guar__plate--a{animation:guarDriftA 26s ease-in-out infinite}
/* three copies at different scales and cycles: the overlaps keep re-forming, which is what
   reads as cloud moving rather than a photograph sliding sideways */
.guar__plate--b{opacity:.62;mix-blend-mode:screen;
  animation:guarDriftB 37s ease-in-out infinite}
.guar__plate--c{opacity:.4;mix-blend-mode:screen;
  animation:guarDriftC 53s ease-in-out infinite}
@keyframes guarDriftA{
  0%,100%{transform:translate3d(-5%,1.8%,0) scale(1.06)}
  50%    {transform:translate3d(5%,-2.6%,0) scale(1.16)}}
@keyframes guarDriftB{
  0%,100%{transform:translate3d(8%,-2.4%,0) scale(1.36) rotate(.9deg)}
  50%    {transform:translate3d(-8%,2.6%,0) scale(1.2) rotate(-.8deg)}}
@keyframes guarDriftC{
  0%,100%{transform:translate3d(-3%,-3.2%,0) scale(1.5) rotate(-1.1deg)}
  50%    {transform:translate3d(4%,3%,0) scale(1.62) rotate(1deg)}}

/* dark under the copy on the left, clear on the right so the cloud is actually seen */
.guar__veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:
  linear-gradient(90deg,rgba(6,4,5,.97) 0%,rgba(6,4,5,.95) 34%,rgba(6,4,5,.74) 52%,
                  rgba(6,4,5,.3) 70%,rgba(6,4,5,0) 88%),
  linear-gradient(180deg,var(--canvas) 0%,rgba(6,4,5,.42) 7%,rgba(6,4,5,.06) 20%,
                  rgba(6,4,5,.06) 80%,rgba(6,4,5,.42) 93%,var(--canvas) 100%)}

.guar__ui{position:absolute;inset:0;z-index:2;display:flex;align-items:center;
  padding:clamp(34px,5vh,64px) 0}
.guar__in{width:100%;max-width:calc(1800px - var(--gut) * 2);margin:0 auto;
  padding:0 var(--gut);text-align:left}

/* everything arrives off the same progress that drives the camera */
.guar__kick,.guar__h1,.guar__h2,.guar__p,.step{
  --a:0;--ramp:.15;
  --r:clamp(0,(var(--sp,0) - var(--a)) / var(--ramp),1);
  opacity:clamp(0,calc(var(--r) * 1.8),1);
  transform:translate3d(calc((1 - var(--r)) * -22px),0,0)}

/* the eyebrow is a headline in its own right here, not a caption */
.guar__kick{--a:.08;display:inline-flex;align-items:center;gap:11px;margin:0 0 clamp(16px,2.4vh,26px);
  font-family:var(--mono);font-weight:500;
  font-size:clamp(13px,1.35vw,21px);letter-spacing:.22em;text-transform:uppercase;
  color:var(--accent);padding-bottom:10px;border-bottom:2px solid var(--accent);
  text-shadow:0 1px 12px rgba(0,0,0,.9)}
.guar__chev{width:clamp(15px,1.5vw,22px);height:auto;flex:none}

.guar__h{margin:0;font-family:var(--display);font-weight:400;
  font-size:clamp(30px,5.2vw,86px);line-height:1.0;letter-spacing:-.02em;
  text-transform:uppercase}
.guar__h1,.guar__h2{display:block;
  text-shadow:0 2px 30px rgba(0,0,0,.94),0 1px 4px rgba(0,0,0,.88)}
.guar__h1{--a:.14;color:var(--text-primary)}
.guar__h2{--a:.20;color:var(--accent)}

.guar__p{--a:.28;color:var(--text-secondary);margin:clamp(18px,2.6vh,30px) 0 0;
  font-size:clamp(14px,1.28vw,19px);line-height:1.72;max-width:62ch;
  text-shadow:0 2px 18px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.9)}

/* the three steps, uncovered by a rule that travels above them */
.steps{margin:clamp(26px,4vh,52px) 0 0;max-width:1180px}
.steps__rail{position:relative;height:2px;background:rgba(244,239,235,.16);
  margin:0 0 clamp(14px,2vh,22px)}
.steps__fill{position:absolute;inset:0;background:var(--accent);transform-origin:0 50%;
  transform:scaleX(clamp(0,(var(--sp,0) - .34) / .40,1));
  box-shadow:0 0 14px 1px rgba(237,28,36,.55)}
.steps__row{list-style:none;display:flex;flex-wrap:wrap;align-items:baseline;
  gap:clamp(10px,1.6vw,26px);margin:0;padding:0}
.step{display:flex;align-items:center;gap:clamp(10px,1.6vw,26px)}
.step:nth-child(1){--a:.40}
.step:nth-child(2){--a:.53}
.step:nth-child(3){--a:.66}
.step b{font-family:var(--display);font-weight:400;text-transform:uppercase;
  color:var(--text-primary);font-size:clamp(19px,2.9vw,48px);line-height:1.05;
  letter-spacing:-.015em;
  text-shadow:0 2px 22px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.9)}
.step__arrow{display:flex;align-items:center;color:var(--accent)}
.step__arrow svg{width:clamp(18px,2.2vw,34px);height:auto}

@media (max-width:900px){
  .track--guar{height:auto;--fh:auto}
  .pin--guar{position:static;height:auto;aspect-ratio:3/4}
  .guar__cam{transform:scale(1.12)}
  .guar__ui{padding:clamp(30px,8vw,52px) 0}
  .guar__h{font-size:clamp(26px,7.6vw,42px)}
  .guar__p{font-size:14px;line-height:1.65}
  .steps__row{flex-direction:column;align-items:flex-start;gap:10px}
  .step{gap:12px}
  .step b{font-size:clamp(20px,6.4vw,30px)}
  .guar__kick,.guar__h1,.guar__h2,.guar__p,.step{opacity:1;transform:none}
  .steps__fill{transform:scaleX(1)}
  .guar__veil{background:linear-gradient(90deg,rgba(6,4,5,.95) 0%,rgba(6,4,5,.86) 52%,
                rgba(6,4,5,.5) 100%),
    linear-gradient(180deg,var(--canvas) 0%,rgba(6,4,5,.2) 12%,
                    rgba(6,4,5,.2) 88%,var(--canvas) 100%)}
}
@media (prefers-reduced-motion:reduce){
  .guar__kick,.guar__h1,.guar__h2,.guar__p,.step{opacity:1;transform:none}
  .guar__plate--a,.guar__plate--b,.guar__plate--c{animation:none}
  .guar__cam{transform:scale(1.1)}
  .steps__fill{transform:scaleX(1)}
}`;
s = s.slice(0, C0) + CSS + s.slice(C1);

/* ---------- the stray rule above the offer ---------- */
if (s.indexOf('<div class="rule" aria-hidden="true"></div>\n  ') < 0) { console.error('offer rule not found'); process.exit(1); }
s = s.replace('<div class="rule" aria-hidden="true"></div>\n  ', '');
s = s.replace(`.rule{width:1px;height:64px;margin:0 auto 34px;
  background:linear-gradient(180deg,transparent,var(--accent));opacity:.7}`, '');
/* the offer used to open under that rule; without it the section needs its own top space */
s = s.replace('.close{position:relative;text-align:center;padding:clamp(96px,13vw,180px) var(--gut)}',
              '.close{position:relative;text-align:center;padding:clamp(84px,11vw,150px) var(--gut)}');

fs.writeFileSync(p, s);
console.log('guarantee redesigned, offer rule removed; net ' + (s.length - t0) + ' bytes');
