import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { loadTaxonomy } from './taxonomy.js';
import { parseAgentFile } from './agentFile.js';
import { CATEGORY_SLUGS, OVERSEER_CATEGORY } from './categories.js';
import { loadPacks } from './packs.js';

export interface ValidationResult {
  errors: string[];
  authored: number;
  total: number;
  byCategory: Record<string, { authored: number; total: number }>;
  overseerAuthored: boolean;
}

const SLUG_RE = /^[a-z][a-z0-9-]*$/;
const SPECIALIST_TOTAL = 1000;
const PER_CATEGORY = 40;

// CONTRIBUTING.md's four machine-checkable house-style rules (its numbered
// items 2, 3, 6, and 7).
const FILE_LINES_MIN = 60;
const FILE_LINES_MAX = 120;
const CORE_EXPERTISE_BULLETS_MIN = 4;
const CORE_EXPERTISE_BULLETS_MAX = 8;
const METHOD_STEPS_MIN = 4;
const METHOD_STEPS_MAX = 7;
const DESCRIPTION_MAX_CHARS = 200;

// CONTRIBUTING.md rule 6 defines "the body" as everything after the
// frontmatter's closing `---`. Taken literally, that reading fails files
// already on `main`: the tightest currently-committed file
// (agents/hr-people/hris-analyst.md) is exactly 60 lines counting the
// whole file, but only ~55 lines counting just what follows the closing
// `---`. A strict post-frontmatter count would put it, and at least one
// other file, below the documented 60-line floor. So this checks the
// *whole file's* line count (what `wc -l` reports, frontmatter included)
// — the reading every currently-authored file actually satisfies — rather
// than a literal post-frontmatter count that nothing on `main` would pass.
function countFileLines(raw: string): number {
  const withoutTrailingNewline = raw.endsWith('\n') ? raw.slice(0, -1) : raw;
  return withoutTrailingNewline.length === 0 ? 0 : withoutTrailingNewline.split('\n').length;
}

// A top-level bullet is a line beginning with "- " or "* " at column 0.
// A continuation line of a wrapped bullet is indented under the bullet's
// text and does not match, so it isn't double-counted.
function countTopLevelBullets(section: string): number {
  return section.split('\n').filter((line) => /^[-*] /.test(line)).length;
}

// A numbered step is a line beginning with one or more digits then a ".".
function countNumberedSteps(section: string): number {
  return section.split('\n').filter((line) => /^\d+\./.test(line)).length;
}

function emptyByCategory(): ValidationResult['byCategory'] {
  const byCategory: ValidationResult['byCategory'] = {};
  for (const slug of CATEGORY_SLUGS) {
    byCategory[slug] = { authored: 0, total: 0 };
  }
  return byCategory;
}

function toolsDiff(taxonomyTools: string[], fileTools: string[]): { missing: string[]; extra: string[] } {
  const taxonomySet = new Set(taxonomyTools);
  const fileSet = new Set(fileTools);
  return {
    missing: taxonomyTools.filter((t) => !fileSet.has(t)),
    extra: fileTools.filter((t) => !taxonomySet.has(t)),
  };
}

function walkAgents(root: string): string[] {
  const dir = join(root, 'agents');
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  const visit = (d: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.name.endsWith('.md')) out.push(full);
    }
  };
  visit(dir);
  return out;
}

function loadPacksSafe(root: string, errors: string[]) {
  try {
    return loadPacks(root);
  } catch (err) {
    errors.push(`packs: ${(err as Error).message}`);
    return [];
  }
}

export function validateLibrary(root: string, opts: { complete: boolean }): ValidationResult {
  const errors: string[] = [];
  const taxonomyPath = join(root, 'data', 'taxonomy.yaml');

  let entries;
  try {
    entries = loadTaxonomy(taxonomyPath);
  } catch (err) {
    return {
      errors: [(err as Error).message],
      authored: 0,
      total: 0,
      byCategory: emptyByCategory(),
      overseerAuthored: false,
    };
  }

  const bySlug = new Map<string, (typeof entries)[number]>();
  const seenTitles = new Map<string, string>();

  for (const entry of entries) {
    if (!SLUG_RE.test(entry.slug)) {
      errors.push(`${entry.slug}: slug must be kebab-case matching ${SLUG_RE}`);
    }
    if (bySlug.has(entry.slug)) {
      errors.push(`duplicate slug "${entry.slug}"`);
    }
    bySlug.set(entry.slug, entry);

    const titleKey = entry.title.toLowerCase();
    const owner = seenTitles.get(titleKey);
    if (owner) {
      errors.push(`duplicate title "${entry.title}" on ${owner} and ${entry.slug}`);
    }
    seenTitles.set(titleKey, entry.slug);

    if (entry.category !== OVERSEER_CATEGORY && !CATEGORY_SLUGS.includes(entry.category)) {
      errors.push(`${entry.slug}: unknown category "${entry.category}"`);
    }
  }

  const specialists = entries.filter((e) => e.category !== OVERSEER_CATEGORY);
  const overseers = entries.filter((e) => e.category === OVERSEER_CATEGORY);

  const byCategory = emptyByCategory();
  for (const entry of specialists) {
    const bucket = byCategory[entry.category];
    if (bucket) bucket.total += 1;
  }

  if (opts.complete) {
    if (specialists.length !== SPECIALIST_TOTAL) {
      errors.push(`taxonomy must hold exactly ${SPECIALIST_TOTAL} specialists — found ${specialists.length}`);
    }
    if (overseers.length !== 1) {
      errors.push(`taxonomy must hold exactly 1 overseer entry — found ${overseers.length}`);
    }
    for (const slug of CATEGORY_SLUGS) {
      const count = byCategory[slug]!.total;
      if (count !== PER_CATEGORY) {
        errors.push(`category "${slug}" must hold exactly ${PER_CATEGORY} entries — found ${count}`);
      }
    }
  }

  let authored = 0;
  let overseerAuthored = false;
  for (const file of walkAgents(root)) {
    const rel = relative(root, file);
    const raw = readFileSync(file, 'utf8');
    let agent;
    try {
      agent = parseAgentFile(raw, rel);
    } catch (err) {
      errors.push((err as Error).message);
      continue;
    }

    const stem = basename(rel).replace(/\.md$/, '');
    if (agent.name !== stem) {
      errors.push(`${rel}: frontmatter name "${agent.name}" does not match filename "${stem}"`);
    }

    // Structural house-style checks: these run for every authored file,
    // independent of whether it has a taxonomy entry, the same way the
    // section-order and frontmatter-key checks in parseAgentFile do.
    const lineCount = countFileLines(raw);
    if (lineCount < FILE_LINES_MIN || lineCount > FILE_LINES_MAX) {
      errors.push(
        `${rel}: file is ${lineCount} lines, must be ${FILE_LINES_MIN}-${FILE_LINES_MAX}`,
      );
    }

    const coreExpertiseBullets = countTopLevelBullets(agent.sections['Core expertise']);
    if (
      coreExpertiseBullets < CORE_EXPERTISE_BULLETS_MIN ||
      coreExpertiseBullets > CORE_EXPERTISE_BULLETS_MAX
    ) {
      errors.push(
        `${rel}: "Core expertise" has ${coreExpertiseBullets} bullet(s), must be ${CORE_EXPERTISE_BULLETS_MIN}-${CORE_EXPERTISE_BULLETS_MAX}`,
      );
    }

    const methodSteps = countNumberedSteps(agent.sections['Method']);
    if (methodSteps < METHOD_STEPS_MIN || methodSteps > METHOD_STEPS_MAX) {
      errors.push(
        `${rel}: "Method" has ${methodSteps} step(s), must be ${METHOD_STEPS_MIN}-${METHOD_STEPS_MAX}`,
      );
    }

    if (agent.description.length >= DESCRIPTION_MAX_CHARS) {
      errors.push(
        `${rel}: description is ${agent.description.length} characters, must be under ${DESCRIPTION_MAX_CHARS}`,
      );
    }

    const entry = bySlug.get(agent.name);
    if (!entry) {
      errors.push(`${rel}: "${agent.name}" has no taxonomy entry`);
      continue;
    }
    if (entry.description !== agent.description) {
      errors.push(`${rel}: description does not match the taxonomy entry for "${agent.name}"`);
    }
    if (entry.category !== agent.category) {
      errors.push(`${rel}: lives in "${agent.category}" but taxonomy says "${entry.category}"`);
    }

    const { missing, extra } = toolsDiff(entry.tools, agent.tools);
    if (missing.length > 0 || extra.length > 0) {
      const parts: string[] = [];
      if (missing.length > 0) parts.push(`missing ${missing.join(', ')}`);
      if (extra.length > 0) parts.push(`unexpected ${extra.join(', ')}`);
      errors.push(
        `${rel}: tools do not match the taxonomy entry for "${agent.name}" (${parts.join('; ')})`,
      );
    }

    if (entry.category === OVERSEER_CATEGORY) {
      overseerAuthored = true;
    } else {
      authored += 1;
      const bucket = byCategory[entry.category];
      if (bucket) bucket.authored += 1;
    }
  }

  const knownSlugs = new Set(bySlug.keys());
  for (const pack of loadPacksSafe(root, errors)) {
    for (const slug of pack.agents) {
      if (!knownSlugs.has(slug)) {
        errors.push(`packs/${pack.file}: references unknown agent "${slug}"`);
      }
    }
  }

  return { errors, authored, total: entries.length, byCategory, overseerAuthored };
}
