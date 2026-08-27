// Heading up under her chin and much larger; beats larger; and the red rule becomes a
// travelling indicator that moves from one beat to the next as each arrives.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');

const A = '.loud{position:absolute;inset:0;z-index:2;max-width:1800px;margin-inline:auto;';
const i0 = s.indexOf(A);
const TAIL = '.beat p{margin:0;padding-left:36px;color:#E8E0E1;\n  font-size:clamp(13px,1.08vw,15.5px);line-height:1.5;\n  text-shadow:0 2px 20px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.9)}';
const i1 = s.indexOf(TAIL);
if (i0 < 0 || i1 < 0) { console.error('anchors not found'); process.exit(1); }

const CSS = `.loud{position:absolute;inset:0;z-index:2;max-width:1800px;margin-inline:auto;
  padding:0 var(--gut) clamp(26px,4vh,52px)}

/* Positioned as a percentage of the FRAME, not with a percentage margin — a percentage
   margin resolves against the container's width, so it moved unpredictably as the
   viewport changed. This sits just under her chin at every size. */
.loud__copy{position:absolute;left:var(--gut);top:31%;
  max-width:min(52%,760px)}
.loud .h{font-size:clamp(30px,4.4vw,72px);line-height:1.02;max-width:13ch;
  letter-spacing:-.02em;
  text-shadow:0 2px 34px rgba(0,0,0,.94),0 1px 5px rgba(0,0,0,.88)}

.formula{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 14px;margin:18px 0 0;
  font-family:var(--mono);font-size:clamp(11px,1.06vw,15px);letter-spacing:.18em;
  text-transform:uppercase;color:var(--text-primary);
  text-shadow:0 1px 16px rgba(0,0,0,.94)}
.formula span,.formula i{--fd:0;
  --f:clamp(0,(var(--p,0) - .10 - var(--fd)*.035)*10,1);
  opacity:var(--f);transform:translateY(calc((1 - var(--f)) * 8px));display:inline-block}
.formula i{font-style:normal;color:var(--accent);font-size:1.3em;line-height:1}
.formula>:nth-child(2){--fd:1}.formula>:nth-child(3){--fd:2}
.formula>:nth-child(4){--fd:3}.formula>:nth-child(5){--fd:4}

/* The three beats sit along the foot of the frame. Their own rules stay neutral; a
   single accent rule rides above them and steps to whichever beat has just arrived, so
   the red reads as one moving light rather than three separate coloured borders. */
.beats{position:absolute;left:var(--gut);right:var(--gut);bottom:clamp(26px,4vh,52px);
  --gap:clamp(18px,2.6vw,52px);
  --col:calc((100% - 2 * var(--gap)) / 3);
  list-style:none;margin:0;padding:0;display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--gap)}
.beats::after{content:"";position:absolute;top:0;left:0;height:2px;width:var(--col);
  background:var(--accent);pointer-events:none;
  /* 0 -> 1 -> 2 as each beat lands, and it slides rather than jumps */
  --slot:clamp(0,(var(--p,0) - .17) * 11,2);
  transform:translateX(calc(var(--slot) * (var(--col) + var(--gap))));
  opacity:clamp(0,(var(--p,0) - .15)*14,1);
  box-shadow:0 0 18px 1px rgba(237,28,36,.55)}

.beat{position:relative;padding-top:16px;border-top:1px solid rgba(244,239,235,.34);
  --bd:0;
  --b:clamp(0,(var(--p,0) - .17 - var(--bd)*.09)*9,1);
  opacity:var(--b);transform:translate3d(calc((1 - var(--b)) * -34px),0,0)}
.beat:nth-child(2){--bd:1}
.beat:nth-child(3){--bd:2}
.beat__n{position:absolute;top:16px;left:0;font-family:var(--mono);font-size:12px;
  letter-spacing:.2em;color:var(--accent);font-variant-numeric:tabular-nums;
  text-shadow:0 1px 12px rgba(0,0,0,.95)}
.beat h3{margin:0 0 6px;padding-left:40px;font-family:var(--display);font-weight:400;
  font-size:clamp(17px,1.62vw,26px);line-height:1.18;letter-spacing:-.008em;
  text-shadow:0 2px 24px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.9)}
.beat p{margin:0;padding-left:40px;color:#E8E0E1;
  font-size:clamp(14px,1.22vw,18px);line-height:1.45;
  text-shadow:0 2px 22px rgba(0,0,0,.95),0 1px 3px rgba(0,0,0,.9)}`;

s = s.slice(0, i0) + CSS + s.slice(i1 + TAIL.length);

/* the mobile block referenced the old positioning */
s = s.replace(
  '  .loud{position:absolute;padding-bottom:clamp(22px,5vw,36px)}\n  .loud__copy{max-width:none;margin-top:auto;margin-bottom:clamp(16px,3vw,26px)}\n  .loud .h{max-width:none;font-size:clamp(22px,6vw,30px)}',
  '  .loud{position:absolute;padding-bottom:clamp(22px,5vw,36px)}\n  .loud__copy{position:static;max-width:none;margin-top:auto;margin-bottom:clamp(16px,3vw,26px)}\n  .loud .h{max-width:none;font-size:clamp(26px,7.2vw,38px)}\n  .beats{position:static;left:auto;right:auto;bottom:auto}\n  .beats::after{display:none}'
);
s = s.replace('  .beat h3{font-size:15px}', '  .beat h3{font-size:16.5px}');

fs.writeFileSync(p, s);
console.log('heading raised + enlarged, travelling accent rule added');
