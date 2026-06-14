# Agent Portability

Which file to copy or install for each AI coding tool.

| Tool                  | File to use                                        | How                                              |
|-----------------------|----------------------------------------------------|--------------------------------------------------|
| **GitHub Copilot**    | `.github/copilot-instructions.md`                  | Copy to your project's `.github/` folder         |
| **Cursor**            | `.cursor/rules/needless.mdc`                       | Copy to `.cursor/rules/` in your project         |
| **Windsurf**          | `.windsurf/rules/needless.md`                      | Copy to `.windsurf/rules/` in your project       |
| **Cline**             | `.clinerules/needless.md`                          | Copy to `.clinerules/` in your project           |
| **Kiro** (project)    | `.kiro/steering/needless.md`                       | Copy to `.kiro/steering/` in your project        |
| **Kiro** (global)     | `.kiro/steering/needless.md`                       | Copy to `~/.kiro/steering/`                      |
| **Codex / OpenAI**    | `AGENTS.md`                                        | Copy to project root, agents auto-load it        |
| **Claude Code**       | `skills/needless/`, `skills/needless-review/`      | Install via `/skill` or copy skills directory    |

All files contain the same core ruleset. The format differs per tool (YAML
frontmatter for Cursor, plain Markdown for the rest).

## What each file does

- **Core rules** (`AGENTS.md`, `.github/copilot-instructions.md`, `.cursor/rules/needless.mdc`, etc.): The always-on ruleset. Injected every turn.
- **`skills/needless/SKILL.md`**: Full skill with intensity levels (lite/full/ultra) and output format rules. Use with Claude Code or Codex.
- **`skills/needless-review/SKILL.md`**: Over-engineering review only. One-line findings. Use with `/needless-review`.
- **`skills/needless-help/SKILL.md`**: Quick-reference card. One-shot, no side effects.
- **`commands/needless.toml`**: Claude Code command binding for `/needless [level]`.
- **`commands/needless-review.toml`**: Claude Code command binding for `/needless-review`.
