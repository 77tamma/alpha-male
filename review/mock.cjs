// Build a standalone mockup of the three guarantee options, in the page's real palette and
// real fonts, so they can be judged as pictures rather than as descriptions.
const fs = require('fs');
const SP = 'C:/Users/DADWOR~1/AppData/Local/Temp/claude/C--Users-DadWorkPC/736b769d-3e4f-49ca-b756-c2895e569576/scratchpad/fonts/';
const b64 = f => fs.readFileSync(SP + f).toString('base64');
const face = (fam, wt, file) =>
  `@font-face{font-family:"${fam}";font-style:normal;font-weight:${wt};font-display:block;` +
  `src:url("data:font/woff2;base64,${b64(file)}") format("woff2")}`;
const FONTS = [
  face('Archivo Black', '400', 'HTxqL289NzCGg4MzN6KJ7eW6CYyF_g.woff2'),
  face('JetBrains Mono', '500', 'tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-qxTOlOV.woff2'),
  face('Manrope', '200 800', 'xn7gYHE41ni1AdIRggexSg.woff2'),
].join('\n');

const CHEV = '<svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg>';
const HEAD = (n) => `
  <p class="eyebrow">${CHEV}The guarantee</p>
  <h2 class="h">Commitment issues?</h2>
  <p class="lede">Take Alpha Male home and see how things go. You have a full 365 days to decide if it deserves a permanent spot in your routine. If you&#8217;re not satisfied, we&#8217;ll refund your purchase.</p>`;

const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
:root{--canvas:#0A0708;--panel-line:#2A2022;--border-strong:#4A3B3E;--accent:#ED1C24;
  --text-primary:#F4EFEB;--text-secondary:#B4A8AC;--text-dim:#6E6467;
  --display:'Archivo Black',Georgia,serif;--body:'Manrope',system-ui,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,monospace}
*{box-sizing:border-box}
body{margin:0;background:var(--canvas);color:var(--text-primary);font-family:var(--body);
  -webkit-font-smoothing:antialiased}
.opt{position:relative;padding:96px 72px;overflow:hidden;isolation:isolate}
/* the shared boundary treatment: a hairline that dissolves before the screen edge, and an
   almost imperceptible warm lift through the middle of the section */
.opt::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;z-index:2;
  background:linear-gradient(90deg,rgba(42,32,34,0) 0%,#2A2022 22%,#2A2022 78%,rgba(42,32,34,0) 100%)}
.opt::after{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;
  background:radial-gradient(70% 84% at 50% 50%,rgba(30,21,24,.9) 0%,rgba(18,13,15,.4) 48%,rgba(10,7,8,0) 82%)}
.in{position:relative;z-index:1;max-width:1080px;margin:0 auto;text-align:center}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--accent);margin:0 0 18px;display:flex;align-items:center;justify-content:center;gap:9px}
.h{font-family:var(--display);font-weight:400;margin:0;font-size:46px;line-height:1.04;
  letter-spacing:-.025em}
.lede{color:var(--text-secondary);font-size:17px;line-height:1.6;max-width:60ch;margin:18px auto 0}
.rule{height:1px;background:var(--panel-line);margin:42px 0 0}
.tag{position:absolute;top:14px;left:20px;z-index:4;font-family:var(--mono);font-size:10px;
  letter-spacing:.2em;text-transform:uppercase;color:var(--text-dim)}

/* ---------- shared three-up ---------- */
.trio{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin:34px 0 0;text-align:left}
.cell{padding-top:16px;border-top:1px solid var(--panel-line);position:relative}
.cell.on{border-top-color:var(--accent)}
.dot{width:13px;height:13px;border-radius:50%;border:1.5px solid var(--border-strong);
  margin-bottom:13px}
.cell.on .dot{background:var(--accent);border-color:var(--accent);
  box-shadow:0 0 0 3px rgba(237,28,36,.2),0 0 12px 2px rgba(237,28,36,.5)}
.cell b{display:block;font-family:var(--display);font-weight:400;font-size:19px;line-height:1.15;
  margin-bottom:6px}
.cell span{display:block;color:var(--text-secondary);font-size:14px;line-height:1.45}
.detail{margin:30px auto 0;min-height:52px;max-width:56ch;color:var(--text-primary);
  font-size:17px;line-height:1.5}
.detail em{font-style:normal;color:var(--text-dim);font-size:14px}

/* ---------- option 2 ---------- */
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin:34px 0 0;text-align:left;
  position:relative}
.steps::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:var(--panel-line)}
.steps::after{content:"";position:absolute;top:0;left:0;width:66.6%;height:1px;background:var(--accent)}
.step{padding-top:18px}
.step i{font-style:normal;font-family:var(--mono);font-size:11px;letter-spacing:.2em;
  color:var(--text-dim);display:block;margin-bottom:9px}
.step.on i{color:var(--accent)}
.step b{display:block;font-family:var(--display);font-weight:400;font-size:18px;
  color:var(--text-dim);line-height:1.2}
.step.on b{color:var(--text-primary)}
.next{display:inline-flex;align-items:center;gap:9px;margin:26px 0 0;padding:11px 20px;
  border:1px solid var(--border-strong);border-radius:3px;background:transparent;
  font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--text-primary)}
.promises{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin:34px 0 0;
  text-align:left;padding-top:16px;border-top:1px solid var(--panel-line)}
.promises b{display:block;font-family:var(--display);font-weight:400;font-size:17px;margin-bottom:5px}
.promises span{color:var(--text-secondary);font-size:13.5px}

/* ---------- option 3 ---------- */
.sw{display:inline-flex;margin:32px 0 0;border:1px solid var(--panel-line);border-radius:3px;
  overflow:hidden}
.sw div{padding:12px 26px;font-family:var(--mono);font-size:11px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--text-dim);display:flex;align-items:center;gap:9px;
  border-right:1px solid var(--panel-line)}
.sw div:last-child{border-right:0}
.sw div.on{color:var(--text-primary);box-shadow:inset 0 -2px 0 var(--accent)}
.sw i{width:9px;height:9px;border-radius:50%;border:1.5px solid var(--border-strong);display:block}
.sw div.on i{background:var(--accent);border-color:var(--accent);
  box-shadow:0 0 0 2px rgba(237,28,36,.22),0 0 10px 1px rgba(237,28,36,.5)}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin:34px 0 0;text-align:left;
  padding-top:16px;border-top:1px solid var(--panel-line)}
.facts u{display:block;text-decoration:none;font-family:var(--mono);font-size:10.5px;
  letter-spacing:.22em;text-transform:uppercase;color:var(--text-dim);margin-bottom:10px}
.facts b{display:block;font-family:var(--display);font-weight:400;font-size:30px;line-height:1.05;
  letter-spacing:-.015em}
</style></head><body>

<section class="opt" id="o1">
  <p class="tag">Option 1 &#183; Three Clauses, Open</p>
  <div class="in">
    ${HEAD()}
    <div class="rule"></div>
    <div class="trio">
      <div class="cell"><span class="dot"></span><b>365 days</b><span>Take your time.</span></div>
      <div class="cell on"><span class="dot"></span><b>Full refund</b><span>We&#8217;ve got you covered.</span></div>
      <div class="cell"><span class="dot"></span><b>No awkward breakup</b><span>Just tell us it didn&#8217;t work out.</span></div>
    </div>
    <p class="detail">Every cent of the purchase price, back on the card you paid with.<br>
      <em>&#8592; the reader tapped &#8220;Full refund&#8221;</em></p>
  </div>
</section>

<section class="opt" id="o2">
  <p class="tag">Option 2 &#183; The Return, Start to Finish</p>
  <div class="in">
    ${HEAD()}
    <div class="steps">
      <div class="step"><i>01</i><b>You email us</b></div>
      <div class="step on"><i>02</i><b>We reply the same day</b></div>
      <div class="step"><i>03</i><b>Your money lands</b></div>
    </div>
    <p class="detail">Same day, from a person. Nothing to print, nothing to package, nothing to ship back.</p>
    <span class="next">Next step &#8594;</span>
    <div class="promises">
      <div><b>365 days</b><span>Take your time.</span></div>
      <div><b>Full refund</b><span>We&#8217;ve got you covered.</span></div>
      <div><b>No awkward breakup</b><span>Just tell us it didn&#8217;t work out.</span></div>
    </div>
  </div>
</section>

<section class="opt" id="o3">
  <p class="tag">Option 3 &#183; The Usual Policy, and Yours</p>
  <div class="in">
    ${HEAD()}
    <div class="sw">
      <div><i></i>A typical policy</div>
      <div class="on"><i></i>Alpha Male</div>
    </div>
    <div class="facts">
      <div><u>How long</u><b>365 days</b></div>
      <div><u>Condition</u><b>Opened, worn,<br>half gone</b></div>
      <div><u>What it costs you</u><b>Nothing</b></div>
    </div>
    <div class="promises">
      <div><b>365 days</b><span>Take your time.</span></div>
      <div><b>Full refund</b><span>We&#8217;ve got you covered.</span></div>
      <div><b>No awkward breakup</b><span>Just tell us it didn&#8217;t work out.</span></div>
    </div>
  </div>
</section>

</body></html>`;

fs.writeFileSync('site/mock.html', HTML);
console.log('site/mock.html written (' + (Buffer.byteLength(HTML) / 1024).toFixed(0) + 'KB)');
