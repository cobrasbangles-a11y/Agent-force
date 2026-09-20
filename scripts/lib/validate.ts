import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadTaxonomy } from './taxonomy.js';
import { parseAgentFile } from './agentFile.js';
import { CATEGORY_SLUGS, OVERSEER_CATEGORY } from './categories.js';
import { loadPacks } from './packs.js';

export interface ValidationResult {
  errors: string[];
  authored: number;
  total: number;
  byCategory: Record<string, { authored: number; total: number }>;
}

const SLUG_RE = /^[a-z][a-z0-9-]*$/;
const SPECIALIST_TOTAL = 1000;
const PER_CATEGORY = 40;

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
    const byCategory: ValidationResult['byCategory'] = {};
    for (const slug of CATEGORY_SLUGS) {
      byCategory[slug] = { authored: 0, total: 0 };
    }
    return {
      errors: [(err as Error).message],
      authored: 0,
      total: 0,
      byCategory,
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

  const byCategory: ValidationResult['byCategory'] = {};
  for (const slug of CATEGORY_SLUGS) {
    byCategory[slug] = { authored: 0, total: 0 };
  }
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
  for (const file of walkAgents(root)) {
    const rel = relative(root, file);
    let agent;
    try {
      agent = parseAgentFile(readFileSync(file, 'utf8'), rel);
    } catch (err) {
      errors.push((err as Error).message);
      continue;
    }

    const stem = rel.split('/').pop()!.replace(/\.md$/, '');
    if (agent.name !== stem) {
      errors.push(`${rel}: frontmatter name "${agent.name}" does not match filename "${stem}"`);
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
    if (entry.tools.join(',') !== agent.tools.join(',')) {
      errors.push(`${rel}: tools do not match the taxonomy entry for "${agent.name}"`);
    }

    authored += 1;
    const bucket = byCategory[entry.category];
    if (bucket) bucket.authored += 1;
  }

  const knownSlugs = new Set(bySlug.keys());
  for (const pack of loadPacksSafe(root, errors)) {
    for (const slug of pack.agents) {
      if (!knownSlugs.has(slug)) {
        errors.push(`packs/${pack.file}: references unknown agent "${slug}"`);
      }
    }
  }

  return { errors, authored, total: entries.length, byCategory };
}
