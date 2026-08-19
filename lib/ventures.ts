/**
 * Each company's one venture — the venture lens over its own OS.
 *
 * One database per workspace, one G-Brain per workspace, one agent roster per
 * workspace: ventures never partition data *within* a company. They're a
 * saved filter — the agents that serve each life area, the brain tag that
 * marks its pages, and the current executive focus. Every company here is a
 * solo operation with exactly one real venture (itself), so each workspace's
 * array is a single-entry list, not a placeholder for a second one.
 *
 * Kept free of server-only imports — client components (BrainDump) read
 * these too via props from a server parent, not by resolving the workspace
 * themselves.
 */
import type { LifeArea } from '@/lib/life-map';
import { getLifeAreas } from '@/lib/life-map';
import { DEFAULT_WORKSPACE_ID, type WorkspaceId } from '@/lib/workspaces';

export type Venture = {
  id: string;
  label: string;
  kind: string;
  color: string;
  detail: string;
  /** Tag that marks this venture's pages inside its own G-Brain. */
  brainTag: string;
  /** Current executive priorities — real punch-list items, not invented. */
  focus: string[];
  /** life-area id → the agents working that area FOR this venture. */
  areaAgents: Record<string, string[]>;
};

const ILS_VENTURES: Venture[] = [
  {
    id: 'ils',
    label: 'Innovative Leadership Strategies',
    kind: 'Coaching & courses',
    // LinkedIn blue — ILS's primary organic channel today (traffic_acquisition
    // .organic_strategies in company.yaml). Distinct from every life-area color.
    color: '#0A66C2',
    detail: 'The LEVERAGE Framework — a 10-module membership course ($197) with 1:1 executive coaching ($5,000–$10,000/mo) as the implementation upsell.',
    brainTag: 'ils',
    focus: [
      'Finish the Coach Foundation CRM workflow audit — 8+ of 18 workflows captured so far',
      'Author the next real skill (/editorial-calendar-build or /campaign-brief-builder) — only 2 of 43 agents have one today',
      'Close the real company.yaml gaps: LTV:CAC and gross margin untracked, no proven headlines/hooks, no funnel conversion data yet',
    ],
    areaAgents: {
      marketing: [
        'marketing-director',
        'brand-positioning',
        'content-strategy',
        'linkedin',
        'copywriting',
        'campaign-management',
        'lead-nurture',
        'marketing-analytics',
      ],
      sales: ['lead-qualification', 'discovery-preparation', 'proposal', 'sales-follow-up', 'pipeline'],
      finances: ['financial-analysis', 'revenue-forecasting', 'billing-review'],
      communication: [],
      clients: ['client-onboarding', 'coaching-preparation', 'client-health', 'curriculum', 'leverage-framework'],
      knowledge: ['company-research', 'market-intelligence', 'competitive-intelligence', 'strategic-research', 'knowledge-management'],
      operations: ['chief-of-staff', 'operations-manager', 'sop', 'workflow', 'quality-control', 'ai-systems-architect', 'automation', 'crm'],
    },
  },
];

const ELOAN4HOME_VENTURES: Venture[] = [
  {
    id: 'eloan4home',
    label: 'Eloan4Home',
    kind: 'Residential mortgage brokerage',
    color: '#16A34A',
    detail: 'Full-service residential mortgage brokerage — Sacramento, CA. Ramesh Prasad, sole Broker/Loan Officer, NMLS #237685. Home purchase and refinance lending statewide. Relaunch phase as of 2026-08.',
    brainTag: 'eloan4home',
    focus: [
      'Run the INTAKE.md interview to fill company.yaml — most compartments are still blank',
      'Author the first skill: a borrower-facing loan-program explainer, or realtor/referral-partner outreach drafting',
      'Populate reference/ with loan-program one-pagers and the RESPA/TILA compliance quick-reference',
    ],
    areaAgents: { marketing: [], sales: [], finances: [], communication: [], clients: [], knowledge: [], operations: [] },
  },
];

const REAL_ESTATE_VENTURES: Venture[] = [
  {
    id: 'real-estate-os',
    label: 'Real Estate OS',
    kind: 'Brokerage · Development · Temp Housing',
    color: '#B45309',
    detail: 'Ramesh Prasad’s real estate venture, Sacramento, CA — an active residential Brokerage (CA Broker License #01321444, ~26 years), a dormant Development line (Cornell certification), and a dormant Temp Housing line (Agginym).',
    brainTag: 'real-estate-os',
    focus: [
      'Run the INTAKE.md gap-closure follow-up — Brokerage compartments are ~96% complete, the rest need Ramesh',
      'Author the first Brokerage skill: buyer/seller inquiry response, or transaction pipeline status drafting',
      'Keep Development and Temp Housing content honestly pre-launch — never blend it with Brokerage’s live track record',
    ],
    areaAgents: { marketing: [], sales: [], finances: [], communication: [], clients: [], knowledge: [], operations: [] },
  },
];

const VENTURES_BY_WORKSPACE: Record<WorkspaceId, Venture[]> = {
  ils: ILS_VENTURES,
  eloan4home: ELOAN4HOME_VENTURES,
  'real-estate-os': REAL_ESTATE_VENTURES,
};

export function getVentures(workspaceId: WorkspaceId = DEFAULT_WORKSPACE_ID): Venture[] {
  return VENTURES_BY_WORKSPACE[workspaceId] ?? VENTURES_BY_WORKSPACE[DEFAULT_WORKSPACE_ID];
}

export function getVenture(id: string, workspaceId: WorkspaceId = DEFAULT_WORKSPACE_ID): Venture | null {
  return getVentures(workspaceId).find((v) => v.id === id) ?? null;
}

/** Every agent serving a venture, across all its life areas. */
export function ventureAgentSet(ventureId: string, workspaceId: WorkspaceId = DEFAULT_WORKSPACE_ID): Set<string> {
  const v = getVenture(ventureId, workspaceId);
  return new Set(v ? Object.values(v.areaAgents).flat() : []);
}

/** Which ventures an agent works for (shared infra agents serve all), within one workspace. */
export function venturesForAgent(agentId: string, workspaceId: WorkspaceId = DEFAULT_WORKSPACE_ID): Venture[] {
  return getVentures(workspaceId).filter((v) => ventureAgentSet(v.id, workspaceId).has(agentId));
}

/** Agents on one life area for one venture. */
export function ventureAreaAgents(ventureId: string, areaId: string, workspaceId: WorkspaceId = DEFAULT_WORKSPACE_ID): string[] {
  return getVenture(ventureId, workspaceId)?.areaAgents[areaId] ?? [];
}

export function lifeAreaById(areaId: string, workspaceId: WorkspaceId = DEFAULT_WORKSPACE_ID): LifeArea | null {
  return getLifeAreas(workspaceId).find((a) => a.id === areaId) ?? null;
}
