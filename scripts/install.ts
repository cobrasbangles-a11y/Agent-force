import { installAgents } from './lib/install.js';

function flag(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const dest = flag('dest');
if (!dest) {
  console.error('usage: npm run install:agents -- --pack <name>|--agents <a,b> --dest <dir> [--symlink] [--force]');
  process.exit(1);
}

try {
  const result = installAgents(process.cwd(), {
    pack: flag('pack'),
    agents: flag('agents')?.split(',').map((s) => s.trim()).filter(Boolean),
    dest,
    symlink: process.argv.includes('--symlink'),
    force: process.argv.includes('--force'),
  });
  for (const file of result.written) console.log(`  + ${file}`);
  for (const file of result.skipped) console.log(`  - ${file} (exists, use --force)`);
  console.log(`\n${result.written.length} installed, ${result.skipped.length} skipped.`);
} catch (err) {
  console.error(`error: ${(err as Error).message}`);
  process.exit(1);
}
