// The closing offer: new copy, correct arithmetic in both offer blocks, hover that
// actually highlights, and one shared treatment for the two Best Value boxes.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 70)); process.exit(1); } s = s.replace(a, b); };
const all = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS(all): ' + a.slice(0, 70)); process.exit(1); } s = s.split(a).join(b); };

/* ---------- 1. the arithmetic, in both the module offer and the closing offer ----------
   3 x 22.99 = 68.97, so the saving against it is 13.98. 2 x 22.99 = 45.98, saving 5.99.
   The struck figure was 69.97, which made the saving read 14.98 off a price that never
   existed. */
all('<s>$69.97</s> <b class="save">Save $14.98</b>', '<s>$68.97</s> <b class="save">Save $13.98</b>');
all('<s>$45.98</s> <b class="save">Save $6</b>',     '<s>$45.98</s> <b class="save">Save $5.99</b>');

/* ---------- 2. per-bottle economics, which is what actually sells the 3-pack ---------- */
rep(`            <span class="pack__q">1 bottle</span>
            <span class="pack__p">$22.99</span>
            <span class="pack__u">Try Alpha Male</span>`,
`            <span class="pack__q">1 bottle</span>
            <span class="pack__p">$22.99</span>
            <span class="pack__each">$22.99 each</span>
            <span class="pack__u">Try Alpha Male</span>`);
rep(`            <span class="pack__q">3 bottles</span>
            <span class="pack__p">$54.99</span>`,
`            <span class="pack__q">3 bottles</span>
            <span class="pack__p">$54.99</span>
            <span class="pack__each">$18.33 each</span>`);
rep(`            <span class="pack__q">2 bottles</span>
            <span class="pack__p">$39.99</span>`,
`            <span class="pack__q">2 bottles</span>
            <span class="pack__p">$39.99</span>
            <span class="pack__each">$20.00 each</span>`);

rep(`.pack__u{display:block;margin-top:9px;font-family:var(--mono);font-size:13px;`,
`.pack__each{display:block;margin-top:6px;font-family:var(--mono);font-size:10.5px;
  letter-spacing:.14em;text-transform:uppercase;color:var(--text-dim);
  font-variant-numeric:tabular-nums}
.pack--best .pack__each{font-size:12px;color:var(--text-secondary)}
.pack__u{display:block;margin-top:9px;font-family:var(--mono);font-size:13px;`);

/* the two Best Value flags now sit the same way: centred on the top edge */
rep(`.pack__flag{position:absolute;top:-10px;left:16px;background:var(--accent);color:#fff;
  font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
  padding:3px 7px;border-radius:2px}`,
`/* centred on the edge it sits on, in both offer blocks, so the two read as the same
   component rather than two designers' versions of one */
.pack__flag{position:absolute;top:0;left:50%;transform:translate(-50%,-50%);
  background:var(--accent);color:#fff;
  font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
  padding:4px 10px;border-radius:2px;white-space:nowrap}`);
rep('.pack--best{border-color:var(--accent);background:rgba(38,10,13,.86);\n  padding:24px 22px 22px;',
    '.pack--best{border-color:var(--accent);background:rgba(38,10,13,.86);\n  padding:28px 22px 22px;');

/* ---------- 3. hover highlights, even before the store URL exists ----------
   The cards were inert on hover while BUY_URL is empty. The highlight is not a promise of
   checkout, and suppressing it hid the design. aria-disabled still states the truth. */
rep(`/* until a store URL exists these are not links, and they should not pretend to be */
.pack--soon{cursor:default}
.pack--soon:hover{transform:none;border-color:var(--panel-line);background:rgba(6,4,5,.62)}
.pack--soon.pack--best:hover{border-color:rgba(237,28,36,.55)}`,
`/* Before a store URL exists these still highlight on hover — the highlight is feedback,
   not a promise of checkout, and withholding it hid the design. aria-disabled carries the
   real state to assistive technology. */`);

/* ---------- 4. the closing offer, rebuilt ---------- */
const G0 = s.indexOf('<section class="close" id="get">');
const G1 = s.indexOf('</section>', G0) + '</section>'.length;
if (G0 < 0) { console.error('#get not found'); process.exit(1); }
s = s.slice(0, G0) + `<section class="close" id="get">
  <div class="rule" aria-hidden="true"></div>
  <div class="stg">
    <h2>You&#8217;ve read enough.<br>Now see what happens.</h2>
    <p class="sub">Alpha Male was made for the nights you want to show up confident, smell unforgettable, and leave an impression. Choose your bottle and make your move.</p>
  </div>

  <div class="tiers" role="list">
    <a class="tier" role="listitem" href="#" data-buy="1">
      <span class="tier__q">1 bottle</span>
      <span class="tier__p">$22.99</span>
      <span class="tier__each">$22.99 each</span>
      <span class="tier__u">Try Alpha Male</span>
    </a>
    <a class="tier tier--best" role="listitem" href="#" data-buy="3">
      <span class="tier__flag">Best value</span>
      <span class="tier__q">3 bottles</span>
      <span class="tier__p">$54.99</span>
      <span class="tier__each">$18.33 each</span>
      <span class="tier__u"><s>$68.97</s> <b class="save">Save $13.98</b></span>
    </a>
    <a class="tier" role="listitem" href="#" data-buy="2">
      <span class="tier__q">2 bottles</span>
      <span class="tier__p">$39.99</span>
      <span class="tier__each">$20.00 each</span>
      <span class="tier__u"><s>$45.98</s> <b class="save">Save $5.99</b></span>
    </a>
  </div>

  <p class="close__note"><b>Try Alpha Male risk-free</b><span>365-day money-back guarantee</span><span>Secure checkout</span><span>Fast shipping</span></p>
  <p class="close__soon" hidden></p>
</section>` + s.slice(G1);

/* ---------- 5. tier styling, matched to the packs ---------- */
const T0 = s.indexOf('.tiers{display:grid;');
const T1 = s.indexOf('.tier--soon.tier--best:hover{border-color:var(--accent)}') + '.tier--soon.tier--best:hover{border-color:var(--accent)}'.length;
if (T0 < 0 || T1 < 0) { console.error('tier css not found'); process.exit(1); }
s = s.slice(0, T0) + `/* The closing offer carries the same grammar as the offer inside the product module —
   same card, same hover, same Best Value treatment — at the larger scale the last section
   of a page can afford. Dominance comes from padding and type size rather than a scale()
   transform, which resamples the text and softens it. */
.tiers{display:grid;grid-template-columns:.86fr 1.3fr .86fr;gap:clamp(12px,1.5vw,20px);
  max-width:1040px;margin:56px auto 0;align-items:center}
@media (max-width:760px){.tiers{grid-template-columns:1fr;max-width:420px;gap:10px}}

.tier{position:relative;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:7px;padding:32px 20px 28px;text-decoration:none;
  border-radius:3px;background:rgba(6,4,5,.62);border:1px solid var(--panel-line);
  transition:border-color .3s var(--ease),background .3s var(--ease),
             transform .3s var(--ease),box-shadow .3s var(--ease)}
.tier:hover,.tier:focus-visible{border-color:var(--accent);background:rgba(26,8,10,.85);
  transform:translateY(-3px);
  box-shadow:0 0 0 1px rgba(237,28,36,.45),0 14px 34px -16px rgba(237,28,36,.5)}
.tier:focus-visible{outline:2px solid var(--text-primary);outline-offset:2px}

.tier--best{order:-1;border-color:var(--accent);background:rgba(38,10,13,.86);
  padding:44px 24px 34px;
  box-shadow:0 0 0 1px rgba(237,28,36,.55),0 0 34px -6px rgba(237,28,36,.34),
             0 18px 46px -20px rgba(237,28,36,.55)}
.tier--best:hover,.tier--best:focus-visible{background:rgba(48,12,16,.92);
  box-shadow:0 0 0 1px rgba(237,28,36,.75),0 0 46px -4px rgba(237,28,36,.5),
             0 22px 54px -20px rgba(237,28,36,.6)}
@media (min-width:761px){.tier--best{order:0}}

.tier__flag{position:absolute;top:0;left:50%;transform:translate(-50%,-50%);
  font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
  background:var(--accent);color:#fff;padding:4px 12px;border-radius:2px;white-space:nowrap}
.tier__q{font-family:var(--mono);font-size:11.5px;letter-spacing:.18em;
  text-transform:uppercase;color:var(--text-secondary)}
.tier--best .tier__q{font-size:13px;color:var(--text-primary)}
.tier__p{font-family:var(--display);font-size:clamp(26px,2.7vw,38px);line-height:1;
  color:var(--text-primary);font-variant-numeric:tabular-nums}
.tier--best .tier__p{font-size:clamp(38px,4.2vw,58px)}
.tier__each{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--text-dim);font-variant-numeric:tabular-nums}
.tier--best .tier__each{font-size:12px;color:var(--text-secondary)}
.tier__u{font-family:var(--mono);font-size:12px;letter-spacing:.06em;
  color:var(--text-secondary);font-variant-numeric:tabular-nums}
.tier--best .tier__u{font-size:14px}
.tier--best .save{font-size:15px}

/* the reassurance line: one claim in the page's voice, then the three facts */
.close__note{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
  gap:9px 20px;margin:38px 0 0;font-family:var(--mono);font-size:11.5px;
  letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary)}
.close__note b{color:var(--text-primary);font-weight:500;letter-spacing:.2em}
.close__note span{position:relative;padding-left:16px}
.close__note span::before{content:"";position:absolute;left:0;top:50%;width:4px;height:4px;
  margin-top:-2px;border-radius:50%;background:var(--accent);opacity:.75}
.close__soon{margin:14px 0 0;font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--text-dim)}
@media (max-width:600px){
  .close__note{flex-direction:column;gap:8px}
  .close__note span{padding-left:0}
  .close__note span::before{display:none}
}` + s.slice(T1);

/* ---------- 6. the not-live notice no longer overwrites the reassurance copy ---------- */
rep(`  if (!live) {
    var note = document.querySelector('.close__note');
    if (note) note.textContent = 'Online store opening shortly. Refund on request if it is not for you.';
  }`,
`  /* the notice gets its own line: it used to overwrite the reassurance copy entirely */
  if (!live) {
    var soon = document.querySelector('.close__soon');
    if (soon) { soon.textContent = 'Online store opening shortly.'; soon.hidden = false; }
  }`);

/* ---------- 7. dead CSS from the deleted FAQ ---------- */
rep(`/* --------------------------------------------------------------- faq */
.faq{margin:48px 0 0;border-top:1px solid var(--panel-line)}

`, '');

fs.writeFileSync(p, s);
console.log('offer rebuilt; net ' + (s.length - t0) + ' bytes');
