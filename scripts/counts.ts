import { loadTaxonomy } from './lib/taxonomy.js';
import { CATEGORY_SLUGS, OVERSEER_CATEGORY } from './lib/categories.js';

const root = process.cwd();
const entries = loadTaxonomy(`${root}/data/taxonomy.yaml`);

const byCategory: Record<string, number> = {};
for (const entry of entries) {
  byCategory[entry.category] = (byCategory[entry.category] ?? 0) + 1;
}

const overseerCount = byCategory[OVERSEER_CATEGORY] ?? 0;
console.log(`${OVERSEER_CATEGORY} ${overseerCount}/1`);

for (const slug of CATEGORY_SLUGS) {
  console.log(`${slug} ${byCategory[slug] ?? 0}/40`);
}

console.log(`\ntotal: ${entries.length} / 1001`);
