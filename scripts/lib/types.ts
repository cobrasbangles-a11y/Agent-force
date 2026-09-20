export const SECTIONS = ['Role', 'Core expertise', 'Method', 'Output', 'Boundaries'] as const;
export type SectionName = (typeof SECTIONS)[number];

export interface TaxonomyEntry {
  slug: string;
  title: string;
  category: string;
  description: string;
  tools: string[];
}

export interface AgentFile {
  path: string;
  name: string;
  description: string;
  tools: string[];
  category: string;
  sections: Record<SectionName, string>;
}
