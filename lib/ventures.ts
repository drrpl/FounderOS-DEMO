/**
 * ILS's one venture — the venture lens over the OS.
 *
 * One database, one G-Brain, one agent roster: ventures never partition the
 * data. They are saved filters — each one names the agents that serve it per
 * life area, the brain tag that marks its pages, and the current executive
 * focus. FounderOS-DEMO originally shipped two ventures (Alex's Vantage
 * agency + Launchpad Cohort); ILS is a solo operation with exactly one real
 * venture, so this is a single-entry array, not a placeholder for a second
 * one.
 */
import type { LifeArea } from '@/lib/life-map';
import { LIFE_AREAS } from '@/lib/life-map';

export type Venture = {
  id: string;
  label: string;
  kind: string;
  color: string;
  detail: string;
  /** Tag that marks this venture's pages inside the single shared G-Brain. */
  brainTag: string;
  /** Current executive priorities — real punch-list items, not invented. */
  focus: string[];
  /** life-area id → the agents working that area FOR this venture. */
  areaAgents: Record<string, string[]>;
};

export const VENTURES: Venture[] = [
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
      // Content, brand, and campaign work — Marketing & Brand department.
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
      // Lead-to-client pipeline — Sales & Business Development department.
      sales: ['lead-qualification', 'discovery-preparation', 'proposal', 'sales-follow-up', 'pipeline'],
      // Pricing is real; unit economics and billing are not yet tracked — Finance department.
      finances: ['financial-analysis', 'revenue-forecasting', 'billing-review'],
      // No unified inbox or dedicated comms department exists at ILS yet
      // (matches lib/life-map.ts's own honest-empty call on this same area) —
      // left unstaffed rather than force-fitting Client Success agents whose
      // real job isn't inbox/WhatsApp/Slack triage.
      communication: [],
      // Client Success & Coaching, plus Programs & Curriculum (the course itself).
      clients: ['client-onboarding', 'coaching-preparation', 'client-health', 'curriculum', 'leverage-framework'],
      // Research & Business Intelligence, plus Knowledge Management (Technology & AI).
      knowledge: ['company-research', 'market-intelligence', 'competitive-intelligence', 'strategic-research', 'knowledge-management'],
      // Operations, plus the rest of Technology & AI Systems.
      operations: ['chief-of-staff', 'operations-manager', 'sop', 'workflow', 'quality-control', 'ai-systems-architect', 'automation', 'crm'],
    },
  },
];

export function getVenture(id: string): Venture | null {
  return VENTURES.find((v) => v.id === id) ?? null;
}

/** Every agent serving a venture, across all its life areas. */
export function ventureAgentSet(ventureId: string): Set<string> {
  const v = getVenture(ventureId);
  return new Set(v ? Object.values(v.areaAgents).flat() : []);
}

/** Which ventures an agent works for (shared infra agents serve all). */
export function venturesForAgent(agentId: string): Venture[] {
  return VENTURES.filter((v) => ventureAgentSet(v.id).has(agentId));
}

/** Agents on one life area for one venture. */
export function ventureAreaAgents(ventureId: string, areaId: string): string[] {
  return getVenture(ventureId)?.areaAgents[areaId] ?? [];
}

export function lifeAreaById(areaId: string): LifeArea | null {
  return LIFE_AREAS.find((a) => a.id === areaId) ?? null;
}
