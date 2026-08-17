/**
 * Lenses over the operating knowledge graph: slice ILS's org graph three
 * ways — by ENTITY TYPE, by BUSINESS FUNCTION (core/revenue-driving vs
 * enabling), and by ACTION (what a thing is actually used for). Picking a
 * lens lights the matching nodes and dims the rest. Pure data + matchers;
 * the component supplies the node list and a department resolver.
 *
 * There is one venture (ILS), so the demo's per-venture "team" lenses
 * (Vantage team / Launchpad Cohort team) don't apply — removed rather than
 * forced onto a single team.
 */

export type LensGroup = 'entity' | 'function' | 'action';

export type Lens = { id: string; group: LensGroup; label: string };

export type LensNode = { id: string; kind: string };

export type LensContext = {
  nodes: LensNode[];
  /** resolves any node to its pillar's team node id (`team:dept-…`), or null */
  teamOf: (nodeId: string) => string | null;
};

export const ENTITY_LENSES: Lens[] = [
  { id: 'ent-people', group: 'entity', label: 'All people' },
  { id: 'ent-subagents', group: 'entity', label: 'Sub-agents' },
  { id: 'ent-tools', group: 'entity', label: 'Tools' },
  { id: 'ent-workflows', group: 'entity', label: 'Workflows' },
  { id: 'ent-sops', group: 'entity', label: 'SOPs' },
  { id: 'ent-projects', group: 'entity', label: 'Projects' },
  { id: 'ent-teams', group: 'entity', label: 'Teams' },
  { id: 'ent-departments', group: 'entity', label: 'Departments' },
];

export const FUNCTION_LENSES: Lens[] = [
  { id: 'fn-core', group: 'function', label: 'Core' },
  { id: 'fn-enabling', group: 'function', label: 'Enabling' },
];

export const ACTION_LENSES: Lens[] = [
  { id: 'act-ad-creation', group: 'action', label: 'Ad creation' },
  { id: 'act-lead-generation', group: 'action', label: 'Lead generation' },
  { id: 'act-content-repurposing', group: 'action', label: 'Content repurposing' },
  { id: 'act-content-ideation', group: 'action', label: 'Content ideation' },
  { id: 'act-content-scripts', group: 'action', label: 'Content script creation' },
  { id: 'act-social-sentiment', group: 'action', label: 'Social media sentiment analysis' },
  { id: 'act-social-scheduler', group: 'action', label: 'Social posting & scheduler' },
  { id: 'act-ai-visuals', group: 'action', label: 'AI-generated visual assets' },
  { id: 'act-competitor-intel', group: 'action', label: 'Competitor ad intelligence' },
  { id: 'act-icp-simulation', group: 'action', label: 'ICP identification & simulation' },
  { id: 'act-channel-budget', group: 'action', label: 'Channel & budget allocation' },
];

export const ALL_LENSES: Lens[] = [...ENTITY_LENSES, ...FUNCTION_LENSES, ...ACTION_LENSES];

/** Revenue-driving pillars (the offer + its delivery) vs the ones that keep the machine running. */
const CORE_DEPTS = new Set(['team:dept-sales-bd', 'team:dept-marketing-brand', 'team:dept-client-success', 'team:dept-programs-curriculum']);
const ENABLING_DEPTS = new Set([
  'team:dept-executive',
  'team:dept-operations',
  'team:dept-finance',
  'team:dept-research-bi',
  'team:dept-tech-ai',
  'team:dept-legal-risk',
]);

/**
 * What each action actually runs on — real seeded ILS agent ids only, honest
 * best-fit against each agent's actual documented job (agents/*.md). Where
 * ILS has no agent whose real job covers the category (no video/creative
 * production, no paid-ads, no social-scheduling automation exist yet — see
 * agents/README.md's honesty tiers), the lens is left out of this map and
 * `lensNodeSet` honestly returns empty for it, same pattern as the
 * not-yet-modeled 'ent-workflows'/'ent-projects' lenses below.
 */
const ACTION_AGENTS: Record<string, string[]> = {
  'act-lead-generation': ['lead-qualification'],
  'act-content-ideation': ['content-strategy'],
  'act-content-scripts': ['linkedin', 'copywriting'],
  'act-competitor-intel': ['competitive-intelligence'],
  'act-icp-simulation': ['market-intelligence', 'company-research'],
  'act-channel-budget': ['campaign-management'],
};

const idSet = (ids: string[]) => new Set(ids.map((id) => `emp:${id}`));

/**
 * The node ids a lens lights. Unknown lens → empty set. Workflows and
 * projects are not modeled as graph entities yet — their lenses honestly
 * return empty until those tables exist (larp-first, real-ready).
 */
export function lensNodeSet(lensId: string, ctx: LensContext): Set<string> {
  const out = new Set<string>();
  const byKind = (kind: string) => {
    for (const n of ctx.nodes) if (n.kind === kind) out.add(n.id);
  };
  switch (lensId) {
    case 'ent-people':
      byKind('person');
      break;
    case 'ent-subagents':
      byKind('employee');
      break;
    case 'ent-tools':
      byKind('tool');
      break;
    case 'ent-sops':
      byKind('task');
      break;
    case 'ent-departments':
      byKind('team');
      break;
    case 'ent-teams':
    case 'ent-workflows':
    case 'ent-projects':
      break; // not modeled yet — honest empty (single venture, no separate "team" grouping beyond departments)
    case 'fn-core':
    case 'fn-enabling': {
      const depts = lensId === 'fn-core' ? CORE_DEPTS : ENABLING_DEPTS;
      for (const n of ctx.nodes) {
        const team = n.kind === 'team' ? n.id : ctx.teamOf(n.id);
        if (team && depts.has(team)) out.add(n.id);
      }
      break;
    }
    default: {
      const agents = ACTION_AGENTS[lensId];
      if (!agents) break;
      const members = idSet(agents);
      for (const n of ctx.nodes) if (members.has(n.id)) out.add(n.id);
    }
  }
  return out;
}
