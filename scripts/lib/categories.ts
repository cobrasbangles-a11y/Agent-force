export interface Category {
  slug: string;
  summary: string;
}

// Summaries are consumed by the app's overseer during stage-A team selection.
export const CATEGORIES: Category[] = [
  { slug: 'engineering', summary: 'Software engineering across languages, platforms, and layers' },
  { slug: 'data-ai', summary: 'Data engineering, analytics, ML, and AI systems' },
  { slug: 'security', summary: 'Offensive, defensive, and governance security' },
  { slug: 'infrastructure-devops', summary: 'Cloud, platform, SRE, networking, and release' },
  { slug: 'design', summary: 'Product, visual, brand, motion, and industrial design' },
  { slug: 'product', summary: 'Product management, research, and product analytics' },
  { slug: 'marketing', summary: 'Brand, growth, content, performance, and lifecycle marketing' },
  { slug: 'sales', summary: 'Prospecting, closing, partnerships, and revenue operations' },
  { slug: 'legal', summary: 'Transactional, litigation, regulatory, and IP practice' },
  { slug: 'finance', summary: 'Accounting, FP&A, treasury, tax, and investment' },
  { slug: 'hr-people', summary: 'Recruiting, HR ops, L&D, compensation, employee relations' },
  { slug: 'operations', summary: 'Business operations, program management, quality, process' },
  { slug: 'customer-support', summary: 'Support, success, onboarding, and escalations' },
  { slug: 'healthcare', summary: 'Clinical, allied health, veterinary, diagnostics, and health administration' },
  { slug: 'science-research', summary: 'Physical, life, earth, and social sciences research' },
  { slug: 'education', summary: 'Teaching, curriculum, instructional design, and administration' },
  { slug: 'media-content', summary: 'Writing, editing, journalism, publishing, and localization' },
  { slug: 'skilled-trades', summary: 'Electrical, plumbing, welding, HVAC, machining, and repair' },
  { slug: 'construction-realestate', summary: 'Building, surveying, estimating, and property' },
  { slug: 'hospitality-food', summary: 'Culinary, beverage, lodging, events, and service' },
  { slug: 'transport-logistics', summary: 'Freight, fleet, warehousing, customs, and transit' },
  { slug: 'public-sector', summary: 'Government, policy, emergency services, and nonprofit' },
  { slug: 'energy-environment', summary: 'Power, renewables, extraction, and environmental work' },
  { slug: 'agriculture', summary: 'Crops, livestock, forestry, fisheries, and agtech' },
  { slug: 'arts-entertainment', summary: 'Performing arts, film, music, galleries, and game narrative' },
];

export const CATEGORY_SLUGS: string[] = CATEGORIES.map((c) => c.slug);
export const OVERSEER_CATEGORY = 'overseer';
