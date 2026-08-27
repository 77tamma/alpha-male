// Batch: drop the FAQ, rebuild the guarantee as a proper moment, enlarge the hotspot
// cards, rework the pricing, restore sentence case and size in the hero, put the
// wordmark back to type, and break the reviews headline onto two lines.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;

/* ---------- 1. delete the FAQ ---------- */
const f0 = s.indexOf('<section class="sec" id="faq">');
const f1 = s.indexOf('<section class="sec guar">');
if (f0 < 0 || f1 < 0) { console.error('faq anchors not found'); process.exit(1); }
// take the divider and comment that preceded the guarantee along with it
let cut0 = f0;
const priorComment = s.lastIndexOf('<!--', f0);
if (priorComment > 0 && f0 - priorComment < 120) cut0 = priorComment;
s = s.slice(0, cut0) + s.slice(f1);

/* ---------- 2. the guarantee, rebuilt ---------- */
const g0 = s.indexOf('<section class="sec guar">');
const g1 = s.indexOf('\n</section>', g0) + '\n</section>'.length;
const GUAR = `<section class="sec guar" id="guarantee">
  <div class="guar__bed" aria-hidden="true">
    <span class="guar__glow"></span>
    <span class="guar__ring guar__ring--a"></span>
    <span class="guar__ring guar__ring--b"></span>
    <span class="guar__ring guar__ring--c"></span>
  </div>

  <div class="wrap guar__in">
    <div class="guar__seal" aria-hidden="true">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle class="gd" cx="60" cy="60" r="52" stroke="currentColor" stroke-width="1.5" style="--len:327"/>
        <circle class="gd" cx="60" cy="60" r="44" stroke="currentColor" stroke-width="1" opacity=".5" style="--len:277"/>
        <path class="gd gd--tick" d="M40 61l14 14 27-30" stroke="currentColor" stroke-width="4"
              stroke-linecap="round" stroke-linejoin="round" style="--len:64"/>
      </svg>
    </div>

    <p class="guar__kick">The guarantee</p>
    <h2 class="guar__h">We can&#8217;t guarantee the girl.</h2>
    <p class="guar__p">But we can stand behind the cologne. Try Alpha Male with confidence &#8212; if you are not happy for any reason, we refund your money. No questions asked.</p>

    <ul class="guar__row">
      <li><b>30 days</b><span>To change your mind</span></li>
      <li><b>Full refund</b><span>Not store credit</span></li>
      <li><b>No questions</b><span>We mean it</span></li>
    </ul>
  </div>
</section>`;
s = s.slice(0, g0) + GUAR + s.slice(g1);

/* guarantee css */
const gc0 = s.indexOf('.guar{padding-top:clamp(70px,9vw,110px);padding-bottom:clamp(70px,9vw,110px)}');
const gcEnd = '.guar__p{color:var(--text-secondary);max-width:52ch;margin:22px auto 0;font-size:clamp(15px,1.25vw,18px)}';
const gc1 = s.indexOf(gcEnd, gc0) + gcEnd.length;
if (gc0 < 0 || gc1 < 0) { console.error('guar css anchors not found'); process.exit(1); }

const GCSS = `/* ------------------------------------------------- the guarantee
   This is the page's reassurance beat and it was reading as a quiet paragraph. It now
   gets its own light: a slow crimson bloom, rings that expand out of the seal, and a
   check that draws itself when the section arrives. Everything is CSS, so it costs
   nothing to load and it inherits the page's palette exactly. */
.guar{position:relative;overflow:hidden;padding-top:clamp(84px,11vw,150px);
  padding-bottom:clamp(84px,11vw,150px);background:var(--canvas-deep)}
.guar__bed{position:absolute;inset:0;pointer-events:none}
.guar__glow{position:absolute;left:50%;top:46%;width:min(1100px,120%);aspect-ratio:1;
  transform:translate(-50%,-50%);border-radius:50%;
  background:radial-gradient(circle,rgba(237,28,36,.20) 0%,rgba(237,28,36,.07) 38%,transparent 68%);
  animation:guarBloom 7s ease-in-out infinite}
@keyframes guarBloom{0%,100%{transform:translate(-50%,-50%) scale(.9);opacity:.7}
                     50%{transform:translate(-50%,-50%) scale(1.06);opacity:1}}
/* rings leave the seal on a stagger, so there is always one mid-flight */
.guar__ring{position:absolute;left:50%;top:46%;width:210px;aspect-ratio:1;margin:-105px 0 0 -105px;
  border:1px solid rgba(237,28,36,.42);border-radius:50%;opacity:0;
  animation:guarRing 5.4s linear infinite}
.guar__ring--b{animation-delay:-1.8s}
.guar__ring--c{animation-delay:-3.6s}
@keyframes guarRing{0%{transform:scale(.5);opacity:0}
                    12%{opacity:.55}
                    100%{transform:scale(4.6);opacity:0}}

.guar__in{position:relative;z-index:1;max-width:900px;margin:0 auto;text-align:center}
.guar__seal{width:clamp(76px,8vw,104px);margin:0 auto clamp(22px,3vw,34px);color:var(--accent)}
.guar__seal svg{width:100%;height:auto;overflow:visible;
  filter:drop-shadow(0 0 22px rgba(237,28,36,.45))}
.guar .gd{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);
  transition:stroke-dashoffset 1.5s cubic-bezier(.22,.61,.36,1)}
.guar .gd--tick{transition-delay:.55s;color:var(--text-primary);stroke:var(--text-primary)}
.guar.in .gd{stroke-dashoffset:0}

.guar__kick{margin:0 0 14px;font-family:var(--mono);font-size:11px;letter-spacing:.24em;
  text-transform:uppercase;color:var(--accent)}
.guar__h{font-family:var(--display);font-weight:400;margin:0;
  font-size:clamp(28px,4.2vw,62px);line-height:1.03;letter-spacing:-.02em;max-width:16ch;
  margin-inline:auto;text-wrap:balance}
.guar__p{color:var(--text-secondary);max-width:54ch;margin:22px auto 0;
  font-size:clamp(15px,1.3vw,19px);line-height:1.55}

.guar__row{list-style:none;display:flex;flex-wrap:wrap;justify-content:center;
  gap:clamp(16px,3vw,54px);margin:clamp(30px,4vw,48px) 0 0;padding:0}
.guar__row li{position:relative;padding-top:14px;border-top:1px solid rgba(237,28,36,.42);
  min-width:150px}
.guar__row b{display:block;font-family:var(--display);font-weight:400;
  font-size:clamp(17px,1.6vw,23px);line-height:1.1;margin-bottom:5px}
.guar__row span{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--text-secondary)}

@media (prefers-reduced-motion:reduce){
  .guar__glow,.guar__ring{animation:none}
  .guar__ring{opacity:.18;transform:scale(2)}
  .guar .gd{transition:none;stroke-dashoffset:0}
}`;
s = s.slice(0, gc0) + GCSS + s.slice(gc1);

/* the seal draws when the section enters; reuse the existing entrance observer */
s = s.replace("'.stg,.rise,.rev,.tier'", "'.stg,.rise,.rev,.tier,.guar'");

/* ---------- 3. hotspot cards bigger ---------- */
s = s.replace('.spot__note{position:absolute;left:var(--nx,0);top:var(--ny,0);\n  width:max-content;max-width:236px;padding:13px 15px;',
              '.spot__note{position:absolute;left:var(--nx,0);top:var(--ny,0);\n  width:max-content;max-width:290px;padding:16px 18px;');
s = s.replace('  font-size:13.5px;line-height:1.45;color:var(--text-secondary);',
              '  font-size:16px;line-height:1.45;color:var(--text-secondary);');
s = s.replace('.spot__note b{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;',
              '.spot__note b{display:block;font-family:var(--mono);font-size:12.5px;letter-spacing:.18em;');

/* ---------- 4. pricing ---------- */
s = s.replace('.packs{display:grid;grid-template-columns:.86fr 1.28fr .86fr;gap:10px;margin:30px 0 0;align-items:stretch;',
              '.packs{display:grid;grid-template-columns:.82fr 1.36fr .82fr;gap:12px;margin:30px 0 0;align-items:center;');
s = s.replace('.pack{position:relative;display:block;text-decoration:none;padding:15px 14px 14px;',
              '.pack{position:relative;display:block;text-decoration:none;padding:17px 16px 15px;');
s = s.replace('.pack__p{display:block;font-family:var(--display);font-size:clamp(19px,1.7vw,25px);',
              '.pack__p{display:block;font-family:var(--display);font-size:clamp(21px,1.9vw,29px);');
s = s.replace('.pack__u{display:block;margin-top:8px;font-family:var(--mono);font-size:11.5px;',
              '.pack__u{display:block;margin-top:9px;font-family:var(--mono);font-size:13px;');
s = s.replace('.save{color:var(--accent);font-weight:500;font-size:1.04em}',
              '.save{color:var(--accent);font-weight:500;font-size:1.1em}');
// every pack lights on hover, not just the best one
s = s.replace('.pack:hover,.pack:focus-visible{border-color:var(--accent);background:rgba(20,7,9,.78);\n  transform:translateY(-2px)}',
              '.pack:hover,.pack:focus-visible{border-color:var(--accent);background:rgba(26,8,10,.85);\n  transform:translateY(-2px);box-shadow:0 0 0 1px rgba(237,28,36,.45),0 12px 30px -16px rgba(237,28,36,.5)}');
// the middle card carries a solid accent edge at rest, not a tint
s = s.replace(/\.pack--best\{border-color:rgba\(237,28,36,\.72\);background:rgba\(30,9,11,\.72\);\n  padding:20px 18px 18px;box-shadow:0 0 0 1px rgba\(237,28,36,\.18\),0 14px 40px -18px rgba\(237,28,36,\.42\)\}/,
`.pack--best{border-color:var(--accent);background:rgba(38,10,13,.86);
  padding:24px 22px 22px;
  box-shadow:0 0 0 1px rgba(237,28,36,.55),0 0 34px -6px rgba(237,28,36,.34),
             0 18px 46px -20px rgba(237,28,36,.55)}
.pack--best:hover,.pack--best:focus-visible{background:rgba(48,12,16,.92);
  box-shadow:0 0 0 1px rgba(237,28,36,.75),0 0 44px -4px rgba(237,28,36,.5),
             0 20px 52px -20px rgba(237,28,36,.6)}`);
s = s.replace('.pack--best .pack__p{font-size:clamp(25px,2.3vw,36px)}',
              '.pack--best .pack__p{font-size:clamp(30px,2.9vw,46px);line-height:.98}');
s = s.replace('.pack--best .pack__q{font-size:12px;color:var(--text-primary)}',
              '.pack--best .pack__q{font-size:13px;color:var(--text-primary)}');
s = s.replace('.pack--best .pack__u{font-size:12.5px}','.pack--best .pack__u{font-size:14px;margin-top:11px}');
s = s.replace('.pack--best .save{font-size:13px}','.pack--best .save{font-size:15px}');

/* ---------- 5. the wordmark returns to type ---------- */
s = s.replace('<h2 class="h">So what makes <img class="h__mark" src="assets/wordmark.png" width="900" height="152" alt="Alpha Male"> different?</h2>',
              '<h2 class="h">So what makes Alpha Male different?</h2>');

/* ---------- 6. hero bands: sentence case, larger ---------- */
s = s.replace('  font-size:clamp(24px,2.75vw,42px);line-height:1.08;letter-spacing:-.01em;\n  text-transform:uppercase;text-wrap:pretty}',
              '  font-size:clamp(28px,3.3vw,54px);line-height:1.04;letter-spacing:-.018em;\n  text-wrap:pretty}');
s = s.replace('.band .sub{margin:20px 0 0;font-size:clamp(17px,1.55vw,23px);color:var(--text-secondary);\n  max-width:34ch;line-height:1.5}',
              '.band .sub{margin:22px 0 0;font-size:clamp(19px,1.8vw,27px);color:var(--text-secondary);\n  max-width:32ch;line-height:1.45}');

/* ---------- 7. reviews headline on two lines ---------- */
s = s.replace('<h2 class="h">They bought it. Then things got interesting.</h2>',
              '<h2 class="h">They bought it.<br>Then things got interesting.</h2>');

fs.writeFileSync(p, s);
console.log('batch2 applied; net ' + (s.length - t0) + ' bytes');
