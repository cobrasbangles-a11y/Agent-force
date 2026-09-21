# Contributing to Agent Force

Phase 1 authored 6 of 1001 agents and left the other 994 job specs defined
but unwritten. Phase 2 fills those in, one category (40 agents) per pull
request. This document is the accumulated judgment from reviewing the first
six — the rules that are not obvious from looking at one finished agent file
in isolation, written for someone who was not in the room for that review.

Read `agents/skilled-trades/journeyman-electrician.md` once before you start.
It is the model for a non-desk role and the longest `Boundaries` section in
the library — both are discussed below.

## The seven house style rules for an agent body

Every agent file has YAML frontmatter (`name`, `description`, `tools` — no
other keys) and a body of exactly five `# Heading` sections, in order:
`Role`, `Core expertise`, `Method`, `Output`, `Boundaries`.

1. **`Role`** — one paragraph, second person, naming seniority and operating
   context. "You are a journeyman electrician with years of residential and
   light commercial work behind you" is a role. "You are an AI that helps
   with electrical work" is not, and will be rejected — it names neither
   seniority nor the situations the agent actually operates in.

2. **`Core expertise`** — 4 to 8 bullets of real domain substance. This is
   where most weak drafts fail, and the test is mechanical:
   **if a bullet could be moved verbatim into a different agent in a
   different profession, it is a failed bullet.** "Communicates clearly with
   stakeholders" fits a plumber, a lawyer, and a marine biologist equally
   well, which means it fits none of them and should be deleted. A bullet
   that only a journeyman electrician could have written — the specific
   derating column, the specific vintage of aluminum wiring, the specific
   panel bonding rule — is the bar.

3. **`Method`** — a numbered procedure, 4 to 7 steps, describing how this
   agent actually works a request from intake to handoff. Not a generic
   "understand, plan, execute, verify" — the steps should be specific enough
   that someone unfamiliar with the job could follow the order of operations.

4. **`Output`** — names the concrete artifact the agent hands back and its
   shape (a job packet with named parts, a JSON object with a documented
   schema, a ranked list with specific fields). "A helpful response" is not
   an output.

5. **`Boundaries`** — what the agent refuses to do, what it escalates, and
   where a licensed or credentialed human is required instead of the agent's
   output. See the length note below — this is the section most likely to be
   copied at the wrong length from the electrician exemplar.

6. **Body length: 60-120 lines.** Shorter usually means `Core expertise` or
   `Method` is thin; longer usually means `Boundaries` grew disclaimers it
   didn't need (see the non-desk stance) or `Core expertise` drifted into
   restating `Method`.

7. **`description`** — one sentence, verb-first ("Reviews and drafts...",
   "Plans, installs, and troubleshoots..."), under 200 characters. This is
   the text injected into every request for agent selection, so it has to
   carry the whole job in one line with no filler.

## Taxonomy authoring rules

These apply when you're proposing new entries or auditing existing ones in
`data/taxonomy.yaml`, not just when writing a body.

- **Titles name jobs a real person holds, not capabilities.** "Contract
  Lawyer" is a job. "Contract Review Specialist" describes what someone does
  without naming who does it, and is a symptom of the next rule.

- **Scope-narrowing is not a different job — until you give it a genuinely
  different mandate.** This is the single most common defect found in
  review, and it is subtle because a narrower scope really does describe a
  real slice of work — it just isn't automatically a distinct job title.
  When two entries collapse into one job like this, there are two valid
  remedies, not one:
  - **Cut** one entry and backfill its slot, when the second title has no
    distinct mandate available. `Medical Practice Manager` was cut as a
    duplicate of `Hospital Administrator` "just smaller in scale," and its
    slot went to `Surgeon`. `Culinary Director` was cut as `Food and
    Beverage Director` scoped to chain-restaurant scale. `Game Narrative
    Writer` was never added at all — it would have been `Screenwriter`
    narrowed to one medium — and `Narrative Designer` was taken instead.
  - **Differentiate**, when both titles genuinely exist in the market and
    only the descriptions failed to separate them. `Category Manager` and
    `Strategic Sourcing Manager` were one job as originally written, the two
    descriptions separated only by how many spend categories each covered.
    Rather than cut either, `Category Manager` was reworded to own the
    ongoing multi-year spend strategy and supplier portfolio for its
    category — total cost of ownership against annual budget targets —
    while `Strategic Sourcing Manager` keeps the competitive-RFP,
    cross-category negotiation mandate. Same starting problem as the three
    cuts above, different remedy, because both roles are real jobs.
  Before proposing a title, ask whether it's describing a genuinely
  different job, or the same job at a different scale, vertical, or remit.
  If it's the latter, either cut it or give it a mandate the other role does
  not have — don't leave two entries standing on scope alone.

- **Check for duplicates across categories, not just within one.** A
  category-by-category review structurally cannot catch this, because
  nobody reading the `data-ai` category is also holding the
  `infrastructure-devops` list in their head. `database-administrator` and
  `database-reliability-engineer` sat in different categories as
  effectively one job before this was caught. When you add a category,
  scan the full taxonomy for near-synonyms, not just your 40.

- **Descriptions must stand alone — never name another role by title.** A
  description that says "does X, unlike a Y" leaks the taxonomy's internal
  structure into agent-selection text and breaks the moment the referenced
  role is renamed. Describe what the job does, not what it isn't.

- **Each category should hold at least a 2.5:1 practitioner-to-management
  ratio.** When classifying a title, **seniority within a craft counts as
  practitioner, not management.** An `Electrical Foreman` and a `Sous Chef`
  are practitioners — they are more senior versions of the craft, still
  doing and directing the craft's actual work. A department head or director
  who has moved to budget, headcount, and strategy is management. Getting
  this wrong systematically over-weights a category toward supervisory
  titles and starves it of the practitioner roles that are actually most
  useful to install.

## The non-desk stance

Roughly 200 agents in this taxonomy describe jobs that involve physical work
an agent cannot do: welding, cooking, teaching a classroom, driving a truck,
pulling wire. This library still writes those agents — it just writes what
the *thinking* part of that job looks like.

- An agent cannot weld, but it can determine joint prep and filler metal; it
  cannot cook, but it can plan a shift's mise en place and specify a recipe
  at scale; it cannot teach a classroom, but it can sequence a unit plan and
  diagnose why a lesson isn't landing. Write what the agent *determines,
  plans, diagnoses, specifies, sequences, or inspects.*

- The model to copy is `agents/skilled-trades/journeyman-electrician.md`.
  The single best line in the library for this pattern is the
  `Heavy Equipment Operator` agent's framing: "Plans dig, grade, and load
  sequencing... calculating cut-and-fill volumes," instead of the flat and
  useless "operates an excavator."

- **Do not over-correct into disclaimers.** The point is to write real
  domain substance about the planning and diagnostic work, not to spend the
  agent apologizing for having no hands. A `Role` section that spends two
  sentences explaining that the agent is not physically present has taken
  space away from `Core expertise` and taught the reader nothing they didn't
  already know from the job title.

- **`Boundaries` length should track the role's actual hazard and
  regulatory exposure, not the electrician exemplar's length.** The
  electrician's 18-line `Boundaries` section reflects a job with live-voltage
  hazards, permit law, and licensure requirements — that length is earned by
  the actual risk in the job. A barista does not carry that risk and does
  not need that length of `Boundaries`; two or three lines about food-safety
  basics and when to escalate to a manager is proportionate. Matching the
  exemplar's line count regardless of the job's actual hazard profile is a
  form of padding, not thoroughness.

## Two parser gotchas, found the hard way

- **The section parser masks fenced code blocks before scanning for `#`
  headings, but does not mask indented code blocks.** A ` ``` ` fence is
  safe — anything inside it, including a line starting with `#`, is ignored
  when the parser looks for section headers. An indented code block (four
  spaces, no fence) is *not* masked: a column-0 `#` comment inside one will
  be read as a spurious section heading and the file will fail to parse.
  **Always use fenced code blocks for any example that might contain a `#`
  character**, including shell comments and code samples.

- **Regulated-domain agents must hedge on which code or regulatory edition
  applies, rather than citing a specific article number.**
  `journeyman-electrician` is the model: it cites NEC concepts and figures
  (the 90°C terminal rating, the optional method's 10 kVA threshold) but
  never cites a specific NEC article number, and states plainly that the
  adopted code edition and the local authority having jurisdiction govern.
  Citing "NEC 210.52" as if it were universal is wrong the moment a
  jurisdiction is on an older cycle or has a local amendment — copy the
  hedge, not a specific citation.

## The competent-humans test

For most agents, the move-test above (`Core expertise`, "could this bullet
move verbatim to another profession") is the right check. For agents whose
job is coordinating or reviewing *other people's or agents' work* — the
overseer is the only one in this position today — there's a sharper test:
**would this bullet be false or useless if the workers being reviewed were
competent humans?** The overseer's `Core expertise` bullets pass this test
because they describe failure modes specific to *reviewing generated work*
(confident vagueness, false consensus, silently-resolved ambiguity) that
don't apply to reviewing a competent human's work in the same way. This test
does not apply to a backend engineer or a contract lawyer — their bullets
describe a database or a liability clause, not a worker, and applying the
competent-humans test to them will just tell you to delete correct bullets.

## Process

- Run `npm run validate` before opening a PR. It runs the structural checks
  (frontmatter keys, section order, uniqueness, referential integrity)
  without the `--complete` count gate, so it's safe to run before a category
  is finished. Its `authored:` counter excludes the overseer — the
  denominator counts specialists only — so with the overseer plus five
  specialists authored you'll see `authored: 5 / 1000` on its own line
  followed by a separate `overseer: authored` line, not `6 / 1000`; that's
  the same six agents the README's "6 of 1001" framing counts, just split
  across two lines instead of one. CI runs `npm run validate -- --complete`
  on every push to `main` and every PR — that gate stays green because the
  taxonomy's counts are already complete; your PR only adds authored bodies,
  it never changes counts.
- One category per PR (40 agents). Don't mix categories in a single PR —
  it makes the "at least 2.5:1 practitioner-to-management" check and the
  cross-category duplicate check harder to do honestly.
- Never add a frontmatter key beyond `name`, `description`, `tools`. The
  parser rejects anything else, but more importantly: this repo installs
  into other people's `.claude/agents/` directories, and an extra key is a
  compatibility surface this library does not want to own.
