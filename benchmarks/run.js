'use strict';
// Runs the 5 benchmark tasks against 3 models (baseline vs needless).
// Usage: ANTHROPIC_API_KEY=... [OPENAI_API_KEY=...] node benchmarks/run.js
// needless: uses fetch directly, no SDK

require('dotenv').config({ path: '.env' });
const fs    = require('fs');
const path  = require('path');
const tasks = require('./tasks');
const { execSync } = require('child_process');

const RUNS = 5;

const NEEDLESS_SYSTEM = `You are a minimal-code developer. Every line must justify its existence.
Before writing code, stop at the first rung that holds:
1. Does this need to exist? (YAGNI) - skip it
2. Stdlib does it? - use it
3. Native platform feature? - use it
4. Can it be one line? - make it one line
5. Only then: the minimum that works
No classes unless asked. No abstractions. No boilerplate. Shortest correct code only.`;

const MODELS = [
  { id: 'claude-haiku-3-5-20241022',   short: 'Haiku 3.5',   name: 'Claude Haiku 3.5',   api: 'anthropic', key: 'ANTHROPIC_API_KEY' },
  { id: 'claude-sonnet-4-5-20251201',  short: 'Sonnet 4.5',  name: 'Claude Sonnet 4.5',  api: 'anthropic', key: 'ANTHROPIC_API_KEY' },
  { id: 'gpt-4o-mini',                 short: 'GPT-4o mini', name: 'GPT-4o mini',         api: 'openai',    key: 'OPENAI_API_KEY'    },
];

// ─── API callers ──────────────────────────────────────────────────────────────

async function callAnthropic(modelId, system, prompt) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) throw new Error(`Anthropic ${r.status}: ${await r.text()}`);
  return (await r.json()).content[0].text;
}

async function callOpenAI(modelId, system, prompt) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
    }),
  });
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`);
  return (await r.json()).choices[0].message.content;
}

// ─── Line counter ─────────────────────────────────────────────────────────────

function countLines(text) {
  // Extract code blocks, take the largest one
  const blocks = [];
  const re = /```[\w]*\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(text)) !== null) blocks.push(m[1]);
  const target = blocks.length
    ? blocks.reduce((a, b) => b.length > a.length ? b : a)
    : text;
  return target.split('\n').filter(l => l.trim()).length;
}

// ─── Median ───────────────────────────────────────────────────────────────────

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const available = MODELS.filter(m => process.env[m.key]);

  if (!available.length) {
    console.error('No API keys found. Set ANTHROPIC_API_KEY and/or OPENAI_API_KEY in .env');
    process.exit(1);
  }

  console.log(`Running: ${available.map(m => m.short).join(', ')}`);
  console.log(`Tasks: ${tasks.map(t => t.label).join(', ')}`);
  console.log(`Runs per cell: ${RUNS}\n`);

  const results = { generated: new Date().toISOString().slice(0, 10), runs_per_cell: RUNS, models: [] };

  for (const model of available) {
    const call = model.api === 'anthropic' ? callAnthropic : callOpenAI;
    const modelResult = { id: model.id, name: model.name, short: model.short, tasks: [] };

    for (const task of tasks) {
      process.stdout.write(`  ${model.short} / ${task.label} ... `);
      const baseCounts = [], needlessCounts = [];

      for (let i = 0; i < RUNS; i++) {
        // baseline: no system prompt
        const baseText = await call(model.id, 'You are a helpful coding assistant.', task.prompt);
        baseCounts.push(countLines(baseText));
        await delay(400);

        // needless: inject the ruleset
        const needText = await call(model.id, NEEDLESS_SYSTEM, task.prompt);
        needlessCounts.push(countLines(needText));
        await delay(400);
      }

      const baseline = median(baseCounts);
      const needless = median(needlessCounts);
      const pct = Math.round((1 - needless / baseline) * 100);
      console.log(`baseline=${baseline} needless=${needless} (-${pct}%)`);
      modelResult.tasks.push({ id: task.id, label: task.label, baseline, needless });
    }

    results.models.push(modelResult);
  }

  const outPath = path.join(__dirname, 'results/latest.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved -> ${outPath}`);

  // auto-generate chart
  console.log('Generating chart...');
  execSync(`node benchmarks/chart.js ${outPath}`, { stdio: 'inherit' });
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

run().catch(e => { console.error(e.message); process.exit(1); });
