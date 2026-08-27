// Show the film whole and bright. The height problem was never the frame — it was that
// the section claimed a full viewport. Fixing it by cropping the picture threw away her
// dress and the hand on the tie, which is the shot. Instead: the complete 16:9 frame at
// a controlled width, no veil, no crop, no darkening, and the copy on the page's own
// ground beside it where it needs no scrim to be readable.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- markup ---------- */
const S = s.indexOf('<section class="track track--loud" id="how">');
const E = s.indexOf('\n</section>', S) + '\n</section>'.length;
if (S < 0 || E < 0) { console.error('section anchors not found'); process.exit(1); }

const SECTION = `<section class="sec loud-sec" id="how">
  <div class="wrap loud">
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

    <figure class="loud__film">
      <video class="fill" id="coupleLoop" src="assets/couple-loop.mp4" poster="assets/couple-poster.jpg"
             muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
    </figure>
  </div>
</section>`;

s = s.slice(0, S) + SECTION + s.slice(E);

/* ---------- css ---------- */
const C0 = s.indexOf('/* =============================== THE LOUD SECTION (colour break) ===============');
const CEND = '@media (prefers-reduced-motion:reduce){\n  .fill{transform:none}\n  .formula span,.formula i,.beat{opacity:1;transform:none}\n}';
const C1 = s.indexOf(CEND, C0) + CEND.length;
if (C0 < 0 || C1 < 0) { console.error('css anchors not found'); process.exit(1); }

const CSS = `/* =============================== THE LOUD SECTION (colour break) ===============
   The one place the page leaves black: warm ground, warm footage, against the cold
   near-black everywhere else.
   The film runs at its own full 16:9 frame — uncropped and ungraded, because the shot is
   her whole figure and the hand on the tie, and any crop tight enough to shorten the
   section removes exactly that. Height is controlled by the frame's WIDTH instead, and
   the copy sits on the page's ground beside it, so nothing has to be darkened to keep
   the type readable. */
.loud-sec{--warm-deep:#0D0705;position:relative;background:var(--warm-deep);
  padding-block:clamp(64px,8vw,110px)}
.loud-sec::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(110% 84% at 74% 46%,rgba(126,58,24,.20) 0%,rgba(13,7,5,0) 64%)}
.loud{position:relative;z-index:1;display:grid;grid-template-columns:.62fr 1.38fr;
  gap:clamp(30px,4vw,64px);align-items:center;
  --bleed:max(0px,(min(1800px,100vw - var(--gut)*2) - 100%) / 2);
  margin-inline:calc(-1 * var(--bleed))}
.loud__copy{max-width:46ch}
.loud .h{font-size:clamp(24px,2.7vw,38px);line-height:1.08}
.loud .eyebrow{color:var(--accent)}

/* the whole frame, nothing cropped away, nothing dimmed */
.loud__film{position:relative;margin:0;aspect-ratio:16/9;border-radius:3px;overflow:hidden;
  background:#000;box-shadow:0 0 0 1px rgba(244,239,235,.09)}
.fill{display:block;width:100%;height:100%;object-fit:contain;
  opacity:clamp(0,(var(--p,0) - .04)*6,1)}

.formula{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 12px;margin:18px 0 0;
  font-family:var(--mono);font-size:clamp(10px,.9vw,12.5px);letter-spacing:.18em;
  text-transform:uppercase;color:var(--text-primary)}
.formula span,.formula i{--fd:0;
  --f:clamp(0,(var(--p,0) - .10 - var(--fd)*.035)*10,1);
  opacity:var(--f);transform:translateY(calc((1 - var(--f)) * 8px));display:inline-block}
.formula i{font-style:normal;color:var(--accent);font-size:1.3em;line-height:1}
.formula>:nth-child(2){--fd:1}.formula>:nth-child(3){--fd:2}
.formula>:nth-child(4){--fd:3}.formula>:nth-child(5){--fd:4}

.beats{list-style:none;margin:clamp(26px,3vw,40px) 0 0;padding:0;display:grid;
  gap:clamp(14px,1.8vw,22px)}
.beat{position:relative;padding-top:15px;border-top:1px solid rgba(244,239,235,.16);
  --bd:0;
  --b:clamp(0,(var(--p,0) - .16 - var(--bd)*.05)*8,1);
  opacity:var(--b);transform:translate3d(calc((1 - var(--b)) * -12px),0,0)}
.beat:nth-child(2){--bd:1}
.beat:nth-child(3){--bd:2}
.beat:first-child{border-top-color:var(--accent)}
.beat__n{position:absolute;top:15px;left:0;font-family:var(--mono);font-size:10.5px;
  letter-spacing:.2em;color:var(--accent);font-variant-numeric:tabular-nums}
.beat h3{margin:0 0 5px;padding-left:34px;font-family:var(--display);font-weight:400;
  font-size:clamp(14px,1.2vw,17px);line-height:1.2;letter-spacing:-.005em}
.beat p{margin:0;padding-left:34px;color:var(--text-secondary);
  font-size:clamp(12.5px,1vw,14px);line-height:1.55}

@media (max-width:900px){
  .loud{grid-template-columns:1fr;gap:30px;margin-inline:0}
  .loud__copy{max-width:none}
  .loud__film{order:-1}
  .fill{opacity:1}
  .beat{opacity:1;transform:none}
  .formula span,.formula i{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
  .fill{opacity:1}
  .formula span,.formula i,.beat{opacity:1;transform:none}
}`;

s = s.slice(0, C0) + CSS + s.slice(C1);

fs.writeFileSync(p, s);
console.log('film shown whole and bright; height controlled by width');
