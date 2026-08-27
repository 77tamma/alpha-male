// The reveal: full-frame smoke that parts from the centre and clears outward as the reader
// scrolls, so the promise is uncovered by the cloud opening rather than the cloud leaving.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const t0 = s.length;
const rep = (a, b) => { if (s.indexOf(a) < 0) { console.error('MISS: ' + a.slice(0, 80)); process.exit(1); } s = s.replace(a, b); };

/* ---------- 1. the plate has to actually fill the frame ----------
   One frame's cloud sits on its right third, so three copies alone left the left half empty.
   The middle copy is mirrored, which puts a cloud on the left without a second asset. */
rep(`.guar__plate{position:absolute;inset:-14%;
  background:url('assets/guar-plate.jpg') 56% 50%/cover no-repeat}`,
`.guar__plate{position:absolute;inset:-16%;
  background:url('assets/guar-plate.jpg') 70% 50%/cover no-repeat}
/* mirrored, so the same cloud also covers the left half — one asset, full frame */
.guar__plate--b{background-position:70% 46%}
.guar__plate--c{background-position:44% 38%}`);
rep('.guar__plate--a{animation:guarDriftA 22s ease-in-out infinite}',
    '.guar__plate--a{opacity:.95;animation:guarDriftA 22s ease-in-out infinite}');
rep('.guar__plate--b{opacity:.72;mix-blend-mode:screen;\n  animation:guarDriftB 31s ease-in-out infinite}',
    '.guar__plate--b{opacity:.88;mix-blend-mode:screen;\n  animation:guarDriftB 31s ease-in-out infinite}');
rep('.guar__plate--c{opacity:.55;mix-blend-mode:screen;\n  animation:guarDriftC 43s ease-in-out infinite}',
    '.guar__plate--c{opacity:.66;mix-blend-mode:screen;\n  animation:guarDriftC 43s ease-in-out infinite}');

/* layer B runs mirrored — the flip lives in its keyframes so it survives the animation */
rep(`@keyframes guarDriftB{
  0%,100%{transform:translate3d(9%,-3%,0) scale(1.4) rotate(3.2deg)}
  33%    {transform:translate3d(-4%,3.4%,0) scale(1.24) rotate(-2deg)}
  66%    {transform:translate3d(-9%,-1.6%,0) scale(1.34) rotate(-3.6deg)}}`,
`@keyframes guarDriftB{
  0%,100%{transform:translate3d(9%,-3%,0) scale(1.4) rotate(3.2deg) scaleX(-1)}
  33%    {transform:translate3d(-4%,3.4%,0) scale(1.24) rotate(-2deg) scaleX(-1)}
  66%    {transform:translate3d(-9%,-1.6%,0) scale(1.34) rotate(-3.6deg) scaleX(-1)}}`);

/* ---------- 2. the parting ----------
   A transparent hole opens in the mask and widens past the frame, its centre travelling
   right as it goes. At --sp 0 the hole is negative, so the frame is solid cloud; by the end
   the mask is entirely transparent and the residual is faded out.
   The hole opens where the copy is, which is the point: the words are what the cloud
   uncovers, rather than the cloud simply ending. */
rep(`.guar__sky{position:absolute;inset:0;overflow:hidden;z-index:0;
  opacity:clamp(0,(.92 - var(--sp,0)) / .34,1)}`,
`.guar__sky{position:absolute;inset:0;overflow:hidden;z-index:0;
  --hole:calc(var(--sp,0) * 132% - 34%);
  --cx:calc(41% + var(--sp,0) * 26%);
  -webkit-mask-image:radial-gradient(132% 158% at var(--cx) 50%,
    rgba(0,0,0,0) 0%,rgba(0,0,0,0) var(--hole),
    #000 calc(var(--hole) + 30%),#000 100%);
          mask-image:radial-gradient(132% 158% at var(--cx) 50%,
    rgba(0,0,0,0) 0%,rgba(0,0,0,0) var(--hole),
    #000 calc(var(--hole) + 30%),#000 100%);
  opacity:clamp(0,(1.06 - var(--sp,0)) / .2,1)}`);

/* the veil can ease off through the middle now the cloud parts where the type is */
rep('  radial-gradient(76% 104% at 50% 50%,rgba(6,4,5,.97) 0%,rgba(6,4,5,.95) 52%,\n                  rgba(6,4,5,.64) 78%,rgba(6,4,5,.14) 100%),',
    '  radial-gradient(76% 104% at 50% 50%,rgba(6,4,5,.95) 0%,rgba(6,4,5,.92) 52%,\n                  rgba(6,4,5,.6) 78%,rgba(6,4,5,.12) 100%),');

/* ---------- 3. mobile keeps a static full-frame plate, no parting ---------- */
rep('  .guar__sky{opacity:1}',
    '  /* --sp never runs at this width, so there is nothing to drive a parting: the plate\n     just sits, and the veil carries the legibility */\n  .guar__sky{opacity:1;-webkit-mask-image:none;mask-image:none}');

fs.writeFileSync(p, s);
console.log('smoke parts from centre; net ' + (s.length - t0) + ' bytes');
