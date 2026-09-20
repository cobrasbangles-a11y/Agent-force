# Agent Force — Library Design

**Date:** 2026-09-20
**Status:** Approved (design), pending spec review
**Scope:** Project 1 of 2. The agent library itself. The chat app that consumes
it is specified separately in `2026-09-20-agent-force-app-design.md`.

## Purpose

A browsable, installable library of **1000 specialist agents plus 1 overseer**,
each a valid Claude Code subagent file. Coverage is deliberately occupational
and broad — lawyers, welders, chefs, paralegals, supply chain managers — not
1000 variations on "software engineer".

The library is the source of truth. The app reads it; the app never owns it.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Agent format | Claude Code subagent markdown | Drop-in usable by Claude Code's Agent tool with no conversion |
| Prompt depth | ~60–120 lines, five fixed sections | Deep enough to be useful; fixed shape keeps 1000 files coherent and checkable |
| Category source | Directory path, not frontmatter | Keeps every file a valid Claude Code agent with no unknown keys |
| Taxonomy format | Single `data/taxonomy.yaml` | One file to diff, sort, and uniqueness-check |
| Toolchain | Node / TypeScript | Same toolchain as the app; one `package.json`, one CI job |
| Distribution | Library + installer, never bulk-copied | See "The context constraint" below |

## The context constraint (load-bearing)

Claude Code loads **every** file in `.claude/agents/` and injects each agent's
`name` and `description` into the Agent tool's schema on every request. At 1000
agents that is roughly 25–30K tokens added to every single request, and agent
selection becomes unusable noise.

Therefore Agent Force is **not** a folder you copy into `.claude/agents/`. It is
a library you install *selections* from. This constraint drives the existence of
`packs/` and `scripts/install.ts`, and it is the single most important thing a
future contributor needs to understand before proposing "just symlink the whole
thing".

## Repo structure

```
Agent-force/
├── README.md                  # what it is, install, progress badge
├── CONTRIBUTING.md            # house style, how to add an agent
├── package.json               # npm workspaces root: validate / install / test
├── data/
│   └── taxonomy.yaml          # SOURCE OF TRUTH — 1000 specs + overseer
├── agents/
│   ├── overseer.md            # outside the categories, deliberately
│   ├── engineering/
│   │   └── backend-engineer.md
│   ├── sales/
│   │   └── customer-getter.md
│   └── …23 more category dirs
├── packs/
│   ├── growth.yaml            # curated bundles, ~8–12 agents each
│   ├── dev-team.yaml
│   └── founder.yaml
├── scripts/
│   ├── validate.ts            # CI gate, prints authored N/1000
│   └── install.ts             # copy a pack or named agents into a project
├── app/                       # Project 2 — the chat app (own package.json)
├── docs/superpowers/specs/
└── .github/workflows/ci.yml
```

Both projects live in one repo as **npm workspaces**: the root `package.json`
owns `validate` / `install` / `test`, and `app/` is a workspace with its own
dependencies. One `npm install` at the root sets up both. The app is a consumer
of the library, never the other way round — nothing in `scripts/` or `data/` may
import from `app/`.

## Agent file format

```markdown
---
name: customer-getter
description: Finds, qualifies, and lands new customers end to end — ICP
  definition, prospect sourcing, outreach sequences, objection handling, close.
tools: Read, Write, WebSearch
---

# Role
One paragraph. Who this agent is, their seniority, the world they operate in.

# Core expertise
4–8 bullets of genuine domain substance. Named frameworks, real constraints,
the things a practitioner knows that an outsider does not.

# Method
A numbered working procedure. What the agent does first, second, third when
handed a task.

# Output
The concrete artifact this agent returns, and its shape.

# Boundaries
What this agent does not do, what it must escalate, and where a licensed or
accountable human is required.
```

Frontmatter is limited to `name`, `description`, `tools` — the keys Claude Code
actually recognises. Category is derived from the parent directory.

`name` MUST equal the filename stem MUST equal the taxonomy `slug`.

## Taxonomy schema

```yaml
- slug: customer-getter
  title: Customer Getter
  category: sales
  description: >-
    Finds, qualifies, and lands new customers end to end — ICP definition,
    prospect sourcing, outreach sequences, objection handling, close.
  tools: [Read, Write, WebSearch]
```

`description` is duplicated into the agent file's frontmatter. `validate.ts`
asserts the two stay identical, so the taxonomy remains a trustworthy index
without reading 1000 markdown files.

## The 1000 — 25 categories × 40

`engineering` · `data-ai` · `security` · `infrastructure-devops` · `design` ·
`product` · `marketing` · `sales` · `legal` · `finance` · `hr-people` ·
`operations` · `customer-support` · `healthcare` · `science-research` ·
`education` · `media-content` · `skilled-trades` · `construction-realestate` ·
`hospitality-food` · `transport-logistics` · `public-sector` ·
`energy-environment` · `agriculture` · `arts-entertainment`

A hard 40-per-category quota is a forcing function. Without it the taxonomy
drifts toward whatever is easiest to enumerate (tech roles) and the long tail of
real occupations never gets written.

### Pinned requirement

`sales/customer-getter` is a required agent, explicitly requested. It is
authored in Phase 1 as an exemplar, not deferred to its category's batch.

## The overseer

`agents/overseer.md` sits at `agents/` root, outside the 25 category folders. It
*is* listed in `data/taxonomy.yaml` with `category: overseer` so that a single
file remains the complete index, but it is excluded from the 1000 count and from
the 40-per-category quota. `validate.ts` enforces **1000 specialists + 1
overseer** and rejects any other value.

Its job is quality control, not coordination theatre. Given a goal and the work
other agents produced, it must:

1. Assemble a team — select the 5–8 agents a goal actually requires.
2. Brief them — state what each is accountable for.
3. Review — check delivered work against the original ask.
4. Send work back with specific, actionable corrections when it is not done
   properly, naming the agent and the gap.
5. Sign off — produce the consolidated deliverable.

The overseer is the one agent whose prompt the app depends on behaviourally, so
its output contract is strict and is specified in the app design doc.

## Validation (`npm run validate`)

CI-blocking assertions:

- taxonomy contains exactly 1001 entries: 1000 specialists plus `overseer`
- the `overseer` entry carries `category: overseer` and is excluded from all
  per-category and specialist-count rules
- every one of the 25 specialist categories has exactly 40 entries
- slugs are unique, kebab-case, matching `^[a-z][a-z0-9-]*$`
- titles are unique (catches "Contract Lawyer" vs "Contracts Lawyer" drift)
- every `agents/**/*.md` has a taxonomy entry; none is orphaned
- frontmatter `name` == filename stem == taxonomy slug
- frontmatter `description` == taxonomy description, byte for byte
- directory name == taxonomy category
- `tools` are drawn from the real Claude Code tool set
- all five sections present, in order, and non-empty
- `packs/*.yaml` reference only slugs that exist

Non-blocking, printed every run:

```
authored: 412 / 1000   (engineering 40/40, legal 40/40, sales 12/40, …)
```

This number is the README progress badge and is how Phase 2 stays self-tracking
across many sessions.

Uniqueness enforcement is the whole ballgame. 1000 hand-written job titles
without a machine check will contain duplicates.

## Install

```bash
npm run install:agents -- --pack growth --dest ~/myproject/.claude/agents
npm run install:agents -- --agents customer-getter,backend-engineer --dest .
npm run install:agents -- --pack growth --dest . --symlink
```

Copy by default; `--symlink` for people who want upstream updates. Refuses to
overwrite an existing file without `--force`, and prints what it wrote.

## Phased delivery

**Phase 1 (one session):** clone, scaffold, `package.json`, `data/taxonomy.yaml`
with all 1000 entries, `validate.ts` with tests written first, `install.ts`,
three starter packs, README, CI, and **6 fully authored exemplars** —
`overseer`, `customer-getter`, and one each from engineering, design, legal, and
skilled-trades — to lock the house style before volume authoring begins.

**Phase 2 (ongoing, ~25 sessions):** author agents one category at a time, 40 per
session, one PR per category, CI green and the progress badge advancing each
time. The repo is shippable at every point.

## Out of scope

- The chat app (separate spec)
- Non-Claude-Code agent formats (LangChain, CrewAI) — the taxonomy makes these
  derivable later; building them now is speculative
- Publishing to npm or a marketplace

## Success criteria

- `npm run validate` exits 0 with 1000 specialist slugs + overseer, all unique
- Installing a pack into a fresh project produces working Claude Code agents
- A reader can open any two agent files and see the same structure
- The long tail is real: a plumber, a sous chef, and a paralegal all exist
