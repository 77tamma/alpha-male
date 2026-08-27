// The guarantee, inverted: the one red field on an all-black page.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- markup ---------- */
const g0 = s.indexOf('<section class="sec guar" id="guarantee">');
const g1 = s.indexOf('\n</section>', g0) + '\n</section>'.length;
if (g0 < 0 || g1 < 0) { console.error('guar anchors not found'); process.exit(1); }

const GUAR = `<section class="sec guar" id="guarantee">
  <span class="guar__num" aria-hidden="true">365</span>
  <div class="guar__bed" aria-hidden="true">
    <span class="guar__ring guar__ring--a"></span>
    <span class="guar__ring guar__ring--b"></span>
    <span class="guar__ring guar__ring--c"></span>
  </div>

  <div class="wrap guar__in">
    <div class="guar__seal" aria-hidden="true">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle class="gd" cx="60" cy="60" r="52" stroke="currentColor" stroke-width="2" style="--len:327"/>
        <path class="gd gd--tick" d="M38 61l15 15 29-32" stroke="currentColor" stroke-width="6"
              stroke-linecap="round" stroke-linejoin="round" style="--len:68"/>
      </svg>
    </div>

    <p class="guar__kick">365-day guarantee</p>
    <h2 class="guar__h">Commitment issues?</h2>
    <p class="guar__p">Take Alpha Male home and see how things go. You have a full 365 days to decide if it deserves a permanent spot in your routine. If you&#8217;re not satisfied, we&#8217;ll refund your purchase. No hassle. No awkward breakup.</p>

    <ul class="guar__row">
      <li><b>365 days</b><span>Take your time.</span></li>
      <li><b>Full refund</b><span>We&#8217;ve got you covered.</span></li>
      <li><b>No awkward breakup</b><span>Just tell us it didn&#8217;t work out.</span></li>
    </ul>
  </div>
</section>`;
s = s.slice(0, g0) + GUAR + s.slice(g1);

/* ---------- css ---------- */
const c0 = s.indexOf('/* ------------------------------------------------- the guarantee');
const cEnd = `@media (prefers-reduced-motion:reduce){
  .guar__glow,.guar__ring{animation:none}
  .guar__ring{opacity:.18;transform:scale(2)}
  .guar .gd{transition:none;stroke-dashoffset:0}
}`;
const c1 = s.indexOf(cEnd, c0) + cEnd.length;
if (c0 < 0 || c1 < 0) { console.error('guar css anchors not found'); process.exit(1); }

const CSS = `/* ------------------------------------------------- the guarantee
   The only red field on an all-black page. Inverting one section is the strongest
   contrast available here, and it belongs on the promise rather than on a product shot.
   The red is deeper than the accent (#C81018 rather than #ED1C24) because white type has
   to sit on it: the brand red gives white only 4.4:1, this gives 5.9:1.
   It bleeds to the page's black at both edges, so it lands as a hard change of state
   without a visible seam. */
.guar{position:relative;overflow:hidden;isolation:isolate;
  padding-top:clamp(96px,13vw,180px);padding-bottom:clamp(96px,13vw,180px);
  background:
    radial-gradient(120% 90% at 50% 42%,#D4141C 0%,#B90F17 46%,#8E0A11 100%)}
/* the seam: black at the very top and bottom, so the field arrives and leaves cleanly */
.guar::before,.guar::after{content:"";position:absolute;left:0;right:0;height:76px;
  pointer-events:none;z-index:3}
.guar::before{top:0;background:linear-gradient(180deg,var(--canvas) 0%,rgba(10,7,8,0) 100%)}
.guar::after{bottom:0;background:linear-gradient(0deg,var(--canvas) 0%,rgba(10,7,8,0) 100%)}

/* 365, set enormous behind everything and breathing slowly. It is the whole promise in
   three characters, and at this size it does the standing-out on its own. */
.guar__num{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  font-family:var(--display);font-size:min(46vw,620px);line-height:.8;letter-spacing:-.04em;
  color:#fff;opacity:.07;pointer-events:none;user-select:none;z-index:0;
  animation:guarNum 9s ease-in-out infinite}
@keyframes guarNum{0%,100%{transform:translate(-50%,-50%) scale(.98);opacity:.055}
                   50%{transform:translate(-50%,-50%) scale(1.03);opacity:.095}}

.guar__bed{position:absolute;inset:0;pointer-events:none;z-index:1}
.guar__ring{position:absolute;left:50%;top:50%;width:240px;aspect-ratio:1;margin:-120px 0 0 -120px;
  border:2px solid rgba(255,255,255,.30);border-radius:50%;opacity:0;
  animation:guarRing 5.6s linear infinite}
.guar__ring--b{animation-delay:-1.87s}
.guar__ring--c{animation-delay:-3.74s}
@keyframes guarRing{0%{transform:scale(.42);opacity:0}
                    14%{opacity:.5}
                    100%{transform:scale(4.4);opacity:0}}

.guar__in{position:relative;z-index:2;max-width:1020px;margin:0 auto;text-align:center}
.guar__seal{width:clamp(84px,9vw,118px);margin:0 auto clamp(24px,3.2vw,38px);color:#fff}
.guar__seal svg{width:100%;height:auto;overflow:visible;
  filter:drop-shadow(0 4px 24px rgba(0,0,0,.35))}
.guar .gd{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);
  transition:stroke-dashoffset 1.4s cubic-bezier(.22,.61,.36,1)}
.guar .gd--tick{transition-delay:.5s}
.guar.in .gd{stroke-dashoffset:0}

/* nothing in this section is allowed to be small */
.guar__kick{margin:0 0 18px;font-family:var(--mono);font-size:clamp(12px,1.15vw,16px);
  letter-spacing:.26em;text-transform:uppercase;color:#fff;opacity:.92}
.guar__h{font-family:var(--display);font-weight:400;margin:0;color:#fff;
  font-size:clamp(40px,7vw,116px);line-height:.98;letter-spacing:-.03em}
.guar__p{color:#fff;opacity:.94;max-width:44ch;margin:clamp(20px,2.6vw,34px) auto 0;
  font-size:clamp(17px,1.75vw,26px);line-height:1.45}

.guar__row{list-style:none;display:grid;grid-template-columns:repeat(3,1fr);
  gap:clamp(18px,3vw,48px);margin:clamp(38px,5vw,64px) 0 0;padding:0;text-align:left}
.guar__row li{padding-top:18px;border-top:2px solid rgba(255,255,255,.45)}
.guar__row b{display:block;font-family:var(--display);font-weight:400;color:#fff;
  font-size:clamp(19px,2.1vw,32px);line-height:1.08;margin-bottom:8px;letter-spacing:-.01em}
.guar__row span{display:block;color:#fff;opacity:.9;
  font-size:clamp(14px,1.25vw,19px);line-height:1.4}

@media (max-width:820px){
  .guar__row{grid-template-columns:1fr;gap:0}
  .guar__row li{padding:16px 0;border-top:2px solid rgba(255,255,255,.4)}
  .guar__num{font-size:76vw}
}
@media (prefers-reduced-motion:reduce){
  .guar__num,.guar__ring{animation:none}
  .guar__num{opacity:.075}
  .guar__ring{opacity:.16;transform:scale(2)}
  .guar .gd{transition:none;stroke-dashoffset:0}
}`;
s = s.slice(0, c0) + CSS + s.slice(c1);

fs.writeFileSync(p, s);
console.log('guarantee inverted to red');
