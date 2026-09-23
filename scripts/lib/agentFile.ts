import { basename, dirname } from 'node:path';
import { parse } from 'yaml';
import { SECTIONS, type AgentFile, type SectionName } from './types.js';
import { isToolName } from './tools.js';

export class AgentFileError extends Error {}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
const ALLOWED_KEYS = new Set(['name', 'description', 'tools']);

export function parseAgentFile(raw: string, path: string): AgentFile {
  const match = FRONTMATTER.exec(raw);
  if (!match) {
    throw new AgentFileError(`${path}: missing YAML frontmatter delimited by ---`);
  }
  const [, head, body] = match as unknown as [string, string, string];

  let meta: unknown;
  try {
    meta = parse(head);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new AgentFileError(`${path}: malformed YAML frontmatter: ${message}`);
  }
  if (typeof meta !== 'object' || meta === null || Array.isArray(meta)) {
    throw new AgentFileError(`${path}: frontmatter must be a mapping`);
  }
  const fields = meta as Record<string, unknown>;
  for (const key of Object.keys(fields)) {
    if (!ALLOWED_KEYS.has(key)) {
      throw new AgentFileError(
        `${path}: unknown frontmatter key "${key}" — only name, description, tools are allowed`,
      );
    }
  }
  const { name, description, tools: toolList } = fields;
  if (typeof name !== 'string' || name.trim() === '') {
    throw new AgentFileError(`${path}: missing or empty "name"`);
  }
  if (typeof description !== 'string' || description.trim() === '') {
    throw new AgentFileError(`${path}: missing or empty "description"`);
  }
  if (typeof toolList !== 'string' || toolList.trim() === '') {
    throw new AgentFileError(`${path}: "tools" must be a comma-separated string`);
  }

  const tools = toolList.split(',').map((t) => t.trim()).filter(Boolean);
  for (const tool of tools) {
    if (!isToolName(tool)) {
      throw new AgentFileError(`${path}: "${tool}" is not a Claude Code tool`);
    }
  }

  const parent = basename(dirname(path));
  const category = parent === 'agents' ? 'overseer' : parent;

  return {
    path,
    name: name.trim(),
    description: description.replace(/\s+/g, ' ').trim(),
    tools,
    category,
    sections: parseSections(body, path),
  };
}

function maskFencedBlocks(body: string): string {
  const lines = body.split('\n');
  let inFence = false;
  const masked = lines.map((line) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      inFence = !inFence;
      return ' '.repeat(line.length);
    }
    if (inFence) {
      return line.replace(/[^\n\r]/g, ' ');
    }
    return line;
  }).join('\n');
  return masked;
}

function parseSections(body: string, path: string): Record<SectionName, string> {
  const masked = maskFencedBlocks(body);
  const found = [...masked.matchAll(/^# (.+)$/gm)].map((m) => ({
    title: (m[1] ?? '').trim(),
    start: m.index ?? 0,
    end: 0,
  }));

  for (let i = 0; i < found.length; i++) {
    found[i]!.end = i + 1 < found.length ? found[i + 1]!.start : body.length;
  }

  const titles = found.map((s) => s.title);
  for (const required of SECTIONS) {
    if (!titles.includes(required)) {
      throw new AgentFileError(`${path}: missing required section "# ${required}"`);
    }
  }
  if (titles.join('|') !== SECTIONS.join('|')) {
    throw new AgentFileError(
      `${path}: sections must be exactly ${SECTIONS.join(', ')} in that order — found ${titles.join(', ')}`,
    );
  }

  const sections = {} as Record<SectionName, string>;
  for (const section of found) {
    const text = body.slice(section.start, section.end).replace(/^# .+$/m, '').trim();
    if (text === '') {
      throw new AgentFileError(`${path}: section "# ${section.title}" is empty`);
    }
    sections[section.title as SectionName] = text;
  }
  return sections;
}
