import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { validateLibrary } from '../scripts/lib/validate.js';
import { CATEGORY_SLUGS } from '../scripts/lib/categories.js';

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
