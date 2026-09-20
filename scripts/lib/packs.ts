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
