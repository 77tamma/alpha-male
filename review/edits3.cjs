const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* ---------- 1. the hero kicker was 11px and unreadable over film ---------- */
rep(`.kicker{font-family:var(--mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--accent);margin:0 0 14px;display:flex;align-items:center;gap:9px}`,
`.kicker{font-family:var(--mono);font-weight:500;font-size:clamp(12.5px,1.15vw,17px);
  letter-spacing:.22em;text-transform:uppercase;
  color:var(--accent);margin:0 0 16px;display:flex;align-items:center;gap:10px}
.kicker svg{width:clamp(14px,1.2vw,18px);height:auto;flex:none}`);

/* ---------- 2. the review count becomes an invitation ---------- */
rep('<p class="revs__count"><b>8</b> verified reviews</p>',
    '<p class="revs__count">See what they&#8217;re saying</p>');
rep(`.revs__count{margin:0;font-family:var(--mono);font-size:11px;letter-spacing:.18em;`,
    `.revs__count{margin:0;font-family:var(--mono);font-size:clamp(11px,1vw,13.5px);letter-spacing:.18em;`);
rep(`.revs__count b{color:var(--accent);font-weight:500}`,
    `.revs__count{color:var(--text-primary)}`);

/* ---------- 3. the hero CTA must reach the pricing ----------
   It already pointed at #get, but wireBuying rewrites every a[href="#get"] to BUY_URL the
   moment a store URL exists — which would send this button off-site instead of down to the
   packs. The in-page jump is marked so it keeps its anchor. */
rep('<div class="settle-cta" style="margin-top:28px"><a class="btn" href="#get">Get Alpha Male</a></div>',
    '<div class="settle-cta" style="margin-top:28px"><a class="btn" href="#get" data-jump>Get Alpha Male</a></div>');
rep(`  document.querySelectorAll('a[href="#get"], #buy').forEach(function(a){
    if (BUY_URL) a.href = BUY_URL;
  });`,
`  /* anchors marked data-jump stay in-page: they scroll to the offer rather than leaving */
  document.querySelectorAll('a[href="#get"], #buy').forEach(function(a){
    if (BUY_URL && !a.hasAttribute('data-jump')) a.href = BUY_URL;
  });`);

fs.writeFileSync(p, s);
console.log('three edits applied; net ' + (s.length - t0) + ' bytes');
