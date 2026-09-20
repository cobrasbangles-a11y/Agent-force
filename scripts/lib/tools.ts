export const ALLOWED_TOOLS = [
  'Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep',
  'WebSearch', 'WebFetch', 'NotebookEdit', 'TodoWrite', 'Task',
] as const;

export type ToolName = (typeof ALLOWED_TOOLS)[number];

export function isToolName(value: string): value is ToolName {
  return (ALLOWED_TOOLS as readonly string[]).includes(value);
}
