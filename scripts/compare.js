// Reads examples/*.md, extracts before/after code blocks, prints a comparison.
// needless: no deps, no framework, just fs + regex
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../examples');
const SKIP_LANG = new Set(['bash', 'shell', 'sh', 'console', 'terminal']);
const codeBlock = /```([\w]*)\n([\s\S]*?)```/g;

function countLines(section) {
  let total = 0, m;
  codeBlock.lastIndex = 0;
  while ((m = codeBlock.exec(section)) !== null) {
    if (!SKIP_LANG.has(m[1])) total += m[2].trim().split('\n').length;
  }
  return total;
}

const results = fs.readdirSync(dir)
  .filter(f => f.endsWith('.md'))
  .sort()
  .map(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    // split returns [pre, "Without", without-text, "With", with-text]
    const parts = content.split(/## (Without|With) Needless/);
    const before = countLines(parts[2] ?? '');
    const after  = countLines(parts[4] ?? '');
    return { name: path.basename(file, '.md'), before, after };
  });

const pad = (s, n) => String(s).padEnd(n);
const lpad = (s, n) => String(s).padStart(n);

console.log('\n' + pad('Example', 16) + ' | Before | After | Reduction');
console.log('-'.repeat(16) + '-+-' + '-'.repeat(6) + '-+-' + '-'.repeat(5) + '-+-' + '-'.repeat(10));
results.forEach(({ name, before, after }) => {
  const pct = Math.round((1 - after / before) * 100);
  console.log(`${pad(name, 16)} | ${lpad(before, 6)} | ${lpad(after, 5)} | -${pct}%`);
});
const avg = Math.round(results.reduce((s, r) => s + (1 - r.after / r.before), 0) / results.length * 100);
console.log(`\nAverage reduction: -${avg}%`);
