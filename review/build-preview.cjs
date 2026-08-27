// Build a single self-contained HTML file: every asset and font inlined as a data URI,
// document shell stripped (the artifact host supplies doctype/head/body).
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/DadWorkPC/Documents/Claude Design/AM Pheromone Cologne';
const SP = 'C:/Users/DADWOR~1/AppData/Local/Temp/claude/C--Users-DadWorkPC/736b769d-3e4f-49ca-b756-c2895e569576/scratchpad';
const FONTS = SP + '/fonts/';

let html = fs.readFileSync(ROOT + '/site/index.html', 'utf8');

/* ---------- fonts ---------- */
const b64 = f => fs.readFileSync(FONTS + f).toString('base64');
const AB = 'HTxqL289NzCGg4MzN6KJ7eW6CYyF_g.woff2';
const JB = 'tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-qxTOlOV.woff2';
const MA = 'xn7gYHE41ni1AdIRggexSg.woff2';

function face(fam, weight, file) {
  return '@font-face{font-family:"' + fam + '";font-style:normal;font-weight:' + weight +
         ';font-display:swap;src:url("data:font/woff2;base64,' + b64(file) + '") format("woff2")}';
}
const fontCss = [
  face('Archivo Black', '400', AB),
  face('JetBrains Mono', '500', JB),
  face('Manrope', '200 800', MA)          // variable font: one file covers 400/500/700
].join('\n');

/* ---------- assets ---------- */
const MIME = { '.mp4':'video/mp4', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
               '.png':'image/png', '.webp':'image/webp' };
const used = [...new Set(html.match(/assets\/[A-Za-z0-9._-]+/g) || [])];
let dataBytes = 0;
for (const rel of used) {
  const p = ROOT + '/site/' + rel;
  if (!fs.existsSync(p)) { console.error('MISSING ' + p); process.exit(1); }
  const buf = fs.readFileSync(p);
  const m = MIME[path.extname(rel).toLowerCase()];
  if (!m) { console.error('no mime for ' + rel); process.exit(1); }
  const uri = 'data:' + m + ';base64,' + buf.toString('base64');
  dataBytes += uri.length;
  html = html.split(rel).join(uri);
  console.error('  inlined ' + rel + '  ' + (buf.length/1024).toFixed(0) + 'KB');
}

/* ---------- strip the shell ---------- */
const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || 'Alpha Male';
const style = html.slice(html.indexOf('<style>') + 7, html.indexOf('</style>'));
const body  = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'));

const out =
  '<title>' + title + '</title>\n' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
  '<style>\n' + fontCss + '\n' + style + '\n</style>\n' +
  body + '\n';

fs.writeFileSync(SP + '/alphamale-preview.html', out);

/* ---------- guard: the failure mode that shipped last time was an empty family name ---------- */
const faces = out.match(/@font-face\{[^}]*\}/g) || [];
let bad = 0;
faces.forEach(f => { if (/font-family:\s*(""|;)/.test(f)) bad++; });
console.error('---');
console.error('@font-face blocks: ' + faces.length + (bad ? '  BAD(empty family): ' + bad : '  families OK'));
faces.forEach(f => console.error('   ' + (f.match(/font-family:"([^"]*)"/) || [])[1] +
                                '  wt=' + (f.match(/font-weight:([^;]*)/) || [])[1]));
console.error('assets: ' + used.length + '   data: ' + (dataBytes/1048576).toFixed(2) + 'MB');
console.error('file:   ' + (Buffer.byteLength(out)/1048576).toFixed(2) + 'MB');
if (bad) process.exit(1);
