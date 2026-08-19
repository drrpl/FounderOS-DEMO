/**
 * The life map: the radial taxonomy at the heart of the OS, one per company.
 * Center = Ramesh's life; ring 1 = color-coded life areas; ring 2 = the
 * modules inside each area. Communication additionally carries the contact
 * tier system — the numbered/colored response-priority ladder for people.
 *
 * This is the one place colors enter the otherwise black & white OS: each
 * life area owns a hue, and everything underneath inherits it. The seven
 * areas (marketing/sales/finances/communication/clients/knowledge/operations)
 * are a universal business skeleton reused across all three companies; what
 * differs per workspace is which agents/modules/departments actually fill
 * them in — ILS's is real and populated, Eloan4Home's and Real Estate OS's
 * are honestly thin scaffolds (each source workspace's agents/README.md
 * says "empty by design").
 *
 * Kept free of server-only imports (next/headers) — client components read
 * these too. Server call sites resolve the current workspace themselves
 * (lib/workspace-context.ts) and pass the id in explicitly.
 */
import type { LifeMap, LifeMapNode } from '@/lib/schemas';
import { DEFAULT_WORKSPACE_ID, type WorkspaceId } from '@/lib/workspaces';

export type LifeModule = { id: string; label: string; detail: string };

export type LifeArea = {
  id: string;
  label: string;
  color: string;
  detail: string;
  modules: LifeModule[];
  agents: string[]; // RuntimeAgent ids working this area, in this workspace
  brainFolders: string[]; // brain-store folders feeding this area
  departmentIds: string[]; // this workspace's seeded departments that roll up to this area
};

const ILS_LIFE_AREAS: LifeArea[] = [
  {
    id: 'marketing',
    label: 'Marketing',
    color: '#f59e0b',
    detail: 'Everything that earns attention.',
    modules: [
      { id: 'content', label: 'Content', detail: 'LinkedIn posts and thought leadership — the primary organic channel.' },
      { id: 'email', label: 'Email', detail: 'Landing-page and email copy for the funnel.' },
      { id: 'newsletter', label: 'Newsletter', detail: 'Planned ongoing send — not yet running.' },
      { id: 'video', label: 'Video', detail: 'YouTube and speaking engagements — planned, not yet a cadence.' },
      { id: 'campaigns', label: 'Campaigns', detail: 'Timed pushes around the complimentary session or the LEVERAGE course.' },
    ],
    agents: [
      'marketing-director',
      'brand-positioning',
      'content-strategy',
      'linkedin',
      'copywriting',
      'campaign-management',
      'lead-nurture',
      'marketing-analytics',
    ],
    brainFolders: ['media', 'writing', 'ideas'],
    departmentIds: ['dept-marketing-brand'],
  },
  {
    id: 'sales',
    label: 'Sales',
    color: '#ef4444',
    detail: 'The complimentary-session pipeline and the coaching close.',
    modules: [
      { id: 'pipeline', label: 'Pipeline', detail: 'Where prospects sit across the funnel — blocked on the CRM workflow audit.' },
      { id: 'qualification', label: 'Qualification', detail: 'Screening inbound interest against the 6 real qualification criteria.' },
      { id: 'follow-up', label: 'Follow-up', detail: 'Outstanding proposals and post-session interest.' },
      { id: 'proposals', label: 'Proposals', detail: 'Scope, cadence, and investment for 1:1 coaching.' },
    ],
    agents: ['lead-qualification', 'discovery-preparation', 'proposal', 'sales-follow-up', 'pipeline'],
    brainFolders: ['people', 'companies'],
    departmentIds: ['dept-sales-bd'],
  },
  {
    id: 'finances',
    label: 'Finances',
    color: '#22c55e',
    detail: 'Pricing is real; unit economics and billing are not yet tracked.',
    modules: [
      { id: 'pricing', label: 'Pricing', detail: 'Course + coaching pricing — the one real number.' },
      { id: 'unit-economics', label: 'Unit economics', detail: 'LTV:CAC and gross margin — not tracked yet.' },
      { id: 'billing', label: 'Billing', detail: 'The actual billing system isn’t even confirmed yet.' },
    ],
    agents: ['financial-analysis', 'revenue-forecasting', 'billing-review'],
    brainFolders: ['companies'],
    departmentIds: ['dept-finance'],
  },
  {
    id: 'communication',
    label: 'Communication',
    color: '#3b82f6',
    detail: 'Every person, one priority ladder — no unified inbox exists yet at ILS.',
    modules: [
      {
        id: 'client-management',
        label: 'Client management',
        detail: 'Tagged people with response tiers — who needs an answer ASAP.',
      },
      { id: 'inbox', label: 'Inbox', detail: 'No unified inbox yet — email is handled directly.' },
      { id: 'meetings', label: 'Meetings', detail: 'Coaching session notes and follow-ups.' },
    ],
    // No dedicated comms department or unified-inbox agent exists yet — left
    // honestly unstaffed rather than forcing a fit onto an agent whose real
    // job is something else.
    agents: [],
    brainFolders: ['inbox', 'meetings', 'people'],
    departmentIds: [],
  },
  {
    id: 'clients',
    label: 'Clients',
    color: '#14b8a6',
    detail: 'Every client and course member, onboarded and served.',
    modules: [
      { id: 'onboarding', label: 'Onboarding', detail: 'Designed for new course members and coaching clients — none exists today.' },
      { id: 'coaching', label: 'Coaching', detail: 'Session prep, recaps, and the accountability rhythm.' },
      { id: 'curriculum', label: 'Curriculum', detail: 'The LEVERAGE Framework’s 10 modules, Locate through Expand.' },
      { id: 'health', label: 'Client health', detail: 'Retention risk — reported honestly as "not enough data" today.' },
    ],
    // Programs & Curriculum is placed here rather than under Knowledge: a
    // member's module progression is part of their client journey, not
    // ILS's own research/knowledge base.
    agents: [
      'client-onboarding',
      'coaching-preparation',
      'session-follow-up',
      'accountability',
      'client-health',
      'curriculum',
      'leverage-framework',
      'assessment',
      'learning-materials',
    ],
    brainFolders: ['people', 'companies'],
    departmentIds: ['dept-client-success', 'dept-programs-curriculum'],
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    color: '#a855f7',
    detail: 'Company, market, and competitive research, plus the DBA research pool.',
    modules: [
      { id: 'company-research', label: 'Company research', detail: 'Per-prospect research ahead of a complimentary session.' },
      { id: 'market-intel', label: 'Market intelligence', detail: 'How the ICP talks about scaling and leadership — the market_research_brief gap.' },
      { id: 'dba-pool', label: 'DBA research', detail: 'Citable concepts from Ramesh’s dissertation, sourced per INV-8.' },
      { id: 'knowledge-mgmt', label: 'Knowledge management', detail: 'The reference/ folder as a pointer into the shared research pool.' },
    ],
    agents: ['company-research', 'market-intelligence', 'competitive-intelligence', 'strategic-research', 'knowledge-management'],
    brainFolders: ['concepts', 'prompts', 'sources', 'archive'],
    // dept-tech-ai rolls up to knowledge first (lifeAreaForDepartment takes
    // the first match, and knowledge is listed before operations below);
    // operations still owns its own agents from that department directly.
    departmentIds: ['dept-research-bi', 'dept-tech-ai'],
  },
  {
    id: 'operations',
    label: 'Operations',
    color: '#fafafa',
    detail: 'SOPs, the CRM workflow catalog, and quality control.',
    modules: [
      { id: 'sops', label: 'SOPs', detail: 'ILS’s real, already-running CRM processes, documented from observed patterns.' },
      { id: 'workflows', label: 'Workflows', detail: 'The live catalog of 18 Coach Foundation CRM automations.' },
      { id: 'quality', label: 'Quality control', detail: 'Spot-checks against INV-1, INV-2, and INV-3.' },
      { id: 'automation', label: 'Automation', detail: 'Technical build side of ILS’s CRM automations, once the audit is complete.' },
    ],
    agents: ['operations-manager', 'sop', 'workflow', 'quality-control', 'automation', 'crm'],
    brainFolders: ['org', 'projects'],
    departmentIds: ['dept-operations', 'dept-tech-ai'],
  },
];

// Eloan4Home (Encoded Businesses/Eloan4Home, scaffold built 2026-08-12): sole
// Broker/Loan Officer, no agents or skills yet — the same 7-area skeleton
// with everything honestly empty except the one real department it rolls up to.
const ELOAN4HOME_LIFE_AREAS: LifeArea[] = [
  { id: 'marketing', label: 'Marketing', color: '#f59e0b', detail: 'Borrower- and realtor-partner-facing marketing — not yet systematized.', modules: [], agents: [], brainFolders: [], departmentIds: [] },
  { id: 'sales', label: 'Sales', color: '#ef4444', detail: 'Lead to funded loan — Prospects through Closed in Encompass.', modules: [], agents: [], brainFolders: [], departmentIds: ['dept-lending'] },
  { id: 'finances', label: 'Finances', color: '#22c55e', detail: 'Rates, APRs, and fees come from a live pricing engine (Encompass/Loanzify), never estimated.', modules: [], agents: [], brainFolders: [], departmentIds: [] },
  { id: 'communication', label: 'Communication', color: '#3b82f6', detail: 'Borrower and realtor-partner communication — no unified inbox yet.', modules: [], agents: [], brainFolders: [], departmentIds: [] },
  { id: 'clients', label: 'Clients', color: '#14b8a6', detail: 'Borrowers across the Encompass pipeline: Prospect, Processing, Closed, Withdrawn, Adverse.', modules: [], agents: [], brainFolders: [], departmentIds: ['dept-lending'] },
  { id: 'knowledge', label: 'Knowledge', color: '#a855f7', detail: 'Loan-program one-pagers and compliance quick-reference — not yet populated.', modules: [], agents: [], brainFolders: [], departmentIds: [] },
  { id: 'operations', label: 'Operations', color: '#fafafa', detail: 'Licensing (NMLS #237685) and compliance — fair lending, RESPA/TILA.', modules: [], agents: [], brainFolders: [], departmentIds: ['dept-lending'] },
];

// Real Estate OS (Encoded Businesses/Real Estate OS, scaffold built
// 2026-08-13): three divisions at very different maturity. No agents or
// skills yet — Development and Temp Housing stay labeled dormant throughout,
// never blended with Brokerage's live track record.
const REAL_ESTATE_LIFE_AREAS: LifeArea[] = [
  { id: 'marketing', label: 'Marketing', color: '#f59e0b', detail: 'Buyer/seller/investor-facing marketing for the active Brokerage line.', modules: [], agents: [], brainFolders: [], departmentIds: [] },
  { id: 'sales', label: 'Sales', color: '#ef4444', detail: 'Brokerage transactions — the only division with live deal flow.', modules: [], agents: [], brainFolders: [], departmentIds: ['dept-brokerage'] },
  { id: 'finances', label: 'Finances', color: '#22c55e', detail: 'Valuations, comps, and ROI come from real MLS data, never estimated.', modules: [], agents: [], brainFolders: [], departmentIds: [] },
  { id: 'communication', label: 'Communication', color: '#3b82f6', detail: 'Buyer, seller, partner, and vendor communication — no unified inbox yet.', modules: [], agents: [], brainFolders: [], departmentIds: [] },
  { id: 'clients', label: 'Clients', color: '#14b8a6', detail: 'Brokerage clients today; Temp Housing residents once Agginym goes active.', modules: [], agents: [], brainFolders: [], departmentIds: ['dept-brokerage', 'dept-temp-housing'] },
  { id: 'knowledge', label: 'Knowledge', color: '#a855f7', detail: 'Cornell Real Estate Development coursework and the Temp Housing reference pool (vendor roster, compliance).', modules: [], agents: [], brainFolders: [], departmentIds: ['dept-development', 'dept-temp-housing'] },
  { id: 'operations', label: 'Operations', color: '#fafafa', detail: 'Broker sovereignty (License #01321444) across whichever brokerage-organization affiliation is current.', modules: [], agents: [], brainFolders: [], departmentIds: ['dept-brokerage'] },
];

const LIFE_AREAS_BY_WORKSPACE: Record<WorkspaceId, LifeArea[]> = {
  ils: ILS_LIFE_AREAS,
  eloan4home: ELOAN4HOME_LIFE_AREAS,
  'real-estate-os': REAL_ESTATE_LIFE_AREAS,
};

export function getLifeAreas(workspaceId: WorkspaceId = DEFAULT_WORKSPACE_ID): LifeArea[] {
  return LIFE_AREAS_BY_WORKSPACE[workspaceId] ?? LIFE_AREAS_BY_WORKSPACE[DEFAULT_WORKSPACE_ID];
}

export type ContactTier = {
  tier: number;
  label: string;
  color: string;
  respond: string;
  tags: string[];
};

/**
 * The response-priority ladder for people Ramesh talks to. Shared across
 * companies — it's a priority scheme, not company-specific content.
 * 1 = red (clients & students), 2 = yellow (brand), 3 = green (personal).
 * Specific people get overrides via the contact_tags table.
 */
export const CONTACT_TIERS: ContactTier[] = [
  { tier: 1, label: 'Priority 1', color: '#ef4444', respond: 'ASAP', tags: ['client', 'student'] },
  { tier: 2, label: 'Priority 2', color: '#eab308', respond: 'same day', tags: ['brand', 'partner', 'lead'] },
  { tier: 3, label: 'Priority 3', color: '#22c55e', respond: 'when free', tags: ['personal', 'friend', 'community'] },
];

export function lifeAreaForDepartment(departmentId: string, workspaceId: WorkspaceId = DEFAULT_WORKSPACE_ID): LifeArea | null {
  return getLifeAreas(workspaceId).find((a) => a.departmentIds.includes(departmentId)) ?? null;
}

export function buildLifeMap(workspaceId: WorkspaceId = DEFAULT_WORKSPACE_ID): LifeMap {
  const nodes: LifeMapNode[] = [
    {
      id: 'center',
      type: 'center',
      label: "Ramesh's Life",
      color: '#fafafa',
      parent: null,
      detail: 'The core. Everything orbits this.',
      agents: [],
      brainFolders: [],
    },
  ];
  const edges: LifeMap['edges'] = [];

  for (const area of getLifeAreas(workspaceId)) {
    nodes.push({
      id: area.id,
      type: 'area',
      label: area.label,
      color: area.color,
      parent: 'center',
      detail: area.detail,
      agents: area.agents,
      brainFolders: area.brainFolders,
    });
    edges.push({ source: 'center', target: area.id });

    for (const mod of area.modules) {
      const id = `${area.id}/${mod.id}`;
      nodes.push({
        id,
        type: 'module',
        label: mod.label,
        color: area.color,
        parent: area.id,
        detail: mod.detail,
        agents: [],
        brainFolders: [],
      });
      edges.push({ source: area.id, target: id });
    }
  }

  // The contact priority ladder hangs off client management — only wired in
  // when that module actually exists (ILS today). Other workspaces' comms
  // area has no modules yet; skip rather than link tiers to a node that
  // isn't there.
  const tierParent = 'communication/client-management';
  if (nodes.some((n) => n.id === tierParent)) {
    for (const t of CONTACT_TIERS) {
      const id = `tier-${t.tier}`;
      nodes.push({
        id,
        type: 'tier',
        label: `T${t.tier} ${t.label}`,
        color: t.color,
        parent: tierParent,
        detail: `${t.tags.join(', ')} — respond ${t.respond}`,
        agents: [],
        brainFolders: [],
      });
      edges.push({ source: tierParent, target: id });
    }
  }

  return { nodes, edges };
}
