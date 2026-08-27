// Remove the press-and-hold drop interaction: its CSS block and its whole JS module.
const fs = require('fs');
const p = 'site/index.html';
let s = fs.readFileSync(p, 'utf8');
const before = s.length;

/* ---- css: from .dropbox{ down to just before .notes{ ---- */
const c0 = s.indexOf('.dropbox{position:relative;aspect-ratio:4/5;');
const c1 = s.indexOf('.notes{', c0);
if (c0 < 0 || c1 < 0) { console.error('css anchors not found'); process.exit(1); }
s = s.slice(0, c0) + s.slice(c1);

/* ---- js: the IIFE that owns the dropbox ---- */
const j = s.indexOf("var box=document.getElementById('dropbox');");
if (j < 0) { console.error('js anchor not found'); process.exit(1); }
// walk back to the start of the enclosing (function(){
let start = s.lastIndexOf('(function(', j);
if (start < 0) { console.error('cannot find enclosing IIFE'); process.exit(1); }
// walk forward matching braces from the first { after start
let i = s.indexOf('{', start), depth = 0, end = -1;
for (; i < s.length; i++) {
  if (s[i] === '{') depth++;
  else if (s[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
}
if (end < 0) { console.error('unbalanced IIFE'); process.exit(1); }
// consume the trailing )(); and any comment line above the IIFE
let tail = s.indexOf(';', end);
tail = tail < 0 ? end + 1 : tail + 1;
let head = start;
const prevLine = s.lastIndexOf('\n', start - 1);
if (prevLine > 0 && /\/\*[^\n]*\*\/\s*$/.test(s.slice(prevLine, start))) head = prevLine;
s = s.slice(0, head) + s.slice(tail);

fs.writeFileSync(p, s);
console.log('removed ' + (before - s.length) + ' bytes of drop interaction');
const left = (s.match(/dropbox|\bbead\b|beadPulse/g) || []).length;
console.log('remaining references: ' + left);
