'use strict';
// Reads a benchmark results JSON, writes assets/benchmark.html
// Usage: node benchmarks/chart.js [path/to/results.json]
// needless: no deps, template literal -> HTML

const fs   = require('fs');
const path = require('path');

const INPUT = process.argv[2] ||
  (fs.existsSync(path.join(__dirname, 'results/latest.json'))
    ? path.join(__dirname, 'results/latest.json')
    : path.join(__dirname, 'results/sample.json'));

const OUT = path.join(__dirname, '../assets/benchmark.html');

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// summary stats
const allPcts = data.models.flatMap(m =>
  m.tasks.map(t => Math.round((1 - t.needless / t.baseline) * 100)));
const avg = Math.round(allPcts.reduce((a, b) => a + b, 0) / allPcts.length);

let best = { pct: 0, short: '', label: '' };
data.models.forEach(m => m.tasks.forEach(t => {
  const p = Math.round((1 - t.needless / t.baseline) * 100);
  if (p > best.pct) best = { pct: p, short: m.short, label: t.label };
}));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, generateHtml(data, avg, best));
console.log(`Chart written -> ${OUT}`);

// ─────────────────────────────────────────────────────────────────────────────

function generateHtml(data, avg, best) {
  const isSample = data._sample === true;
  const tabs = data.models
    .map((m, i) => `<button class="tab${i === 0 ? ' active' : ''}" onclick="show(${i})">${m.short}</button>`)
    .join('');

  const tableHead = data.models.map(m =>
    `<th colspan="2">${m.short}</th>`).join('');
  const tableSubHead = data.models.map(() =>
    `<th>base</th><th class="g">needless</th>`).join('');
  const tableRows = data.models[0].tasks.map(t => {
    const cells = data.models.map(m => {
      const r = m.tasks.find(x => x.id === t.id);
      const p = Math.round((1 - r.needless / r.baseline) * 100);
      return `<td>${r.baseline}</td><td class="g">${r.needless} <span class="tpct">-${p}%</span></td>`;
    }).join('');
    return `<tr><td class="mono">${t.label}</td>${cells}</tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Needless Benchmark</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0d1117;--sf:#161b22;--sf2:#1c2128;--bd:#21262d;
  --tx:#e6edf3;--mu:#7d8590;
  --g:#2ea043;--gl:#3fb950;--gdim:rgba(46,160,67,.15);
  --gr:#484f58;--ac:#1f6feb;
}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
  background:var(--bg);color:var(--tx);max-width:900px;margin:0 auto;padding:52px 24px 80px}
a{color:var(--ac);text-decoration:none}a:hover{text-decoration:underline}
code,pre{font-family:'SFMono-Regular',Consolas,monospace}
code{font-size:.83em;background:var(--sf2);padding:2px 6px;border-radius:4px;color:#a5d6ff}

/* banner */
.banner{background:#2d2203;border:1px solid #9e6a03;color:#d29922;
  padding:10px 16px;border-radius:6px;margin-bottom:32px;font-size:13px;line-height:1.5}

/* header */
.hd h1{font-size:28px;font-weight:700;letter-spacing:-.5px;margin-bottom:8px}
.hd p{color:var(--mu);font-size:14px;line-height:1.7;margin-bottom:40px}

/* cards */
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:44px}
.card{background:var(--sf);border:1px solid var(--bd);border-radius:8px;padding:22px 20px}
.card-n{font-size:40px;font-weight:700;color:var(--gl);letter-spacing:-1.5px;line-height:1}
.card-l{font-size:12px;color:var(--mu);margin-top:6px;line-height:1.5}

/* section label */
.sec-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;
  color:var(--mu);margin-bottom:16px}

/* tabs */
.tabs{display:flex;gap:0;border-bottom:1px solid var(--bd);margin-bottom:26px}
.tab{padding:9px 20px;font-size:13px;font-weight:500;cursor:pointer;color:var(--mu);
  background:none;border:none;border-bottom:2px solid transparent;
  margin-bottom:-1px;transition:color .15s,border-color .15s}
.tab:hover{color:var(--tx)}
.tab.active{color:var(--tx);border-bottom-color:var(--gl)}

/* legend */
.legend{display:flex;gap:22px;margin-bottom:32px}
.leg{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--mu)}
.dot{width:12px;height:12px;border-radius:2px;flex-shrink:0}

/* chart bars */
.bar-row{margin-bottom:26px}
.row-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px}
.task-name{font-size:12px;font-weight:600;font-family:'SFMono-Regular',Consolas,monospace;
  color:var(--tx)}
.badge{background:var(--gdim);color:var(--gl);border-radius:20px;
  padding:3px 11px;font-size:11px;font-weight:700;letter-spacing:.02em}
.bars{display:flex;flex-direction:column;gap:5px}
.bar-line{display:flex;align-items:center;gap:10px}
.arm{font-size:10px;color:var(--mu);width:52px;text-align:right;flex-shrink:0;letter-spacing:.02em}
.bar{height:24px;border-radius:3px;display:flex;align-items:center;
  transition:width 1s cubic-bezier(.16,1,.3,1);min-width:3px;overflow:visible}
.bar-base{background:var(--gr)}
.bar-need{background:var(--g)}
.bar-v{font-size:11px;color:var(--mu);margin-left:8px;white-space:nowrap}

/* table */
.tbl-wrap{margin-top:56px}
.tbl-wrap .sec-label{margin-bottom:14px}
.tbl{width:100%;border-collapse:collapse;font-size:12px;overflow:hidden;
  border:1px solid var(--bd);border-radius:8px}
.tbl th{text-align:left;padding:8px 12px;color:var(--mu);font-weight:600;
  text-transform:uppercase;letter-spacing:.06em;font-size:10px;
  background:var(--sf);border-bottom:1px solid var(--bd)}
.tbl td{padding:10px 12px;border-bottom:1px solid var(--bd)}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:var(--sf2)}
.g{color:var(--gl);font-weight:700}
.tpct{color:var(--mu);font-weight:400;font-size:10px;margin-left:3px}
.mono{font-family:'SFMono-Regular',Consolas,monospace;font-size:11px}

/* footer */
footer{margin-top:64px;border-top:1px solid var(--bd);padding-top:24px;
  font-size:12px;color:var(--mu);line-height:2}

@media(max-width:600px){
  .cards{grid-template-columns:1fr}
  .arm{width:38px}
  .card-n{font-size:32px}
}
</style>
</head>
<body>

${isSample ? `<div class="banner">
  Sample data &mdash; run <code>node benchmarks/run.js</code> to generate real results and replace this.
</div>` : ''}

<div class="hd">
  <h1>Needless Benchmark</h1>
  <p>
    Median lines of code across 5 tasks &times; 3 models &times; ${data.runs_per_cell || 5} runs. Lower is leaner.<br>
    Reproduce yourself: <code>node benchmarks/run.js</code>
    &nbsp;&middot;&nbsp; <a href="https://github.com/siddhamapple/needless">github.com/siddhamapple/needless</a>
  </p>
</div>

<div class="cards">
  <div class="card">
    <div class="card-n">${avg}%</div>
    <div class="card-l">fewer lines of code, on average across all models and tasks</div>
  </div>
  <div class="card">
    <div class="card-n">${best.pct}%</div>
    <div class="card-l">peak reduction &mdash; ${best.short}, <code>${best.label}</code></div>
  </div>
  <div class="card">
    <div class="card-n">${data.models.length}</div>
    <div class="card-l">models tested &mdash; same direction every single time</div>
  </div>
</div>

<p class="sec-label">Lines of code &mdash; median of ${data.runs_per_cell || 5} runs</p>
<div class="tabs" id="tabs">${tabs}</div>

<div class="legend">
  <div class="leg"><div class="dot" style="background:var(--gr)"></div>baseline (no needless)</div>
  <div class="leg"><div class="dot" style="background:var(--g)"></div>needless</div>
</div>

<div id="chart"></div>

<div class="tbl-wrap">
  <p class="sec-label">All numbers</p>
  <table class="tbl">
    <thead>
      <tr><th>Task</th>${tableHead}</tr>
      <tr><th></th>${tableSubHead}</tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</div>

<footer>
  Median of ${data.runs_per_cell || 5} runs/cell &middot; default temperature &middot;
  tasks: ${data.models[0].tasks.map(t => `<code>${t.label}</code>`).join(', ')} &middot;
  generated ${data.generated || new Date().toISOString().slice(0, 10)}
  ${isSample ? '&middot; <strong>sample data</strong>' : ''}<br>
  <a href="https://github.com/siddhamapple/needless">github.com/siddhamapple/needless</a>
  &nbsp;&middot;&nbsp;
  MIT License
</footer>

<script>
const D = ${JSON.stringify(data)};
let cur = 0;

function pct(b, n) { return Math.round((1 - n / b) * 100); }

function show(i) {
  cur = i;
  document.querySelectorAll('.tab').forEach((t, j) => t.classList.toggle('active', j === i));
  renderChart();
}

function renderChart() {
  const m = D.models[cur];
  const maxB = Math.max(...m.tasks.map(t => t.baseline));
  document.getElementById('chart').innerHTML = m.tasks.map(t => {
    const bw = Math.max(1, Math.round(t.baseline / maxB * 100));
    const nw = Math.max(1, Math.round(t.needless  / maxB * 100));
    const p  = pct(t.baseline, t.needless);
    return \`
      <div class="bar-row">
        <div class="row-head">
          <span class="task-name">\${t.label}</span>
          <span class="badge">-\${p}%</span>
        </div>
        <div class="bars">
          <div class="bar-line">
            <span class="arm">baseline</span>
            <div class="bar bar-base" style="width:0" data-w="\${bw}%">
              <span class="bar-v">\${t.baseline} lines</span>
            </div>
          </div>
          <div class="bar-line">
            <span class="arm">needless</span>
            <div class="bar bar-need" style="width:0" data-w="\${nw}%">
              <span class="bar-v">\${t.needless} lines</span>
            </div>
          </div>
        </div>
      </div>\`;
  }).join('');

  // double rAF so CSS transition fires after layout
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.bar[data-w]').forEach(b => { b.style.width = b.dataset.w; });
  }));
}

renderChart();
</script>
</body>
</html>`;
}
