# Needless

> If you are about to write it, it is probably needless. Prove otherwise.

Makes your AI agent default to the minimum code that actually works. Every line
must justify its existence.

---

## Numbers

Five tasks, three models, five runs per cell, median reported.
Baseline: no instructions. Needless: ruleset injected as system prompt.

**[View the full interactive benchmark chart](https://siddhamapple.github.io/needless/assets/benchmark.html)**

| Task | Haiku 3.5 (base) | Haiku 3.5 (needless) | Sonnet 4.5 (base) | Sonnet 4.5 (needless) | GPT-4o mini (base) | GPT-4o mini (needless) |
|---|---:|---:|---:|---:|---:|---:|
| isPrime(n) | 20 | 3 | 26 | 3 | 23 | 4 |
| formatPhone(s) | 32 | 3 | 44 | 3 | 37 | 4 |
| truncate(s,n) | 12 | 2 | 17 | 1 | 14 | 2 |
| shuffle(arr) | 24 | 5 | 30 | 5 | 27 | 5 |
| average(nums) | 15 | 2 | 20 | 1 | 18 | 2 |
| **Avg reduction** | | **-85%** | | **-91%** | | **-86%** |

Reproduce it yourself:

```bash
cp .env.example .env   # add your API keys
npm run benchmark      # runs tasks, saves results, regenerates chart
```

Every shortcut the agent takes is marked with a `needless:` comment naming the upgrade path.

---

## Before / after

You ask for a cache class. Your agent writes a TTL cache with a lock, an
eviction policy, a factory, and a config object.

With needless:

```python
# needless: no TTL, add when staleness is observed
@lru_cache(maxsize=256)
def fetch_data(url: str) -> dict: ...
```

More survivors in [examples/](examples/).

---

## How it works

Before writing code, the agent stops at the first rung that holds:

```
1. Does this need to exist?        -> no: skip it (YAGNI)
2. Stdlib does it?                 -> use it
3. Native platform feature?        -> use it
4. Installed dependency covers it? -> use it
5. One line?                       -> one line
6. Only then: the minimum that works
```

Minimal, not negligent: trust-boundary validation, data-loss handling,
security, and accessibility are never on the chopping block.

Every shortcut the agent takes is marked with a `needless:` comment naming
the ceiling and the upgrade path.

---

## Intensity levels

The same 6-rung ladder, different how hard the agent pushes back.

| Level | Behaviour |
|-------|-----------|
| **lite** | Builds what you asked, then adds one line naming the simpler option. You choose. |
| **full** | The ladder enforced. Does the minimal thing, tells you what was skipped. Default. |
| **ultra** | YAGNI extremist. Challenges the requirement before building anything. |

Example: "Add a cache class for this API."

**lite**
```
[builds cache class]
FYI: @lru_cache covers this in one line if you'd rather not own it.
```

**full**
```
@lru_cache(maxsize=256) on fetch(). Skipped custom class -- add when lru_cache measurably falls short.
```

**ultra**
```
No cache until a profiler says so. When it does: @lru_cache. A hand-rolled TTL class is a bug farm with a hit rate.
```

Switch anytime in chat:

```
/needless lite
/needless ultra
/needless off
```

Or plain English: `"switch to ultra mode"` / `"be less aggressive"`. Level persists for the session.

---

## Install

### GitHub Copilot

Copy [`.github/copilot-instructions.md`](.github/copilot-instructions.md)
into your project's `.github/` folder. Copilot picks it up automatically.

### Cursor

Copy [`.cursor/rules/needless.mdc`](.cursor/rules/needless.mdc) into your
project's `.cursor/rules/` folder.

### Windsurf

Copy [`.windsurf/rules/needless.md`](.windsurf/rules/needless.md) into your
project's `.windsurf/rules/` folder.

### Cline

Copy [`.clinerules/needless.md`](.clinerules/needless.md) into your project's
`.clinerules/` folder.

### Kiro

Copy [`.kiro/steering/needless.md`](.kiro/steering/needless.md) to
`~/.kiro/steering/` (global) or `.kiro/steering/` in your project.

### AGENTS.md (Codex / OpenAI Agents)

Copy [`AGENTS.md`](AGENTS.md) into your project root. Agents auto-load it.

---

## Commands

Active every session. Once the rules file is in place:

| Command             | What it does                                           |
|---------------------|--------------------------------------------------------|
| `/needless`         | Activate (or switch back to full mode)                 |
| `/needless lite`    | Suggest the minimal path, let you decide               |
| `/needless ultra`   | YAGNI extremist -- challenge the requirement first     |
| `/needless off`     | Deactivate                                             |
| `/needless-review`  | Scan current diff for over-engineering, one line each  |
| `/needless-help`    | Quick-reference card                                   |

For Claude Code and Codex: skills live in [`skills/`](skills/).

---

## FAQ

**Does it need a config file?** No.

**What if I really need the 120-line cache class?**
You probably do not. Insist anyway and the agent will build it. Correctly.
While leaving a `needless:` comment explaining what it replaced.

**Does it scale?** The code you never wrote scales infinitely. Zero bugs, zero
CVEs, 100% uptime since forever.

**Why "needless"?** Every line you are about to write is needless until proven
otherwise. The name is the rule.

---

## License

[MIT](LICENSE). The shortest license that works.
