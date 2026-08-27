// One buy component, used in both the product module and the closing offer: pick a
// quantity, the card lights, then one CTA. Replaces .packs/.cta-row and .tiers/.close__note.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 70)); process.exit(1); } s = s.replace(a, b); };
const cut = (a, b, what) => {
  const i = s.indexOf(a); if (i < 0) { console.error('CUT start miss: ' + what); process.exit(1); }
  const j = s.indexOf(b, i); if (j < 0) { console.error('CUT end miss: ' + what); process.exit(1); }
  s = s.slice(0, i) + s.slice(j + b.length);
};

const ICON = {
  shield: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 1.7 3.3 4.4v4.9c0 4 2.8 7.1 6.7 8.5 3.9-1.4 6.7-4.5 6.7-8.5V4.4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M6.9 9.9l2.3 2.3 4.1-4.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock:   '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="4.1" y="8.5" width="11.8" height="8.6" rx="1.4" stroke="currentColor" stroke-width="1.4"/><path d="M7 8.5V6.3a3 3 0 016 0v2.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  truck:  '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M1.6 4.9h9.6v8.6H1.6z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M11.2 7.9h3.1l3.1 3.2v2.4h-6.2z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="5.6" cy="15.4" r="1.7" stroke="currentColor" stroke-width="1.4"/><circle cx="14.2" cy="15.4" r="1.7" stroke="currentColor" stroke-width="1.4"/></svg>',
  badge:  '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.4" stroke="currentColor" stroke-width="1.4"/><path d="M6.6 10.1l2.3 2.3 4.5-4.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:  '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.6" stroke="currentColor" stroke-width="1.3"/><path d="M6.7 10.1l2.2 2.2 4.4-4.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ctaLock:'<svg class="cta__i" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="4.1" y="8.5" width="11.8" height="8.6" rx="1.4" stroke="currentColor" stroke-width="1.7"/><path d="M7 8.5V6.3a3 3 0 016 0v2.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  arrow:  '<svg class="cta__a" viewBox="0 0 24 12" fill="none" aria-hidden="true"><path d="M0 6h21M15.6 1l5.6 5-5.6 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

function opts(group) {
  return `<div class="buy__opts" role="radiogroup" aria-label="Choose how many bottles">
      <label class="opt">
        <input class="opt__in" type="radio" name="qty-${group}" value="1">
        <span class="opt__dot" aria-hidden="true"></span>
        <span class="opt__q">1 bottle</span>
        <span class="opt__p">$22.99</span>
        <span class="opt__each">$22.99 each</span>
        <span class="opt__u"></span>
        <span class="opt__tag">Try it</span>
      </label>
      <label class="opt opt--best">
        <span class="opt__flag">Best value</span>
        <input class="opt__in" type="radio" name="qty-${group}" value="3" checked>
        <span class="opt__dot" aria-hidden="true"></span>
        <span class="opt__q">3 bottles</span>
        <span class="opt__p">$54.99</span>
        <span class="opt__each">$18.33 each</span>
        <span class="opt__u"><s>$68.97</s> <b class="save">Save $13.98</b></span>
        <span class="opt__tag opt__tag--rib">Most popular &#183; Maximum savings</span>
      </label>
      <label class="opt">
        <input class="opt__in" type="radio" name="qty-${group}" value="2">
        <span class="opt__dot" aria-hidden="true"></span>
        <span class="opt__q">2 bottles</span>
        <span class="opt__p">$39.99</span>
        <span class="opt__each">$20.00 each</span>
        <span class="opt__u"><s>$45.98</s> <b class="save">Save $5.99</b></span>
        <span class="opt__tag">Great value</span>
      </label>
    </div>`;
}
const TRUST = `<ul class="trust">
      <li>${ICON.shield}<span><b>365-day</b>Money-back guarantee</span></li>
      <li>${ICON.lock}<span><b>Secure</b>Checkout</span></li>
      <li>${ICON.truck}<span><b>Fast</b>Shipping</span></li>
      <li>${ICON.badge}<span><b>Satisfaction</b>Guaranteed</span></li>
    </ul>`;
const CTA = `<a class="cta" href="#" data-cta>${ICON.ctaLock}<span class="cta__t">Get Alpha Male now</span>${ICON.arrow}</a>
    <p class="buy__soon" hidden></p>`;

/* ---------- 1. the closing offer ---------- */
const G0 = s.indexOf('<section class="close" id="get">');
const G1 = s.indexOf('</section>', G0) + '</section>'.length;
if (G0 < 0) { console.error('#get missing'); process.exit(1); }
s = s.slice(0, G0) + `<section class="close" id="get">
  <div class="rule" aria-hidden="true"></div>
  <div class="stg">
    <h2>You&#8217;ve read enough.<br>Now see what happens.</h2>
    <p class="sub">Alpha Male was made for the nights you want to show up confident, smell unforgettable, and leave an impression. <b class="sub__hit">Choose your bottle and make your move.</b></p>
  </div>

  <div class="buy" id="buyClose">
    ${opts('close')}
    ${TRUST}
    ${CTA}
    <p class="buy__join">${ICON.check}<span>Join <b>10,000+</b> men who chose confidence.</span></p>
    <p class="buy__help">Questions? <a class="buy__mail" href="#">Contact our support team.</a> We&#8217;re here for you.</p>
  </div>
</section>` + s.slice(G1);

/* ---------- 2. the product module: same component, compact ---------- */
const P0 = s.indexOf('        <div class="packs" role="list">');
const PEND = `        <div class="cta-row">
          <a class="btn" href="#get">Get Alpha Male</a>
          <a class="btn btn--ghost" href="#how">Why Alpha Male?</a>
        </div>`;
const P1 = s.indexOf(PEND, P0);
if (P0 < 0 || P1 < 0) { console.error('packs/cta-row block missing'); process.exit(1); }
s = s.slice(0, P0) + `        <div class="buy buy--compact" id="buyModule">
    ${opts('module')}
    ${TRUST}
    ${CTA}
        </div>` + s.slice(P1 + PEND.length);

/* ---------- 3. drop the old CSS ---------- */
cut('.packs{display:grid;grid-template-columns:.82fr 1.36fr .82fr;',
    '.pack__flag{position:static;margin-left:auto}}', 'pack css');
cut('/* The closing offer carries the same grammar as the offer inside the product module —',
    `@media (max-width:600px){
  .close__note{flex-direction:column;gap:8px}
  .close__note span{padding-left:0}
  .close__note span::before{display:none}
}`, 'tier css');

/* ---------- 4. the component ---------- */
const CSS = `/* ---------------------------------------------------------- the buy box
   One component, used twice: inside the product module and at the close. Choosing a
   quantity is its own step — the card lights and the dot fills — and only then does the
   single CTA carry that choice to checkout. Two separate offers with two separate looks
   was the page asking the same question twice in two different voices. */
.buy{--sel:0}
.pin__copy .buy{--s:clamp(0,(var(--t,0) - .38)*4,1);opacity:var(--s);
  transform:translate3d(0,calc((1 - var(--s)) * 14px),0)}
.buy__opts{display:grid;grid-template-columns:.9fr 1.24fr .9fr;
  gap:clamp(10px,1.2vw,18px);align-items:stretch;margin:0}
@media (max-width:760px){.buy__opts{grid-template-columns:1fr;max-width:430px;margin-inline:auto}}

/* the card is a label wrapping a real radio: keyboard, arrow keys and screen readers all
   work without a line of JS pretending to be a form control */
.opt{position:relative;display:grid;justify-items:center;align-content:start;
  gap:6px;padding:30px 16px 18px;cursor:pointer;border-radius:4px;
  background:rgba(6,4,5,.62);border:1.5px solid var(--panel-line);
  transition:border-color .28s var(--ease),background .28s var(--ease),
             transform .28s var(--ease),box-shadow .28s var(--ease)}
.opt__in{position:absolute;opacity:0;width:1px;height:1px;margin:0;pointer-events:none}
.opt:hover{border-color:rgba(237,28,36,.55);background:rgba(20,7,9,.8);transform:translateY(-2px)}
.opt:has(.opt__in:focus-visible){outline:2px solid var(--text-primary);outline-offset:3px}

/* the dot: hollow until chosen, then filled accent with a ring around it */
.opt__dot{width:17px;height:17px;border-radius:50%;border:1.5px solid var(--border-strong);
  background:transparent;margin-bottom:4px;
  transition:border-color .28s var(--ease),background .28s var(--ease),box-shadow .28s var(--ease)}
.opt.is-sel .opt__dot{border-color:var(--accent);background:var(--accent);
  box-shadow:0 0 0 3px rgba(237,28,36,.22),0 0 14px 2px rgba(237,28,36,.55)}

/* chosen: the whole card goes red, which is the only place on the page a card does */
.opt.is-sel{border-color:var(--accent);background:rgba(40,9,12,.9);
  box-shadow:0 0 0 1px rgba(237,28,36,.5),0 0 34px -8px rgba(237,28,36,.5),
             0 16px 44px -22px rgba(237,28,36,.6)}
.opt.is-sel:hover{background:rgba(50,11,15,.94)}

.opt--best{border-color:rgba(237,28,36,.5);background:rgba(30,8,10,.82);padding-top:34px}
.opt--best.is-sel{box-shadow:0 0 0 1px rgba(237,28,36,.7),0 0 44px -6px rgba(237,28,36,.55),
             0 20px 52px -22px rgba(237,28,36,.65)}
.opt__flag{position:absolute;top:0;left:50%;transform:translate(-50%,-50%);
  font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;
  background:var(--accent);color:#fff;padding:4px 11px;border-radius:2px;white-space:nowrap}

.opt__q{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--text-secondary)}
.opt.is-sel .opt__q,.opt--best .opt__q{color:var(--text-primary)}
.opt__p{font-family:var(--display);font-size:clamp(24px,2.4vw,34px);line-height:1;
  color:var(--text-primary);font-variant-numeric:tabular-nums}
.opt--best .opt__p{font-size:clamp(32px,3.5vw,50px)}
.opt__each{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--text-dim);font-variant-numeric:tabular-nums}
.opt--best .opt__each{font-size:12px;color:var(--text-secondary)}
/* the row is kept even when empty so the three cards agree line for line */
.opt__u{min-height:1.5em;font-family:var(--mono);font-size:11.5px;letter-spacing:.05em;
  color:var(--text-secondary);font-variant-numeric:tabular-nums}
.opt--best .opt__u{font-size:13px}
.opt__u s{color:var(--text-secondary);opacity:.6;text-decoration-thickness:1px}
.opt__tag{margin-top:6px;font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--text-secondary)}
.opt__tag--rib{color:var(--accent);border:1px solid rgba(237,28,36,.42);border-radius:2px;
  padding:5px 10px;background:rgba(237,28,36,.09);letter-spacing:.12em}

/* the four reassurances, on one rule-separated strip */
.trust{list-style:none;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;
  gap:0;margin:clamp(20px,2.4vw,30px) 0 0;padding:0}
.trust li{display:flex;align-items:center;gap:9px;padding:0 clamp(14px,1.7vw,26px);
  border-left:1px solid var(--panel-line)}
.trust li:first-child{border-left:0}
.trust svg{width:19px;height:19px;flex:none;color:var(--accent)}
.trust span{display:flex;flex-direction:column;gap:2px;text-align:left;
  font-family:var(--mono);font-size:9.5px;letter-spacing:.15em;text-transform:uppercase;
  color:var(--text-secondary);line-height:1.25}
.trust b{font-weight:500;font-size:11px;letter-spacing:.17em;color:var(--text-primary)}
@media (max-width:820px){
  .trust li{border-left:0;padding:7px 12px;flex:0 0 auto}
  .trust{gap:2px 6px}
}

/* the single action. Full width, because at this point in the page there is one thing left
   to do and the button should not look like it is one of several options. */
.cta{position:relative;display:flex;align-items:center;justify-content:center;gap:14px;
  margin:clamp(22px,2.6vw,34px) auto 0;max-width:920px;
  padding:clamp(18px,1.8vw,24px) 28px;border-radius:4px;
  background:linear-gradient(180deg,#F42731 0%,var(--accent) 46%,#C4141B 100%);
  border:1px solid #FF4A52;color:#fff;text-decoration:none;cursor:pointer;
  font-family:var(--display);font-weight:400;font-size:clamp(17px,1.9vw,26px);
  letter-spacing:.005em;
  box-shadow:0 0 0 1px rgba(237,28,36,.4),0 0 46px -8px rgba(237,28,36,.6),
             0 20px 50px -24px rgba(237,28,36,.75);
  transition:transform .3s var(--ease),box-shadow .35s var(--ease),filter .3s var(--ease)}
.cta:hover{transform:translateY(-2px);filter:brightness(1.07);
  box-shadow:0 0 0 1px rgba(237,28,36,.6),0 0 58px -6px rgba(237,28,36,.72),
             0 24px 58px -24px rgba(237,28,36,.85)}
.cta:focus-visible{outline:2px solid #fff;outline-offset:3px}
.cta__i{width:clamp(18px,1.5vw,22px);height:clamp(18px,1.5vw,22px);flex:none}
.cta__a{width:clamp(22px,1.9vw,30px);height:auto;flex:none;
  transition:transform .3s var(--ease)}
.cta:hover .cta__a{transform:translateX(4px)}
.cta[aria-disabled="true"]{cursor:default}
.cta[aria-disabled="true"]:hover{transform:none;filter:none}

.buy__soon{margin:12px 0 0;font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--text-dim)}
.buy__join{display:flex;align-items:center;justify-content:center;gap:9px;
  margin:clamp(14px,1.6vw,20px) 0 0;font-family:var(--mono);
  font-size:clamp(10.5px,1vw,12.5px);letter-spacing:.15em;text-transform:uppercase;
  color:var(--text-secondary)}
.buy__join svg{width:17px;height:17px;flex:none;color:var(--accent)}
.buy__join b{color:var(--accent);font-weight:500}
.buy__help{margin:14px 0 0;font-size:14px;color:var(--text-dim)}
.buy__mail{color:var(--text-secondary);text-underline-offset:3px}
.buy__mail:hover{color:var(--accent)}
.sub__hit{display:block;margin-top:4px;color:var(--accent);font-weight:inherit}

/* the module copy column is roughly half a viewport, so the same component runs tighter */
.buy--compact .opt{padding:26px 10px 14px;gap:4px}
.buy--compact .opt--best{padding-top:30px}
.buy--compact .opt__p{font-size:clamp(19px,1.7vw,26px)}
.buy--compact .opt--best .opt__p{font-size:clamp(25px,2.5vw,36px)}
.buy--compact .opt__q{font-size:10px;letter-spacing:.14em}
.buy--compact .opt__each{font-size:9.5px;letter-spacing:.08em}
.buy--compact .opt__u{font-size:10.5px}
.buy--compact .opt--best .opt__u{font-size:11.5px}
.buy--compact .opt__tag{font-size:9px;letter-spacing:.12em;margin-top:4px}
.buy--compact .opt__tag--rib{padding:4px 7px;letter-spacing:.06em}
.buy--compact .opt__dot{width:14px;height:14px}
.buy--compact .opt__flag{font-size:9px;padding:3px 8px}
.buy--compact .trust{margin-top:18px}
.buy--compact .trust li{padding:0 clamp(8px,1vw,14px);gap:7px}
.buy--compact .trust svg{width:16px;height:16px}
.buy--compact .trust span{font-size:8.5px;letter-spacing:.12em}
.buy--compact .trust b{font-size:9.5px;letter-spacing:.13em}
.buy--compact .cta{margin-top:20px;padding:15px 20px;font-size:clamp(15px,1.35vw,19px);gap:11px}
@media (max-width:1180px){
  .buy--compact .buy__opts{grid-template-columns:1fr;gap:8px;max-width:none}
  .buy--compact .opt{grid-template-columns:auto auto 1fr auto;justify-items:start;
    align-items:center;padding:12px 14px;gap:4px 12px}
  .buy--compact .opt__flag{position:static;transform:none;grid-column:1/-1;justify-self:end}
  .buy--compact .opt__u,.buy--compact .opt__tag{margin-top:0}
}
@media (prefers-reduced-motion:reduce){.opt,.cta,.cta__a{transition:none}}
`;

const CSSANCHOR = '.close{position:relative;text-align:center;';
if (s.indexOf(CSSANCHOR) < 0) { console.error('close css anchor missing'); process.exit(1); }
s = s.replace(CSSANCHOR, CSS + '\n' + CSSANCHOR);

/* the closing section is no longer a narrow column */
rep('.close .sub{color:var(--text-secondary);margin:22px auto 0;max-width:44ch}',
    '.close .sub{color:var(--text-secondary);margin:22px auto 0;max-width:52ch}\n.close .buy{max-width:1040px;margin:clamp(34px,4vw,52px) auto 0}');

/* ---------- 5. wiring ---------- */
rep(`var BUY_URL   = '';
var BUY_LINKS = { '1': '', '2': '', '3': '' };   /* optional per-pack links */`,
`var BUY_URL   = '';
var BUY_LINKS = { '1': '', '2': '', '3': '' };   /* optional per-pack links */
var SUPPORT_EMAIL = '';                          /* e.g. 'help@yourstore.com' */`);

const W0 = s.indexOf('(function wireBuying(){');
const W1 = s.indexOf('})();', W0) + 5;
if (W0 < 0 || W1 < 4) { console.error('wireBuying missing'); process.exit(1); }
s = s.slice(0, W0) + `(function wireBuying(){
  var pick = function(n){ return (BUY_LINKS[n] || BUY_URL || ''); };
  var live = !!(BUY_URL || BUY_LINKS['1'] || BUY_LINKS['2'] || BUY_LINKS['3']);

  /* Both buy boxes behave identically: the radio is the source of truth, the card only
     reflects it, and the CTA reads it at click time rather than caching a URL. */
  document.querySelectorAll('.buy').forEach(function(box){
    var ins  = [].slice.call(box.querySelectorAll('.opt__in'));
    var cta  = box.querySelector('.cta');
    var soon = box.querySelector('.buy__soon');

    function sync(){
      ins.forEach(function(i){
        var card = i.parentNode;
        card.classList.toggle('is-sel', i.checked);
        card.setAttribute('aria-checked', i.checked ? 'true' : 'false');
      });
      var chosen = box.querySelector('.opt__in:checked');
      var url = chosen ? pick(chosen.value) : '';
      if (!cta) return;
      if (url) { cta.href = url; cta.removeAttribute('aria-disabled'); }
      else { cta.href = '#'; cta.setAttribute('aria-disabled', 'true'); }
    }

    ins.forEach(function(i){ i.addEventListener('change', sync); });
    if (cta) cta.addEventListener('click', function(e){
      if (cta.getAttribute('aria-disabled') === 'true') e.preventDefault();
    });
    if (!live && soon) { soon.textContent = 'Online store opening shortly.'; soon.hidden = false; }
    sync();
  });

  document.querySelectorAll('a[href="#get"], #buy').forEach(function(a){
    if (BUY_URL) a.href = BUY_URL;
  });

  document.querySelectorAll('.buy__mail').forEach(function(a){
    if (SUPPORT_EMAIL) a.href = 'mailto:' + SUPPORT_EMAIL;
  });
})();` + s.slice(W1);

fs.writeFileSync(p, s);
console.log('buy box built; net ' + (s.length - t0) + ' bytes');
