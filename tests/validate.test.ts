import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { validateLibrary } from '../scripts/lib/validate.js';
import { CATEGORY_SLUGS } from '../scripts/lib/categories.js';

// A well-formed body: whole-file line count in [60, 120], 6 "Core expertise"
// bullets (in [4, 8]), and 5 "Method" steps (in [4, 7]). Used as the default
// fixture body so every existing test keeps passing under the four new
// structural checks; tests for those checks below build their own bodies
// off of `agentWithBody`.
const BODY = `
# Role
You are a senior specialist with years of hands-on experience in this domain,
operating across a range of real engagements and carrying responsibility for
outcomes that matter to the people who rely on your judgment every single
day. You are trusted to make sound calls under incomplete information and to
know exactly when a decision is above your authority to make alone. You
operate with the understanding that the requester came to you because the
problem was not simple enough to solve without specialized judgment, and you
treat every engagement as an opportunity to leave the underlying system in a
more legible state than you found it, not just to close the immediate ticket.
You are equally comfortable working from a terse one-line request and from a
long, meandering description that buries the actual ask in the third
paragraph, and you know how to extract the real question either way. You
never treat a request as fully understood until you can restate it back in
your own words and have that restatement confirmed, because acting on a
misread request wastes more time than asking the one clarifying question
would have.

# Core expertise
- Diagnosing the root cause of a recurring problem before proposing a fix
- Sequencing a multi-step plan so dependent work never blocks on missing input
- Weighing tradeoffs between two approaches using concrete cost and risk data
- Communicating a technical decision in terms a non-specialist stakeholder can act on
- Auditing prior work for a specific class of subtle, easy-to-miss defect
- Recognizing when a symptom and its cause live in different parts of the system

# Method
1. Gather the request and confirm the scope and constraints with the requester.
2. Assess the current state against the relevant standard or specification.
3. Draft a plan covering the identified gaps in priority order.
4. Execute the plan, validating each step before moving to the next.
5. Document the outcome and hand off with clear next steps.

# Output
A structured report naming the finding, the recommended action, and the
evidence supporting it, delivered in a format the requester can act on
immediately without needing to ask a follow-up question. The report always
names the specific artifact affected and the concrete next action, never a
vague summary of the general area that was reviewed. Where more than one
finding exists, each one is ranked by severity so the requester knows which
to act on first, and each ranked item carries its own supporting evidence
rather than pointing back to a single shared paragraph of context. A report
with zero findings still says so explicitly, rather than being silently
withheld. A report covering multiple files groups findings by file so a
reviewer can jump straight to the one they own instead of scanning the whole
list.

# Boundaries
You do not make a final call on anything outside your stated domain of
expertise, and you escalate ambiguous or high-risk requests to a qualified
human rather than guessing. You never fabricate data you were not given, and
you never present a partial finding as a complete one. When a request would
require you to exceed your mandate, you say so plainly instead of stretching
the mandate to cover it, and you say which specific part of the request falls
outside it rather than declining the whole engagement. You do not proceed on
a request that conflicts with a safety or compliance requirement you are
aware of, and you flag that conflict to the requester rather than quietly
working around it. You do not retroactively soften a finding to make a
stakeholder more comfortable with it once it has already been delivered.
`;

let root: string;

function agent(cat: string, slug: string, description: string, tools = 'Read') {
  agentWithBody(cat, slug, description, BODY, tools);
}

function agentWithBody(cat: string, slug: string, description: string, body: string, tools = 'Read') {
  const dir = cat === 'overseer' ? join(root, 'agents') : join(root, 'agents', cat);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${slug}.md`), `---\nname: ${slug}\ndescription: ${description}\ntools: ${tools}\n---\n${body}`);
}

// Parameterized body builder for the four new structural-check tests below.
// `rolePad` adds throwaway filler lines to the Role section purely to move
// the whole-file line count into or out of the 60-120 window without
// touching the bullet or step counts under test.
const ROLE = `You are a senior specialist with years of hands-on experience in this domain,
operating across a range of real engagements and carrying responsibility for
outcomes that matter to the people who rely on your judgment every single
day. You are trusted to make sound calls under incomplete information and to
know exactly when a decision is above your authority to make alone.`;

const OUTPUT = `A structured report naming the finding, the recommended action, and the
evidence supporting it, delivered in a format the requester can act on
immediately without needing to ask a follow-up question.`;

const BOUNDARIES = `You do not make a final call on anything outside your stated domain of
expertise, and you escalate ambiguous or high-risk requests to a qualified
human rather than guessing. You never fabricate data you were not given.`;

function fillerLines(n: number): string {
  return Array.from(
    { length: n },
    (_, i) => `Filler line ${i + 1} pads this section's length only for a test fixture.`,
  ).join('\n');
}

function bulletLines(n: number): string {
  return Array.from(
    { length: n },
    (_, i) => `- Bullet ${i + 1} names one specific, non-generic piece of domain expertise.`,
  ).join('\n');
}

function stepLines(n: number): string {
  return Array.from(
    { length: n },
    (_, i) => `${i + 1}. Step ${i + 1} names one concrete action taken while working a request.`,
  ).join('\n');
}

function makeBody(opts: { bullets: number; steps: number; rolePad?: number }): string {
  const { bullets, steps, rolePad = 0 } = opts;
  const pad = rolePad > 0 ? `\n${fillerLines(rolePad)}` : '';
  return `
# Role
${ROLE}${pad}

# Core expertise
${bulletLines(bullets)}

# Method
${stepLines(steps)}

# Output
${OUTPUT}

# Boundaries
${BOUNDARIES}
`;
}

function taxonomy(yaml: string) {
  mkdirSync(join(root, 'data'), { recursive: true });
  writeFileSync(join(root, 'data', 'taxonomy.yaml'), yaml);
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'af-val-'));
  mkdirSync(join(root, 'packs'), { recursive: true });
});

describe('validateLibrary', () => {
  it('passes a consistent taxonomy and agent file', () => {
    taxonomy(`
- slug: customer-getter
  title: Customer Getter
  category: sales
  description: Finds and lands new customers.
  tools: [Read]
`);
    agent('sales', 'customer-getter', 'Finds and lands new customers.');
    const result = validateLibrary(root, { complete: false });
    expect(result.errors).toEqual([]);
    expect(result.authored).toBe(1);
    expect(result.total).toBe(1);
  });

  it('reports duplicate slugs', () => {
    taxonomy(`
- slug: dup
  title: One
  category: sales
  description: a
  tools: [Read]
- slug: dup
  title: Two
  category: sales
  description: b
  tools: [Read]
`);
    const result = validateLibrary(root, { complete: false });
    expect(result.errors.join('\n')).toMatch(/duplicate slug.*dup/i);
  });

  it('reports duplicate titles', () => {
    taxonomy(`
- slug: a-one
  title: Same Title
  category: sales
  description: a
  tools: [Read]
- slug: a-two
  title: Same Title
  category: sales
  description: b
  tools: [Read]
`);
    expect(validateLibrary(root, { complete: false }).errors.join('\n'))
      .toMatch(/duplicate title.*Same Title/i);
  });

  it('reports a slug that is not kebab-case', () => {
    taxonomy(`
- slug: Not_Kebab
  title: Bad
  category: sales
  description: a
  tools: [Read]
`);
    expect(validateLibrary(root, { complete: false }).errors.join('\n')).toMatch(/kebab/i);
  });

  it('reports an unknown category', () => {
    taxonomy(`
- slug: x-one
  title: X One
  category: wizardry
  description: a
  tools: [Read]
`);
    expect(validateLibrary(root, { complete: false }).errors.join('\n')).toMatch(/wizardry/);
  });

  it('reports an orphaned agent file with no taxonomy entry', () => {
    taxonomy(`[]`);
    agent('sales', 'ghost', 'Nobody knows me.');
    expect(validateLibrary(root, { complete: false }).errors.join('\n')).toMatch(/ghost.*no taxonomy entry/i);
  });

  it('reports a description that drifts from the taxonomy', () => {
    taxonomy(`
- slug: drifter
  title: Drifter
  category: sales
  description: Canonical text.
  tools: [Read]
`);
    agent('sales', 'drifter', 'Different text.');
    expect(validateLibrary(root, { complete: false }).errors.join('\n')).toMatch(/drifter.*description/i);
  });

  it('reports a directory that disagrees with the taxonomy category', () => {
    taxonomy(`
- slug: misfiled
  title: Misfiled
  category: sales
  description: a
  tools: [Read]
`);
    agent('legal', 'misfiled', 'a');
    expect(validateLibrary(root, { complete: false }).errors.join('\n')).toMatch(/misfiled.*legal.*sales/i);
  });

  it('reports a pack referencing an unknown slug', () => {
    taxonomy(`[]`);
    writeFileSync(join(root, 'packs', 'growth.yaml'), 'name: Growth\nagents:\n  - nonexistent\n');
    expect(validateLibrary(root, { complete: false }).errors.join('\n')).toMatch(/nonexistent/);
  });

  it('fills byCategory with zeroed buckets when the taxonomy file is missing', () => {
    // No taxonomy() call: data/taxonomy.yaml does not exist in this root.
    const result = validateLibrary(root, { complete: false });
    expect(result.errors.length).toBeGreaterThan(0);
    expect(Object.keys(result.byCategory)).toHaveLength(CATEGORY_SLUGS.length);
    expect(result.byCategory['sales']).toEqual({ authored: 0, total: 0 });
  });

  it('excludes the overseer from the authored specialist count', () => {
    taxonomy(`
- slug: boss
  title: Boss
  category: overseer
  description: Oversees everything.
  tools: [Read]
- slug: helper
  title: Helper
  category: sales
  description: Helps.
  tools: [Read]
`);
    agent('overseer', 'boss', 'Oversees everything.');
    agent('sales', 'helper', 'Helps.');
    const result = validateLibrary(root, { complete: false });
    expect(result.errors).toEqual([]);
    expect(result.authored).toBe(1);
    expect(result.overseerAuthored).toBe(true);
  });

  it('does not error when tools match but are listed in a different order', () => {
    taxonomy(`
- slug: ordered
  title: Ordered
  category: sales
  description: a
  tools: [Read, Write]
`);
    agent('sales', 'ordered', 'a', 'Write, Read');
    expect(validateLibrary(root, { complete: false }).errors).toEqual([]);
  });

  it('names the specific tools that differ between taxonomy and file', () => {
    taxonomy(`
- slug: mismatched
  title: Mismatched
  category: sales
  description: a
  tools: [Read, Write]
`);
    agent('sales', 'mismatched', 'a', 'Read, Bash');
    const message = validateLibrary(root, { complete: false }).errors.join('\n');
    expect(message).toMatch(/mismatched/);
    expect(message).toMatch(/missing Write/);
    expect(message).toMatch(/unexpected Bash/);
  });

  it('ignores count rules unless complete is set', () => {
    taxonomy(`
- slug: lonely
  title: Lonely
  category: sales
  description: a
  tools: [Read]
`);
    expect(validateLibrary(root, { complete: false }).errors).toEqual([]);
    expect(validateLibrary(root, { complete: true }).errors.join('\n')).toMatch(/1000/);
  });

  it('reports a body that is too short', () => {
    taxonomy(`
- slug: too-short
  title: Too Short
  category: sales
  description: a
  tools: [Read]
`);
    agentWithBody('sales', 'too-short', 'a', makeBody({ bullets: 4, steps: 4 }));
    const message = validateLibrary(root, { complete: false }).errors.join('\n');
    expect(message).toMatch(/too-short.*file is \d+ lines, must be 60-120/);
  });

  it('reports a body that is too long', () => {
    taxonomy(`
- slug: too-long
  title: Too Long
  category: sales
  description: a
  tools: [Read]
`);
    agentWithBody('sales', 'too-long', 'a', makeBody({ bullets: 6, steps: 5, rolePad: 100 }));
    const message = validateLibrary(root, { complete: false }).errors.join('\n');
    expect(message).toMatch(/too-long.*file is \d+ lines, must be 60-120/);
  });

  it('reports a "Core expertise" section with too few bullets', () => {
    taxonomy(`
- slug: few-bullets
  title: Few Bullets
  category: sales
  description: a
  tools: [Read]
`);
    agentWithBody('sales', 'few-bullets', 'a', makeBody({ bullets: 3, steps: 5, rolePad: 28 }));
    const message = validateLibrary(root, { complete: false }).errors.join('\n');
    expect(message).toMatch(/few-bullets.*"Core expertise" has 3 bullet\(s\), must be 4-8/);
  });

  it('reports a "Core expertise" section with too many bullets', () => {
    taxonomy(`
- slug: many-bullets
  title: Many Bullets
  category: sales
  description: a
  tools: [Read]
`);
    agentWithBody('sales', 'many-bullets', 'a', makeBody({ bullets: 9, steps: 5, rolePad: 25 }));
    const message = validateLibrary(root, { complete: false }).errors.join('\n');
    expect(message).toMatch(/many-bullets.*"Core expertise" has 9 bullet\(s\), must be 4-8/);
  });

  it('reports a "Method" section with the wrong number of steps', () => {
    taxonomy(`
- slug: wrong-steps
  title: Wrong Steps
  category: sales
  description: a
  tools: [Read]
`);
    agentWithBody('sales', 'wrong-steps', 'a', makeBody({ bullets: 6, steps: 3, rolePad: 30 }));
    const message = validateLibrary(root, { complete: false }).errors.join('\n');
    expect(message).toMatch(/wrong-steps.*"Method" has 3 step\(s\), must be 4-7/);
  });

  it('reports a description over 200 characters', () => {
    const longDescription =
      'Finds and lands new customers by prospecting, qualifying, and closing deals ' +
      'across multiple channels, coordinating with marketing and product to ensure ' +
      'the pipeline stays healthy and revenue targets are consistently met quarter ' +
      'over quarter no matter what headwinds the broader market throws at the team.';
    expect(longDescription.length).toBeGreaterThan(200);
    taxonomy(`
- slug: long-description
  title: Long Description
  category: sales
  description: ${longDescription}
  tools: [Read]
`);
    agent('sales', 'long-description', longDescription);
    const message = validateLibrary(root, { complete: false }).errors.join('\n');
    expect(message).toMatch(/long-description.*description is \d+ characters, must be under 200/);
  });

  it('passes a well-formed agent on all four new structural checks', () => {
    taxonomy(`
- slug: well-formed
  title: Well Formed
  category: sales
  description: Finds and lands new customers.
  tools: [Read]
`);
    agentWithBody(
      'sales',
      'well-formed',
      'Finds and lands new customers.',
      makeBody({ bullets: 6, steps: 5, rolePad: 25 }),
    );
    const result = validateLibrary(root, { complete: false });
    expect(result.errors).toEqual([]);
  });

  it('under --complete, reports a taxonomy entry with no agent file', () => {
    taxonomy(`
- slug: written
  title: Written
  category: sales
  description: Finds and lands new customers.
  tools: [Read]
- slug: unwritten
  title: Unwritten
  category: sales
  description: Never authored.
  tools: [Read]
`);
    agent('sales', 'written', 'Finds and lands new customers.');
    expect(validateLibrary(root, { complete: false }).errors.join('\n')).not.toMatch(/unwritten/);
    expect(validateLibrary(root, { complete: true }).errors.join('\n')).toMatch(
      /unwritten: taxonomy entry has no agent file \(expected agents\/sales\/unwritten\.md\)/,
    );
  });

  it('does not count a prose line starting with a number and a dot as a Method step', () => {
    taxonomy(`
- slug: prose-number
  title: Prose Number
  category: sales
  description: a
  tools: [Read]
`);
    const body = makeBody({ bullets: 6, steps: 7, rolePad: 25 }).replace(
      '\n\n# Output',
      '\n2024. was a year this sentence starts a wrapped line.\n\n# Output',
    );
    agentWithBody('sales', 'prose-number', 'a', body);
    expect(validateLibrary(root, { complete: false }).errors).toEqual([]);
  });

  it('reports Method steps that are not numbered 1..n in order', () => {
    taxonomy(`
- slug: all-ones
  title: All Ones
  category: sales
  description: a
  tools: [Read]
`);
    const body = makeBody({ bullets: 6, steps: 5, rolePad: 25 }).replace(/^\d+\. /gm, '1. ');
    agentWithBody('sales', 'all-ones', 'a', body);
    expect(validateLibrary(root, { complete: false }).errors.join('\n')).toMatch(
      /all-ones.*"Method" steps must be numbered 1-5 in order — found 1, 1, 1, 1, 1/,
    );
  });

  it('reports an agent file whose frontmatter name differs from its filename', () => {
    taxonomy(`
- slug: right-name
  title: Right Name
  category: sales
  description: a
  tools: [Read]
`);
    agent('sales', 'right-name', 'a');
    const file = join(root, 'agents', 'sales', 'right-name.md');
    writeFileSync(file, readFileSync(file, 'utf8').replace('name: right-name', 'name: wrong-name'));
    expect(validateLibrary(root, { complete: false }).errors.join('\n')).toMatch(
      /frontmatter name "wrong-name" does not match filename "right-name"/,
    );
  });

  it('reports an unreadable agent file instead of crashing', () => {
    taxonomy(`[]`);
    mkdirSync(join(root, 'agents', 'sales'), { recursive: true });
    const loop = join(root, 'agents', 'sales', 'loop.md');
    symlinkSync(loop, loop);
    let result: ReturnType<typeof validateLibrary> | undefined;
    expect(() => {
      result = validateLibrary(root, { complete: false });
    }).not.toThrow();
    expect(result!.errors.join('\n')).toMatch(/loop\.md: unreadable/);
  });

  it('reports a pack with a missing agents list, unknown keys, or duplicates', () => {
    taxonomy(`
- slug: customer-getter
  title: Customer Getter
  category: sales
  description: Finds and lands new customers.
  tools: [Read]
`);
    agent('sales', 'customer-getter', 'Finds and lands new customers.');
    writeFileSync(join(root, 'packs', 'typo.yaml'), 'name: Typo\nagent:\n  - customer-getter\n');
    writeFileSync(join(root, 'packs', 'empty.yaml'), 'name: Empty\nagents: []\n');
    writeFileSync(join(root, 'packs', 'dupe.yaml'), 'name: Dupe\nagents:\n  - customer-getter\n  - customer-getter\n');
    writeFileSync(join(root, 'packs', 'wrong-ext.yml'), 'name: Ext\nagents:\n  - customer-getter\n');
    const message = validateLibrary(root, { complete: false }).errors.join('\n');
    expect(message).toMatch(/packs\/typo\.yaml: unknown key "agent"/);
    expect(message).toMatch(/packs\/typo\.yaml: "agents" must be a list/);
    expect(message).toMatch(/packs\/empty\.yaml: "agents" is empty/);
    expect(message).toMatch(/packs\/dupe\.yaml: lists "customer-getter" more than once/);
    expect(message).toMatch(/packs\/wrong-ext\.yml: pack files must use the \.yaml extension/);
  });
});
