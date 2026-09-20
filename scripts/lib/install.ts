import { copyFileSync, existsSync, lstatSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { loadTaxonomy } from './taxonomy.js';
import { loadPacks } from './packs.js';
import { CATEGORY_SLUGS } from './categories.js';

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

export function resolveAgents(root: string, opts: InstallOptions): string[] {
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

  // Validate all slugs before any filesystem operations
  for (const slug of slugs) {
    const entry = bySlug.get(slug);
    if (!entry) throw new InstallError(`unknown agent "${slug}"`);

    // Guard 1: slug must match kebab-case pattern
    if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
      throw new InstallError(`invalid slug "${slug}" (must match ^[a-z][a-z0-9-]*$)`);
    }

    // Guard 2: category must be valid
    if (entry.category !== 'overseer' && !CATEGORY_SLUGS.includes(entry.category)) {
      throw new InstallError(`invalid category "${entry.category}" for agent "${slug}"`);
    }

    const source =
      entry.category === 'overseer'
        ? join(root, 'agents', `${slug}.md`)
        : join(root, 'agents', entry.category, `${slug}.md`);

    if (!existsSync(source)) {
      throw new InstallError(`"${slug}" is in the taxonomy but not yet authored`);
    }
  }

  return slugs;
}

export function installAgents(root: string, opts: InstallOptions): InstallResult {
  // Validate all agents first - prevents partial installs on logical failures
  const slugs = resolveAgents(root, opts);
  const entries = loadTaxonomy(join(root, 'data', 'taxonomy.yaml'));
  const bySlug = new Map(entries.map((e) => [e.slug, e]));

  mkdirSync(opts.dest, { recursive: true });
  const resolvedDest = resolve(opts.dest);

  const written: string[] = [];
  const skipped: string[] = [];

  for (const slug of slugs) {
    const entry = bySlug.get(slug)!; // Safe: resolveAgents already validated

    const source =
      entry.category === 'overseer'
        ? join(root, 'agents', `${slug}.md`)
        : join(root, 'agents', entry.category, `${slug}.md`);

    const filename = `${slug}.md`;
    const target = join(opts.dest, filename);
    const resolvedTarget = resolve(target);

    // Guard 3: ensure target is within dest (defense in depth)
    if (!resolvedTarget.startsWith(resolvedDest + '/') && resolvedTarget !== resolvedDest) {
      throw new InstallError(`path escape attempt: target "${slug}.md" would write outside destination`);
    }

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
