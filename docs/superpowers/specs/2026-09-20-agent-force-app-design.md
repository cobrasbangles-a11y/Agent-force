# Agent Force — App Design

**Date:** 2026-09-20
**Status:** Approved (design), pending spec review
**Scope:** Project 2 of 2. The local chat app. Depends on Project 1's
`data/taxonomy.yaml` and `agents/**.md` existing.

## Purpose

A local web app for talking to the Agent Force library: browse and search 1000
agents, chat one-to-one, rename them to whatever you want, and run group chats
where the overseer assembles a team and drives them to produce something —
checking the work and sending it back when it is not done properly.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Hosting | Local only, `localhost:3000` | No auth, no hosting bill, no key on a server |
| Model | Ollama, `qwen3.5:9b` default | User's choice; runs fully offline on the M1 |
| Group chat | Overseer assembles the team | 1000 agents replying is neither readable nor affordable in time |
| Renaming | App display name only | Repo stays canonical; a rename can never break a slug or an installed pack |
| Stack | Next.js (App Router) + TypeScript + SQLite | One toolchain with the library scripts; SQLite needs no server |
| Location | `app/`, an npm workspace of the library repo | App reads the library off disk; no publishing step between them |

## The hardware constraint (load-bearing)

Target machine: **Apple M1, 16 GB unified memory.**

`qwen3.5:9b` is ~6.6 GB resident. Only one model fits comfortably, so **agent
turns cannot run in parallel** — they queue. A 5-agent, 2-round group run plus
overseer briefing and review is ~12 sequential generations: **minutes, not
seconds**.

Every architectural choice below follows from this. A conventional
request/response chat app would appear frozen and would lose all work on a tab
refresh. Specifically it requires:

- token streaming, so output appears as it is produced
- a persisted run state machine, so a refresh resumes rather than restarts
- a visible queue — who has spoken, who is generating, who is waiting
- the ability to stop a run mid-flight

`gemma4:26b` is present on the machine at 18 GB but exceeds total RAM and must
not be offered in the model picker.

## Architecture

```
┌─ Next.js app (localhost:3000) ────────────────┐
│  UI          chat, agent browser, group runs  │
│  API routes  /api/chat  /api/run  /api/agents │
│  Runner      single sequential job queue      │
│  lib/ollama  generate() — the only model call │
└───────────────┬───────────────────────────────┘
                │
      ┌─────────┴─────────┐
      ▼                   ▼
  SQLite               Ollama
  app/data/            localhost:11434
  agentforce.db
  (gitignored)
                ▲
                │ read-only at boot
      ../data/taxonomy.yaml + ../agents/**.md
```

The library is read-only to the app. Agents are synced into SQLite at boot for
querying; the markdown bodies remain the source of truth for prompts.

`lib/ollama.ts` exposes a single `generate(messages, opts)` returning a token
stream. It is the only place the model is called, so retargeting at the Claude
API later is one file, not a rewrite. No provider registry, no plugin
abstraction — one function, one implementation.

## Data model

```sql
agents          slug PK, title, category, description, tools, body_path
agent_overrides slug PK, display_name, updated_at      -- renames live here
chats           id PK, kind('direct'|'group'), title, created_at
chat_members    chat_id, agent_slug
messages        id PK, chat_id, role('user'|'agent'|'overseer'|'system'),
                agent_slug, content, round, status('pending'|'streaming'|
                'done'|'error'|'stopped'), created_at
runs            id PK, chat_id, goal, status, phase, current_round,
                max_rounds, created_at
```

`agents` is rebuilt from the library at boot. `agent_overrides` is never touched
by that sync — renames survive library updates.

Display name resolution is one helper used everywhere: `override ?? title`.

## Group chat orchestration

A run is an explicit state machine persisted in `runs.phase`, so any phase can
resume after a refresh or a crash.

**1. `assembling`** — Two-stage selection, because 1000 descriptions do not fit
in context:

- *Stage A:* overseer sees the 25 category names with one-line summaries, picks
  3–5 relevant categories.
- *Stage B:* overseer sees the titles and descriptions of agents in those
  categories only (~120–200 entries), picks 5–8 agents and writes a one-line
  accountability brief for each.

Selection is validated against real slugs; hallucinated slugs are dropped and
the stage retried once, then surfaced as an error rather than silently ignored.

**2. `proposing`** — the assembled lineup is shown for edit. Add, drop, or swap
agents before anything expensive runs. (Chosen over auto-start so a bad team
costs a click, not five minutes.)

**3. `round`** — agents generate sequentially. Each agent sees: the goal, its own
brief, and the posts already made in the current round. It does **not** see the
full transcript of every prior round.

**4. `reviewing`** — the overseer reads the round against the goal and returns a
strict verdict:

```json
{
  "verdict": "sign_off" | "revise",
  "gaps": [{ "agent": "supply-chain-manager",
             "problem": "no cost per unit",
             "action": "give landed cost at 1k and 10k units" }],
  "summary": "..."
}
```

`revise` re-queues only the named agents with their specific correction.
`sign_off` ends the run with the overseer's consolidated summary as the
deliverable.

**5. `done` | `stopped` | `error`.**

`max_rounds` defaults to 3 and is a hard stop. Without it a picky overseer and a
weak local model can loop indefinitely — and on this hardware each loop is
minutes.

### Context budget

qwen3.5:9b's real context window is read at build time via `ollama show` rather
than assumed. Per-turn prompt budget is enforced in code: system prompt (the
agent's markdown body, ~600–1000 tokens) + goal + brief + current-round posts.
When current-round posts exceed the budget, older posts in that round are
replaced by the overseer's running summary. Transcripts grow faster than people
expect; a group run that silently overflows context produces agents that ignore
each other.

## Renaming

Inline edit on the agent's name anywhere it appears. Writes
`agent_overrides.display_name`. Instant, reversible, repo untouched. Prompts
continue to use the canonical identity — renaming the label must not silently
rewrite the agent's own sense of what it is.

## UI direction

Reference: the Grok chat aesthetic — near-black ground, high-contrast white
text, very little chrome, a centered reading column, thin hairline borders,
generous vertical rhythm, restraint over decoration. Agent identity carried by
a small monospace slug next to the display name rather than by colour or
avatars.

Three surfaces:

1. **Agent browser** — search and filter 1000 agents by category, tool, text.
   Must stay fast; searching 1000 rows client-side is fine, rendering 1000 DOM
   nodes is not.
2. **Direct chat** — one agent, streamed.
3. **Group run** — goal input, team lineup, per-agent status (waiting /
   generating / done / revising), transcript grouped by round, overseer verdicts
   visually distinct from agent posts, stop button always available.

The `frontend-design` skill is invoked at build time for this surface rather
than the direction being improvised.

## Error handling

- Ollama unreachable → clear banner naming the fix (`ollama serve`), not a
  stack trace
- Model not pulled → name the exact `ollama pull` command
- Generation fails mid-run → mark that message `error`, keep the run resumable,
  do not discard completed work
- Malformed overseer JSON → one retry with a stricter reprompt, then surface it
- Tab closed mid-run → run continues server-side; reopening resumes the view

## Testing

- `lib/ollama.ts` against a stubbed stream — no live model in tests
- Run state machine transitions, including resume-after-crash
- Two-stage team selection with hallucinated slugs in the fixture
- Context-budget trimming at the boundary
- Rename resolution, including rename-then-library-resync
- Overseer verdict parsing: valid, malformed, and `revise` re-queue paths

## Out of scope

- Auth, multi-user, deployment
- Agents calling tools or executing code — they converse and produce text
- Voice, file upload, image generation
- Editing agent markdown from the app (the repo is the source of truth)

## Success criteria

- Chat one-to-one with any of the 1000 agents, streamed, on a plane
- Rename an agent and see the new name everywhere; repo `git status` stays clean
- State a goal, watch the overseer assemble a team, edit it, run it, and get a
  consolidated deliverable
- Watch the overseer reject weak work with a specific, actionable correction and
  see that agent redo it
- Refresh mid-run and lose nothing
