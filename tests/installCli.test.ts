import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

// Drives the real CLI the way `npm run install:agents` does: npm sets the
// cwd to the package root and passes the user's directory as INIT_CWD.
const repo = resolve(__dirname, '..');
const tsx = join(repo, 'node_modules', '.bin', 'tsx');

function run(args: string[], initCwd: string) {
  try {
    const stdout = execFileSync(tsx, ['scripts/install.ts', ...args], {
      cwd: repo,
      env: { ...process.env, INIT_CWD: initCwd },
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, out: stdout };
  } catch (err) {
    const e = err as { status: number; stdout: string; stderr: string };
    return { code: e.status, out: e.stdout + e.stderr };
  }
}

describe('install CLI', () => {
  it("resolves a relative --dest against the user's directory, not the library repo", () => {
    const project = mkdtempSync(join(tmpdir(), 'af-proj-'));
    const result = run(['--agents', 'customer-getter', '--dest', './.claude/agents'], project);
    expect(result.code).toBe(0);
    expect(readdirSync(join(project, '.claude', 'agents'))).toEqual(['customer-getter.md']);
    expect(existsSync(join(repo, '.claude', 'agents', 'customer-getter.md'))).toBe(false);
  });

  it('rejects unknown flags, a flag in place of a value, and --pack with --agents', () => {
    const project = mkdtempSync(join(tmpdir(), 'af-proj-'));
    expect(run(['--agents', 'customer-getter', '--dest', '.', '--frce'], project).code).toBe(1);
    expect(run(['--agents', 'customer-getter', '--dest', '--force'], project).code).toBe(1);
    expect(existsSync(join(project, '--force'))).toBe(false);
    const both = run(['--pack', 'founder', '--agents', 'customer-getter', '--dest', '.'], project);
    expect(both.code).toBe(1);
    expect(both.out).toMatch(/not both/);
  });
});
