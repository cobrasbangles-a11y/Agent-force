import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, lstatSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { installAgents, InstallError } from '../scripts/lib/install.js';

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

  it('rejects path traversal in slug', () => {
    writeFileSync(join(root, 'data', 'taxonomy.yaml'), `
- slug: ../evil
  title: Evil
  category: sales
  description: a
  tools: [Read]
`);
    mkdirSync(join(root, 'agents', 'sales', '..'), { recursive: true });
    writeFileSync(join(root, 'agents', 'sales', '../evil.md'), 'dangerous');
    expect(() => installAgents(root, { agents: ['../evil'], dest })).toThrow(/invalid slug/);
    // Verify nothing was written outside dest
    expect(existsSync(join(root, 'evil.md'))).toBe(false);
  });

  it('rejects path traversal in category', () => {
    writeFileSync(join(root, 'data', 'taxonomy.yaml'), `
- slug: traversal-agent
  title: Traversal Agent
  category: ../../tmp
  description: a
  tools: [Read]
`);
    expect(() => installAgents(root, { agents: ['traversal-agent'], dest })).toThrow(/invalid category/);
  });

  it('skips a dangling symlink without force', () => {
    // Create a symlink to a nonexistent target
    symlinkSync(join(root, 'agents', 'sales', 'customer-getter-nonexistent.md'), join(dest, 'customer-getter.md'));
    const result = installAgents(root, { agents: ['customer-getter'], dest });
    expect(result.written).toEqual([]);
    expect(result.skipped).toEqual(['customer-getter.md']);
    expect(lstatSync(join(dest, 'customer-getter.md')).isSymbolicLink()).toBe(true);
  });

  it('overwrites an existing symlink with force', () => {
    symlinkSync(join(root, 'agents', 'sales', 'customer-getter-nonexistent.md'), join(dest, 'customer-getter.md'));
    const result = installAgents(root, { agents: ['customer-getter'], dest, force: true });
    expect(result.written).toEqual(['customer-getter.md']);
    expect(lstatSync(join(dest, 'customer-getter.md')).isSymbolicLink()).toBe(false);
    expect(readFileSync(join(dest, 'customer-getter.md'), 'utf8')).toContain('name: customer-getter');
  });

  it('validates every agent in a multi-agent pack before writing any of them', () => {
    writeFileSync(join(root, 'data', 'taxonomy.yaml'), `
- slug: agent-one
  title: Agent One
  category: sales
  description: First agent, authored.
  tools: [Read]

- slug: agent-two
  title: Agent Two
  category: sales
  description: Second agent, not yet authored.
  tools: [Read]

- slug: agent-three
  title: Agent Three
  category: sales
  description: Third agent, authored.
  tools: [Read]
`);
    writeFileSync(join(root, 'agents', 'sales', 'agent-one.md'),
      `---\nname: agent-one\ndescription: First agent, authored.\ntools: Read\n---\n${BODY}`);
    // agent-two is in the taxonomy but has no authored .md file.
    writeFileSync(join(root, 'agents', 'sales', 'agent-three.md'),
      `---\nname: agent-three\ndescription: Third agent, authored.\ntools: Read\n---\n${BODY}`);
    writeFileSync(join(root, 'packs', 'trio.yaml'), 'name: Trio\nagents:\n  - agent-one\n  - agent-two\n  - agent-three\n');

    expect(() => installAgents(root, { pack: 'trio', dest })).toThrow(InstallError);
    expect(() => installAgents(root, { pack: 'trio', dest })).toThrow(/agent-two/);
    // The whole-pack validation must complete before any writes happen — agent-one
    // would have been written first by a naive validate-then-write-per-item loop.
    expect(existsSync(join(dest, 'agent-one.md'))).toBe(false);
    expect(existsSync(join(dest, 'agent-two.md'))).toBe(false);
    expect(existsSync(join(dest, 'agent-three.md'))).toBe(false);
  });

  it('resolves overseer agent to agents/overseer.md', () => {
    mkdirSync(join(root, 'agents'), { recursive: true });
    writeFileSync(join(root, 'data', 'taxonomy.yaml'), `
- slug: overseer
  title: Overseer
  category: overseer
  description: Master coordinator
  tools: [Read]
`);
    writeFileSync(join(root, 'agents', 'overseer.md'),
      `---\nname: overseer\ndescription: Master coordinator.\ntools: Read\n---\n${BODY}`);
    const result = installAgents(root, { agents: ['overseer'], dest });
    expect(result.written).toEqual(['overseer.md']);
    expect(existsSync(join(dest, 'overseer.md'))).toBe(true);
    expect(readFileSync(join(dest, 'overseer.md'), 'utf8')).toContain('name: overseer');
  });

  it('refuses a destination inside the library agents/ folder, leaving the source intact', () => {
    const source = join(root, 'agents', 'sales', 'customer-getter.md');
    const before = readFileSync(source, 'utf8');
    for (const target of [join(root, 'agents', 'sales'), join(root, 'agents'), join(root, 'agents', 'new-sub')]) {
      expect(() => installAgents(root, { agents: ['customer-getter'], dest: target, force: true })).toThrow(
        /inside the library's agents\/ folder/,
      );
      expect(() =>
        installAgents(root, { agents: ['customer-getter'], dest: target, force: true, symlink: true }),
      ).toThrow(InstallError);
    }
    expect(lstatSync(source).isSymbolicLink()).toBe(false);
    expect(readFileSync(source, 'utf8')).toBe(before);
    expect(existsSync(join(root, 'agents', 'new-sub'))).toBe(false);
  });

  it('refuses a symlinked destination that resolves into agents/', () => {
    const link = join(dest, 'sneaky');
    symlinkSync(join(root, 'agents', 'sales'), link);
    expect(() => installAgents(root, { agents: ['customer-getter'], dest: link, force: true })).toThrow(
      /inside the library's agents\/ folder/,
    );
    expect(existsSync(join(root, 'agents', 'sales', 'customer-getter.md'))).toBe(true);
  });

  it('throws on a pack that lists no agents', () => {
    writeFileSync(join(root, 'packs', 'empty.yaml'), 'name: Empty\nagents: []\n');
    expect(() => installAgents(root, { pack: 'empty', dest })).toThrow(/lists no agents/);
  });
});
