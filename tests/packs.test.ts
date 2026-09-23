import { describe, it, expect } from 'vitest';
import { mkdtempSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { loadPacks } from '../scripts/lib/packs.js';
import { installAgents } from '../scripts/lib/install.js';

// The shipped packs, not fixtures: each must be well formed, stay small
// enough to be cheap to load, and install cleanly.
const repo = resolve(__dirname, '..');
const packs = loadPacks(repo);

describe('shipped packs', () => {
  it('exist', () => {
    expect(packs.map((p) => p.file).sort()).toEqual(['dev-team.yaml', 'founder.yaml', 'growth.yaml']);
  });

  for (const pack of packs) {
    it(`${pack.file} is well formed, 8-12 agents, and installs`, () => {
      expect(pack.issues).toEqual([]);
      expect(pack.agents.length).toBeGreaterThanOrEqual(8);
      expect(pack.agents.length).toBeLessThanOrEqual(12);
      expect(pack.agents).toContain('overseer');
      const dest = mkdtempSync(join(tmpdir(), 'af-pack-'));
      const result = installAgents(repo, { pack: pack.file.replace(/\.yaml$/, ''), dest });
      expect(result.written.sort()).toEqual(pack.agents.map((s) => `${s}.md`).sort());
      expect(readdirSync(dest)).toHaveLength(pack.agents.length);
    });
  }
});
