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

  it('normalizes whitespace in multi-line descriptions', () => {
    const p = fixture(`
- slug: folded-desc
  title: Folded Desc
  category: sales
  description: |-
    Finds, qualifies, and lands new
    customers end to end across
    several lines.
  tools: [Read]
`);
    const entries = loadTaxonomy(p);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.description).toBe(
      'Finds, qualifies, and lands new customers end to end across several lines.'
    );
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
