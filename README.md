# Agent Force

Agent Force is a library of specialist Claude Code subagent definitions —
one job title, one file, each written to the same five-section format — plus
an overseer agent that assembles a team from the library, briefs it, and
reviews the work that comes back. The taxonomy spans 1000 specialist jobs
across 25 categories of 40 each.

## Status: all 1001 agents authored and reviewed

The taxonomy (`data/taxonomy.yaml`) defines 1000 specialist jobs plus the
overseer — slug, title, category, description, and allowed tools for every
one — and every one of those 1001 entries has a written agent file under
`agents/`. The library has also been through a full review pass: duplicate
and overlapping roles were cut or rescoped, descriptions tightened for
agent selection, and bodies checked against the house style in
`CONTRIBUTING.md`. `npm run validate -- --complete` fails if any taxonomy
entry is missing its file.

## Why this is a library you install from, not a folder you copy

Claude Code loads every file in `.claude/agents/` at the start of a session
and injects each agent's `name` and `description` into every request so it
can decide which agent to route work to. That cost is paid on every request,
whether or not the agent is used.

At full strength this library has 1000 agent files. If you copied all of
them into `.claude/agents/`, you would add roughly **35,000-40,000 tokens to
every single request** (the 1001 names and descriptions alone are about
147,000 characters) for descriptions of agents that are relevant to the
current task maybe once in a hundred sessions — and you would hand the model
1000 similarly-worded options to route between, which makes selection worse,
not better, than having ten well-chosen ones.

**Do not symlink or copy the whole `agents/` directory into a project.**
Install only the agents a given project actually needs, using a pack or an
explicit list (below). If you're about to propose "just point
`.claude/agents/` at this repo," read this paragraph again — that is the one
mistake this README exists to prevent.

## Installing agents

Agents install by copying (or symlinking) their `.md` file into a
destination directory — typically a project's `.claude/agents/`. A relative
`--dest` is resolved from the directory you run the command in, so run it
from your project with `npm --prefix` pointing at this repo:

```bash
cd ~/my-project
npm --prefix ~/agent-force run install:agents -- --pack founder --dest .claude/agents
```

The examples below assume that form (or an absolute `--dest`). The
installer refuses a destination inside this repo's own `agents/` folder.

Install a curated pack:

```bash
npm run install:agents -- --pack founder --dest .claude/agents
```

Install specific agents by slug:

```bash
npm run install:agents -- --agents backend-engineer,contract-lawyer --dest .claude/agents
```

Symlink instead of copy (useful while developing inside this repo, so edits
to the source file are picked up without reinstalling):

```bash
npm run install:agents -- --pack dev-team --dest .claude/agents --symlink
```

Add `--force` to overwrite files that already exist at the destination.
Unknown flags, an unknown slug or pack, or passing both `--pack` and
`--agents` are errors, and nothing is written.

Packs live in `packs/*.yaml` as a name, description, and list of agent
slugs. Current packs: `growth`, `dev-team`, `founder`.

## The agent file format

Every agent body has exactly five sections, in this order, each a top-level
`# Heading`:

1. **Role** — who the agent is, in second person, with seniority and
   operating context.
2. **Core expertise** — bulleted domain substance specific to this job.
3. **Method** — a numbered procedure for how the agent does the work.
4. **Output** — the concrete artifact it hands back, and its shape.
5. **Boundaries** — what it refuses, what it escalates, and where a
   licensed human is required.

Frontmatter is limited to exactly three keys: `name`, `description`
(one sentence, shown to Claude Code during agent selection), and `tools`
(a comma-separated allowlist).

A short excerpt, from `agents/legal/contract-lawyer.md`:

```markdown
---
name: contract-lawyer
description: Reviews and drafts commercial contracts, flags risky clauses and missing terms, and ranks exposure so a business can decide what to negotiate.
tools: Read, Write, WebSearch
---

# Role
You are a commercial contracts specialist who has sat on both sides of the
table — in-house for a company that had to ship, and across from counsel whose
job was to win every clause. ...

# Core expertise
- The interaction that actually kills deals at signature: a limitation of
  liability cap sitting next to an IP or data-breach indemnity that is carved
  out of it, ...
```

See `agents/skilled-trades/journeyman-electrician.md` for the fullest
example, including how a non-desk trade is written for an agent that has no
hands (see CONTRIBUTING.md).

## Validating, counting, and testing

```bash
npm run validate               # structural and house-style checks on every file
npm run validate -- --complete # also requires the full 25x40 + overseer taxonomy
                               # and an agent file for every entry
npm run counts                 # per-category authored/total breakdown
npm run typecheck              # tsc --noEmit over scripts and tests
npm test                       # unit tests for the loader, parser, validator,
                               # and installer (including the CLI)
```

CI (`.github/workflows/ci.yml`) runs the typecheck, the tests, and
`npm run validate -- --complete` on every push to `main` and every pull
request. It passes at `authored: 1000 / 1000` plus `overseer: authored`.

## The 25 categories

`engineering`, `data-ai`, `security`, `infrastructure-devops`, `design`,
`product`, `marketing`, `sales`, `legal`, `finance`, `hr-people`,
`operations`, `customer-support`, `healthcare`, `science-research`,
`education`, `media-content`, `skilled-trades`, `construction-realestate`,
`hospitality-food`, `transport-logistics`, `public-sector`,
`energy-environment`, `agriculture`, `arts-entertainment` — 40 specialist
slugs each, defined in `data/taxonomy.yaml`.

## Contributing

Authoring an agent body has seven house style rules and a set of taxonomy
lessons that are not obvious from the format alone. See
[`CONTRIBUTING.md`](CONTRIBUTING.md) before writing one.

## Design docs

The original design rationale — schema, validation rules, and install
semantics — lives in `docs/superpowers/specs/`, notably
`2026-09-20-agent-force-library-design.md`. It predates the authoring and
review work; where it and this README disagree, the README and the code are
current.
