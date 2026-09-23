import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export interface Pack {
  file: string;
  name: string;
  agents: string[];
  /** Shape problems found while loading; reported by the validator. */
  issues: string[];
}

const PACK_KEYS = new Set(['name', 'description', 'agents']);

export function loadPacks(root: string): Pack[] {
  const dir = join(root, 'packs');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.ya?ml$/i.test(f))
    .sort()
    .map((f) => {
      const issues: string[] = [];
      if (!f.endsWith('.yaml')) issues.push('pack files must use the .yaml extension');
      const raw: unknown = parse(readFileSync(join(dir, f), 'utf8')) ?? {};
      const obj = (typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? raw : {}) as Record<string, unknown>;
      if (obj !== raw) issues.push('pack must be a mapping with name and agents');
      for (const key of Object.keys(obj)) {
        if (!PACK_KEYS.has(key)) issues.push(`unknown key "${key}" (allowed: ${[...PACK_KEYS].join(', ')})`);
      }
      const agents = Array.isArray(obj.agents) ? obj.agents.map(String) : [];
      if (!Array.isArray(obj.agents)) issues.push('"agents" must be a list of agent slugs');
      else if (agents.length === 0) issues.push('"agents" is empty');
      const seen = new Set<string>();
      for (const slug of agents) {
        if (seen.has(slug)) issues.push(`lists "${slug}" more than once`);
        seen.add(slug);
      }
      return {
        file: f,
        name: typeof obj.name === 'string' ? obj.name : f.replace(/\.ya?ml$/i, ''),
        agents,
        issues,
      };
    });
}
