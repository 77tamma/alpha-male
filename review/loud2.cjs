// Re-lay the loud section: copy on the left, the loop as a contained panel on the right,
// and drop the full-viewport pin so the section stops eating a whole screen of height.
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
        <li class="beat"><span class="beat__n">03</span><h3>Roll-On Control</h3><p>Apply exactly where you want it. No cloud. No wasted spray.</p></li>
      </ol>
    </div>

    <figure class="loud__film">
      <video class="fill" id="coupleLoop" src="assets/couple-loop.mp4" poster="assets/couple-poster.jpg"
             muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
      <span class="loud__edge" aria-hidden="true"></span>
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
   The one place the page leaves black. Everything above is cold near-black; this runs
   warm, because a page this dark needs one moment that changes temperature or the whole
   thing reads as a single undifferentiated slab. Copy left, film right. */
.loud-sec{--warm:#150C09;--warm-deep:#0D0705;position:relative;background:var(--warm-deep)}
.loud-sec::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 90% at 78% 42%,rgba(120,52,20,.16) 0%,rgba(13,7,5,0) 62%)}
.loud{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1.06fr;
  gap:clamp(34px,5vw,80px);align-items:center;
  --bleed:max(0px,(min(1800px,100vw - var(--gut)*2) - 100%) / 2);
  margin-inline:calc(-1 * var(--bleed))}
.loud__copy{max-width:52ch}
.loud .h{font-size:clamp(26px,3.1vw,42px)}
.loud .eyebrow{color:var(--accent)}

/* the film: a contained panel, not a full-bleed backdrop, so the section keeps a
   normal section's height instead of claiming a whole viewport */
.loud__film{position:relative;margin:0;border-radius:3px;overflow:hidden;
  background:var(--warm-deep);aspect-ratio:16/10}
.fill{display:block;width:100%;height:100%;object-fit:cover;object-position:58% 34%;
  transform:scale(calc(1.01 + var(--p,0) * .04));transform-origin:58% 40%;
  opacity:clamp(0,(var(--p,0) - .06)*6,1)}
/* a hairline inside the panel edge and a floor under the frame, so it sits in the page
   rather than being pasted onto it */
.loud__edge{position:absolute;inset:0;pointer-events:none;
  box-shadow:inset 0 0 0 1px rgba(244,239,235,.10),
             inset 0 -70px 90px -46px rgba(13,7,5,.92)}

/* the formula terms arrive in sequence — the section's opening beat */
.formula{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px 14px;margin:22px 0 0;
  font-family:var(--mono);font-size:clamp(11px,1.05vw,14px);letter-spacing:.16em;
  text-transform:uppercase;color:var(--text-primary)}
.formula span,.formula i{--fd:0;
  --f:clamp(0,(var(--p,0) - .12 - var(--fd)*.035)*10,1);
  opacity:var(--f);transform:translateY(calc((1 - var(--f)) * 8px));display:inline-block}
.formula i{font-style:normal;color:var(--accent);font-size:1.25em;line-height:1}
.formula>:nth-child(2){--fd:1}.formula>:nth-child(3){--fd:2}
.formula>:nth-child(4){--fd:3}.formula>:nth-child(5){--fd:4}

.beats{list-style:none;margin:clamp(30px,4vw,46px) 0 0;padding:0;display:grid;
  gap:clamp(16px,2vw,24px)}
.beat{position:relative;padding-top:16px;border-top:1px solid rgba(244,239,235,.16);
  --bd:0;
  --b:clamp(0,(var(--p,0) - .20 - var(--bd)*.05)*8,1);
  opacity:var(--b);transform:translate3d(calc((1 - var(--b)) * -12px),0,0)}
.beat:nth-child(2){--bd:1}
.beat:nth-child(3){--bd:2}
.beat:first-child{border-top-color:var(--accent)}
.beat__n{position:absolute;top:16px;left:0;font-family:var(--mono);font-size:11px;
  letter-spacing:.2em;color:var(--accent);font-variant-numeric:tabular-nums}
.beat h3{margin:0 0 6px;padding-left:38px;font-family:var(--display);font-weight:400;
  font-size:clamp(15px,1.32vw,19px);line-height:1.22;letter-spacing:-.005em}
.beat p{margin:0;padding-left:38px;color:var(--text-secondary);
  font-size:clamp(13px,1.05vw,15px);line-height:1.55}

@media (max-width:900px){
  .loud{grid-template-columns:1fr;gap:34px;margin-inline:0}
  .loud__copy{max-width:none;order:1}
  .loud__film{order:2;aspect-ratio:16/11}
  .fill{opacity:1;transform:none}
  .beat{opacity:1;transform:none}
  .formula span,.formula i{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
  .fill{transform:none;opacity:1}
  .formula span,.formula i,.beat{opacity:1;transform:none}
}`;

s = s.slice(0, C0) + CSS + s.slice(C1);

fs.writeFileSync(p, s);
console.log('loud section re-laid: copy left, film right, no pin');
