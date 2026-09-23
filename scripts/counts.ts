import { validateLibrary, SPECIALIST_TOTAL } from './lib/validate.js';
import { CATEGORY_SLUGS, OVERSEER_CATEGORY } from './lib/categories.js';

// Authored files on disk against taxonomy entries, per category.
const result = validateLibrary(process.cwd(), { complete: false });

console.log(`${OVERSEER_CATEGORY} ${result.overseerAuthored ? 1 : 0}/1`);
for (const slug of CATEGORY_SLUGS) {
  const bucket = result.byCategory[slug]!;
  console.log(`${slug} ${bucket.authored}/${bucket.total}`);
}
console.log(`\nauthored: ${result.authored + (result.overseerAuthored ? 1 : 0)} / ${SPECIALIST_TOTAL + 1}`);
