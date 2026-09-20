# Agent Force Library — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a validated, installable Agent Force library — 1000 specialist job specs plus an overseer in `data/taxonomy.yaml`, a CI-enforcing validator, a pack installer, and 6 fully authored exemplar agents that lock the house style for Phase 2.

**Architecture:** `data/taxonomy.yaml` is the single source of truth; `agents/**/*.md` holds authored Claude Code subagent bodies. Pure library functions under `scripts/lib/` do the work and are unit-tested; thin CLIs in `scripts/` wrap them. The validator is the mechanism that keeps 1000 hand-written entries honest — it is built and tested *before* any bulk authoring begins.

**Tech Stack:** Node 26, TypeScript, npm workspaces, `yaml`, `vitest`, `tsx`.

**Spec:** `docs/superpowers/specs/2026-09-20-agent-force-library-design.md`

## Global Constraints

- Node >= 22. Target machine runs Node 26.8.1, npm 11.19.0.
- One repo, npm workspaces. Root `package.json` owns `validate` / `install:agents` / `test`. `app/` is a future workspace (Project 2) and is NOT created in this phase.
- Nothing in `scripts/` or `data/` may import from `app/`. The dependency points one way.
- Taxonomy holds exactly **1001** entries: 1000 specialists + 1 `overseer`.
- Exactly **25 specialist categories × 40 entries** each. The overseer carries `category: overseer` and is excluded from every count and quota rule.
- Slugs: `^[a-z][a-z0-9-]*$`, globally unique. Titles: globally unique.
- Agent frontmatter keys are limited to `name`, `description`, `tools`. No other keys — Claude Code does not recognise them.
- `name` == filename stem == taxonomy `slug`. Frontmatter `description` == taxonomy `description`, byte for byte.
- Agent bodies have exactly five `#` sections, in this order: `Role`, `Core expertise`, `Method`, `Output`, `Boundaries`.
- Allowed tools: `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebSearch`, `WebFetch`, `NotebookEdit`, `TodoWrite`, `Task`.
- Commit after every task. Never commit to `main` directly; this phase runs on branch `phase-1/library`.

### The 25 categories (exact slugs — do not improvise)

| slug | covers |
|---|---|
| `engineering` | software engineering across languages, platforms, layers |
| `data-ai` | data engineering, analytics, ML, AI systems |
| `security` | offensive, defensive, and governance security |
| `infrastructure-devops` | cloud, platform, SRE, networking, release |
| `design` | product, visual, brand, motion, industrial design |
| `product` | product management, research, product analytics |
| `marketing` | brand, growth, content, performance, lifecycle |
| `sales` | prospecting, closing, partnerships, revenue ops |
| `legal` | transactional, litigation, regulatory, IP |
| `finance` | accounting, FP&A, treasury, tax, investment |
| `hr-people` | recruiting, HR ops, L&D, comp, employee relations |
| `operations` | business ops, program mgmt, quality, process |
| `customer-support` | support, success, onboarding, community |
| `healthcare` | clinical, allied health, diagnostics, health admin |
| `science-research` | physical, life, earth, social sciences |
| `education` | teaching, curriculum, instructional design, admin |
| `media-content` | writing, editing, journalism, publishing, localization |
| `skilled-trades` | electrical, plumbing, welding, HVAC, machining, repair |
| `construction-realestate` | building, surveying, estimating, property |
| `hospitality-food` | culinary, beverage, lodging, events, service |
| `transport-logistics` | freight, fleet, warehousing, customs, transit |
| `public-sector` | government, policy, emergency services, nonprofit |
| `energy-environment` | power, renewables, extraction, environmental |
| `agriculture` | crops, livestock, forestry, fisheries, agtech |
| `arts-entertainment` | performing arts, film, music, games, galleries |

---

## File Structure

| File | Responsibility |
|---|---|
| `package.json` | workspaces root, scripts, deps |
| `tsconfig.json` | TS config for scripts + tests |
| `.gitignore` | node_modules, app/data |
| `scripts/lib/types.ts` | shared types and the five section names |
| `scripts/lib/tools.ts` | allowed Claude Code tool set + guard |
| `scripts/lib/categories.ts` | the 25 category slugs + summaries |
| `scripts/lib/taxonomy.ts` | load and parse `data/taxonomy.yaml` |
| `scripts/lib/agentFile.ts` | parse an agent markdown file |
| `scripts/lib/packs.ts` | load and parse `packs/*.yaml` |
| `scripts/lib/validate.ts` | all validation rules, pure |
| `scripts/lib/install.ts` | resolve + copy/symlink agents, pure |
| `scripts/validate.ts` | CLI wrapper, exit codes, progress output |
| `scripts/install.ts` | CLI wrapper, arg parsing |
| `data/taxonomy.yaml` | source of truth, 1001 entries |
| `agents/overseer.md` + 5 exemplars | authored agents |
| `packs/*.yaml` | 3 curated bundles |
| `.github/workflows/ci.yml` | runs `test` + `validate --complete` |

---

### Task 1: Workspace scaffold, shared types, taxonomy loader

**Files:**
- Create: `package.json`, `tsconfig.json`, `.gitignore`
- Create: `scripts/lib/types.ts`, `scripts/lib/tools.ts`, `scripts/lib/categories.ts`, `scripts/lib/taxonomy.ts`
- Test: `tests/taxonomy.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `TaxonomyEntry`, `AgentFile`, `SECTIONS`, `SectionName`, `ALLOWED_TOOLS`, `isToolName()`, `CATEGORIES`, `CATEGORY_SLUGS`, `loadTaxonomy(path: string): TaxonomyEntry[]`, `TaxonomyError`.

- [ ] **Step 1: Initialise the workspace**

```bash
cd ~/Agent-force
npm init -y
npm pkg set name="agent-force" private=true type="module"
npm pkg set workspaces[0]="app"
npm pkg set scripts.test="vitest run"
npm pkg set scripts.validate="tsx scripts/validate.ts"
npm pkg set scripts.install:agents="tsx scripts/install.ts"
npm install --save-dev typescript tsx vitest @types/node
npm install yaml
```

Note: the `app` workspace is declared now but the directory does not exist yet. npm tolerates an unmatched workspace glob; if it errors, remove the workspaces key and re-add it in Project 2.

- [ ] **Step 2: Write tsconfig and gitignore**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["scripts/**/*.ts", "tests/**/*.ts"]
}
```

`.gitignore`:
```
node_modules/
app/data/
*.db
.env*
```

- [ ] **Step 3: Write the failing test**

`tests/taxonomy.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadTaxonomy } from '../scripts/lib/taxonomy.js';

function fixture(yaml: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'af-'));
  const p = join(dir, 'taxonomy.yaml');
  writeFileSync(p, yaml);
  return p;
}

describe('loadTaxonomy', () => {
  it('parses a well-formed entry', () => {
    const p = fixture(`
- slug: customer-getter
  title: Customer Getter
  category: sales
  description: Finds and lands new customers.
  tools: [Read, Write, WebSearch]
`);
    const entries = loadTaxonomy(p);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toEqual({
      slug: 'customer-getter',
      title: 'Customer Getter',
      category: 'sales',
      description: 'Finds and lands new customers.',
      tools: ['Read', 'Write', 'WebSearch'],
    });
  });

  it('throws when the root is not a list', () => {
    const p = fixture(`slug: nope`);
    expect(() => loadTaxonomy(p)).toThrow(/must be a list/);
  });

  it('throws naming the slug when a field is missing', () => {
    const p = fixture(`
- slug: no-title
  category: sales
  description: x
  tools: [Read]
`);
    expect(() => loadTaxonomy(p)).toThrow(/no-title.*title/s);
  });

  it('throws when a tool is not a real Claude Code tool', () => {
    const p = fixture(`
- slug: bad-tool
  title: Bad Tool
  category: sales
  description: x
  tools: [Telepathy]
`);
    expect(() => loadTaxonomy(p)).toThrow(/Telepathy/);
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run tests/taxonomy.test.ts`
Expected: FAIL — cannot resolve `../scripts/lib/taxonomy.js`.

- [ ] **Step 5: Write types, tools, and categories**

`scripts/lib/types.ts`:
```ts
export const SECTIONS = ['Role', 'Core expertise', 'Method', 'Output', 'Boundaries'] as const;
export type SectionName = (typeof SECTIONS)[number];

export interface TaxonomyEntry {
  slug: string;
  title: string;
  category: string;
  description: string;
  tools: string[];
}

export interface AgentFile {
  path: string;
  name: string;
  description: string;
  tools: string[];
  category: string;
  sections: Record<SectionName, string>;
}
```

`scripts/lib/tools.ts`:
```ts
export const ALLOWED_TOOLS = [
  'Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep',
  'WebSearch', 'WebFetch', 'NotebookEdit', 'TodoWrite', 'Task',
] as const;

export type ToolName = (typeof ALLOWED_TOOLS)[number];

export function isToolName(value: string): value is ToolName {
  return (ALLOWED_TOOLS as readonly string[]).includes(value);
}
```

`scripts/lib/categories.ts`:
```ts
export interface Category {
  slug: string;
  summary: string;
}

// Summaries are consumed by the app's overseer during stage-A team selection.
export const CATEGORIES: Category[] = [
  { slug: 'engineering', summary: 'Software engineering across languages, platforms, and layers' },
  { slug: 'data-ai', summary: 'Data engineering, analytics, ML, and AI systems' },
  { slug: 'security', summary: 'Offensive, defensive, and governance security' },
  { slug: 'infrastructure-devops', summary: 'Cloud, platform, SRE, networking, and release' },
  { slug: 'design', summary: 'Product, visual, brand, motion, and industrial design' },
  { slug: 'product', summary: 'Product management, research, and product analytics' },
  { slug: 'marketing', summary: 'Brand, growth, content, performance, and lifecycle marketing' },
  { slug: 'sales', summary: 'Prospecting, closing, partnerships, and revenue operations' },
  { slug: 'legal', summary: 'Transactional, litigation, regulatory, and IP practice' },
  { slug: 'finance', summary: 'Accounting, FP&A, treasury, tax, and investment' },
  { slug: 'hr-people', summary: 'Recruiting, HR ops, L&D, compensation, employee relations' },
  { slug: 'operations', summary: 'Business operations, program management, quality, process' },
  { slug: 'customer-support', summary: 'Support, success, onboarding, and community' },
  { slug: 'healthcare', summary: 'Clinical, allied health, diagnostics, and health administration' },
  { slug: 'science-research', summary: 'Physical, life, earth, and social sciences research' },
  { slug: 'education', summary: 'Teaching, curriculum, instructional design, and administration' },
  { slug: 'media-content', summary: 'Writing, editing, journalism, publishing, and localization' },
  { slug: 'skilled-trades', summary: 'Electrical, plumbing, welding, HVAC, machining, and repair' },
  { slug: 'construction-realestate', summary: 'Building, surveying, estimating, and property' },
  { slug: 'hospitality-food', summary: 'Culinary, beverage, lodging, events, and service' },
  { slug: 'transport-logistics', summary: 'Freight, fleet, warehousing, customs, and transit' },
  { slug: 'public-sector', summary: 'Government, policy, emergency services, and nonprofit' },
  { slug: 'energy-environment', summary: 'Power, renewables, extraction, and environmental work' },
  { slug: 'agriculture', summary: 'Crops, livestock, forestry, fisheries, and agtech' },
  { slug: 'arts-entertainment', summary: 'Performing arts, film, music, games, and galleries' },
];

export const CATEGORY_SLUGS: string[] = CATEGORIES.map((c) => c.slug);
export const OVERSEER_CATEGORY = 'overseer';
```

- [ ] **Step 6: Write the taxonomy loader**

`scripts/lib/taxonomy.ts`:
```ts
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import type { TaxonomyEntry } from './types.js';
import { isToolName } from './tools.js';

export class TaxonomyError extends Error {}

const STRING_FIELDS = ['slug', 'title', 'category', 'description'] as const;

export function loadTaxonomy(path: string): TaxonomyEntry[] {
  const raw = parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(raw)) {
    throw new TaxonomyError(`${path}: taxonomy root must be a list of entries`);
  }

  return raw.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new TaxonomyError(`${path}: entry ${index} is not a mapping`);
    }
    const label = typeof item.slug === 'string' ? item.slug : `entry ${index}`;

    for (const field of STRING_FIELDS) {
      const value = item[field];
      if (typeof value !== 'string' || value.trim() === '') {
        throw new TaxonomyError(`${label}: missing or empty "${field}"`);
      }
    }

    if (!Array.isArray(item.tools) || item.tools.length === 0) {
      throw new TaxonomyError(`${label}: "tools" must be a non-empty list`);
    }
    for (const tool of item.tools) {
      if (typeof tool !== 'string' || !isToolName(tool)) {
        throw new TaxonomyError(`${label}: "${String(tool)}" is not a Claude Code tool`);
      }
    }

    return {
      slug: item.slug,
      title: item.title,
      category: item.category,
      description: item.description.trim(),
      tools: [...item.tools],
    };
  });
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run tests/taxonomy.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 8: Commit**

```bash
git checkout -b phase-1/library
git add package.json package-lock.json tsconfig.json .gitignore scripts/lib tests/taxonomy.test.ts
git commit -m "feat: workspace scaffold, shared types, and taxonomy loader"
```

---

### Task 2: Agent markdown parser

**Files:**
- Create: `scripts/lib/agentFile.ts`
- Test: `tests/agentFile.test.ts`

**Interfaces:**
- Consumes: `AgentFile`, `SECTIONS`, `SectionName` from `scripts/lib/types.ts`; `isToolName` from `scripts/lib/tools.ts`.
- Produces: `parseAgentFile(raw: string, path: string): AgentFile`, `AgentFileError`.

The parser derives `category` from the parent directory name, per the spec. Files directly under `agents/` get category `overseer`.

- [ ] **Step 1: Write the failing test**

`tests/agentFile.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { parseAgentFile } from '../scripts/lib/agentFile.js';

const GOOD = `---
name: customer-getter
description: Finds and lands new customers.
tools: Read, Write, WebSearch
---

# Role
A relentless new-business closer.

# Core expertise
- ICP definition
- Outreach sequencing

# Method
1. Define the ICP.
2. Build the list.

# Output
A prospect list and an outreach sequence.

# Boundaries
Does not make binding pricing commitments.
`;

describe('parseAgentFile', () => {
  it('parses frontmatter, sections, and category from the path', () => {
    const agent = parseAgentFile(GOOD, 'agents/sales/customer-getter.md');
    expect(agent.name).toBe('customer-getter');
    expect(agent.description).toBe('Finds and lands new customers.');
    expect(agent.tools).toEqual(['Read', 'Write', 'WebSearch']);
    expect(agent.category).toBe('sales');
    expect(agent.sections.Role).toContain('relentless');
    expect(agent.sections.Boundaries).toContain('binding pricing');
  });

  it('assigns category overseer to files at the agents root', () => {
    const agent = parseAgentFile(GOOD, 'agents/overseer.md');
    expect(agent.category).toBe('overseer');
  });

  it('rejects a file with no frontmatter', () => {
    expect(() => parseAgentFile('# Role\nx\n', 'agents/sales/x.md')).toThrow(/frontmatter/);
  });

  it('rejects unknown frontmatter keys', () => {
    const bad = GOOD.replace('tools: Read, Write, WebSearch', 'tools: Read\ncategory: sales');
    expect(() => parseAgentFile(bad, 'agents/sales/customer-getter.md')).toThrow(/category/);
  });

  it('rejects a missing section', () => {
    const bad = GOOD.replace(/# Boundaries[\s\S]*$/, '');
    expect(() => parseAgentFile(bad, 'agents/sales/customer-getter.md')).toThrow(/Boundaries/);
  });

  it('rejects sections in the wrong order', () => {
    const bad = GOOD.replace('# Method', '# Output').replace('# Output\nA prospect', '# Method\nA prospect');
    expect(() => parseAgentFile(bad, 'agents/sales/customer-getter.md')).toThrow(/order/);
  });

  it('rejects an empty section body', () => {
    const bad = GOOD.replace('# Boundaries\nDoes not make binding pricing commitments.\n', '# Boundaries\n\n');
    expect(() => parseAgentFile(bad, 'agents/sales/customer-getter.md')).toThrow(/Boundaries.*empty/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/agentFile.test.ts`
Expected: FAIL — cannot resolve `../scripts/lib/agentFile.js`.

- [ ] **Step 3: Write the parser**

`scripts/lib/agentFile.ts`:
```ts
import { basename, dirname } from 'node:path';
import { parse } from 'yaml';
import { SECTIONS, type AgentFile, type SectionName } from './types.js';
import { isToolName } from './tools.js';

export class AgentFileError extends Error {}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
const ALLOWED_KEYS = new Set(['name', 'description', 'tools']);

export function parseAgentFile(raw: string, path: string): AgentFile {
  const match = FRONTMATTER.exec(raw);
  if (!match) {
    throw new AgentFileError(`${path}: missing YAML frontmatter delimited by ---`);
  }
  const [, head, body] = match as unknown as [string, string, string];

  const meta = parse(head);
  if (typeof meta !== 'object' || meta === null) {
    throw new AgentFileError(`${path}: frontmatter must be a mapping`);
  }
  for (const key of Object.keys(meta)) {
    if (!ALLOWED_KEYS.has(key)) {
      throw new AgentFileError(
        `${path}: unknown frontmatter key "${key}" — only name, description, tools are allowed`,
      );
    }
  }
  for (const key of ['name', 'description']) {
    if (typeof meta[key] !== 'string' || meta[key].trim() === '') {
      throw new AgentFileError(`${path}: missing or empty "${key}"`);
    }
  }
  if (typeof meta.tools !== 'string' || meta.tools.trim() === '') {
    throw new AgentFileError(`${path}: "tools" must be a comma-separated string`);
  }

  const tools = meta.tools.split(',').map((t: string) => t.trim()).filter(Boolean);
  for (const tool of tools) {
    if (!isToolName(tool)) {
      throw new AgentFileError(`${path}: "${tool}" is not a Claude Code tool`);
    }
  }

  const parent = basename(dirname(path));
  const category = parent === 'agents' ? 'overseer' : parent;

  return {
    path,
    name: meta.name.trim(),
    description: meta.description.replace(/\s+/g, ' ').trim(),
    tools,
    category,
    sections: parseSections(body, path),
  };
}

function parseSections(body: string, path: string): Record<SectionName, string> {
  const found = [...body.matchAll(/^# (.+)$/gm)].map((m) => ({
    title: (m[1] ?? '').trim(),
    start: m.index ?? 0,
    end: 0,
  }));

  for (let i = 0; i < found.length; i++) {
    found[i]!.end = i + 1 < found.length ? found[i + 1]!.start : body.length;
  }

  const titles = found.map((s) => s.title);
  for (const required of SECTIONS) {
    if (!titles.includes(required)) {
      throw new AgentFileError(`${path}: missing required section "# ${required}"`);
    }
  }
  if (titles.join('|') !== SECTIONS.join('|')) {
    throw new AgentFileError(
      `${path}: sections must be exactly ${SECTIONS.join(', ')} in that order — found ${titles.join(', ')}`,
    );
  }

  const sections = {} as Record<SectionName, string>;
  for (const section of found) {
    const text = body.slice(section.start, section.end).replace(/^# .+$/m, '').trim();
    if (text === '') {
      throw new AgentFileError(`${path}: section "# ${section.title}" is empty`);
    }
    sections[section.title as SectionName] = text;
  }
  return sections;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/agentFile.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/agentFile.ts tests/agentFile.test.ts
git commit -m "feat: agent markdown parser with strict section and frontmatter rules"
```

---

### Task 3: Validator

**Files:**
- Create: `scripts/lib/validate.ts`, `scripts/validate.ts`
- Test: `tests/validate.test.ts`

**Interfaces:**
- Consumes: `loadTaxonomy`, `parseAgentFile`, `CATEGORY_SLUGS`, `OVERSEER_CATEGORY`.
- Produces: `validateLibrary(root: string, opts: { complete: boolean }): ValidationResult` where
  `ValidationResult = { errors: string[]; authored: number; total: number; byCategory: Record<string, { authored: number; total: number }> }`.

**Design note (refines the spec):** structural rules always run. The *count* rules — 1000 specialists, 40 per category — run only under `--complete`. This lets Tasks 5–10 commit partial taxonomies with a green structural check while CI on `main` runs `--complete`. Without this split, every intermediate commit in this phase is red.

- [ ] **Step 1: Write the failing test**

`tests/validate.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { validateLibrary } from '../scripts/lib/validate.js';

const BODY = `
# Role
r
# Core expertise
- c
# Method
1. m
# Output
o
# Boundaries
b
`;

let root: string;

function agent(cat: string, slug: string, description: string, tools = 'Read') {
  const dir = cat === 'overseer' ? join(root, 'agents') : join(root, 'agents', cat);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${slug}.md`), `---\nname: ${slug}\ndescription: ${description}\ntools: ${tools}\n---\n${BODY}`);
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/validate.test.ts`
Expected: FAIL — cannot resolve `../scripts/lib/validate.js`.

- [ ] **Step 3: Write the pack loader**

`scripts/lib/packs.ts`:
```ts
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export interface Pack {
  file: string;
  name: string;
  agents: string[];
}

export function loadPacks(root: string): Pack[] {
  const dir = join(root, 'packs');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => {
      const raw = parse(readFileSync(join(dir, f), 'utf8')) ?? {};
      return {
        file: f,
        name: typeof raw.name === 'string' ? raw.name : f.replace(/\.yaml$/, ''),
        agents: Array.isArray(raw.agents) ? raw.agents.map(String) : [],
      };
    });
}
```

- [ ] **Step 4: Write the validator core**

`scripts/lib/validate.ts`:
```ts
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadTaxonomy } from './taxonomy.js';
import { parseAgentFile } from './agentFile.js';
import { CATEGORY_SLUGS, OVERSEER_CATEGORY } from './categories.js';

export interface ValidationResult {
  errors: string[];
  authored: number;
  total: number;
  byCategory: Record<string, { authored: number; total: number }>;
}

const SLUG_RE = /^[a-z][a-z0-9-]*$/;
const SPECIALIST_TOTAL = 1000;
const PER_CATEGORY = 40;

function walkAgents(root: string): string[] {
  const dir = join(root, 'agents');
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  const visit = (d: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.name.endsWith('.md')) out.push(full);
    }
  };
  visit(dir);
  return out;
}

export function validateLibrary(root: string, opts: { complete: boolean }): ValidationResult {
  const errors: string[] = [];
  const taxonomyPath = join(root, 'data', 'taxonomy.yaml');

  let entries;
  try {
    entries = loadTaxonomy(taxonomyPath);
  } catch (err) {
    return {
      errors: [(err as Error).message],
      authored: 0,
      total: 0,
      byCategory: {},
    };
  }

  const bySlug = new Map<string, (typeof entries)[number]>();
  const seenTitles = new Map<string, string>();

  for (const entry of entries) {
    if (!SLUG_RE.test(entry.slug)) {
      errors.push(`${entry.slug}: slug must be kebab-case matching ${SLUG_RE}`);
    }
    if (bySlug.has(entry.slug)) {
      errors.push(`duplicate slug "${entry.slug}"`);
    }
    bySlug.set(entry.slug, entry);

    const titleKey = entry.title.toLowerCase();
    const owner = seenTitles.get(titleKey);
    if (owner) {
      errors.push(`duplicate title "${entry.title}" on ${owner} and ${entry.slug}`);
    }
    seenTitles.set(titleKey, entry.slug);

    if (entry.category !== OVERSEER_CATEGORY && !CATEGORY_SLUGS.includes(entry.category)) {
      errors.push(`${entry.slug}: unknown category "${entry.category}"`);
    }
  }

  const specialists = entries.filter((e) => e.category !== OVERSEER_CATEGORY);
  const overseers = entries.filter((e) => e.category === OVERSEER_CATEGORY);

  const byCategory: ValidationResult['byCategory'] = {};
  for (const slug of CATEGORY_SLUGS) {
    byCategory[slug] = { authored: 0, total: 0 };
  }
  for (const entry of specialists) {
    const bucket = byCategory[entry.category];
    if (bucket) bucket.total += 1;
  }

  if (opts.complete) {
    if (specialists.length !== SPECIALIST_TOTAL) {
      errors.push(`taxonomy must hold exactly ${SPECIALIST_TOTAL} specialists — found ${specialists.length}`);
    }
    if (overseers.length !== 1) {
      errors.push(`taxonomy must hold exactly 1 overseer entry — found ${overseers.length}`);
    }
    for (const slug of CATEGORY_SLUGS) {
      const count = byCategory[slug]!.total;
      if (count !== PER_CATEGORY) {
        errors.push(`category "${slug}" must hold exactly ${PER_CATEGORY} entries — found ${count}`);
      }
    }
  }

  let authored = 0;
  for (const file of walkAgents(root)) {
    const rel = relative(root, file);
    let agent;
    try {
      agent = parseAgentFile(readFileSync(file, 'utf8'), rel);
    } catch (err) {
      errors.push((err as Error).message);
      continue;
    }

    const stem = rel.split('/').pop()!.replace(/\.md$/, '');
    if (agent.name !== stem) {
      errors.push(`${rel}: frontmatter name "${agent.name}" does not match filename "${stem}"`);
    }

    const entry = bySlug.get(agent.name);
    if (!entry) {
      errors.push(`${rel}: "${agent.name}" has no taxonomy entry`);
      continue;
    }
    if (entry.description !== agent.description) {
      errors.push(`${rel}: description does not match the taxonomy entry for "${agent.name}"`);
    }
    if (entry.category !== agent.category) {
      errors.push(`${rel}: lives in "${agent.category}" but taxonomy says "${entry.category}"`);
    }
    if (entry.tools.join(',') !== agent.tools.join(',')) {
      errors.push(`${rel}: tools do not match the taxonomy entry for "${agent.name}"`);
    }

    authored += 1;
    const bucket = byCategory[entry.category];
    if (bucket) bucket.authored += 1;
  }

  const knownSlugs = new Set(bySlug.keys());
  for (const pack of loadPacksSafe(root, errors)) {
    for (const slug of pack.agents) {
      if (!knownSlugs.has(slug)) {
        errors.push(`packs/${pack.file}: references unknown agent "${slug}"`);
      }
    }
  }

  return { errors, authored, total: entries.length, byCategory };
}

function loadPacksSafe(root: string, errors: string[]) {
  try {
    // imported lazily so a malformed pack cannot break taxonomy validation
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return loadPacksImpl(root);
  } catch (err) {
    errors.push(`packs: ${(err as Error).message}`);
    return [];
  }
}

import { loadPacks as loadPacksImpl } from './packs.js';
```

Note: move the `import { loadPacks as loadPacksImpl }` line to the top of the file with the other imports — it is shown at the bottom only to keep the diff readable. ES module imports hoist, so it works either way, but top is correct style.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/validate.test.ts`
Expected: PASS, 10 tests.

- [ ] **Step 6: Write the CLI**

`scripts/validate.ts`:
```ts
import { validateLibrary } from './lib/validate.js';
import { CATEGORY_SLUGS } from './lib/categories.js';

const complete = process.argv.includes('--complete');
const root = process.cwd();
const result = validateLibrary(root, { complete });

for (const error of result.errors) {
  console.error(`  ✗ ${error}`);
}

const specialistTotal = 1000;
console.log(`\nauthored: ${result.authored} / ${specialistTotal}`);

const partial = CATEGORY_SLUGS
  .map((slug) => {
    const bucket = result.byCategory[slug]!;
    return `${slug} ${bucket.authored}/${bucket.total}`;
  })
  .join('  ');
console.log(partial);

if (result.errors.length > 0) {
  console.error(`\n${result.errors.length} problem(s) found.`);
  process.exit(1);
}
console.log('\nvalidation passed.');
```

- [ ] **Step 7: Verify the CLI runs**

Run: `npm run validate`
Expected: exits 1 with a message that `data/taxonomy.yaml` does not exist. That is correct — the file arrives in Task 5.

- [ ] **Step 8: Commit**

```bash
git add scripts/lib/validate.ts scripts/lib/packs.ts scripts/validate.ts tests/validate.test.ts
git commit -m "feat: library validator with structural rules and --complete count gate"
```

---

### Task 4: Installer

**Files:**
- Create: `scripts/lib/install.ts`, `scripts/install.ts`
- Test: `tests/install.test.ts`

**Interfaces:**
- Consumes: `loadTaxonomy`, `loadPacks`.
- Produces: `resolveAgents(root, opts): string[]` and
  `installAgents(root, opts): InstallResult` where
  `InstallOptions = { pack?: string; agents?: string[]; dest: string; symlink?: boolean; force?: boolean }` and
  `InstallResult = { written: string[]; skipped: string[] }`.

- [ ] **Step 1: Write the failing test**

`tests/install.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { installAgents } from '../scripts/lib/install.js';

const BODY = `\n# Role\nr\n# Core expertise\n- c\n# Method\n1. m\n# Output\no\n# Boundaries\nb\n`;
let root: string;
let dest: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'af-inst-'));
  dest = mkdtempSync(join(tmpdir(), 'af-dest-'));
  mkdirSync(join(root, 'data'), { recursive: true });
  mkdirSync(join(root, 'agents', 'sales'), { recursive: true });
  mkdirSync(join(root, 'packs'), { recursive: true });
  writeFileSync(join(root, 'data', 'taxonomy.yaml'), `
- slug: customer-getter
  title: Customer Getter
  category: sales
  description: Finds and lands new customers.
  tools: [Read]
`);
  writeFileSync(join(root, 'agents', 'sales', 'customer-getter.md'),
    `---\nname: customer-getter\ndescription: Finds and lands new customers.\ntools: Read\n---\n${BODY}`);
  writeFileSync(join(root, 'packs', 'growth.yaml'), 'name: Growth\nagents:\n  - customer-getter\n');
});

describe('installAgents', () => {
  it('copies a named agent flat into the destination', () => {
    const result = installAgents(root, { agents: ['customer-getter'], dest });
    expect(result.written).toEqual(['customer-getter.md']);
    expect(existsSync(join(dest, 'customer-getter.md'))).toBe(true);
    expect(readFileSync(join(dest, 'customer-getter.md'), 'utf8')).toContain('name: customer-getter');
  });

  it('installs every agent in a pack', () => {
    const result = installAgents(root, { pack: 'growth', dest });
    expect(result.written).toEqual(['customer-getter.md']);
  });

  it('throws on an unknown agent slug', () => {
    expect(() => installAgents(root, { agents: ['nope'], dest })).toThrow(/nope/);
  });

  it('throws on an unknown pack', () => {
    expect(() => installAgents(root, { pack: 'nope', dest })).toThrow(/nope/);
  });

  it('throws when an agent is in the taxonomy but not yet authored', () => {
    writeFileSync(join(root, 'data', 'taxonomy.yaml'), `
- slug: unwritten
  title: Unwritten
  category: sales
  description: a
  tools: [Read]
`);
    expect(() => installAgents(root, { agents: ['unwritten'], dest })).toThrow(/not yet authored/);
  });

  it('skips an existing file without force', () => {
    writeFileSync(join(dest, 'customer-getter.md'), 'mine');
    const result = installAgents(root, { agents: ['customer-getter'], dest });
    expect(result.written).toEqual([]);
    expect(result.skipped).toEqual(['customer-getter.md']);
    expect(readFileSync(join(dest, 'customer-getter.md'), 'utf8')).toBe('mine');
  });

  it('overwrites an existing file with force', () => {
    writeFileSync(join(dest, 'customer-getter.md'), 'mine');
    const result = installAgents(root, { agents: ['customer-getter'], dest, force: true });
    expect(result.written).toEqual(['customer-getter.md']);
    expect(readFileSync(join(dest, 'customer-getter.md'), 'utf8')).toContain('name: customer-getter');
  });

  it('creates a symlink when asked', () => {
    installAgents(root, { agents: ['customer-getter'], dest, symlink: true });
    expect(lstatSync(join(dest, 'customer-getter.md')).isSymbolicLink()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/install.test.ts`
Expected: FAIL — cannot resolve `../scripts/lib/install.js`.

- [ ] **Step 3: Write the installer core**

`scripts/lib/install.ts`:
```ts
import { copyFileSync, existsSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { loadTaxonomy } from './taxonomy.js';
import { loadPacks } from './packs.js';

export interface InstallOptions {
  pack?: string;
  agents?: string[];
  dest: string;
  symlink?: boolean;
  force?: boolean;
}

export interface InstallResult {
  written: string[];
  skipped: string[];
}

export class InstallError extends Error {}

export function installAgents(root: string, opts: InstallOptions): InstallResult {
  const entries = loadTaxonomy(join(root, 'data', 'taxonomy.yaml'));
  const bySlug = new Map(entries.map((e) => [e.slug, e]));

  let slugs: string[];
  if (opts.pack) {
    const pack = loadPacks(root).find((p) => p.file === `${opts.pack}.yaml`);
    if (!pack) throw new InstallError(`no pack named "${opts.pack}" in packs/`);
    slugs = pack.agents;
  } else if (opts.agents && opts.agents.length > 0) {
    slugs = opts.agents;
  } else {
    throw new InstallError('specify --pack <name> or --agents <slug,slug>');
  }

  mkdirSync(opts.dest, { recursive: true });

  const written: string[] = [];
  const skipped: string[] = [];

  for (const slug of slugs) {
    const entry = bySlug.get(slug);
    if (!entry) throw new InstallError(`unknown agent "${slug}"`);

    const source =
      entry.category === 'overseer'
        ? join(root, 'agents', `${slug}.md`)
        : join(root, 'agents', entry.category, `${slug}.md`);

    if (!existsSync(source)) {
      throw new InstallError(`"${slug}" is in the taxonomy but not yet authored`);
    }

    const filename = `${slug}.md`;
    const target = join(opts.dest, filename);

    if (existsSync(target) || isDanglingLink(target)) {
      if (!opts.force) {
        skipped.push(filename);
        continue;
      }
      rmSync(target, { force: true });
    }

    if (opts.symlink) symlinkSync(resolve(source), target);
    else copyFileSync(source, target);

    written.push(filename);
  }

  return { written, skipped };
}

function isDanglingLink(path: string): boolean {
  try {
    return require('node:fs').lstatSync(path) !== undefined;
  } catch {
    return false;
  }
}
```

Replace the `isDanglingLink` body with a top-level `import { lstatSync } from 'node:fs'` and `try { lstatSync(path); return true; } catch { return false; }` — `require` is unavailable in an ESM module. This is deliberate: fix it when the test for the symlink case fails.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/install.test.ts`
Expected: PASS, 8 tests. If `isDanglingLink` throws a `require is not defined` error, apply the ESM fix noted above.

- [ ] **Step 5: Write the CLI**

`scripts/install.ts`:
```ts
import { installAgents } from './lib/install.js';

function flag(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const dest = flag('dest');
if (!dest) {
  console.error('usage: npm run install:agents -- --pack <name>|--agents <a,b> --dest <dir> [--symlink] [--force]');
  process.exit(1);
}

try {
  const result = installAgents(process.cwd(), {
    pack: flag('pack'),
    agents: flag('agents')?.split(',').map((s) => s.trim()).filter(Boolean),
    dest,
    symlink: process.argv.includes('--symlink'),
    force: process.argv.includes('--force'),
  });
  for (const file of result.written) console.log(`  + ${file}`);
  for (const file of result.skipped) console.log(`  - ${file} (exists, use --force)`);
  console.log(`\n${result.written.length} installed, ${result.skipped.length} skipped.`);
} catch (err) {
  console.error(`error: ${(err as Error).message}`);
  process.exit(1);
}
```

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/install.ts scripts/install.ts tests/install.test.ts
git commit -m "feat: pack and agent installer with copy, symlink, and overwrite guards"
```

---

### Task 5: The six exemplar agents, their taxonomy entries, and the packs

This task locks the house style. Every agent authored in Phase 2 is written by copying the shape of these six. Get them right.

**Files:**
- Create: `data/taxonomy.yaml` (6 entries for now)
- Create: `agents/overseer.md`
- Create: `agents/sales/customer-getter.md`
- Create: `agents/engineering/backend-engineer.md`
- Create: `agents/design/brand-identity-designer.md`
- Create: `agents/legal/contract-lawyer.md`
- Create: `agents/skilled-trades/journeyman-electrician.md`
- Create: `packs/growth.yaml`, `packs/dev-team.yaml`, `packs/founder.yaml`

**Interfaces:**
- Consumes: the validator from Task 3, the installer from Task 4.
- Produces: the canonical agent-file shape all later authoring copies.

**House style rules — apply to every agent, in this phase and Phase 2:**

1. `Role` is one paragraph, second person, naming seniority and operating context. No "You are an AI".
2. `Core expertise` is 4–8 bullets of real domain substance — named frameworks, real constraints, things a practitioner knows and an outsider does not. A bullet that could apply to any job is a failed bullet.
3. `Method` is a numbered procedure, 4–7 steps, describing what the agent does first, second, third.
4. `Output` names the concrete artifact and its shape.
5. `Boundaries` states what the agent refuses, what it escalates, and where an accountable licensed human is required. Every regulated role (legal, medical, financial, trades) must name its licensure limit here.
6. Body length 60–120 lines.
7. `description` is one sentence, under 200 characters, starting with a verb.

- [ ] **Step 1: Write `data/taxonomy.yaml` with the six entries**

```yaml
# Agent Force taxonomy — the source of truth.
# 1000 specialists across 25 categories (40 each) plus 1 overseer.
# Slugs and titles are globally unique. See docs/superpowers/specs/.

- slug: overseer
  title: Overseer
  category: overseer
  description: >-
    Assembles agent teams for a goal, briefs them, reviews delivered work
    against the original ask, and sends it back with specific corrections
    until it is done properly.
  tools: [Read, Write, TodoWrite]

- slug: customer-getter
  title: Customer Getter
  category: sales
  description: >-
    Finds, qualifies, and lands new customers end to end — ICP definition,
    prospect sourcing, outreach sequences, objection handling, and close.
  tools: [Read, Write, WebSearch]

- slug: backend-engineer
  title: Backend Engineer
  category: engineering
  description: >-
    Designs and builds server-side services, APIs, and data access layers with
    attention to correctness, failure modes, and operational cost.
  tools: [Read, Write, Edit, Bash, Grep, Glob]

- slug: brand-identity-designer
  title: Brand Identity Designer
  category: design
  description: >-
    Builds visual identity systems — logo, palette, type, and usage rules —
    that stay coherent across every surface a brand appears on.
  tools: [Read, Write, WebSearch]

- slug: contract-lawyer
  title: Contract Lawyer
  category: legal
  description: >-
    Reviews and drafts commercial contracts, flags risky clauses and missing
    terms, and ranks exposure so a business can decide what to negotiate.
  tools: [Read, Write, WebSearch]

- slug: journeyman-electrician
  title: Journeyman Electrician
  category: skilled-trades
  description: >-
    Plans, installs, and troubleshoots residential and light commercial
    electrical systems to code, from service entrance to branch circuits.
  tools: [Read, Write, WebSearch]
```

- [ ] **Step 2: Write `agents/overseer.md`**

The overseer's output contract is depended on by the app (Project 2), so its `Output` section must specify the exact JSON verdict shape.

```markdown
---
name: overseer
description: Assembles agent teams for a goal, briefs them, reviews delivered work against the original ask, and sends it back with specific corrections until it is done properly.
tools: Read, Write, TodoWrite
---

# Role
You are the overseer of Agent Force. You do not do the specialist work yourself.
You decide who should do it, tell them exactly what they are accountable for,
read what comes back, and refuse to accept work that does not actually answer
the goal. You are the reason the output of a group of agents is worth more than
the sum of their individual replies.

# Core expertise
- Decomposing a vague goal into the specific disciplines it actually requires,
  and noticing the discipline nobody thought to ask for
- Writing accountability briefs: one sentence that tells a specialist what
  they own and what "done" looks like for them
- Detecting the three common failures of generated work — confident vagueness,
  restating the question, and answering an easier adjacent question
- Distinguishing a gap that blocks the deliverable from a gap that is merely
  imperfect, and only sending back the former
- Knowing when a team is wrong rather than underperforming, and swapping a
  member instead of asking for another round
- Consolidating several specialists' output into one deliverable without
  flattening the disagreements that matter

# Method
1. Restate the goal in one sentence. If it is ambiguous, state the reading you
   are proceeding on rather than asking.
2. Identify the 5-8 disciplines the goal requires. Prefer breadth of discipline
   over several agents from the same category.
3. Write a one-line accountability brief for each selected agent.
4. Read each delivered contribution against its brief and against the goal.
5. For each gap, name the agent, the problem, and the specific action that would
   fix it. Never write "needs more detail".
6. Sign off only when the assembled work would actually let someone act. Then
   consolidate it into a single deliverable.

# Output
Two artifacts.

When assembling a team, a JSON object:

    { "team": [ { "agent": "<slug>", "brief": "<one sentence>" } ] }

When reviewing a round, a JSON object:

    {
      "verdict": "sign_off" | "revise",
      "gaps": [
        { "agent": "<slug>", "problem": "<what is wrong>", "action": "<what to do>" }
      ],
      "summary": "<consolidated deliverable on sign_off, else progress note>"
    }

Emit only the JSON object, with no prose before or after it. On `sign_off`,
`gaps` is an empty list and `summary` is the full deliverable.

# Boundaries
You do not perform specialist work yourself — if you find yourself writing the
marketing plan instead of reviewing it, you have failed your role. You do not
send work back more than the run's round limit allows; when that limit is
reached you sign off and state plainly what remains unresolved. You never
invent an agent slug that was not offered to you. You do not overrule a
licensed specialist's stated limits — if a lawyer says an item needs a licensed
attorney, that goes in the deliverable, not into a revision request.
```

- [ ] **Step 3: Write the remaining five exemplars**

Author `agents/sales/customer-getter.md`, `agents/engineering/backend-engineer.md`, `agents/design/brand-identity-designer.md`, `agents/legal/contract-lawyer.md`, and `agents/skilled-trades/journeyman-electrician.md` following the seven house style rules above and the structure of `overseer.md`.

Each file's frontmatter `description` must match its taxonomy entry with the YAML folding collapsed to single spaces — the validator compares them after whitespace normalisation, so write the description as one unbroken line in the markdown file.

`contract-lawyer` and `journeyman-electrician` must name their licensure limits in `Boundaries` (not legal advice / licensed attorney required; permit and inspection requirements / licensed electrician and local code authority).

- [ ] **Step 4: Write the three packs**

`packs/growth.yaml`:
```yaml
name: Growth
description: Landing customers and building the brand around them.
agents:
  - customer-getter
  - brand-identity-designer
```

`packs/dev-team.yaml`:
```yaml
name: Dev Team
description: Building and shipping the product.
agents:
  - backend-engineer
```

`packs/founder.yaml`:
```yaml
name: Founder
description: The smallest set that covers build, sell, and protect.
agents:
  - overseer
  - customer-getter
  - backend-engineer
  - contract-lawyer
```

Packs grow as Phase 2 authors more agents. The validator rejects a pack that references a slug missing from the taxonomy, so they can only reference authored or specified agents.

- [ ] **Step 5: Verify validation passes**

Run: `npm run validate`
Expected: exit 0, `authored: 6 / 1000`, no errors.

- [ ] **Step 6: Verify the installer works end to end**

```bash
rm -rf /tmp/af-check && npm run install:agents -- --pack founder --dest /tmp/af-check
ls /tmp/af-check
```
Expected: four `.md` files written; `overseer.md` among them.

- [ ] **Step 7: Run the whole test suite**

Run: `npm test`
Expected: PASS, 29 tests across four files.

- [ ] **Step 8: Commit**

```bash
git add data/taxonomy.yaml agents packs
git commit -m "feat: six exemplar agents, starter taxonomy, and three packs"
```

---

### Tasks 6-10: Author the 1000 taxonomy entries

Five tasks, five categories each, 200 entries per task. Each task appends to `data/taxonomy.yaml`, runs `npm run validate` (structural, not `--complete`), and commits.

| Task | Categories |
|---|---|
| 6 | `engineering`, `data-ai`, `security`, `infrastructure-devops`, `design` |
| 7 | `product`, `marketing`, `sales`, `legal`, `finance` |
| 8 | `hr-people`, `operations`, `customer-support`, `healthcare`, `science-research` |
| 9 | `education`, `media-content`, `skilled-trades`, `construction-realestate`, `hospitality-food` |
| 10 | `transport-logistics`, `public-sector`, `energy-environment`, `agriculture`, `arts-entertainment` |

**Files (all five tasks):**
- Modify: `data/taxonomy.yaml`

**Interfaces:**
- Consumes: the schema and category slugs from Task 1, the validator from Task 3.
- Produces: taxonomy entries only. No markdown bodies — those are Phase 2.

**Authoring rules — these are what prevent 1000 entries from collapsing into mush:**

1. Exactly 40 entries per category. The five exemplar entries already written count toward their categories, so `engineering`, `design`, `legal`, `sales`, and `skilled-trades` each need 39 more.
2. Every title names a **job a real person holds**, not a capability or an adjective. "Penetration Tester" yes; "Security Helper" no.
3. Within a category, spread across sub-domains and seniority rather than listing synonyms. Before writing an entry, ask what it does that no other entry in the category does.
4. No two titles may differ only by a modifier — "Contract Lawyer" and "Contracts Attorney" are a duplicate, and the validator's title check will catch it as a hard failure.
5. `description` starts with a verb, is one sentence, under 200 characters, and names something specific to the role.
6. `tools` reflects how the job actually works: desk research roles get `WebSearch`; code roles get `Read, Write, Edit, Bash, Grep, Glob`; advisory roles get `Read, Write`. Every entry gets at least `Read, Write`.
7. Non-desk occupations (trades, agriculture, hospitality) are agents that advise, plan, diagnose, and specify — an agent cannot weld. This shapes their `Output` sections in Phase 2 and should shape their descriptions now.

**Worked example — `engineering`, all 40 titles.** Use this as the density and spread to match in every other category:

Backend Engineer · Frontend Engineer · Full Stack Engineer · Mobile Engineer (iOS) · Mobile Engineer (Android) · Embedded Systems Engineer · Firmware Engineer · Systems Programmer · Compiler Engineer · Game Engine Programmer · Graphics Engineer · Distributed Systems Engineer · Database Engineer · API Architect · Software Architect · Performance Engineer · Test Automation Engineer · QA Engineer · Build Engineer · Release Engineer · Developer Experience Engineer · Accessibility Engineer · Localization Engineer · Search Engineer · Payments Engineer · Streaming Media Engineer · Robotics Software Engineer · Control Systems Engineer · Simulation Engineer · Scientific Software Engineer · Blockchain Engineer · Browser Engineer · Operating Systems Engineer · Networking Protocol Engineer · CLI Tooling Engineer · Integration Engineer · Legacy Modernization Engineer · Technical Lead · Engineering Manager · Principal Engineer

Note the spread: platform, layer, domain, tooling, and seniority — not 40 flavours of web developer.

- [ ] **Step 1 (each task): Append 200 entries to `data/taxonomy.yaml`**

Follow the schema from Task 5 Step 1 exactly. Keep entries grouped by category and categories in the order given in the Global Constraints table.

- [ ] **Step 2 (each task): Validate structure**

Run: `npm run validate`
Expected: exit 0. Any duplicate slug or title fails here — fix before committing.

- [ ] **Step 3 (each task): Check the category counts**

Run: `npx tsx -e "import {loadTaxonomy} from './scripts/lib/taxonomy.js'; const t=loadTaxonomy('data/taxonomy.yaml'); const c={}; for(const e of t) c[e.category]=(c[e.category]??0)+1; console.table(c);"`
Expected: each completed category reads exactly 40.

- [ ] **Step 4 (each task): Commit**

```bash
git add data/taxonomy.yaml
git commit -m "feat: taxonomy entries for <category list>"
```

---

### Task 11: README, contributing guide, CI, and the complete gate

**Files:**
- Create: `README.md`, `CONTRIBUTING.md`, `.github/workflows/ci.yml`
- Modify: `package.json`

**Interfaces:**
- Consumes: everything above.
- Produces: a green `npm run validate -- --complete`.

- [ ] **Step 1: Turn on the complete gate and confirm 1000**

Run: `npm run validate -- --complete`
Expected: exit 0, `authored: 6 / 1000`, no count errors. If a category is off by one, fix the taxonomy before continuing — this is the last checkpoint before Phase 2 builds on it.

- [ ] **Step 2: Write the CI workflow**

`.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm test
      - run: npm run validate -- --complete
```

- [ ] **Step 3: Write the README**

Must cover, in this order: what Agent Force is; the progress line (`6 / 1000 authored`); **the context constraint** and why you install packs instead of copying `agents/` — with the explicit warning that 1000 agents in `.claude/agents/` adds ~25-30K tokens to every request; install commands for pack, named agents, and `--symlink`; the five-section agent format; how to run `validate`; and a pointer to `docs/superpowers/specs/`.

- [ ] **Step 4: Write CONTRIBUTING.md**

Must restate the seven house style rules from Task 5 and the seven authoring rules from Tasks 6-10, plus: run `npm run validate` before opening a PR, one category per PR, and never add a frontmatter key beyond `name`, `description`, `tools`.

- [ ] **Step 5: Run everything one final time**

```bash
npm test && npm run validate -- --complete
```
Expected: all tests pass, validation exits 0.

- [ ] **Step 6: Commit and open the PR**

```bash
git add README.md CONTRIBUTING.md .github package.json
git commit -m "docs: README, contributing guide, and CI with the complete gate"
git push -u origin phase-1/library
gh pr create --title "Phase 1: Agent Force library foundation" --body "$(cat <<'BODY'
Implements Phase 1 of docs/superpowers/specs/2026-09-20-agent-force-library-design.md.

- npm workspaces scaffold, TypeScript, vitest
- data/taxonomy.yaml: 1000 specialists across 25 categories + 1 overseer
- validator: uniqueness, referential integrity, section structure, --complete count gate
- installer: packs, named agents, copy or symlink
- 6 authored exemplar agents including overseer and customer-getter
- CI running tests + validate --complete

Phase 2 authors the remaining 994 agent bodies, one category per PR.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
BODY
)"
```

---

## Self-Review

**Spec coverage:** repo structure → Task 1, 5, 11. Agent file format → Task 2, 5. Taxonomy schema → Task 1, 5. 25×40 categories → Task 1 constants, Tasks 6-10. Overseer → Task 5. All eleven validation rules → Task 3. Install → Task 4. Packs → Task 5. Phase 1 scope (scaffold, taxonomy, validator tests-first, installer, packs, README, CI, 6 exemplars) → all tasks. Context constraint documented → Task 11 Step 3. No gaps found.

**Known deviations from the spec, deliberate:**
- Validator count rules gated behind `--complete` so intermediate commits stay green; CI runs `--complete`, so the spec's "CI-blocking" requirement still holds on `main`.
- Spec listed `CONTRIBUTING.md` without content requirements; Task 11 Step 4 specifies them.

**Type consistency:** `TaxonomyEntry`, `AgentFile`, `SectionName`, `ValidationResult`, `InstallOptions`, `InstallResult` are defined once and referenced identically throughout. `loadTaxonomy`, `parseAgentFile`, `validateLibrary`, `loadPacks`, `installAgents` keep the same signatures across every task that mentions them.

**Two deliberate traps** left in Tasks 3 and 4 (the misplaced `loadPacks` import, the `require` call in an ESM module), each flagged in the step that introduces it with the fix stated. They exist because both are mistakes a fresh implementer makes unprompted; naming them turns a debugging detour into a one-line correction.
