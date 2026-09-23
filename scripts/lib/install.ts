import { copyFileSync, existsSync, lstatSync, mkdirSync, realpathSync, rmSync, symlinkSync } from 'node:fs';
import { basename, join, resolve, sep } from 'node:path';
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
    if (pack.agents.length === 0) throw new InstallError(`pack "${opts.pack}" lists no agents`);
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

  // Never install into the library itself: with --force, the "existing"
  // target would be the source file, which rmSync would delete before the
  // copy (or, with --symlink, replace with a link to itself). Compare real
  // paths so a symlinked destination can't slip past the check.
  const agentsDir = realpathOrResolve(join(root, 'agents'));
  const intendedDest = realpathOrResolve(opts.dest);
  if (intendedDest === agentsDir || intendedDest.startsWith(agentsDir + sep)) {
    throw new InstallError(`--dest "${opts.dest}" is inside the library's agents/ folder; install into a project's .claude/agents/ instead`);
  }

  mkdirSync(opts.dest, { recursive: true });
  const resolvedDest = realpathOrResolve(opts.dest);
  if (resolvedDest === agentsDir || resolvedDest.startsWith(agentsDir + sep)) {
    throw new InstallError(`--dest "${opts.dest}" resolves inside the library's agents/ folder`);
  }

  const written: string[] = [];
  const skipped: string[] = [];

  for (const slug of slugs) {
    const entry = bySlug.get(slug)!; // Safe: resolveAgents already validated

    const source =
      entry.category === 'overseer'
        ? join(root, 'agents', `${slug}.md`)
        : join(root, 'agents', entry.category, `${slug}.md`);

    const filename = `${slug}.md`;
    const target = join(resolvedDest, filename);
    const resolvedTarget = resolve(target);

    // Guard 3: ensure target is within dest (defense in depth)
    if (!resolvedTarget.startsWith(resolvedDest + sep) && resolvedTarget !== resolvedDest) {
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

// realpath for the longest existing prefix of `path`, with the rest appended,
// so a destination that doesn't exist yet still resolves through symlinks.
function realpathOrResolve(path: string): string {
  const abs = resolve(path);
  let head = abs;
  const tail: string[] = [];
  while (!existsSync(head)) {
    const parent = resolve(head, '..');
    if (parent === head) return abs;
    tail.unshift(basename(head));
    head = parent;
  }
  return join(realpathSync(head), ...tail);
}

function pathExists(path: string): boolean {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}
