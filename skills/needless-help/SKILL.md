---
name: needless-help
description: >
  Quick-reference card for all needless modes, skills, and commands.
  One-shot display, not a persistent mode. Trigger: /needless-help,
  "needless help", "what needless commands", "how do I use needless".
---

Display this reference card when invoked. One-shot -- do NOT change mode,
write flag files, or persist anything.

## Levels

| Level   | Trigger           | What changes                                                  |
|---------|-------------------|---------------------------------------------------------------|
| **Lite**  | `/needless lite`  | Build what's asked, name the minimal alternative in one line. |
| **Full**  | `/needless`       | The ladder enforced: YAGNI -> stdlib -> native -> 1 line -> minimum. Default. |
| **Ultra** | `/needless ultra` | YAGNI extremist. Challenges requirements before building.     |
| **Off**   | `/needless off`   | Disable. Resume with `/needless`.                             |

Level sticks until changed or session end.

## Skills

| Skill                | Trigger             | What it does                                              |
|----------------------|---------------------|-----------------------------------------------------------|
| **needless**         | `/needless`         | Minimal mode. Simplest solution that works.               |
| **needless-review**  | `/needless-review`  | Over-engineering review: one line per finding, net count. |
| **needless-help**    | `/needless-help`    | This card.                                                |

## The ladder (quick ref)

1. Does this need to exist? (YAGNI) -> skip
2. Stdlib does it? -> use it
3. Native platform feature? -> use it
4. Already-installed dep? -> use it
5. One line? -> one line
6. Only then: minimum code that works

## Deactivate

Say "stop needless" or "normal mode". Resume anytime with `/needless`.
`/needless off` also works.

## Mark intentional shortcuts

```js
// needless: global lock, per-account locks if throughput matters
// needless: O(n) scan, index on col if table grows large
```

## More

Full docs + examples: https://github.com/siddhamapple/needless
