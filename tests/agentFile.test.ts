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
