// Full-width film with the copy rolling in inside the scene. Height is bounded by
// capping the frame against viewport height rather than by cropping it, and the only
// darkening is a soft foot that carries the frame into the next section.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- markup ---------- */
const S = s.indexOf('<section class="sec loud-sec" id="how">');
const E = s.indexOf('\n</section>', S) + '\n</section>'.length;
if (S < 0 || E < 0) { console.error('section anchors not found'); process.exit(1); }

const SECTION = `<section class="sec loud-sec" id="how">
  <div class="wrap loud">
    <figure class="loud__film">
      <video class="fill" id="coupleLoop" src="assets/couple-loop.mp4" poster="assets/couple-poster.jpg"
             muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
      <span class="loud__foot" aria-hidden="true"></span>

      <div class="loud__copy">
        <p class="eyebrow"><svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>Why Alpha Male?</p>
        <h2 class="h">So what makes Alpha Male different?</h2>
        <p class="formula">
          <span>Premium fragrance</span><i aria-hidden="true">+</i><span>Pheromones</span><i aria-hidden="true">+</i><span>Roll-on application</span>
        </p>
        <ol class="beats">
          <li class="beat"><span class="beat__n">01</span><h3>Premium Masculine Scent</h3><p>Smells sophisticated enough to wear anywhere.</p></li>
          <li class="beat"><span class="beat__n">02</span><h3>Premium Masculine Scent</h3><p>Smells sophisticated enough to wear anywhere.</p></li>
          <li class="beat"><span class="beat__n">03</span><h3>Roll-On Control</h3><p>Apply exactly where you want it. No cloud, no wasted spray.</p></li>
        </ol>
      </div>
    </figure>
  </div>
</section>`;

s = s.slice(0, S) + SECTION + s.slice(E);

/* ---------- css ---------- */
const C0 = s.indexOf('/* =============================== THE LOUD SECTION (colour break) ===============');
const CEND = '@media (prefers-reduced-motion:reduce){\n  .fill{opacity:1}\n  .formula span,.formula i,.beat{opacity:1;transform:none}\n}';
const C1 = s.indexOf(CEND, C0) + CEND.length;
if (C0 < 0 || C1 < 0) { console.error('css anchors not found'); process.exit(1); }

const CSS = `/* =============================== THE LOUD SECTION (colour break) ===============
   The one place the page leaves black. The film runs the full width of the module with
   the copy rolling in inside the scene.
   Height is bounded by capping the frame against VIEWPORT HEIGHT, not by cropping it —
   the shot is her whole figure and the hand on the tie, and any crop tight enough to
   shorten the section removes exactly that. What made this module feel enormous before
   was the 240vh track and the sticky pin, both of which are gone. */
.loud-sec{--warm-deep:#0D0705;position:relative;background:var(--warm-deep);
  padding-block:clamp(56px,7vw,96px)}
.loud-sec::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(110% 84% at 62% 46%,rgba(126,58,24,.18) 0%,rgba(13,7,5,0) 66%)}
.loud{position:relative;z-index:1;
  --bleed:max(0px,(min(1800px,100vw - var(--gut)*2) - 100%) / 2);
  margin-inline:calc(-1 * var(--bleed))}

.loud__film{position:relative;margin:0 auto;overflow:hidden;border-radius:3px;background:#000;
  width:100%;aspect-ratio:16/9;
  /* the frame never grows past three quarters of the screen, so a tall monitor cannot
     turn a full-width 16:9 film into a 1000px wall */
  max-width:min(100%,calc(74vh * 16 / 9));
  box-shadow:0 0 0 1px rgba(244,239,235,.08)}
.fill{display:block;width:100%;height:100%;object-fit:cover;
  opacity:clamp(0,(var(--p,0) - .04)*6,1)}

/* Just a foot. Enough to seat the copy and carry the frame into the next section,
   deliberately short of the "dark gradient" that was swallowing the picture. */
.loud__foot{position:absolute;left:0;right:0;bottom:0;height:52%;pointer-events:none;
  background:linear-gradient(180deg,rgba(13,7,5,0) 0%,rgba(13,7,5,.34) 46%,
                             rgba(13,7,5,.72) 78%,rgba(13,7,5,.88) 100%)}

/* the copy lives in the scene, lower left, where the frame is naturally darkest */
.loud__copy{position:absolute;left:0;right:0;bottom:0;z-index:2;
  padding:0 clamp(20px,3.2vw,52px) clamp(20px,3vw,42px);
  display:flex;flex-direction:column;gap:clamp(12px,1.6vh,20px)}
.loud .h{font-size:clamp(20px,2.4vw,34px);line-height:1.08;max-width:22ch;
  text-shadow:0 2px 26px rgba(0,0,0,.9),0 1px 3px rgba(0,0,0,.75)}
.loud .eyebrow{margin:0;color:var(--accent);text-shadow:0 1px 12px rgba(0,0,0,.9)}

.formula{display:flex;flex-wrap:wrap;align-items:baseline;gap:7px 11px;margin:0;
  font-family:var(--mono);font-size:clamp(9.5px,.82vw,11.5px);letter-spacing:.18em;
  text-transform:uppercase;color:var(--text-primary);
  text-shadow:0 1px 12px rgba(0,0,0,.9)}
.formula span,.formula i{--fd:0;
  --f:clamp(0,(var(--p,0) - .10 - var(--fd)*.035)*10,1);
  opacity:var(--f);transform:translateY(calc((1 - var(--f)) * 8px));display:inline-block}
.formula i{font-style:normal;color:var(--accent);font-size:1.3em;line-height:1}
.formula>:nth-child(2){--fd:1}.formula>:nth-child(3){--fd:2}
.formula>:nth-child(4){--fd:3}.formula>:nth-child(5){--fd:4}

/* the beats roll in from the left, one after another, the way they did before */
.beats{list-style:none;margin:clamp(4px,1vh,12px) 0 0;padding:0;display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(14px,2vw,38px)}
.beat{position:relative;padding-top:11px;border-top:1px solid rgba(244,239,235,.30);
  --bd:0;
  --b:clamp(0,(var(--p,0) - .16 - var(--bd)*.05)*8,1);
  opacity:var(--b);transform:translate3d(calc((1 - var(--b)) * -22px),0,0)}
.beat:nth-child(2){--bd:1}
.beat:nth-child(3){--bd:2}
.beat:first-child{border-top-color:var(--accent)}
.beat__n{position:absolute;top:11px;left:0;font-family:var(--mono);font-size:9.5px;
  letter-spacing:.2em;color:var(--accent);font-variant-numeric:tabular-nums;
  text-shadow:0 1px 10px rgba(0,0,0,.9)}
.beat h3{margin:0 0 3px;padding-left:30px;font-family:var(--display);font-weight:400;
  font-size:clamp(12.5px,1.02vw,15px);line-height:1.2;letter-spacing:-.005em;
  text-shadow:0 2px 18px rgba(0,0,0,.92),0 1px 3px rgba(0,0,0,.8)}
.beat p{margin:0;padding-left:30px;color:#E2D9DA;
  font-size:clamp(11px,.86vw,12.5px);line-height:1.45;
  text-shadow:0 2px 16px rgba(0,0,0,.92),0 1px 3px rgba(0,0,0,.8)}

@media (max-width:900px){
  .loud{margin-inline:0}
  .loud__film{aspect-ratio:4/5;max-width:100%}
  .fill{opacity:1;object-position:56% 22%}
  .loud__foot{height:62%}
  .loud__copy{gap:14px}
  .beats{grid-template-columns:1fr;gap:0}
  .beat{padding:12px 0;opacity:1;transform:none;border-top-color:rgba(244,239,235,.26)}
  .beat__n{top:12px}
  .beat p{display:none}
  .formula span,.formula i{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
  .fill{opacity:1}
  .formula span,.formula i,.beat{opacity:1;transform:none}
}`;

s = s.slice(0, C0) + CSS + s.slice(C1);

fs.writeFileSync(p, s);
console.log('full-width film, copy rolling in inside the scene');
