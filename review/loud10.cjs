// Formula onto one line, and the three beats get their real copy.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

/* ---------- the three beats ---------- */
const B0 = s.indexOf('      <ol class="beats">');
const B1 = s.indexOf('</ol>', B0) + '</ol>'.length;
if (B0 < 0 || B1 < 0) { console.error('beats anchors not found'); process.exit(1); }

const BEATS = `      <ol class="beats">
        <li class="beat"><span class="beat__n">01</span><h3>Smell unforgettable</h3><p>A sophisticated masculine fragrance designed to smell refined, confident and unmistakably masculine &#8212; from the first impression to the last.</p></li>
        <li class="beat"><span class="beat__n">02</span><h3>Turn up your natural appeal</h3><p>Pheromone-infused to complement what you already bring &#8212; your presence, your confidence, your chemistry.</p></li>
        <li class="beat"><span class="beat__n">03</span><h3>Made for closer</h3><p>Roll it directly onto your pulse points, keeping the fragrance close to your skin &#8212; right where personal space starts disappearing.</p></li>
      </ol>`;

s = s.slice(0, B0) + BEATS + s.slice(B1);

/* ---------- formula: one line, always ---------- */
s = s.replace(
'.formula{display:flex;flex-wrap:wrap;align-items:baseline;gap:9px 15px;margin:20px 0 0;\n  font-family:var(--mono);font-size:clamp(12.5px,1.26vw,18px);letter-spacing:.18em;',
`/* One line at every width. It is a formula — breaking "roll-on application" onto its own
   row made it read as a list instead. Sized off the viewport and set nowrap so it scales
   to fit rather than wrapping, and kept inside the left flank the veil covers. */
.formula{display:flex;flex-wrap:nowrap;white-space:nowrap;width:max-content;max-width:none;
  align-items:baseline;gap:8px 13px;margin:20px 0 0;
  font-family:var(--mono);font-size:clamp(9.5px,1.13vw,16px);letter-spacing:.13em;`);

/* ---------- the titles now carry the em dash and run in caps ---------- */
s = s.replace(
'.beat__n{position:absolute;top:16px;left:0;font-family:var(--mono);font-size:12px;\n  letter-spacing:.2em;color:var(--accent);font-variant-numeric:tabular-nums;',
'.beat__n{position:absolute;top:16px;left:0;font-family:var(--mono);font-size:12px;\n  letter-spacing:.2em;color:var(--accent);font-variant-numeric:tabular-nums;\n  white-space:nowrap;');
s = s.replace('.beat__n{position:absolute;', '.beat__n::after{content:"\\2009\\2014"}\n.beat__n{position:absolute;');

s = s.replace(
'.beat h3{margin:0 0 6px;padding-left:40px;font-family:var(--display);font-weight:400;\n  font-size:clamp(17px,1.62vw,26px);line-height:1.18;letter-spacing:-.008em;',
'.beat h3{margin:0 0 6px;padding-left:62px;font-family:var(--display);font-weight:400;\n  font-size:clamp(15px,1.38vw,22px);line-height:1.2;letter-spacing:.005em;\n  text-transform:uppercase;');
s = s.replace('.beat p{margin:0;padding-left:40px;color:#E8E0E1;', '.beat p{margin:0;padding-left:62px;color:#E8E0E1;');

fs.writeFileSync(p, s);
console.log('formula forced to one line; beat copy replaced');
