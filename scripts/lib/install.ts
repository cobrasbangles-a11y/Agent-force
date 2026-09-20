import { copyFileSync, existsSync, lstatSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
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

    if (existsSync(target) || pathExists(target)) {
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

function pathExists(path: string): boolean {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}
