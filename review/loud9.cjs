// Wordmark set into the headline, film brightened, formula enlarged, headline dropped
// further below her chin.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- the wordmark replaces the words, but not the reading of them ---------- */
s = s.replace(
  '<h2 class="h">So what makes Alpha Male different?</h2>',
  '<h2 class="h">So what makes <img class="h__mark" src="assets/wordmark.png" width="900" height="152" alt="Alpha Male"> different?</h2>'
);

/* ---------- css ---------- */
s = s.replace(
'.loud .h{font-size:clamp(28px,3.85vw,62px);line-height:1.04;max-width:13ch;\n  letter-spacing:-.02em;',
`.loud .h{font-size:clamp(28px,3.85vw,62px);line-height:1.12;max-width:min(62%,760px);
  letter-spacing:-.02em;`);

s = s.replace(
'.formula{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 14px;margin:18px 0 0;\n  font-family:var(--mono);font-size:clamp(11px,1.06vw,15px);letter-spacing:.18em;',
`/* the wordmark rides the line as a word: sized off the em so it tracks the headline at
   every breakpoint, and nudged down to sit on the same optical baseline as the caps */
.h__mark{display:inline-block;height:.74em;width:auto;vertical-align:-.055em;
  margin:0 .06em;filter:drop-shadow(0 2px 26px rgba(0,0,0,.85))}

.formula{display:flex;flex-wrap:wrap;align-items:baseline;gap:9px 15px;margin:20px 0 0;
  font-family:var(--mono);font-size:clamp(12.5px,1.26vw,18px);letter-spacing:.18em;`);

/* ---------- lower, and brighter ---------- */
s = s.replace('.loud__copy{position:absolute;left:var(--gut);top:39%;',
              '.loud__copy{position:absolute;left:var(--gut);top:44%;');
s = s.replace('  .loud__copy{top:36%}', '  .loud__copy{top:40%}');

s = s.replace(
'.fill{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 30%;',
`/* lifted so the room feels lit rather than merely dark — the grade came out of Kling
   deliberately low-key and the page was compounding it */
.fill{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 30%;
  filter:brightness(1.16) saturate(1.06) contrast(1.02);`);

/* the veil can give some back now the picture is brighter */
s = s.replace(
'  linear-gradient(180deg,rgba(13,7,5,0) 0%,rgba(13,7,5,.10) 22%,rgba(13,7,5,.34) 48%,\n                  rgba(13,7,5,.62) 78%,rgba(13,7,5,.78) 100%),',
'  linear-gradient(180deg,rgba(13,7,5,0) 0%,rgba(13,7,5,.06) 24%,rgba(13,7,5,.30) 50%,\n                  rgba(13,7,5,.60) 78%,rgba(13,7,5,.76) 100%),');

fs.writeFileSync(p, s);
console.log('wordmark set in the headline, film brightened, formula up, headline lowered');
