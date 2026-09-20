import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import type { TaxonomyEntry } from './types.js';
import { isToolName } from './tools.js';

export class TaxonomyError extends Error {}

const STRING_FIELDS = ['slug', 'title', 'category', 'description'] as const;

export function loadTaxonomy(path: string): TaxonomyEntry[] {
  const raw = parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(raw)) {
    throw new TaxonomyError(`${path}: taxonomy root must be a list of entries`);
  }

  return raw.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new TaxonomyError(`${path}: entry ${index} is not a mapping`);
    }
    const label = typeof item.slug === 'string' ? item.slug : `entry ${index}`;

    for (const field of STRING_FIELDS) {
      const value = item[field];
      if (typeof value !== 'string' || value.trim() === '') {
        throw new TaxonomyError(`${label}: missing or empty "${field}"`);
      }
    }

    if (!Array.isArray(item.tools) || item.tools.length === 0) {
      throw new TaxonomyError(`${label}: "tools" must be a non-empty list`);
    }
    for (const tool of item.tools) {
      if (typeof tool !== 'string' || !isToolName(tool)) {
        throw new TaxonomyError(`${label}: "${String(tool)}" is not a Claude Code tool`);
      }
    }

    return {
      slug: item.slug,
      title: item.title,
      category: item.category,
      description: item.description.replace(/\s+/g, ' ').trim(),
      tools: [...item.tools],
    };
  });
}
