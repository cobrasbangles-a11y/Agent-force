import { validateLibrary, SPECIALIST_TOTAL } from './lib/validate.js';
import { CATEGORY_SLUGS } from './lib/categories.js';

const complete = process.argv.includes('--complete');
const root = process.cwd();
const result = validateLibrary(root, { complete });

for (const error of result.errors) {
  console.error(`  ✗ ${error}`);
}

console.log(`\nauthored: ${result.authored} / ${SPECIALIST_TOTAL}`);
console.log(result.overseerAuthored ? 'overseer: authored' : 'overseer: not yet authored');

const partial = CATEGORY_SLUGS
  .map((slug) => {
    const bucket = result.byCategory[slug]!;
    return `${slug} ${bucket.authored}/${bucket.total}`;
  })
  .join('  ');
console.log(partial);

if (result.errors.length > 0) {
  console.error(`\n${result.errors.length} problem(s) found.`);
  process.exit(1);
}
console.log('\nvalidation passed.');
