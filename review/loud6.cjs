// Film edge-to-edge at any viewport width, copy dropped to shoulder height so it clears
// her face, the three beats brought inside the frame, everything larger, and the backing
// left transparent so the picture reads through it.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- markup: beats back inside the figure ---------- */
const S = s.indexOf('<section class="sec loud-sec" id="how">');
const E = s.indexOf('\n</section>', S) + '\n</section>'.length;
if (S < 0 || E < 0) { console.error('section anchors not found'); process.exit(1); }

const SECTION = `<section class="sec loud-sec" id="how">
  <figure class="loud__film">
    <video class="fill" id="coupleLoop" src="assets/couple-loop.mp4" poster="assets/couple-poster.jpg"
           muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
    <span class="loud__foot" aria-hidden="true"></span>

    <div class="loud">
      <div class="loud__copy">
        <h2 class="h">So what makes Alpha Male different?</h2>
        <p class="formula">
          <span>Premium fragrance</span><i aria-hidden="true">+</i><span>Pheromones</span><i aria-hidden="true">+</i><span>Roll-on application</span>
        </p>
      </div>

      <ol class="beats">
        <li class="beat"><span class="beat__n">01</span><h3>Premium Masculine Scent</h3><p>Smells sophisticated enough to wear anywhere.</p></li>
        <li class="beat"><span class="beat__n">02</span><h3>Premium Masculine Scent</h3><p>Smells sophisticated enough to wear anywhere.</p></li>
        <li class="beat"><span class="beat__n">03</span><h3>Roll-On Control</h3><p>Apply exactly where you want it. No cloud, no wasted spray.</p></li>
      </ol>
    </div>
  </figure>
</section>`;

s = s.slice(0, S) + SECTION + s.slice(E);

/* ---------- css ---------- */
const C0 = s.indexOf('/* =============================== THE LOUD SECTION (colour break) ===============');
const CEND = '@media (prefers-reduced-motion:reduce){\n  .fill{opacity:1}\n  .formula span,.formula i,.beat{opacity:1;transform:none}\n}';
const C1 = s.indexOf(CEND, C0) + CEND.length;
if (C0 < 0 || C1 < 0) { console.error('css anchors not found'); process.exit(1); }

const CSS = `/* =============================== THE LOUD SECTION (colour break) ===============
   The one place the page leaves black. The film runs edge to edge at ANY viewport width
   — no max-width, no gutters — and its height is bounded so an ultrawide monitor cannot
   turn a full-bleed 16:9 frame into a two-thousand-pixel wall. Copy sits at shoulder
   height so it clears her face, and everything is scrimmed only enough to read: the
   picture is meant to show through the type, not sit behind a panel. */
.loud-sec{--warm-deep:#0D0705;position:relative;padding:0;background:var(--warm-deep)}
.loud__film{position:relative;margin:0;overflow:hidden;background:#000;
  width:100vw;margin-inline:calc(50% - 50vw);
  height:clamp(540px,72vh,860px)}
.fill{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 34%;
  opacity:clamp(0,(var(--p,0) - .04)*6,1)}

/* barely there — enough to seat the type and carry the frame into the next section */
.loud__foot{position:absolute;left:0;right:0;bottom:0;height:46%;pointer-events:none;
  background:linear-gradient(180deg,rgba(13,7,5,0) 0%,rgba(13,7,5,.30) 44%,
                             rgba(13,7,5,.62) 78%,rgba(13,7,5,.80) 100%)}

.loud{position:absolute;inset:0;z-index:2;max-width:1800px;margin-inline:auto;
  padding:0 var(--gut);display:flex;flex-direction:column;justify-content:flex-end;
  gap:clamp(20px,3vh,40px);padding-bottom:clamp(26px,4vh,52px)}

/* dropped to shoulder height: at the top of the frame it covered her face */
.loud__copy{max-width:min(46%,620px);margin-bottom:auto;margin-top:38%}
.loud__copy::before{content:"";position:absolute;pointer-events:none;z-index:-1;
  left:-12%;right:-18%;top:24%;bottom:-8%;
  background:radial-gradient(64% 84% at 26% 46%,rgba(13,7,5,.78) 0%,rgba(13,7,5,.56) 40%,
                             rgba(13,7,5,.22) 70%,rgba(13,7,5,0) 100%)}
.loud .h{font-size:clamp(24px,2.9vw,44px);line-height:1.06;max-width:16ch;
  text-shadow:0 2px 30px rgba(0,0,0,.94),0 1px 4px rgba(0,0,0,.85)}

.formula{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 13px;margin:16px 0 0;
  font-family:var(--mono);font-size:clamp(11px,1.02vw,14px);letter-spacing:.18em;
  text-transform:uppercase;color:var(--text-primary);
  text-shadow:0 1px 16px rgba(0,0,0,.94)}
.formula span,.formula i{--fd:0;
  --f:clamp(0,(var(--p,0) - .10 - var(--fd)*.035)*10,1);
  opacity:var(--f);transform:translateY(calc((1 - var(--f)) * 8px));display:inline-block}
.formula i{font-style:normal;color:var(--accent);font-size:1.3em;line-height:1}
.formula>:nth-child(2){--fd:1}.formula>:nth-child(3){--fd:2}
.formula>:nth-child(4){--fd:3}.formula>:nth-child(5){--fd:4}

/* the beats live in the frame now, along its foot, and are sized to be read at a glance
   rather than squinted at */
.beats{list-style:none;margin:0;padding:0;display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(18px,2.6vw,52px)}
.beat{position:relative;padding-top:14px;border-top:1px solid rgba(244,239,235,.34);
  --bd:0;
  --b:clamp(0,(var(--p,0) - .16 - var(--bd)*.05)*8,1);
  opacity:var(--b);transform:translate3d(calc((1 - var(--b)) * -22px),0,0)}
.beat:nth-child(2){--bd:1}
.beat:nth-child(3){--bd:2}
.beat:first-child{border-top-color:var(--accent)}
.beat__n{position:absolute;top:14px;left:0;font-family:var(--mono);font-size:11px;
  letter-spacing:.2em;color:var(--accent);font-variant-numeric:tabular-nums;
  text-shadow:0 1px 12px rgba(0,0,0,.95)}
.beat h3{margin:0 0 5px;padding-left:36px;font-family:var(--display);font-weight:400;
  font-size:clamp(15px,1.32vw,20px);line-height:1.2;letter-spacing:-.005em;
  text-shadow:0 2px 22px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.9)}
.beat p{margin:0;padding-left:36px;color:#E8E0E1;
  font-size:clamp(13px,1.08vw,15.5px);line-height:1.5;
  text-shadow:0 2px 20px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.9)}

@media (max-width:900px){
  .loud__film{height:auto;aspect-ratio:3/4}
  .fill{opacity:1;object-position:54% 26%}
  .loud__foot{height:58%}
  .loud{position:absolute;padding-bottom:clamp(22px,5vw,36px)}
  .loud__copy{max-width:none;margin-top:auto;margin-bottom:clamp(16px,3vw,26px)}
  .loud .h{max-width:none;font-size:clamp(22px,6vw,30px)}
  .beats{grid-template-columns:1fr;gap:0}
  .beat{padding:11px 0;opacity:1;transform:none;border-top-color:rgba(244,239,235,.28)}
  .beat__n{top:11px}
  .beat p{display:none}
  .beat h3{font-size:15px}
  .formula span,.formula i{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
  .fill{opacity:1}
  .formula span,.formula i,.beat{opacity:1;transform:none}
}`;

s = s.slice(0, C0) + CSS + s.slice(C1);

fs.writeFileSync(p, s);
console.log('film edge-to-edge, copy at shoulder height, beats inside the frame');
