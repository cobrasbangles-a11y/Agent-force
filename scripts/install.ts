import { isAbsolute, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { installAgents } from './lib/install.js';

const USAGE =
  'usage: npm run install:agents -- (--pack <name> | --agents <a,b>) --dest <dir> [--symlink] [--force]';

// The library root is this script's parent folder, wherever it is run from.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// `npm run` always executes with the package root as cwd, so a relative
// --dest would land inside this repo. npm exposes the directory the user
// actually ran the command from as INIT_CWD; resolve relative paths there.
const invokedFrom = process.env.INIT_CWD ?? process.cwd();

let values;
try {
  ({ values } = parseArgs({
    options: {
      pack: { type: 'string' },
      agents: { type: 'string' },
      dest: { type: 'string' },
      symlink: { type: 'boolean', default: false },
      force: { type: 'boolean', default: false },
    },
    strict: true,
    allowPositionals: false,
  }));
} catch (err) {
  console.error(`error: ${(err as Error).message}\n${USAGE}`);
  process.exit(1);
}

if (!values.dest || values.dest.startsWith('--')) {
  console.error(USAGE);
  process.exit(1);
}
if (values.pack && values.agents) {
  console.error(`error: pass --pack or --agents, not both\n${USAGE}`);
  process.exit(1);
}

const dest = isAbsolute(values.dest) ? values.dest : resolve(invokedFrom, values.dest);

try {
  const result = installAgents(root, {
    pack: values.pack,
    agents: values.agents?.split(',').map((s) => s.trim()).filter(Boolean),
    dest,
    symlink: values.symlink,
    force: values.force,
  });
  console.log(`into ${dest}`);
  for (const file of result.written) console.log(`  + ${file}`);
  for (const file of result.skipped) console.log(`  - ${file} (exists, use --force)`);
  console.log(`\n${result.written.length} installed, ${result.skipped.length} skipped.`);
} catch (err) {
  console.error(`error: ${(err as Error).message}`);
  process.exit(1);
}
