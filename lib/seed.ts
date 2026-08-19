import type { FounderDb } from '@/lib/db';
import { PERSONAS } from '@/lib/personas-seed';
import { DEFAULT_WORKSPACE_ID, type WorkspaceId } from '@/lib/workspaces';
import type {
  Agent,
  AgentTask,
  Department,
  Domain,
  EmailListSnapshot,
  FunnelContact,
  FunnelTouch,
  Metric,
  Person,
  Phase,
  RoadmapItem,
  LeadMagnet,
  SopTask,
  Workflow,
  Skill,
  SocialAccount,
  SocialDm,
  SocialDmSnapshot,
  SocialDmMessage,
  SocialPost,
  SocialSnapshot,
  Tool,
} from '@/lib/schemas';

// Monochrome palette — the UI is strict black & white; "color" fields carry
// grayscale steps used only for subtle hierarchy.
const GRAY = {
  white: '#fafafa',
  light: '#d4d4d4',
  mid: '#a3a3a3',
  dim: '#737373',
  dark: '#525252',
};

// ILS's 10 departments (agents/README.md org chart, built 2026-08-17).
// Department colors are pulled from each department's own agents' real
// frontmatter `color` field (ILS/agents/*.md) — every agent in a department
// shares one color there, so it doubles honestly as the department accent.
const departments: Department[] = [
  { id: 'dept-executive', name: 'Executive Office', slug: 'executive', tagline: 'Escalation routing and cross-department synthesis to Ramesh.', color: '#111827', order: 1 },
  { id: 'dept-sales-bd', name: 'Sales & Business Development', slug: 'sales-bd', tagline: 'Qualification, discovery prep, proposals, and pipeline.', color: '#B91C1C', order: 2 },
  { id: 'dept-marketing-brand', name: 'Marketing & Brand', slug: 'marketing-brand', tagline: 'Brand, content, LinkedIn, copy, campaigns, nurture, analytics.', color: '#1F2937', order: 3 },
  { id: 'dept-client-success', name: 'Client Success & Coaching', slug: 'client-success', tagline: 'Onboarding, coaching prep, follow-up, accountability, client health.', color: '#0D9488', order: 4 },
  { id: 'dept-programs-curriculum', name: 'Programs & Curriculum', slug: 'programs-curriculum', tagline: 'The LEVERAGE Framework’s 10 modules, RAGE, and the Scalability Assessment.', color: '#4338CA', order: 5 },
  { id: 'dept-operations', name: 'Operations', slug: 'operations', tagline: 'SOPs, CRM workflow cataloging, and quality control.', color: '#B45309', order: 6 },
  { id: 'dept-finance', name: 'Finance', slug: 'finance', tagline: 'Pricing is real; unit economics and billing are not yet tracked.', color: '#047857', order: 7 },
  { id: 'dept-research-bi', name: 'Research & Business Intelligence', slug: 'research-bi', tagline: 'Company, market, and competitive research, plus the DBA research pool.', color: '#0369A1', order: 8 },
  { id: 'dept-tech-ai', name: 'Technology & AI Systems', slug: 'tech-ai', tagline: 'This workspace’s own agent architecture, CRM platform, and automation.', color: '#6D28D9', order: 9 },
  { id: 'dept-legal-risk', name: 'Legal, Risk & Compliance', slug: 'legal-risk', tagline: 'Contract review, compliance, and risk — thin except one real flag.', color: '#57534E', order: 10 },
];

// The roster IS the runtime — every row here maps 1:1 to a RuntimeAgent in
// lib/agents/real.ts (enforced by tests/seed.test.ts). No larp agents.
//
// ILS's 43-agent org chart (agents/README.md, built 2026-08-17), sourced
// verbatim from each agent's real frontmatter in ILS/agents/*.md. Only 2 of
// the 43 have a real skill wired (linkedin, brand-positioning) — every other
// agent is a judgment-complete persona with no automation built yet, so
// `status: 'planned'` and an honest `model` string is the correct read, not
// 'active'/'idle'/'training', which would imply automation that isn't real.
const agents: Agent[] = [
  // ── 01 Executive Office ────────────────────────────────────────────────
  {
    id: 'chief-of-staff',
    departmentId: 'dept-executive',
    name: 'Chief of Staff',
    role: 'Chief of Staff',
    status: 'planned',
    tier: 'lead',
    description: "Top of ILS's agent chain: routes every department head's escalation to Ramesh, tracks MRR as the one number that matters, and owns the foundations_status punch list.",
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: null,
    instance: 'builtin',
  },
  {
    id: 'executive-briefing',
    departmentId: 'dept-executive',
    name: 'Executive Briefing',
    role: 'Executive Briefing Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Synthesizes workspace/STATE.md and every department’s punch list into a two-minute status brief for Ramesh, never rounding a department’s status up.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'strategy',
    departmentId: 'dept-executive',
    name: 'Strategy',
    role: 'Strategy Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Holds ILS’s whole-business strategic judgment — checks new initiatives against the "scale systems, not effort" philosophy and flags recommendations resting on unvalidated economics.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob', 'WebSearch'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },

  // ── 02 Sales & Business Development ───────────────────────────────────
  {
    id: 'discovery-preparation',
    departmentId: 'dept-sales-bd',
    name: 'Discovery Preparation',
    role: 'Discovery Preparation Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Preps Ramesh for the complimentary coaching session — a diagnostic-and-qualification call — by surfacing likely pain points and objections in advance.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'lead-qualification',
    departmentId: 'dept-sales-bd',
    name: 'Lead Qualification',
    role: 'Lead Qualification Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Screens inbound interest against ILS’s 6 real qualification criteria before a complimentary session is booked, routing qualified leads to Discovery Preparation and not-ready ones to Lead Nurture.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'pipeline',
    departmentId: 'dept-sales-bd',
    name: 'Pipeline',
    role: 'Pipeline Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Tracks where prospects sit across the funnel — blocked today on the in-progress CRM workflow audit, since no documented pipeline-stage structure exists yet.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'proposal',
    departmentId: 'dept-sales-bd',
    name: 'Proposal',
    role: 'Proposal Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Writes the post-complimentary-session proposal covering scope, coaching cadence, and investment when 1:1 coaching is the live recommendation.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'sales-follow-up',
    departmentId: 'dept-sales-bd',
    name: 'Sales Follow-Up',
    role: 'Sales Follow-Up Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Follows up on outstanding proposals and post-session interest without manufactured urgency, checking first whether a CRM automation already covers it.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },

  // ── 03 Marketing & Brand ───────────────────────────────────────────────
  {
    id: 'marketing-director',
    departmentId: 'dept-marketing-brand',
    name: 'Marketing Director',
    role: 'Director of Marketing & Brand',
    status: 'planned',
    tier: 'lead',
    description: 'Diagnoses every marketing request, routes it to exactly one specialist, and gates all client-facing output on Brand & Positioning’s voice check and Ramesh’s sign-off.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'brand-positioning',
    departmentId: 'dept-marketing-brand',
    name: 'Brand & Positioning',
    role: 'Brand & Positioning Specialist',
    status: 'active',
    tier: 'specialist',
    description: 'Runs the /brand-voice-audit voice-and-positioning check every other marketing specialist’s draft passes through before it reaches Ramesh.',
    model: 'Claude Code skill: /brand-voice-audit',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob', 'WebSearch', 'WebFetch'],
    parentId: 'marketing-director',
    instance: 'builtin',
  },
  {
    id: 'content-strategy',
    departmentId: 'dept-marketing-brand',
    name: 'Content Strategy',
    role: 'Content Strategy Specialist',
    status: 'planned',
    tier: 'specialist',
    description: 'Decides what ILS publishes against its 9 content pillars and hands the brief to LinkedIn or Copywriting — never writes the post itself.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob', 'WebSearch', 'WebFetch'],
    parentId: 'marketing-director',
    instance: 'builtin',
  },
  {
    id: 'linkedin',
    departmentId: 'dept-marketing-brand',
    name: 'LinkedIn',
    role: 'LinkedIn Specialist',
    status: 'active',
    tier: 'specialist',
    description: 'Drafts LinkedIn posts via /linkedin-post-draft from Content Strategy’s brief — ILS’s primary organic acquisition channel today.',
    model: 'Claude Code skill: /linkedin-post-draft',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob', 'WebSearch'],
    parentId: 'marketing-director',
    instance: 'builtin',
  },
  {
    id: 'copywriting',
    departmentId: 'dept-marketing-brand',
    name: 'Copywriting',
    role: 'Copywriting Specialist',
    status: 'planned',
    tier: 'specialist',
    description: 'Writes landing-page, email, and ad copy structured around "diagnose before prescribe," flagging any missing proof point as a gap instead of inventing one.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'marketing-director',
    instance: 'builtin',
  },
  {
    id: 'campaign-management',
    departmentId: 'dept-marketing-brand',
    name: 'Campaign Management',
    role: 'Campaign Management Specialist',
    status: 'planned',
    tier: 'specialist',
    description: 'Coordinates the other specialists’ output into a timed campaign push around the complimentary session or LEVERAGE course.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'marketing-director',
    instance: 'builtin',
  },
  {
    id: 'lead-nurture',
    departmentId: 'dept-marketing-brand',
    name: 'Lead Nurture',
    role: 'Lead Nurture Specialist',
    status: 'planned',
    tier: 'specialist',
    description: 'Builds educational follow-up for interested-but-not-ready prospects from scratch — no nurture sequence exists today.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'marketing-director',
    instance: 'builtin',
  },
  {
    id: 'marketing-analytics',
    departmentId: 'dept-marketing-brand',
    name: 'Marketing Analytics',
    role: 'Marketing Analytics Specialist',
    status: 'planned',
    tier: 'specialist',
    description: 'Measures marketing outcomes against the MRR north-star — reports honestly that almost nothing is instrumented yet rather than fabricating a metric.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob', 'WebSearch'],
    parentId: 'marketing-director',
    instance: 'builtin',
  },

  // ── 04 Client Success & Coaching ───────────────────────────────────────
  {
    id: 'client-onboarding',
    departmentId: 'dept-client-success',
    name: 'Client Onboarding',
    role: 'Client Onboarding Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Designs onboarding for new course members and coaching clients where none currently exists.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'coaching-preparation',
    departmentId: 'dept-client-success',
    name: 'Coaching Preparation',
    role: 'Coaching Preparation Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Preps Ramesh for recurring 1:1 sessions by carrying context forward between meetings — blocked until a session-history record exists.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'session-follow-up',
    departmentId: 'dept-client-success',
    name: 'Session Follow-Up',
    role: 'Session Follow-Up Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Sends the post-session recap and commitment log that feeds the Accountability Agent’s tracking.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'accountability',
    departmentId: 'dept-client-success',
    name: 'Accountability',
    role: 'Accountability Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Turns Session Follow-Up’s captured commitments into a check-in rhythm aligned with RAGE’s Accountability Rhythms component.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'client-health',
    departmentId: 'dept-client-success',
    name: 'Client Health',
    role: 'Client Health Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Assesses retention risk for active clients — reports "not enough data" honestly rather than assigning a fabricated health score.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },

  // ── 05 Programs & Curriculum ───────────────────────────────────────────
  {
    id: 'curriculum',
    departmentId: 'dept-programs-curriculum',
    name: 'Curriculum',
    role: 'Curriculum Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Owns the structural integrity of the LEVERAGE Framework’s 10 delivered modules and the Locate-through-Expand sequencing.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'leverage-framework',
    departmentId: 'dept-programs-curriculum',
    name: 'LEVERAGE Framework',
    role: 'LEVERAGE Framework Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Protects LEVERAGE as a concept — systems, decisions, people, and leverage over more effort — so no department uses the name as a generic buzzword.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'assessment',
    departmentId: 'dept-programs-curriculum',
    name: 'Assessment',
    role: 'Assessment Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Owns the designed-but-unbuilt ILS Scalability Readiness Assessment — the clearest next-build target in the whole workspace.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'learning-materials',
    departmentId: 'dept-programs-curriculum',
    name: 'Learning Materials',
    role: 'Learning Materials Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Routes course-content production requests to Coach Foundation and content/editorial decisions back to Ramesh, per the vendor boundary.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },

  // ── 06 Operations ───────────────────────────────────────────────────────
  {
    id: 'operations-manager',
    departmentId: 'dept-operations',
    name: 'Operations Manager',
    role: 'Operations Manager Agent',
    status: 'planned',
    tier: 'lead',
    description: 'Owns the in-progress Coach Foundation CRM workflow audit — ILS’s richest real evidence base — and coordinates SOP and Workflow beneath it.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'sop',
    departmentId: 'dept-operations',
    name: 'SOP',
    role: 'SOP Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Turns ILS’s real, already-running CRM processes into documented SOPs, sourced only from observed patterns.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'operations-manager',
    instance: 'builtin',
  },
  {
    id: 'workflow',
    departmentId: 'dept-operations',
    name: 'Workflow',
    role: 'Workflow Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Owns the live catalog of ILS’s 18 Coach Foundation CRM automations, captured screenshot by screenshot.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'operations-manager',
    instance: 'builtin',
  },
  {
    id: 'quality-control',
    departmentId: 'dept-operations',
    name: 'Quality Control',
    role: 'Quality Control Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Spot-checks output workspace-wide against INV-1, INV-2, and INV-3 — flags invariant misses, never grants exceptions.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'operations-manager',
    instance: 'builtin',
  },

  // ── 07 Finance ────────────────────────────────────────────────────────
  {
    id: 'financial-analysis',
    departmentId: 'dept-finance',
    name: 'Financial Analysis',
    role: 'Financial Analysis Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Works from the one real number (course/coaching pricing) and reports LTV:CAC and gross margin as genuinely untracked rather than estimating them.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'revenue-forecasting',
    departmentId: 'dept-finance',
    name: 'Revenue Forecasting',
    role: 'Revenue Forecasting Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Forecasts against the MRR north-star metric — fully blocked until Client Health, Pipeline, and Marketing Analytics close their own instrumentation gaps.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'billing-review',
    departmentId: 'dept-finance',
    name: 'Billing Review',
    role: 'Billing Review Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Reviews billing and payment operations — the actual billing system isn’t even confirmed yet, so that’s the first open question.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },

  // ── 08 Research & Business Intelligence ────────────────────────────────
  {
    id: 'company-research',
    departmentId: 'dept-research-bi',
    name: 'Company Research',
    role: 'Company Research Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Researches a specific prospect’s company ahead of a complimentary session, feeding Lead Qualification and Discovery Preparation.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'market-intelligence',
    departmentId: 'dept-research-bi',
    name: 'Market Intelligence',
    role: 'Market Intelligence Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Owns closing the not-started market_research_brief gap and tracks external shifts in how the ICP talks about scaling and leadership.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob', 'WebSearch'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'competitive-intelligence',
    departmentId: 'dept-research-bi',
    name: 'Competitive Intelligence',
    role: 'Competitive Intelligence Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Tracks ILS’s competitive landscape — no competitor is named anywhere yet, so this starts from the documented category-level objection pattern.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob', 'WebSearch'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'strategic-research',
    departmentId: 'dept-research-bi',
    name: 'Strategic Research',
    role: 'Strategic Research Agent',
    status: 'planned',
    tier: 'specialist',
    description: "Surfaces citable concepts from Ramesh's defended DBA dissertation (Switching-Cost Theory, 'partial switching') for coaching and content, always sourced per INV-8.",
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },

  // ── 09 Technology & AI Systems ──────────────────────────────────────────
  {
    id: 'ai-systems-architect',
    departmentId: 'dept-tech-ai',
    name: 'AI Systems Architect',
    role: 'AI Systems Architect',
    status: 'planned',
    tier: 'specialist',
    description: 'Owns this workspace’s own agent and skill architecture — keeps new agents consistent with the established frontmatter shape and reporting chain.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'automation',
    departmentId: 'dept-tech-ai',
    name: 'Automation',
    role: 'Automation Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Owns the technical build side of ILS’s CRM automations once the workflow audit is complete — specifies changes, since it has no platform access to execute them.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'crm',
    departmentId: 'dept-tech-ai',
    name: 'CRM',
    role: 'CRM Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Owns ILS’s understanding of the Coach Foundation platform itself — host, course platform, and a genuinely sophisticated marketing automation system with 18 live workflows.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'knowledge-management',
    departmentId: 'dept-tech-ai',
    name: 'Knowledge Management',
    role: 'Knowledge Management Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Maintains ILS’s reference/ folder as a pointer, not a copy, into the shared cross-venture DBA knowledge pool.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },

  // ── 10 Legal, Risk & Compliance ─────────────────────────────────────────
  {
    id: 'contract-review',
    departmentId: 'dept-legal-risk',
    name: 'Contract Review',
    role: 'Contract Review Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Reviews contracts and agreements — no terms are documented anywhere yet, including for the Coach Foundation vendor relationship.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'risk-review',
    departmentId: 'dept-legal-risk',
    name: 'Risk Review',
    role: 'Risk Review Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Owns the one real, concrete risk flag: the WHA confidentiality obligation on dissertation-derived data — everything else in "risk" is unscoped.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
  {
    id: 'compliance',
    departmentId: 'dept-legal-risk',
    name: 'Compliance',
    role: 'Compliance Agent',
    status: 'planned',
    tier: 'specialist',
    description: 'Checks ILS’s compliance posture — no formal framework is documented, and this agent’s first job is confirming what compliance even means for a solo coaching practice.',
    model: 'Persona only — no automation built',
    tools: ['Read', 'Grep', 'Glob'],
    parentId: 'chief-of-staff',
    instance: 'builtin',
  },
];

// ── Humans in the process ─────────────────────────────────────────────────────
// ILS is a solo operation (company.yaml: team.structure "solo") — Ramesh has
// no other staff to model as tool-wielding workers here. Honestly empty
// rather than inventing a team (INV-1, truth gate).
const people: Person[] = [];

const leadMagnets: LeadMagnet[] = [
  {
    id: 'operator-stack',
    name: 'The Operator Stack',
    offer: 'Every layer of the agent stack, and what to use instead of each one',
    url: 'https://stack.example.com',
    status: 'live',
    captures: 'email',
    destination: 'Newsletter · main list',
    source: 'Carousel · "One person, a company of agents" (comment STACK)',
    launchedAt: '2026-08-12',
    origin: 'seed',
    notes: 'Ungated. Newsletter signup plus a separate cohort waitlist form.',
  },
  {
    id: 'automation-teardown',
    name: 'The Automation Teardown',
    offer: 'A workflow pulled apart step by step, with the hours each one costs',
    url: 'https://teardown.example.com',
    status: 'live',
    captures: 'email',
    destination: 'Newsletter · main list',
    source: 'Short · "Where the week actually goes" (comment TEARDOWN)',
    launchedAt: '2026-08-05',
    origin: 'seed',
    notes: 'Built from the workflows view. Doubles as the cohort lesson one handout.',
  },
  {
    id: 'cohort-waitlist',
    name: 'Cohort Waitlist',
    offer: 'A seat in the next cohort before it opens publicly',
    url: 'https://waitlist.example.com',
    status: 'paused',
    captures: 'email',
    destination: 'Newsletter · cohort waitlist segment',
    source: 'Bio link + end cards',
    launchedAt: '2026-07-28',
    origin: 'seed',
    notes: 'Paused between cohorts. Reopen when the next intake is dated.',
  },
];

// ── SOP tasks — only where a real, documented process already exists ────────
// Of ILS's 43 agents, exactly 2 have a real authored skill with a written
// process (agents/README.md: "zero skills exist for any of these 43 agents
// except two"). The other 41 are judgment-complete personas with no built
// automation yet — giving them a written SOP would fabricate a process that
// doesn't exist (INV-1). These two are paraphrased from each agent's real
// "## Process" / "## Critical Rules" sections in ILS/agents/*.md, not invented.
const sopTasks: SopTask[] = [
  {
    id: 'sop-linkedin', departmentId: 'dept-marketing-brand', assigneeKind: 'agent', assigneeId: 'linkedin',
    title: 'Draft a LinkedIn post from a Content Strategy brief',
    summary: 'ILS’s primary organic acquisition channel today — hook, body, CTA, never freelanced.',
    steps: [
      'Take the brief from Content Strategy (pillar + real pain point + funnel step) rather than freelancing a topic',
      'Draft hook → body → CTA via /linkedin-post-draft: open with symptom-recognition, not framework-pitching',
      'Draw the hook only from pain points/desires already documented in audience_intelligence_system — never invent one',
      'End with a clear, low-friction next step — today that is the complimentary coaching session',
      'Send to Brand & Positioning for the voice-and-positioning check',
      'Route to Ramesh for sign-off before it posts — no autonomous posting exists for a one-person business',
    ],
  },
  {
    id: 'sop-brand-positioning', departmentId: 'dept-marketing-brand', assigneeKind: 'agent', assigneeId: 'brand-positioning',
    title: 'Run the voice-and-positioning check on a marketing draft',
    summary: 'The checkpoint every other marketing specialist’s output passes through before Ramesh sees it.',
    steps: [
      'Check the draft against the banned-vocabulary list (copy_messaging.phrases_to_avoid)',
      'Check register: direct, analytical, evidence-based — flag anything that reads as motivational-coach voice',
      'Check ICP/positioning scope: never lets the pitch drift toward "we coach every business" or a rescue narrative',
      'Check any response to skepticism cites the real counter-belief (limiting_belief_diagnosis), never "trust the process"',
      'Return a pass/fail with line-level notes to the originating specialist via the Marketing Director — never a silent rewrite',
    ],
  },
];
// ILS's real, honest tech stack (company.yaml `operational_intelligence
// .tech_stack` + `content_strategy.platforms`). A solo coaching business —
// deliberately short next to Alex's 20+ connector stack (INV-1: a blank/
// thin list beats padding with tools ILS doesn't actually use).
const tools: Tool[] = [
  { id: 'tool-coach-foundation', name: 'Coach Foundation', category: 'Platform', status: 'connected', color: GRAY.white, description: 'Website host + LEVERAGE Framework membership-site content production. No IP interest in ILS content.' },
  { id: 'tool-linkedin', name: 'LinkedIn', category: 'Social', status: 'connected', color: GRAY.light, description: 'Primary organic content/thought-leadership channel; not yet a systematized acquisition funnel.' },
  { id: 'tool-website', name: 'Website (drrpl.com)', category: 'Marketing', status: 'connected', color: GRAY.mid, description: 'Long-form articles, course content, lead-gen pages, conversion into the complimentary coaching session.' },
  { id: 'tool-email', name: 'Email / Newsletter', category: 'Marketing', status: 'planned', color: GRAY.dim, description: 'Ongoing education on scaling, leadership, profitability, AI — not yet instrumented (no subscriber history tracked).' },
  { id: 'tool-youtube', name: 'YouTube / Video', category: 'Marketing', status: 'planned', color: GRAY.light, description: 'Deeper educational content, business diagnostics, LEVERAGE concept explanations — not yet a live, tracked channel.' },
  { id: 'tool-webinars', name: 'Speaking & Webinars', category: 'Marketing', status: 'planned', color: GRAY.dim, description: 'Executive education, workshops, industry events — lead generation through live interaction; not yet tracked.' },
  { id: 'tool-claude-code', name: 'Claude Code', category: 'Orchestration', status: 'connected', color: GRAY.white, description: 'Runs ILS\'s 43 agent personas and its 2 real skills (/linkedin-post-draft, /brand-voice-audit).' },
];

const roadmap: RoadmapItem[] = [
  { id: 'rm-v1', title: 'FOUNDER OS v1 baseline', quarter: '2026-Q2', status: 'done', departmentId: 'dept-tech', description: 'Six views, SQLite repos, 32 tests.' },
  { id: 'rm-mono', title: 'Monochrome rebuild + real connectors', quarter: '2026-Q2', status: 'done', departmentId: 'dept-tech', description: 'Black & white theme; IMAP, Slack, Stripe, Notion, gbrain wired.' },
  { id: 'rm-gbrain', title: 'G-Brain provider live', quarter: '2026-Q2', status: 'done', departmentId: 'dept-tech', description: 'gbrain CLI doctor/query + brain-store local fallback.' },
  { id: 'rm-creds-email', title: 'Connect 4 email inboxes', quarter: '2026-Q2', status: 'now', departmentId: 'dept-comms', description: 'App passwords / IMAP creds into .env.local slots 1-4.' },
  { id: 'rm-creds-slack', title: 'Connect Slack workspace', quarter: '2026-Q2', status: 'now', departmentId: 'dept-comms', description: 'Bot token with channels:read, channels:history.' },
  { id: 'rm-creds-payments', title: 'Connect payment processors', quarter: '2026-Q2', status: 'now', departmentId: 'dept-finance', description: 'Stripe first; PayPal/Square/Whop as keys land.' },
  { id: 'rm-creds-notion', title: 'Connect Notion workspace', quarter: '2026-Q2', status: 'now', departmentId: 'dept-tech', description: 'Internal integration secret + page shares.' },
  { id: 'rm-supabase', title: 'Revive Supabase Second Brain', quarter: '2026-Q2', status: 'now', departmentId: 'dept-tech', description: 'Unpause free-tier project so gbrain hybrid queries resolve again.' },
  { id: 'rm-scheduler', title: 'Agent scheduler (cron runs)', quarter: '2026-Q3', status: 'next', departmentId: 'dept-tech', description: 'Recurring agent runs with run history and failure alerts.' },
  { id: 'rm-llm', title: 'LLM summarization layer', quarter: '2026-Q3', status: 'next', departmentId: 'dept-tech', description: 'Claude API digests over inbox/Slack/payments data.' },
  { id: 'rm-host', title: 'Migrate to a dedicated host', quarter: '2026-Q3', status: 'next', departmentId: 'dept-tech', description: 'Host app + gbrain + agents on the host; Supabase stays managed.' },
  { id: 'rm-ui', title: 'UI design pass', quarter: '2026-Q4', status: 'later', departmentId: 'dept-tech', description: 'Ramesh-led redesign once all integrations are live.' },
  { id: 'rm-auth', title: 'Auth + remote access', quarter: '2026-Q4', status: 'later', departmentId: 'dept-tech', description: 'Reach FOUNDER OS on the host from anywhere, safely.' },
];

// Honest zeros — these flip to live numbers as connectors come online.
const metrics: Metric[] = [
  { id: 'metric-unread', key: 'unread_total', label: 'Unread (all inboxes)', value: 0, unit: 'emails', delta: 0, period: 'pending creds' },
  { id: 'metric-brain', key: 'brain_pages', label: 'Brain-store Pages', value: 0, unit: 'pages', delta: 0, period: 'run Data Agent' },
  { id: 'metric-balance', key: 'stripe_available', label: 'Stripe Available', value: 0, unit: 'usd', delta: 0, period: 'pending creds' },
  { id: 'metric-runs', key: 'agent_runs', label: 'Agent Runs Logged', value: 0, unit: 'runs', delta: 0, period: 'all time' },
];

const domains: Domain[] = [
  { id: 'brm-1', number: 1, title: 'Command & Memory', color: GRAY.white, items: ['G-Brain (gbrain CLI)', 'brain-store markdown', 'Agent run history', 'Operator dashboard'] },
  { id: 'brm-2', number: 2, title: 'Email Operations', color: GRAY.light, items: ['Four IMAP inboxes', 'Unread triage', 'Per-inbox health', 'Digest (planned)'] },
  { id: 'brm-3', number: 3, title: 'Team Comms', color: GRAY.light, items: ['Slack channels', 'Message digests', 'Mention tracking (planned)'] },
  { id: 'brm-4', number: 4, title: 'Payments & Revenue', color: GRAY.mid, items: ['Stripe balance + charges', 'PayPal / Square / Whop registry', 'Reconciliation (planned)'] },
  { id: 'brm-5', number: 5, title: 'Knowledge & Docs', color: GRAY.mid, items: ['Notion workspace', 'ZeroEntropy embeddings', 'Supabase Second Brain'] },
  { id: 'brm-6', number: 6, title: 'Agent Runtime', color: GRAY.dim, items: ['Registry + run()', 'Persisted run log', 'Honest failure states'] },
  { id: 'brm-7', number: 7, title: 'Infrastructure', color: GRAY.dim, items: ['Current host', 'dedicated host (next)', 'SQLite local', 'Supabase managed'] },
  { id: 'brm-8', number: 8, title: 'Security', color: GRAY.dark, items: ['.env.local secrets (gitignored)', 'Read-only connector scopes', 'No keys in repo'] },
];

const phases: Phase[] = [
  { id: 'phase-1', number: 1, title: 'Real Connections', items: ['4 email inboxes', 'Slack', 'Payment processors', 'Notion', 'G-Brain'] },
  { id: 'phase-2', number: 2, title: 'Real Agents', items: ['Runtime + run log', 'Honest status board', 'On-demand runs'] },
  { id: 'phase-3', number: 3, title: 'Autonomy', items: ['Scheduled runs', 'LLM digests', 'Failure alerts'] },
  { id: 'phase-4', number: 4, title: 'Dedicated Host', items: ['Migrate compute', 'Remote access + auth', '24/7 uptime'] },
];

// The @founderos.ai footprint, handles straight from the Postly config.
const socialAccounts: SocialAccount[] = [
  { platform: 'instagram', handle: '@founderos.ai', url: 'https://instagram.com/founderos.ai', order: 1 },
  { platform: 'tiktok', handle: '@founderos.ai', url: 'https://tiktok.com/@founderos.ai', order: 2 },
  { platform: 'twitter', handle: '@Founderosai', url: 'https://x.com/Founderosai', order: 3 },
  { platform: 'youtube', handle: '@founderosai', url: 'https://youtube.com/@founderosai', order: 4 },
  { platform: 'linkedin', handle: 'Ramesh Prasad', url: null, order: 5 },
];

// Demo follower counts. LinkedIn has no baseline in this demo, so it gets
// honest nulls until scrapes land. Live syncs append from here.
// 91 days of DAILY snapshot dates ending on the final seeded capture, so
// the audience lines read densely at every 7/30/60/all-time window — which is
// also how the live daily Postly sync will fill them going forward.
const SERIES_END = '2026-06-12';
const SERIES_LEN = 91;
const SERIES_DATES: string[] = (() => {
  const end = new Date(`${SERIES_END}T00:00:00Z`);
  const out: string[] = [];
  for (let i = SERIES_LEN - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
})();

/**
 * Deterministic upward ramp from `start` to `end` across SERIES_DATES, with a
 * seeded organic wobble (two mixed frequencies + a slow drift) so daily history
 * reads like real growth rather than a straight line. The final point is forced
 * to `end` so the latest dummy value matches the seeded current value.
 */
function ramp(start: number, end: number, seed: number): number[] {
  const n = SERIES_DATES.length;
  const span = Math.abs(end - start);
  return SERIES_DATES.map((_, i) => {
    if (i === n - 1) return end;
    const t = i / (n - 1);
    // Smooth-ish accelerating trend (subtle S-curve) plus layered jitter.
    const trend = start + (end - start) * (0.7 * t + 0.3 * t * t);
    const wobble =
      (Math.sin(i * 0.7 + seed) * 0.6 + Math.sin(i * 0.27 + seed * 2) * 0.4) * span * 0.012;
    return Math.max(0, Math.round(trend + wobble));
  });
}

// Demo current follower counts; LinkedIn history is fully DUMMY. Each
// platform ramps up to its current value.
const FOLLOWER_TARGETS: { platform: SocialAccount['platform']; start: number; end: number }[] = [
  { platform: 'instagram', start: 30000, end: 42000 },
  { platform: 'tiktok', start: 6000, end: 12000 },
  { platform: 'twitter', start: 3000, end: 5200 },
  { platform: 'youtube', start: 300, end: 900 },
  { platform: 'linkedin', start: 800, end: 1500 },
];

const socialBaseline: SocialSnapshot[] = FOLLOWER_TARGETS.flatMap((t, ti) =>
  ramp(t.start, t.end, ti + 1).map((followers, i) => ({
    platform: t.platform,
    capturedAt: SERIES_DATES[i],
    followers,
    // the final seeded point keeps its source; history is seeded dummy
    source: i === SERIES_DATES.length - 1 && t.platform !== 'linkedin' ? 'postly-config' : 'seed-dummy',
  })),
);

// Email list — demo Beehiiv snapshot. Beehiiv's stats endpoint exposes only
// current + all-time aggregates, not a daily series, so we seed the honest
// shape: the list exists from a single import date and sits essentially flat
// over the window. Once BEEHIIV_API_KEY lands, syncBeehiivEmail overwrites
// today's point with the live count.
const BEEHIIV_IMPORT_DATE = '2026-05-28';
const BEEHIIV_ACTIVE_SUBSCRIBERS = 1850;
const emailListDates = SERIES_DATES.filter((d) => d >= BEEHIIV_IMPORT_DATE);
const emailListBaseline: EmailListSnapshot[] = emailListDates.map((capturedAt, i) => ({
  capturedAt,
  // flat since the import; the final point is the seeded current value
  subscribers: i === emailListDates.length - 1 ? BEEHIIV_ACTIVE_SUBSCRIBERS : BEEHIIV_ACTIVE_SUBSCRIBERS - 1,
  source: 'seed-beehiiv',
}));

// DM counts — DUMMY until a DMFlow/Postly source is wired. Current totals…
const DM_TARGETS: { platform: SocialDm['platform']; start: number; end: number }[] = [
  { platform: 'instagram', start: 820, end: 1240 },
  { platform: 'tiktok', start: 210, end: 386 },
  { platform: 'twitter', start: 120, end: 214 },
  { platform: 'youtube', start: 26, end: 58 },
  { platform: 'linkedin', start: 44, end: 92 },
];
const socialDms: SocialDm[] = DM_TARGETS.map((t) => ({
  platform: t.platform,
  count: t.end,
  updatedAt: '2026-06-12',
}));

// Instagram DM inbox — realistic seeded conversations so the /social DM tab is
// alive on a fresh clone. DUMMY until the DMFlow webhook feeds it live
// (source 'seed-dummy'; real messages arrive as source 'dmflow'). Four
// threads, inbound + outbound, believable Vantage / FounderOS lead-gen tone.
const socialDmMessages: SocialDmMessage[] = [
  // Alex — agency owner off a reel
  ['ig-alex', 'Alex Rivera', 'alex.rivera', 'in', 'saw your reel on the 3-agent setup 🔥 do you actually work with agencies?', null, '2026-07-18T14:02:00.000Z'],
  ['ig-alex', 'Alex Rivera', 'alex.rivera', 'out', 'appreciate it! yeah — agencies are exactly who Vantage is built for. what are you running right now?', null, '2026-07-18T14:09:00.000Z'],
  ['ig-alex', 'Alex Rivera', 'alex.rivera', 'in', 'SMMA, ~12 clients, drowning in fulfillment tbh 😅', null, '2026-07-18T14:15:00.000Z'],
  // Jordan — keyword flow "SCALE"
  ['ig-jordan', 'Jordan Blake', 'jordanbuilds', 'in', 'SCALE', 'SCALE', '2026-07-18T12:41:00.000Z'],
  ['ig-jordan', 'Jordan Blake', 'jordanbuilds', 'out', 'boom 💥 here’s the free breakdown → founderos.ai/scale. want me to show how it maps to your funnel?', 'SCALE', '2026-07-18T12:41:20.000Z'],
  ['ig-jordan', 'Jordan Blake', 'jordanbuilds', 'in', 'yes pls', null, '2026-07-18T13:05:00.000Z'],
  // Priya — story reply
  ['ig-priya', 'Priya N', 'priya.builds', 'in', 'replied to your story — I want OUT of retainer hell 😩', null, '2026-07-17T21:12:00.000Z'],
  ['ig-priya', 'Priya N', 'priya.builds', 'out', 'lol felt. that’s the whole thesis. what’s your current model — retainers or projects?', null, '2026-07-17T21:30:00.000Z'],
  // Sam — pricing question (unreplied → shows as needing attention)
  ['ig-sam', 'Sam Ortiz', 'sam.ortiz.co', 'in', 'what does pricing look like for the done-for-you build?', null, '2026-07-18T15:48:00.000Z'],
].map(([subscriberId, name, handle, direction, text, tag, ts], i) => ({
  id: `dm-${subscriberId}-${i}`,
  platform: 'instagram' as const,
  subscriberId: subscriberId as string,
  name: name as string,
  handle: handle as string,
  text: text as string,
  direction: direction as SocialDmMessage['direction'],
  tag: tag as string | null,
  ts: ts as string,
  source: 'seed-dummy',
}));
// …and the per-day history behind them, so DM growth charts over every window.
const socialDmSnapshots: SocialDmSnapshot[] = DM_TARGETS.flatMap((t, ti) =>
  ramp(t.start, t.end, ti + 50).map((count, i) => ({
    platform: t.platform,
    capturedAt: SERIES_DATES[i],
    count,
    source: 'seed-dummy',
  })),
);

// One example queued post so the composer's queue isn't empty on first load.
const socialPosts: SocialPost[] = [
  {
    id: 'post-seed-1',
    caption: 'New Vantage case study — 3x pipeline in 60 days. Full breakdown dropping this week 🚀',
    mediaUrl: null,
    platforms: ['instagram', 'tiktok', 'twitter'],
    status: 'queued',
    scheduledFor: null,
    createdAt: '2026-06-12T18:00:00Z',
  },
];

// ── Funnel journeys — honestly empty (INV-1 truth gate) ─────────────────────
// The demo shipped this dataset as fabricated dummy clients (Jake Moreau, Ava
// Stone, etc.) with invented deal amounts. ILS's own INVARIANTS.md (INV-1,
// "a blank beats a fabrication") and company.yaml both confirm no funnel/CRM
// data is tracked yet, so this stays empty rather than relabeling fake
// clients as ILS's. funnel-live.ts / funnel-ghl.ts (live Attio/GHL providers)
// stay wired for when a real funnel source exists; /funnel falls back to
// this seed, which honestly renders empty until then.
const funnelDay = (daysBack: number): string =>
  new Date(Date.now() - daysBack * 86_400_000).toISOString().slice(0, 10);

type SeededTouch = [FunnelTouch['stage'], FunnelTouch['channel'], string, FunnelTouch['source'], number];
type SeededJourney = {
  id: string;
  name: string;
  venture: FunnelContact['venture'];
  relationship: FunnelContact['relationship'];
  likelihood: number; // 0–100 likelihood-to-buy (dummy; later CRM/Trakyo-scored)
  product?: string;
  amountUsd?: number;
  email?: string; // dummy contact channels so the demo shows outreach actions
  phone?: string;
  person?: string; // the human behind the deal — demo dossier identity
  company?: string;
  role?: string;
  linkedin?: string;
  touches: SeededTouch[]; // 4–5, chronological (last number = days ago)
};

const FUNNEL_JOURNEYS: SeededJourney[] = [
];

const funnelContacts: FunnelContact[] = FUNNEL_JOURNEYS.map((j) => ({
  id: j.id,
  name: j.name,
  venture: j.venture,
  status: j.touches[j.touches.length - 1][0], // furthest stage reached
  product: j.product ?? null,
  amountUsd: j.amountUsd ?? null,
  relationship: j.relationship,
  likelihood: j.likelihood,
  url: null,
  email: j.email ?? null,
  phone: j.phone ?? null,
  person: j.person ?? null,
  company: j.company ?? null,
  role: j.role ?? null,
  linkedin: j.linkedin ?? null,
  createdAt: funnelDay(j.touches[0][4]), // journey starts at the first touch
}));

const funnelTouches: FunnelTouch[] = FUNNEL_JOURNEYS.flatMap((j) =>
  j.touches.map(([stage, channel, label, source, daysBack], i) => ({
    id: `${j.id}-t${i + 1}`,
    contactId: j.id,
    seq: i + 1,
    stage,
    channel,
    label,
    source,
    at: funnelDay(daysBack),
  })),
);

// The machine, mapped: each venture's process as an owned chain of steps.
// Real-ready — owners, weekly hours, tools, the bottlenecks that leak money,
// and the automations (live or suggested) that carry the load back.
// ILS's 4 real cross-agent workflows, documented in agents/README.md's
// "Marketing & Brand — cross-agent workflows" section. Per INV-1 (truth
// gate), hoursPerWeek/revenueUsd/leakUsd/automation.recoveredUsd are 0/null
// throughout — none of that is instrumented yet (company.yaml confirms
// offer_architecture.economics is blank). 0 is a placeholder signaling
// "not measured," never a claimed real number.
const workflows: Workflow[] = [
  {
    id: 'wf-ils-content-pipeline',
    name: 'Content pipeline',
    subtitle: 'The routine weekly flow: pillar to published post.',
    revenueUsd: 0,
    order: 0,
    steps: [
      {
        id: 'wf-cp-1',
        title: 'Pick pillar + real pain point + funnel step',
        ownerKind: 'agent',
        owner: 'content-strategy',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'brief',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-cp-2',
        title: 'Draft, in-voice, from the brief',
        ownerKind: 'agent',
        owner: 'linkedin',
        hoursPerWeek: 0,
        tools: ['linkedin'],
        edgeLabel: 'draft',
        leakUsd: null,
        automation: { title: 'Claude Code skill: /linkedin-post-draft', state: 'live', recoveredUsd: 0 },
      },
      {
        id: 'wf-cp-3',
        title: 'Voice + positioning check',
        ownerKind: 'agent',
        owner: 'brand-positioning',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'checked',
        leakUsd: null,
        automation: { title: 'Claude Code skill: /brand-voice-audit', state: 'live', recoveredUsd: 0 },
      },
      {
        id: 'wf-cp-4',
        title: 'Sign-off',
        ownerKind: 'human',
        owner: 'Ramesh Prasad',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'approved',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-cp-5',
        title: 'Publish',
        ownerKind: 'human',
        owner: 'Ramesh Prasad',
        hoursPerWeek: 0,
        tools: ['linkedin'],
        edgeLabel: 'tracked, once instrumented',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-cp-6',
        title: 'Track performance',
        ownerKind: 'agent',
        owner: 'marketing-analytics',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: null,
        leakUsd: null,
        automation: null,
      },
    ],
  },
  {
    id: 'wf-ils-campaign-launch',
    name: 'Campaign launch',
    subtitle: 'Offer-specific push: complimentary session or LEVERAGE.',
    revenueUsd: 0,
    order: 1,
    steps: [
      {
        id: 'wf-cl-1',
        title: 'Scope the campaign (never the unbuilt Assessment)',
        ownerKind: 'agent',
        owner: 'campaign-management',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'requests assets',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-cl-2',
        title: 'Draft LinkedIn posts + copy assets',
        ownerKind: 'agent',
        owner: 'copywriting',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'assets',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-cl-3',
        title: 'Brand & positioning check',
        ownerKind: 'agent',
        owner: 'brand-positioning',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'checked',
        leakUsd: null,
        automation: { title: 'Claude Code skill: /brand-voice-audit', state: 'live', recoveredUsd: 0 },
      },
      {
        id: 'wf-cl-4',
        title: 'Sign-off + launch',
        ownerKind: 'human',
        owner: 'Ramesh Prasad',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'launched',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-cl-5',
        title: 'Route interested-but-not-ready leads to nurture; qualified leads to sales',
        ownerKind: 'agent',
        owner: 'lead-nurture',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: null,
        leakUsd: null,
        automation: null,
      },
    ],
  },
  {
    id: 'wf-ils-lead-nurture-sales',
    name: 'Lead nurture → sales handoff',
    subtitle: 'Not-ready prospect to qualified discovery call.',
    revenueUsd: 0,
    order: 2,
    steps: [
      {
        id: 'wf-ln-1',
        title: 'Map the prospect’s specific objection',
        ownerKind: 'agent',
        owner: 'lead-nurture',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'objection mapped',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-ln-2',
        title: 'One educational touch, diagnosis-first, no pressure',
        ownerKind: 'agent',
        owner: 'lead-nurture',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'qualification check',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-ln-3',
        title: 'Qualify against conversion_sales.qualification_criteria',
        ownerKind: 'agent',
        owner: 'lead-qualification',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'qualified',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-ln-4',
        title: 'Discovery preparation',
        ownerKind: 'agent',
        owner: 'discovery-preparation',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'complimentary session',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-ln-5',
        title: 'Proposal, if coaching is the live recommendation',
        ownerKind: 'agent',
        owner: 'proposal',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: null,
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-ln-6',
        title: 'Sales follow-up',
        ownerKind: 'agent',
        owner: 'sales-follow-up',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: null,
        leakUsd: null,
        automation: null,
      },
    ],
  },
  {
    id: 'wf-ils-escalation',
    name: 'Escalation',
    subtitle: 'Any agent blocked by missing company.yaml context.',
    revenueUsd: 0,
    order: 3,
    steps: [
      {
        id: 'wf-esc-1',
        title: 'Specialist hits a blank/thin company.yaml compartment',
        ownerKind: 'agent',
        owner: 'marketing-director',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'escalate to department head, else Chief of Staff',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-esc-2',
        title: 'Chief of Staff routes and filters',
        ownerKind: 'agent',
        owner: 'chief-of-staff',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: 'flags to Ramesh',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-esc-3',
        title: 'Accept as known punch-list item, or run interview-mode',
        ownerKind: 'human',
        owner: 'Ramesh Prasad',
        hoursPerWeek: 0,
        tools: [],
        edgeLabel: null,
        leakUsd: null,
        automation: null,
      },
    ],
  },
];

// Agent task board — seeded across open/doing/done so the Kanban is alive on
// first load. Demo cards; user-added tasks coexist (we insert by id, never wipe).
const SEED_TS = '2026-07-21T12:00:00.000Z';
// Task titles reflect each agent's real, documented job (agents/*.md) — no
// fabricated activity or numbers (INV-1).
const agentTasks: AgentTask[] = [
  { id: 'task-seed-1', agentId: 'content-strategy', title: 'Pick this week’s pillar + real pain point + funnel step', status: 'open', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-2', agentId: 'linkedin', title: 'Draft the next LinkedIn post from Content Strategy’s brief', status: 'open', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-3', agentId: 'lead-nurture', title: 'Map the specific objection for a not-ready prospect', status: 'open', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-4', agentId: 'brand-positioning', title: 'Run the voice + positioning check on a pending draft', status: 'doing', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-5', agentId: 'copywriting', title: 'Draft copy assets for the current campaign scope', status: 'doing', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-6', agentId: 'lead-qualification', title: 'Qualify a lead against conversion_sales.qualification_criteria', status: 'doing', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-7', agentId: 'discovery-preparation', title: 'Prep the next complimentary coaching session', status: 'doing', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-8', agentId: 'campaign-management', title: 'Scope the next campaign (complimentary session or LEVERAGE)', status: 'done', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-9', agentId: 'chief-of-staff', title: 'Escalate a blank company.yaml compartment to Ramesh', status: 'done', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-10', agentId: 'marketing-director', title: 'Review the week’s content pipeline output', status: 'done', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-11', agentId: 'sales-follow-up', title: 'Follow up after a completed discovery call', status: 'done', createdAt: SEED_TS, updatedAt: SEED_TS },
];

const SKILL_STATUS_NOTE: Record<string, string> = {
  live: 'Live in production. The owning agent runs this today.',
  learning: 'In training. Runs with a human in the loop while it calibrates.',
  planned: 'Planned. Scoped and queued, not yet wired.',
};

/** Compose a real-ready SKILL.md doc from a skill's fields (viewed from its card). */
function skillDoc(s: Omit<Skill, 'markdown'>): string {
  const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const toolLine = s.tools.length ? s.tools.map((t) => `\`${t}\``).join(', ') : 'no external tools';
  return `---
name: ${slug}
description: ${s.description}
category: ${s.category}
status: ${s.status}
---

# ${s.name}

${s.description}

## When to use
Reach for this when the ${s.category.toLowerCase()} flow needs to ${s.name.toLowerCase()}. It runs on ${toolLine}.

## Status
${SKILL_STATUS_NOTE[s.status] ?? s.status}
`;
}

// The capability library the agent workforce draws on.
// ILS's real capability library — the 2 of 43 agents that own a real,
// running Claude Code skill (ILS/skills/*/SKILL.md). Everything else in the
// roster is honestly `planned` at the agent level (see agents array above),
// not padded out here with capabilities that don't exist yet.
const skills: Omit<Skill, 'markdown'>[] = [
  { id: 'skill-linkedin-post-draft', name: 'LinkedIn Post Draft', category: 'Marketing', description: 'Writes one publish-ready LinkedIn post in Ramesh’s voice from Content Strategy’s brief — ILS’s primary and only systematized organic acquisition channel today.', ownerAgentId: 'linkedin', status: 'live', tools: [], order: 0 },
  { id: 'skill-brand-voice-audit', name: 'Brand Voice Audit', category: 'Marketing', description: 'Reviews a marketing draft against ILS’s real voice and positioning before it reaches Ramesh for sign-off — pass/fail per axis with line-level notes, never a silent rewrite.', ownerAgentId: 'brand-positioning', status: 'live', tools: [], order: 1 },
];

// --- Eloan4Home: Encoded Businesses/Eloan4Home, scaffold built 2026-08-12,
// agent roster built 2026-08-19. Ramesh is the sole licensed Broker/Loan
// Officer (NMLS #237685) — 38 agents across 8 departments, three drafting
// passes with Ramesh (agents/README.md), every agent grounded in the real
// company.yaml content from the 2026-08-12 intake. Zero skills authored yet,
// so every agent is honestly 'planned' — judgment without automation.
const eloan4homeDepartments: Department[] = [
  { id: 'dept-executive', name: 'Executive & Strategy', slug: 'executive', tagline: 'Escalation routing and cross-department synthesis to Ramesh.', color: '#111827', order: 1 },
  { id: 'dept-marketing', name: 'Marketing & Referral Growth', slug: 'marketing', tagline: 'Content, campaigns, and the ~4 active Realtor referral partnerships.', color: '#1D4ED8', order: 2 },
  { id: 'dept-sales', name: 'Sales & Borrower Intake', slug: 'sales', tagline: 'The real sales process — Prospect through the one-on-one Mortgage Session to a decision path.', color: '#B91C1C', order: 3 },
  { id: 'dept-origination', name: 'Loan Origination & Lender Placement', slug: 'origination', tagline: '14 real loan programs; wholesale lender panel described but not yet populated.', color: '#7C3AED', order: 4 },
  { id: 'dept-processing', name: 'Processing, Pipeline & Closing', slug: 'processing', tagline: 'Application through Closed — the one part of the funnel confirmed live in Encompass today.', color: '#B45309', order: 5 },
  { id: 'dept-education', name: 'Client Education & Retention', slug: 'education', tagline: 'The real content pillars, plus past-client reactivation — the strongest referral source, not yet systematized.', color: '#0D9488', order: 6 },
  { id: 'dept-compliance', name: 'Compliance & Quality Control', slug: 'compliance', tagline: 'Fair lending, no invented pricing, licensing boundary — real regulatory weight, kept its own department.', color: '#57534E', order: 7 },
  { id: 'dept-finance-tech', name: 'Finance, Technology & Systems', slug: 'finance-tech', tagline: 'The real commission model, plus the CRM/nurture gap that blocks four other departments.', color: '#047857', order: 8 },
];

const eloan4homeAgents: Agent[] = [
  // ── 01 Executive & Strategy ──────────────────────────────────────────
  { id: 'chief-of-staff', departmentId: 'dept-executive', name: 'Chief of Staff', role: 'Chief of Staff', status: 'planned', tier: 'lead', description: "Top of Eloan4Home's agent chain: routes all 7 other department heads' escalations to Ramesh, tracks the CRM/nurture-layer gap as the real relaunch bottleneck.", model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: null, instance: 'builtin' },
  { id: 'strategy', departmentId: 'dept-executive', name: 'Strategy', role: 'Strategy Agent', status: 'planned', tier: 'specialist', description: 'Holds the relaunch priority order (lead-gen predictability, then operational efficiency, then advisory repositioning) and the real "advisory resource, not rate-shopper" positioning.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'executive-reporting', departmentId: 'dept-executive', name: 'Executive Reporting', role: 'Executive Reporting Agent', status: 'planned', tier: 'specialist', description: 'Reports what is actually measured vs. an honest gap — almost none of the 17 funnel or 10 commission metrics are instrumented yet.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },

  // ── 02 Marketing & Referral Growth ───────────────────────────────────
  { id: 'marketing-director', departmentId: 'dept-marketing', name: 'Marketing Director', role: 'Director of Marketing & Referral Growth', status: 'planned', tier: 'lead', description: 'Owns the content-to-conversion path and the core content principle; knows the diagnosed Facebook Ads failure (inquiries, zero funded loans, no nurture layer) and checks every new campaign against it.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'content', departmentId: 'dept-marketing', name: 'Content', role: 'Content Agent', status: 'planned', tier: 'specialist', description: 'Writes Facebook/Instagram/Email/SMS content across the 4 real content pillars, with the compliance disclaimer required on every illustrative pricing scenario.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'marketing-director', instance: 'builtin' },
  { id: 'campaign', departmentId: 'dept-marketing', name: 'Campaign', role: 'Campaign Agent', status: 'planned', tier: 'specialist', description: 'Scopes paid campaigns; must check every new push against the diagnosed Facebook Ads failure before launch.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'WebSearch'], parentId: 'marketing-director', instance: 'builtin' },
  { id: 'realtor-partnership', departmentId: 'dept-marketing', name: 'Realtor Partnership', role: 'Realtor Partnership Agent', status: 'planned', tier: 'specialist', description: 'Maintains the ~4 real active Realtor referral partners and the dormant reactivation pool — "earn through performance, maintain through communication, grow through results," never "send me your leads."', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'marketing-director', instance: 'builtin' },
  { id: 'marketing-analytics', departmentId: 'dept-marketing', name: 'Marketing Analytics', role: 'Marketing Analytics Agent', status: 'planned', tier: 'specialist', description: 'Reports what is and is not instrumented — none of the 17 real funnel metrics are tracked yet, and says so plainly rather than estimating.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'marketing-director', instance: 'builtin' },

  // ── 03 Sales & Borrower Intake ───────────────────────────────────────
  { id: 'borrower-intake-manager', departmentId: 'dept-sales', name: 'Borrower Intake Manager', role: 'Borrower Intake Manager', status: 'planned', tier: 'lead', description: 'Owns the real sales process (Prospect → One-on-One Session → Documentation → Qualification → Realtor Handoff) and the marketing-vs-mortgage qualification distinction.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'lead-qualification', departmentId: 'dept-sales', name: 'Lead Qualification', role: 'Lead Qualification Agent', status: 'planned', tier: 'specialist', description: 'Screens inbound interest for real mortgage intent vs. early browsing before a one-on-one session is scheduled.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'borrower-intake-manager', instance: 'builtin' },
  { id: 'borrower-intake', departmentId: 'dept-sales', name: 'Borrower Intake', role: 'Borrower Intake Agent', status: 'planned', tier: 'specialist', description: 'Runs the one-on-one Mortgage Session structure: Diagnosis → Strategy → Qualification → Next Step, capturing the full real intake topic set.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'borrower-intake-manager', instance: 'builtin' },
  { id: 'mortgage-readiness', departmentId: 'dept-sales', name: 'Mortgage Readiness', role: 'Mortgage Readiness Agent', status: 'planned', tier: 'specialist', description: 'Issues the Ready-now / Not-yet-qualified call from a completed intake — not-yet-qualified routes to CRM Nurture, never discarded.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'borrower-intake-manager', instance: 'builtin' },
  { id: 'consultation-prep', departmentId: 'dept-sales', name: 'Consultation Prep', role: 'Consultation Prep Agent', status: 'planned', tier: 'specialist', description: 'Preps Ramesh for each upcoming one-on-one session — what is known vs. still open.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'borrower-intake-manager', instance: 'builtin' },
  { id: 'follow-up', departmentId: 'dept-sales', name: 'Follow-Up', role: 'Follow-Up Agent', status: 'planned', tier: 'specialist', description: 'Executes the real decision path after a session — qualified-buyer, not-yet-qualified, or refinance-prospect — each with its own real next step.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'borrower-intake-manager', instance: 'builtin' },

  // ── 04 Loan Origination & Lender Placement ───────────────────────────
  { id: 'origination-manager', departmentId: 'dept-origination', name: 'Origination Manager', role: 'Origination Manager', status: 'planned', tier: 'lead', description: 'Owns the real 14-program list and the panel lender-selection principle (total execution profile, not just rate); the wholesale lender panel is still empty.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'loan-scenario', departmentId: 'dept-origination', name: 'Loan Scenario', role: 'Loan Scenario Agent', status: 'planned', tier: 'specialist', description: 'Structures a readiness diagnosis into a loan scenario — program-agnostic and pricing-free, from real intake facts only.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'origination-manager', instance: 'builtin' },
  { id: 'program-matching', departmentId: 'dept-origination', name: 'Program Matching', role: 'Program Matching Agent', status: 'planned', tier: 'specialist', description: 'Matches a scenario to the real 14-program list only — never an assumed or invented product.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'origination-manager', instance: 'builtin' },
  { id: 'lender-matching', departmentId: 'dept-origination', name: 'Lender Matching', role: 'Lender Matching Agent', status: 'planned', tier: 'specialist', description: 'Selects a wholesale lender per transaction — currently blocked, since the real lender panel is an empty array, a genuine punch-list item.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'origination-manager', instance: 'builtin' },
  { id: 'pricing-comparison', departmentId: 'dept-origination', name: 'Pricing Comparison', role: 'Pricing Comparison Agent', status: 'planned', tier: 'specialist', description: 'The most tightly gated agent in the workspace — pricing only from a live Encompass/Loanzify pull or Ramesh directly, never general knowledge (INV-2).', model: 'Persona only — no automation built', tools: ['Read'], parentId: 'origination-manager', instance: 'builtin' },
  { id: 'pre-approval-support', departmentId: 'dept-origination', name: 'Pre-Approval Support', role: 'Pre-Approval Support Agent', status: 'planned', tier: 'specialist', description: 'Supports pre-approval documentation and process status — never the determination itself, which belongs to Ramesh and underwriting alone.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'origination-manager', instance: 'builtin' },

  // ── 05 Processing, Pipeline & Closing ────────────────────────────────
  { id: 'pipeline-manager', departmentId: 'dept-processing', name: 'Pipeline Manager', role: 'Pipeline Manager', status: 'planned', tier: 'lead', description: 'Owns Application through Closed — the one stage range confirmed live in Encompass today, distinct from the still-designed Lead/Nurture/Prospect stages.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'document-collection', departmentId: 'dept-processing', name: 'Document Collection', role: 'Document Collection Agent', status: 'planned', tier: 'specialist', description: 'Manages program-specific document requests and intake tracking at the Application stage.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'pipeline-manager', instance: 'builtin' },
  { id: 'file-completeness', departmentId: 'dept-processing', name: 'File Completeness', role: 'File Completeness Agent', status: 'planned', tier: 'specialist', description: 'Gates whether a file is ready to move from Processing to Underwriting — presence, not compliance quality (that is File Quality Control’s separate check).', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'pipeline-manager', instance: 'builtin' },
  { id: 'conditions-tracking', departmentId: 'dept-processing', name: 'Conditions Tracking', role: 'Conditions Tracking Agent', status: 'planned', tier: 'specialist', description: 'Tracks lender-issued underwriting conditions — reports real conditions, never predicts or invents them.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'pipeline-manager', instance: 'builtin' },
  { id: 'closing-coordination', departmentId: 'dept-processing', name: 'Closing Coordination', role: 'Closing Coordination Agent', status: 'planned', tier: 'specialist', description: 'Coordinates Clear to Close through Funded/Closed — only after the lender has actually confirmed each stage.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'pipeline-manager', instance: 'builtin' },

  // ── 06 Client Education & Retention ──────────────────────────────────
  { id: 'client-success-manager', departmentId: 'dept-education', name: 'Client Success Manager', role: 'Client Success Manager', status: 'planned', tier: 'lead', description: 'Owns the real content pillars matched to awareness stage, and the named-but-unsystematized past-client reactivation opportunity.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'credit-education', departmentId: 'dept-education', name: 'Credit Education', role: 'Credit Education Agent', status: 'planned', tier: 'specialist', description: '"Before you rule yourself out, let’s determine where you actually stand" — the real Credit & Mortgage Readiness content pillar.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'client-success-manager', instance: 'builtin' },
  { id: 'first-time-buyer-education', departmentId: 'dept-education', name: 'First-Time Buyer Education', role: 'First-Time Buyer Education Agent', status: 'planned', tier: 'specialist', description: 'Owns the dominant First-Time Homebuyer Education pillar — "I don’t know where to start" to "I understand what I need to do next."', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'client-success-manager', instance: 'builtin' },
  { id: 'dpa-education', departmentId: 'dept-education', name: 'DPA Education', role: 'DPA Education Agent', status: 'planned', tier: 'specialist', description: 'Owns Down Payment Assistance education as a real financing strategy comparison, never framed as free money.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'client-success-manager', instance: 'builtin' },
  { id: 'long-term-nurture', departmentId: 'dept-education', name: 'Long-Term Nurture', role: 'Long-Term Nurture Agent', status: 'planned', tier: 'specialist', description: 'Owns the 12 real nurture tracks — sits directly on the CRM/nurture-layer gap and names it plainly rather than implying automation that isn’t built.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'client-success-manager', instance: 'builtin' },
  { id: 'post-closing', departmentId: 'dept-education', name: 'Post-Closing', role: 'Post-Closing Agent', status: 'planned', tier: 'specialist', description: 'Owns Closed → Past Client / Client-for-Life — past clients are the real strongest referral source today, reactivation just isn’t systematized yet.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'client-success-manager', instance: 'builtin' },

  // ── 07 Compliance & Quality Control ──────────────────────────────────
  { id: 'mortgage-compliance-officer', departmentId: 'dept-compliance', name: 'Mortgage Compliance Officer', role: 'Mortgage Compliance Officer', status: 'planned', tier: 'lead', description: 'Enforces the real 6 banned-phrase categories and INV-4 segmentation rules — kept its own department deliberately, given real regulatory weight.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'advertising-review', departmentId: 'dept-compliance', name: 'Advertising Review', role: 'Advertising Review Agent', status: 'planned', tier: 'specialist', description: 'Last check on marketing content before it reaches Ramesh — sweeps for all 6 real banned-phrase categories.', model: 'Persona only — no automation built', tools: ['Read', 'Grep'], parentId: 'mortgage-compliance-officer', instance: 'builtin' },
  { id: 'file-quality-control', departmentId: 'dept-compliance', name: 'File Quality Control', role: 'File Quality Control Agent', status: 'planned', tier: 'specialist', description: 'Audits files against INVARIANTS.md — distinct from File Completeness’s processing checklist.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'mortgage-compliance-officer', instance: 'builtin' },

  // ── 08 Finance, Technology & Systems ─────────────────────────────────
  { id: 'business-operations-manager', departmentId: 'dept-finance-tech', name: 'Business Operations Manager', role: 'Business Operations Manager', status: 'planned', tier: 'lead', description: 'Owns the real commission model and the CRM/nurture build as the workspace’s single highest-leverage project.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'revenue-commission', departmentId: 'dept-finance-tech', name: 'Revenue & Commission', role: 'Revenue & Commission Agent', status: 'planned', tier: 'specialist', description: 'Holds the real commission model (1.00%-2.75%, $550K avg. loan) — never reports a model figure as a measured actual.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'business-operations-manager', instance: 'builtin' },
  { id: 'crm-automation', departmentId: 'dept-finance-tech', name: 'CRM & Automation', role: 'CRM & Automation Agent', status: 'planned', tier: 'specialist', description: 'Owns the single most consequential gap in the workspace — the CRM/nurture layer is designed, not built, distinct from the real, live Encompass LOS.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'business-operations-manager', instance: 'builtin' },
  { id: 'knowledge-management', departmentId: 'dept-finance-tech', name: 'Knowledge Management', role: 'Knowledge Management Agent', status: 'planned', tier: 'specialist', description: 'Owns the still-empty reference/ library — points to real company.yaml content rather than a document that doesn’t exist yet.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'business-operations-manager', instance: 'builtin' },
];

const eloan4homeWorkflows: Workflow[] = [];
const eloan4homeSkills: Omit<Skill, 'markdown'>[] = [];
const eloan4homeAgentTasks: AgentTask[] = [];
const eloan4homeSopTasks: SopTask[] = [];

// --- Real Estate OS: Encoded Businesses/Real Estate OS, scaffold built
// 2026-08-13, agent roster built 2026-08-19. Deliberately asymmetric — 9
// departments cover Brokerage (the only division with live activity) in real
// depth (agents/README.md); the 10th (Emerging Divisions) is intentionally
// thin — 2 stewards, no department head — since Development and Temp Housing
// are dormant/pre-launch and INV-8 forbids implying otherwise. Zero skills
// authored yet, so every agent is honestly 'planned'.
const realEstateDepartments: Department[] = [
  { id: 'dept-executive', name: 'Executive & Strategy', slug: 'executive', tagline: 'Escalation routing, GCI north star, and division-honesty enforcement.', color: '#111827', order: 1 },
  { id: 'dept-marketing', name: 'Marketing & Content', slug: 'marketing', tagline: 'Content-to-action framework, brand positioning, and the testimonial truth gate.', color: '#1D4ED8', order: 2 },
  { id: 'dept-buyer', name: 'Buyer Representation', slug: 'buyer', tagline: 'The real 17-stage buyer_workflow — representation through offer.', color: '#B91C1C', order: 3 },
  { id: 'dept-seller', name: 'Seller Representation', slug: 'seller', tagline: 'The real 14-stage seller_workflow — listing through offer negotiation.', color: '#EA580C', order: 4 },
  { id: 'dept-investor', name: 'Investor Services', slug: 'investor', tagline: 'The real 13-stage investor_workflow — analysis-driven, never a guaranteed return.', color: '#7C3AED', order: 5 },
  { id: 'dept-transaction', name: 'Transaction Management & Closing', slug: 'transaction', tagline: 'The shared back-half of all 3 workflows — due diligence through close.', color: '#B45309', order: 6 },
  { id: 'dept-relations', name: 'Client Relations & Retention', slug: 'relations', tagline: 'Post-close nurture and referrals across all 3 client types, via TopProducer.', color: '#0D9488', order: 7 },
  { id: 'dept-compliance', name: 'Compliance & Quality Control', slug: 'compliance', tagline: 'Fair housing (19 real prohibited phrases), testimonial truth gate, affiliation accuracy.', color: '#57534E', order: 8 },
  { id: 'dept-finance', name: 'Finance & Operations', slug: 'finance', tagline: 'Real economics: $650K avg. transaction, $20M volume target, $1.5M GCI north star.', color: '#047857', order: 9 },
  { id: 'dept-emerging', name: 'Emerging Divisions', slug: 'emerging', tagline: 'Development and Temp Housing — dormant/pre-launch, kept deliberately thin (INV-8).', color: '#78716C', order: 10 },
];

const realEstateAgents: Agent[] = [
  // ── 01 Executive & Strategy ──────────────────────────────────────────
  { id: 'chief-of-staff', departmentId: 'dept-executive', name: 'Chief of Staff', role: 'Chief of Staff', status: 'planned', tier: 'lead', description: "Top of the agent chain: routes all 9 other department heads' and both stewards' escalations to Ramesh, tracks the $1.5M GCI north star, enforces Division Honesty across every cross-department report.", model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: null, instance: 'builtin' },
  { id: 'strategy', departmentId: 'dept-executive', name: 'Strategy', role: 'Strategy Agent', status: 'planned', tier: 'specialist', description: 'Holds the real volume math ($650K avg. transaction against a $20M annual volume target, ~31 transactions) and the real "Strategy Before Transaction" positioning.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'executive-reporting', departmentId: 'dept-executive', name: 'Executive Reporting', role: 'Executive Reporting Agent', status: 'planned', tier: 'specialist', description: 'Reports real GCI/volume progress from Excel commission tracking only, keeps Brokerage and the two dormant divisions strictly separated in every report.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },

  // ── 02 Marketing & Content ────────────────────────────────────────────
  { id: 'marketing-director', departmentId: 'dept-marketing', name: 'Marketing Director', role: 'Director of Marketing & Content', status: 'planned', tier: 'lead', description: 'Owns the real content-to-action framework and CTA style; gates every testimonial/results claim hard against a truth gate that is currently unestablished.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'content', departmentId: 'dept-marketing', name: 'Content', role: 'Content Agent', status: 'planned', tier: 'specialist', description: 'Writes general educational and past-client relationship-nurture content, audience-matched to real buyer/seller/investor desired actions.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'marketing-director', instance: 'builtin' },
  { id: 'listing-marketing', departmentId: 'dept-marketing', name: 'Listing Marketing', role: 'Listing Marketing Agent', status: 'planned', tier: 'specialist', description: 'Owns brand-level positioning concepts ("Strategy Before Transaction") — explicitly developing, not yet proven campaign winners.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'marketing-director', instance: 'builtin' },
  { id: 'marketing-analytics', departmentId: 'dept-marketing', name: 'Marketing Analytics', role: 'Marketing Analytics Agent', status: 'planned', tier: 'specialist', description: 'Reports the real attribution gap — acquisition/referral tracking is informal via TopProducer, not yet formally attributed.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'marketing-director', instance: 'builtin' },

  // ── 03 Buyer Representation ───────────────────────────────────────────
  { id: 'buyer-intake-manager', departmentId: 'dept-buyer', name: 'Buyer Intake Manager', role: 'Buyer Intake Manager', status: 'planned', tier: 'lead', description: 'Owns the front half of the real 17-stage buyer workflow — representation through offer submission — and the hard pre-approval/proof-of-funds qualification gate.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'buyer-qualification', departmentId: 'dept-buyer', name: 'Buyer Qualification', role: 'Buyer Qualification Agent', status: 'planned', tier: 'specialist', description: 'Verifies financial capacity via real verifiable pre-approval or proof of funds — never an unverified claim; holds the Eloan4Home separation rule.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'buyer-intake-manager', instance: 'builtin' },
  { id: 'property-matching', departmentId: 'dept-buyer', name: 'Property Matching', role: 'Property Matching Agent', status: 'planned', tier: 'specialist', description: 'Sources properties from real, current MLS data matched to the buyer’s real stated budget and criteria — never an estimated valuation.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'buyer-intake-manager', instance: 'builtin' },
  { id: 'showing-coordination', departmentId: 'dept-buyer', name: 'Showing Coordination', role: 'Showing Coordination Agent', status: 'planned', tier: 'specialist', description: 'Schedules and coordinates showings — no fair-housing/steering signals, no personal valuation opinions during a showing.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'buyer-intake-manager', instance: 'builtin' },
  { id: 'offer-strategy', departmentId: 'dept-buyer', name: 'Offer Strategy', role: 'Offer Strategy Agent', status: 'planned', tier: 'specialist', description: 'Drafts buyer offer strategy for Ramesh’s review — never a binding submission; hands off to Transaction Management once accepted.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'buyer-intake-manager', instance: 'builtin' },

  // ── 04 Seller Representation ──────────────────────────────────────────
  { id: 'listing-manager', departmentId: 'dept-seller', name: 'Listing Manager', role: 'Listing Manager', status: 'planned', tier: 'lead', description: 'Owns the front half of the real 14-stage seller workflow — consultation through offer acceptance — and the no-fixed-commission-rate rule.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'listing-preparation', departmentId: 'dept-seller', name: 'Listing Preparation', role: 'Listing Preparation Agent', status: 'planned', tier: 'specialist', description: 'Captures real seller objectives and supports listing-agreement prep — never suggests a listing price from general knowledge.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'listing-manager', instance: 'builtin' },
  { id: 'property-marketing', departmentId: 'dept-seller', name: 'Property Marketing', role: 'Property Marketing Agent', status: 'planned', tier: 'specialist', description: 'Executes real per-listing MLS/marketing work and buyer-activity tracking — distinct from Listing Marketing’s brand-level content.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'listing-manager', instance: 'builtin' },
  { id: 'offer-negotiation', departmentId: 'dept-seller', name: 'Offer Negotiation', role: 'Offer Negotiation Agent', status: 'planned', tier: 'specialist', description: 'Presents every real offer received and supports negotiation — never drafts a binding counter or acceptance itself.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'listing-manager', instance: 'builtin' },
  { id: 'seller-communication', departmentId: 'dept-seller', name: 'Seller Communication', role: 'Seller Communication Agent', status: 'planned', tier: 'specialist', description: 'Keeps the seller informed with real, stage-accurate status updates across the whole workflow.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'listing-manager', instance: 'builtin' },

  // ── 05 Investor Services ──────────────────────────────────────────────
  { id: 'investor-relations-manager', departmentId: 'dept-investor', name: 'Investor Relations Manager', role: 'Investor Relations Manager', status: 'planned', tier: 'lead', description: 'Owns the front half of the real 13-stage investor workflow — analysis-driven, never a promised return.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'investor-discovery', departmentId: 'dept-investor', name: 'Investor Discovery', role: 'Investor Discovery Agent', status: 'planned', tier: 'specialist', description: 'Interviews for real investor goals, budget, and compensation plan — never sets return expectations at discovery.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'investor-relations-manager', instance: 'builtin' },
  { id: 'property-sourcing', departmentId: 'dept-investor', name: 'Property Sourcing', role: 'Property Sourcing Agent', status: 'planned', tier: 'specialist', description: 'Sources and vets investment properties from real MLS/comp data — never produces a pro forma or ROI estimate from general knowledge.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'investor-relations-manager', instance: 'builtin' },
  { id: 'investment-presentation', departmentId: 'dept-investor', name: 'Investment Presentation', role: 'Investment Presentation Agent', status: 'planned', tier: 'specialist', description: 'Presents real sourced facts, analysis-driven — never guarantees appreciation, cash flow, or returns.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'investor-relations-manager', instance: 'builtin' },
  { id: 'acquisition-structuring', departmentId: 'dept-investor', name: 'Acquisition Structuring', role: 'Acquisition Structuring Agent', status: 'planned', tier: 'specialist', description: 'Drafts acquisition/participation structure options for Ramesh’s review — never a binding structure generated autonomously.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'investor-relations-manager', instance: 'builtin' },

  // ── 06 Transaction Management & Closing ───────────────────────────────
  { id: 'transaction-manager', departmentId: 'dept-transaction', name: 'Transaction Manager', role: 'Transaction Manager', status: 'planned', tier: 'lead', description: 'Owns the real shared back-half of all 3 client workflows — due diligence through close — and the real external TC relationship (Sarah Strickland / Top Performance T.C.).', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'due-diligence', departmentId: 'dept-transaction', name: 'Due Diligence', role: 'Due Diligence Agent', status: 'planned', tier: 'specialist', description: 'Tracks real inspection/disclosure findings across all 3 client types — never summarizes a report it hasn’t seen.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'transaction-manager', instance: 'builtin' },
  { id: 'financing-coordination', departmentId: 'dept-transaction', name: 'Financing Coordination', role: 'Financing Coordination Agent', status: 'planned', tier: 'specialist', description: 'Coordinates lender status only — never states loan terms or approval status; holds the Eloan4Home separation rule.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'transaction-manager', instance: 'builtin' },
  { id: 'closing-coordination', departmentId: 'dept-transaction', name: 'Closing Coordination', role: 'Closing Coordination Agent', status: 'planned', tier: 'specialist', description: 'Coordinates the close across all 3 client types only once escrow/title actually confirms it.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'transaction-manager', instance: 'builtin' },
  { id: 'transaction-documentation', departmentId: 'dept-transaction', name: 'Transaction Documentation', role: 'Transaction Documentation Agent', status: 'planned', tier: 'specialist', description: 'Tracks real zipForm status and coordinates with the real external transaction coordinator when engaged.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'transaction-manager', instance: 'builtin' },

  // ── 07 Client Relations & Retention ───────────────────────────────────
  { id: 'client-relations-manager', departmentId: 'dept-relations', name: 'Client Relations Manager', role: 'Client Relations Manager', status: 'planned', tier: 'lead', description: 'Owns post-close relationship work across all 3 client types via the real TopProducer CRM.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'referral', departmentId: 'dept-relations', name: 'Referral', role: 'Referral Agent', status: 'planned', tier: 'specialist', description: 'Runs the real referral-request close-out step — relationship-first, never commission-framed.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'client-relations-manager', instance: 'builtin' },
  { id: 'long-term-nurture', departmentId: 'dept-relations', name: 'Long-Term Nurture', role: 'Long-Term Nurture Agent', status: 'planned', tier: 'specialist', description: 'Drafts ongoing nurture content matched to real client history — never a guaranteed-performance claim.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'client-relations-manager', instance: 'builtin' },
  { id: 'post-closing', departmentId: 'dept-relations', name: 'Post-Closing', role: 'Post-Closing Agent', status: 'planned', tier: 'specialist', description: 'Sends the real, transaction-specific closing acknowledgment and confirms TopProducer entry.', model: 'Persona only — no automation built', tools: ['Read', 'Write', 'Edit'], parentId: 'client-relations-manager', instance: 'builtin' },

  // ── 08 Compliance & Quality Control ───────────────────────────────────
  { id: 'real-estate-compliance-officer', departmentId: 'dept-compliance', name: 'Real Estate Compliance Officer', role: 'Real Estate Compliance Officer', status: 'planned', tier: 'lead', description: 'Enforces the real 19-phrase fair-housing list, the testimonial truth gate, and affiliation accuracy — kept its own department given real regulatory weight.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'fair-housing-review', departmentId: 'dept-compliance', name: 'Fair Housing Review', role: 'Fair Housing Review Agent', status: 'planned', tier: 'specialist', description: 'Sweeps every listing/marketing piece against the real 19 prohibited fair-housing phrases plus indirect steering signals.', model: 'Persona only — no automation built', tools: ['Read', 'Grep'], parentId: 'real-estate-compliance-officer', instance: 'builtin' },
  { id: 'file-quality-control', departmentId: 'dept-compliance', name: 'File Quality Control', role: 'File Quality Control Agent', status: 'planned', tier: 'specialist', description: 'Audits closed files against INVARIANTS.md — distinct from Transaction Documentation’s completeness tracking.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'real-estate-compliance-officer', instance: 'builtin' },

  // ── 09 Finance & Operations ───────────────────────────────────────────
  { id: 'business-operations-manager', departmentId: 'dept-finance', name: 'Business Operations Manager', role: 'Business Operations Manager', status: 'planned', tier: 'lead', description: 'Owns the real economics ($650K/$20M/$1.5M GCI) and the real licensing facts (License #01321444, RE/MAX affiliation) — flags every unverified compliance gap honestly.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'revenue-commission', departmentId: 'dept-finance', name: 'Commission & GCI', role: 'Commission & GCI Agent', status: 'planned', tier: 'specialist', description: 'Holds the real $650K/$20M/$1.5M benchmarks — tracked via Excel only; never reports a projection as a measured actual.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'business-operations-manager', instance: 'builtin' },
  { id: 'mls-systems', departmentId: 'dept-finance', name: 'MLS & Systems', role: 'MLS & Systems Agent', status: 'planned', tier: 'specialist', description: 'Holds the real confirmed tech stack (TopProducer, MetroList, zipForm, DocuSign) and flags unconfirmed systems honestly.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'business-operations-manager', instance: 'builtin' },

  // ── 10 Emerging Divisions (dormant — INV-8, deliberately thin) ───────
  { id: 'development-steward', departmentId: 'dept-emerging', name: 'Development Steward', role: 'Development Steward', status: 'planned', tier: 'specialist', description: 'Holds the real Cornell Module 1 + proprietary 13-phase methodology reference pool — states plainly that Development has no active projects.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
  { id: 'temp-housing-steward', departmentId: 'dept-emerging', name: 'Temp Housing Steward', role: 'Temp Housing Steward', status: 'planned', tier: 'specialist', description: 'Holds the real Agginym/Amity Foundation reference pool (5 vendors, only 1 signed document) — states plainly that Temp Housing has no active project or residents.', model: 'Persona only — no automation built', tools: ['Read', 'Grep', 'Glob'], parentId: 'chief-of-staff', instance: 'builtin' },
];

const realEstateWorkflows: Workflow[] = [];
const realEstateSkills: Omit<Skill, 'markdown'>[] = [];
const realEstateAgentTasks: AgentTask[] = [];
const realEstateSopTasks: SopTask[] = [];

/**
 * The one thing that actually differs company to company: org structure, the
 * agent roster, the capability library, and the workflows they run. Everything
 * else seedDatabase writes below (tools, roadmap, metrics, social/funnel demo
 * data, ...) stays shared scaffolding across all three workspaces until each
 * company's real numbers replace it — same "blank beats fabrication" rule
 * INV-1 applies to, just not this session's scope.
 */
function identityFor(workspaceId: WorkspaceId) {
  switch (workspaceId) {
    case 'eloan4home':
      return {
        departments: eloan4homeDepartments,
        agents: eloan4homeAgents,
        workflows: eloan4homeWorkflows,
        skills: eloan4homeSkills,
        agentTasks: eloan4homeAgentTasks,
        sopTasks: eloan4homeSopTasks,
      };
    case 'real-estate-os':
      return {
        departments: realEstateDepartments,
        agents: realEstateAgents,
        workflows: realEstateWorkflows,
        skills: realEstateSkills,
        agentTasks: realEstateAgentTasks,
        sopTasks: realEstateSopTasks,
      };
    case 'ils':
    default:
      return { departments, agents, workflows, skills, agentTasks, sopTasks };
  }
}

export function seedDatabase(db: FounderDb, workspaceId: WorkspaceId = DEFAULT_WORKSPACE_ID): void {
  const identity = identityFor(workspaceId);
  // INSERT OR REPLACE in every repo makes re-seeding idempotent by id.
  for (const d of identity.departments) db.departments.insert(d);
  for (const a of identity.agents) db.agents.insert(a);
  // The roster IS the runtime: rows that left the roster leave the DB too,
  // and departments that left the operating model go with them.
  db.agents.deleteWhereIdNotIn(identity.agents.map((a) => a.id));
  db.departments.deleteWhereIdNotIn(identity.departments.map((d) => d.id));
  for (const p of people) db.people.insert(p);
  db.people.deleteWhereIdNotIn(people.map((p) => p.id));
  for (const m of leadMagnets) db.leadMagnets.insert(m);
  db.leadMagnets.deleteWhereIdNotIn(leadMagnets.map((m) => m.id));
  for (const t of identity.sopTasks) db.sopTasks.insert(t);
  db.sopTasks.deleteWhereIdNotIn(identity.sopTasks.map((t) => t.id));
  for (const w of identity.workflows) db.workflows.insert(w);
  db.workflows.deleteWhereIdNotIn(identity.workflows.map((w) => w.id));
  for (const s of identity.skills) db.skills.insert({ ...s, markdown: skillDoc(s) });
  db.skills.deleteWhereIdNotIn(identity.skills.map((s) => s.id));
  for (const t of identity.agentTasks) db.agentTasks.insert(t); // insert-by-id; user tasks coexist
  for (const t of tools) db.tools.insert(t);
  for (const r of roadmap) db.roadmap.insert(r);
  for (const m of metrics) db.metrics.insert(m);
  for (const d of domains) db.domains.insert(d);
  for (const p of PERSONAS) db.personas.insert(p);
  for (const p of phases) db.phases.insert(p);
  for (const a of socialAccounts) db.social.upsertAccount(a);
  for (const s of socialBaseline) db.social.insertSnapshot(s);
  for (const d of socialDms) db.social.upsertDm(d);
  for (const s of socialDmSnapshots) db.social.insertDmSnapshot(s);
  for (const m of socialDmMessages) db.social.upsertDmMessage(m);
  // Retired dummy email history leaves the DB on re-seed; the real Beehiiv
  // baseline is authoritative. Live-synced snapshots survive.
  db.emailList.deleteSeeded();
  for (const s of emailListBaseline) db.emailList.insertSnapshot(s);
  for (const p of socialPosts) db.socialPosts.enqueue(p);
  for (const c of funnelContacts) db.funnel.insertContact(c);
  for (const t of funnelTouches) db.funnel.insertTouch(t);
}
