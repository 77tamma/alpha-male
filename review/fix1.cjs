// Two fixes:
//  1. the reviews start 238px further in than the modules above them, because .wrap is a
//     centred 1180px box while the pinned modules are 1800px + gutter. Align them.
//  2. the review cards clip their text with no way to read the rest. Give each card a
//     smooth expansion, and only where something is actually hidden.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 70)); process.exit(1); } s = s.replace(a, b); };

/* ---------- 1. alignment ----------
   .sec already pads by var(--gut). The pinned modules cap their inner rail at 1800px and
   then pad by --gut, so their copy begins at (1800 - 2*gut) centred. Give .wrap exactly
   that content width and the left edges agree at every viewport. */
rep('.wrap{max-width:1180px;margin:0 auto}',
`/* Matches the pinned modules: they cap at 1800px then pad by --gut, so their copy starts
   at a content box of (1800 - 2*gut) centred. .sec has already applied the gutter, so the
   same content box here puts the reviews on the same left edge as the scent and mechanism
   modules above. Measured: at 1920 both begin at x=132, previously 132 vs 370. */
.wrap{max-width:calc(1800px - var(--gut) * 2);margin:0 auto}`);

// the headline and lede must not stretch to the new width — they keep a readable measure
rep('.lede{font-size:clamp(16px,1.3vw,19px);color:var(--text-secondary);max-width:56ch;',
    '.lede{font-size:clamp(16px,1.3vw,19px);color:var(--text-secondary);max-width:60ch;');

/* ---------- 2. review cards that open ---------- */
rep(`.revs{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(288px,1fr);
  gap:clamp(14px,1.6vw,22px);overflow-x:auto;scroll-snap-type:x mandatory;`,
`.revs{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(300px,1fr);
  align-items:start;
  gap:clamp(14px,1.6vw,22px);overflow-x:auto;scroll-snap-type:x mandatory;`);

rep(`.rev blockquote{margin:0}
.rev blockquote p{color:var(--text-secondary);font-size:14.5px;line-height:1.62;margin:0 0 10px}`,
`/* Every card shows the same six lines, so the row reads as a row, and only the cards with
   something hidden get a control. The height is animated to a measured pixel value rather
   than to a guessed max-height, so the easing is honest at any length. */
.rev blockquote{margin:0;font-size:14.5px;line-height:1.62;overflow:hidden;
  min-height:9.72em;max-height:9.72em;
  transition:max-height .55s cubic-bezier(.22,.61,.36,1)}
.rev.open blockquote{max-height:var(--full,240em)}
.rev--clip:not(.open) blockquote{
  -webkit-mask-image:linear-gradient(180deg,#000 66%,rgba(0,0,0,0) 100%);
          mask-image:linear-gradient(180deg,#000 66%,rgba(0,0,0,0) 100%)}
.rev blockquote p{color:var(--text-secondary);font-size:inherit;line-height:inherit;margin:0 0 10px}

.rev__more{align-self:flex-start;margin:12px 0 0;padding:0;background:none;border:0;
  border-bottom:1px solid rgba(237,28,36,.4);cursor:pointer;
  font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--accent);
  transition:color .25s var(--ease),border-color .25s var(--ease)}
.rev__more:hover{color:var(--text-primary);border-bottom-color:var(--text-primary)}
.rev__more:focus-visible{outline:2px solid var(--text-primary);outline-offset:3px}
@media (prefers-reduced-motion:reduce){.rev blockquote{transition:none}}`);

/* the card grows downward, so its own border must follow rather than the row stretching */
rep(`.rev{scroll-snap-align:start;margin:0;padding:26px 24px;display:flex;flex-direction:column;`,
    `.rev{scroll-snap-align:start;margin:0;padding:26px 24px;display:flex;flex-direction:column;\n  height:auto;`);

/* ---------- the control, added only where text is actually hidden ---------- */
const JS = `
/* ------------------------------------------------ reviews that open
   Measured after fonts settle: a control is only added to a card that is really hiding
   something, so a short review does not get a "read more" that reveals nothing. */
(function expandableReviews(){
  function build(){
    document.querySelectorAll('.rev').forEach(function(fig, i){
      if (fig.dataset.exp) return;
      var q = fig.querySelector('blockquote');
      if (!q || q.scrollHeight - q.clientHeight < 8) return;
      fig.dataset.exp = '1';
      fig.classList.add('rev--clip');
      if (!q.id) q.id = 'revq' + i;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rev__more';
      b.textContent = 'Read more';
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-controls', q.id);
      q.parentNode.insertBefore(b, q.nextSibling);
      b.addEventListener('click', function(){
        var open = !fig.classList.contains('open');
        if (open) fig.style.setProperty('--full', q.scrollHeight + 'px');
        fig.classList.toggle('open', open);
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
        b.textContent = open ? 'Show less' : 'Read more';
      });
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  else window.addEventListener('load', build);
  window.addEventListener('resize', function(){
    document.querySelectorAll('.rev.open').forEach(function(f){
      var q = f.querySelector('blockquote');
      if (q) f.style.setProperty('--full', q.scrollHeight + 'px');
    });
  });
})();
`;

const anchor = '/* ------------------------------------------------------ small helpers */';
if (s.indexOf(anchor) < 0) { console.error('js anchor missing'); process.exit(1); }
s = s.replace(anchor, JS + '\n' + anchor);

fs.writeFileSync(p, s);
console.log('alignment + expandable reviews; net ' + (s.length - t0) + ' bytes');
