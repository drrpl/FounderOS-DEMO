import type { FounderDb } from '@/lib/db';
import { PERSONAS } from '@/lib/personas-seed';
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
const tools: Tool[] = [
  // Knowledge
  { id: 'tool-gbrain', name: 'G-Brain (gbrain CLI)', category: 'Knowledge', status: 'connected', color: GRAY.white, description: 'v0.41 · brain-store markdown + Supabase + ZeroEntropy embeddings. Live.' },
  { id: 'tool-brain-store', name: 'brain-store/', category: 'Knowledge', status: 'connected', color: GRAY.light, description: 'Local markdown knowledge base at knowledge/brain-store.' },
  { id: 'tool-zeroentropy', name: 'ZeroEntropy', category: 'Knowledge', status: 'connected', color: GRAY.mid, description: 'Vector embeddings behind gbrain hybrid search. Key in ~/.config/knowledge/config.json.' },
  { id: 'tool-supabase', name: 'Supabase (Second Brain)', category: 'Knowledge', status: 'available', color: GRAY.mid, description: '1240 pages / 15k chunks. Free tier pauses on idle — unpause from dashboard when queries fail.' },
  { id: 'tool-obsidian', name: 'Notes Vault', category: 'Knowledge', status: 'connected', color: GRAY.light, description: 'Local notes vault. Direct filesystem access.' },
  { id: 'tool-notion', name: 'Notion', category: 'Knowledge', status: 'available', color: GRAY.dim, description: 'Client implemented. Set NOTION_API_KEY and share pages with the integration.' },
  // Social & growth
  { id: 'tool-postly', name: 'Postly', category: 'Social', status: 'connected', color: GRAY.white, description: '6 platforms under @founderos.ai (IG, TikTok, X…). Key at ~/.config/social/.env — live.' },
  { id: 'tool-dmflow', name: 'DMFlow', category: 'Social', status: 'available', color: GRAY.dim, description: 'DM automation. Endpoint map fully documented in shared-config; needs DMFLOW_API_KEY.' },
  { id: 'tool-skool', name: 'Skool (via Playwright)', category: 'Social', status: 'connected', color: GRAY.mid, description: 'launchpad-cohort community, driven by the documented Playwright workflow.' },
  // CRM & revenue
  { id: 'tool-ledger', name: 'Ledger', category: 'CRM & Revenue', status: 'connected', color: GRAY.white, description: 'Vantage + LC deals. Key reused from MCP config (read-scoped: query records, not lists).' },
  { id: 'tool-paykit', name: 'PayKit', category: 'CRM & Revenue', status: 'planned', color: GRAY.light, description: 'Offer/payment/customer context for Sales, including the Vantage PayKit lane.' },
  { id: 'tool-flexpay', name: 'FlexPay', category: 'CRM & Revenue', status: 'planned', color: GRAY.mid, description: 'Financing options for sales offers and payment-plan context.' },
  { id: 'tool-stripe', name: 'Stripe', category: 'CRM & Revenue', status: 'available', color: GRAY.light, description: 'Full client implemented — balance + charges live once STRIPE_SECRET_KEY is set.' },
  { id: 'tool-ghl', name: 'GoHighLevel', category: 'CRM & Revenue', status: 'planned', color: GRAY.dark, description: 'CLI wrapper scaffolded in knowledge/scripts; keys never added.' },
  { id: 'tool-recall', name: 'Recall', category: 'CRM & Revenue', status: 'available', color: GRAY.mid, description: 'AI meeting notetaker, used daily. Needs RECALL_API_KEY from settings for API access.' },
  { id: 'tool-webinarjam', name: 'WebinarJam', category: 'CRM & Revenue', status: 'available', color: GRAY.light, description: 'Launchpad Cohort webinar funnel — registrants & attendees are leads. Client implemented; set WEBINARJAM_API_KEY (account-wide).' },
  { id: 'tool-trakyo', name: 'Trakyo', category: 'CRM & Revenue', status: 'planned', color: GRAY.dim, description: 'Revenue attribution for Launchpad Cohort: content → booked calls → payments. Status-only until Trakyo ships a public API (TRAKYO_API_KEY).' },
  // Creative studio
  { id: 'tool-reelkit', name: 'Reelkit Pipeline', category: 'Creative', status: 'connected', color: GRAY.white, description: 'Local reelkit pipeline · LC + Vantage themes · 7 skills.' },
  { id: 'tool-renderly', name: 'Renderly CLI', category: 'Creative', status: 'connected', color: GRAY.light, description: 'v0.1.40, auth in keychain. generate / product-photoshoot / marketing-studio / soul-id.' },
  { id: 'tool-adsmith', name: 'Adsmith', category: 'Creative', status: 'connected', color: GRAY.mid, description: 'UGC ads for Vantage (Veo/Sora/Kling). Basic auth from env.' },
  { id: 'tool-whisper', name: 'Whisper (local)', category: 'Creative', status: 'connected', color: GRAY.dim, description: 'whisper-cli + ffmpeg via brew. Local transcription, nothing leaves the machine.' },
  { id: 'tool-miro', name: 'Miro', category: 'Creative', status: 'connected', color: GRAY.mid, description: 'REST API with token from knowledge/.env.agents. GBrain architecture board exists.' },
  { id: 'tool-canva-figma', name: 'Canva + Figma', category: 'Creative', status: 'available', color: GRAY.dark, description: 'Connected as Claude MCPs (session-scoped). Standalone API needs separate keys.' },
  // Comms
  { id: 'tool-imap', name: 'Email (4 IMAP slots)', category: 'Comms', status: 'available', color: GRAY.light, description: 'Client implemented for 4 inboxes — set INBOX_1..4_HOST/_USER/_PASS.' },
  { id: 'tool-slack', name: 'Slack', category: 'Comms', status: 'available', color: GRAY.mid, description: 'Client implemented. Needs a bot token with channels:read/history scopes.' },
  { id: 'tool-dictate', name: 'Dictate Flow', category: 'Comms', status: 'connected', color: GRAY.white, description: 'Voice dictation — heaviest daily-use tool found. Local flow.sqlite read live.' },
  { id: 'tool-whatsapp', name: 'WhatsApp', category: 'Comms', status: 'connected', color: GRAY.white, description: 'Desktop app local ChatStorage.sqlite, read-only: local team chats.' },
  // Orchestration & infra
  { id: 'tool-command-center', name: 'Command Center (:4000)', category: 'Orchestration', status: 'available', color: GRAY.light, description: 'command-center: kanban, brand deals, sales calls, SOPs, dispatch. Start with npm run dev.' },
  { id: 'tool-clawline', name: 'Clawline Gateway', category: 'Orchestration', status: 'available', color: GRAY.dim, description: 'Dormant — gateway offline, token missing. Needs repair/reinstall.' },
  { id: 'tool-tmux', name: 'tmux', category: 'Orchestration', status: 'connected', color: GRAY.mid, description: 'Multi-Claude session orchestration. Dashboard reads live session list.' },
  { id: 'tool-ollama', name: 'Ollama', category: 'Orchestration', status: 'connected', color: GRAY.light, description: 'Local LLM server :11434, no auth. Pull a model to enable free local inference.' },
  { id: 'tool-vercel', name: 'Vercel CLI', category: 'Orchestration', status: 'connected', color: GRAY.mid, description: 'v50, authenticated. Deploy target when FOUNDER OS goes public.' },
  { id: 'tool-gh', name: 'GitHub CLI', category: 'Orchestration', status: 'connected', color: GRAY.dim, description: 'gh 2.89, authenticated.' },
  // Payments (registry awaiting keys)
  { id: 'tool-paypal', name: 'PayPal', category: 'Payments', status: 'planned', color: GRAY.mid, description: 'Registered in the processor registry; client lands when keys do.' },
  { id: 'tool-square', name: 'Square', category: 'Payments', status: 'planned', color: GRAY.dim, description: 'Registered in the processor registry; client lands when keys do.' },
  { id: 'tool-whop', name: 'Whop', category: 'Payments', status: 'planned', color: GRAY.dark, description: 'Registered in the processor registry; client lands when keys do.' },
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
  { id: 'rm-ui', title: 'UI design pass', quarter: '2026-Q4', status: 'later', departmentId: 'dept-tech', description: 'Alex-led redesign once all integrations are live.' },
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
  { platform: 'linkedin', handle: 'Alex Rivera', url: null, order: 5 },
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
const workflows: Workflow[] = [
  {
    id: 'wf-vantage-sales',
    name: 'Vantage sales machine',
    subtitle: 'Cold outbound to closed retainer.',
    revenueUsd: 120_000,
    order: 0,
    steps: [
      {
        id: 'wf-mer-1',
        title: 'Run outbound campaigns',
        ownerKind: 'agent',
        owner: 'Postly Publisher',
        hoursPerWeek: 6,
        tools: ['postly', 'adsmith'],
        edgeLabel: 'replies',
        leakUsd: null,
        automation: { title: 'Always-on content + DM outreach', state: 'live', recoveredUsd: 4200 },
      },
      {
        id: 'wf-mer-2',
        title: 'Qualify replies',
        ownerKind: 'agent',
        owner: 'Comms Agent',
        hoursPerWeek: 9,
        tools: ['dmflow', 'gmail'],
        edgeLabel: 'qualified',
        leakUsd: 14_000,
        automation: { title: 'Auto-qualify + book', state: 'suggested', recoveredUsd: 9000 },
      },
      {
        id: 'wf-mer-3',
        title: 'Book demos',
        ownerKind: 'human',
        owner: 'Alex · Founder',
        hoursPerWeek: 4,
        tools: ['calendar', 'ledger'],
        edgeLabel: 'demo',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-mer-4',
        title: 'Sales call',
        ownerKind: 'human',
        owner: 'Alex · Founder',
        hoursPerWeek: 10,
        tools: ['webinarjam', 'ledger'],
        edgeLabel: 'proposal',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-mer-5',
        title: 'Proposal & follow-up',
        ownerKind: 'human',
        owner: 'Alex · Founder',
        hoursPerWeek: 5,
        tools: ['proposal-gen', 'gmail'],
        edgeLabel: 'won',
        leakUsd: 6000,
        automation: { title: 'Proposal follow-up sequence', state: 'suggested', recoveredUsd: 6000 },
      },
      {
        id: 'wf-mer-6',
        title: 'Onboard & deliver',
        ownerKind: 'agent',
        owner: 'Onboarding Agent',
        hoursPerWeek: 3,
        tools: ['ledger', 'slack', 'notion'],
        edgeLabel: null,
        leakUsd: null,
        automation: { title: 'Onboarding rails', state: 'live', recoveredUsd: 3000 },
      },
    ],
  },
  {
    id: 'wf-lc-delivery',
    name: 'Launchpad Cohort delivery',
    subtitle: 'Webinar lead to retained program member.',
    revenueUsd: 80_000,
    order: 1,
    steps: [
      {
        id: 'wf-lc-1',
        title: 'Capture webinar leads',
        ownerKind: 'agent',
        owner: 'WebinarJam',
        hoursPerWeek: 2,
        tools: ['webinarjam', 'ghl'],
        edgeLabel: 'registered',
        leakUsd: null,
        automation: { title: 'Webinar to GHL sync', state: 'live', recoveredUsd: 2500 },
      },
      {
        id: 'wf-lc-2',
        title: 'Nurture in GHL',
        ownerKind: 'agent',
        owner: 'GoHighLevel',
        hoursPerWeek: 3,
        tools: ['ghl'],
        edgeLabel: 'booked',
        leakUsd: 8000,
        automation: { title: 'Nurture sequences', state: 'live', recoveredUsd: 5000 },
      },
      {
        id: 'wf-lc-3',
        title: 'Strategy call',
        ownerKind: 'human',
        owner: 'Alex · Founder',
        hoursPerWeek: 8,
        tools: ['ghl', 'calendar'],
        edgeLabel: 'closed',
        leakUsd: null,
        automation: null,
      },
      {
        id: 'wf-lc-4',
        title: 'Deliver program',
        ownerKind: 'human',
        owner: 'LC Team',
        hoursPerWeek: 12,
        tools: ['skool', 'notion'],
        edgeLabel: 'retained',
        leakUsd: 5000,
        automation: { title: 'Skool community ops', state: 'suggested', recoveredUsd: 4000 },
      },
      {
        id: 'wf-lc-5',
        title: 'Track attribution',
        ownerKind: 'agent',
        owner: 'Trakyo',
        hoursPerWeek: 1,
        tools: ['trakyo'],
        edgeLabel: null,
        leakUsd: null,
        automation: { title: 'Revenue attribution', state: 'suggested', recoveredUsd: 0 },
      },
    ],
  },
];

// Agent task board — seeded across open/doing/done so the Kanban is alive on
// first load. Demo cards; user-added tasks coexist (we insert by id, never wipe).
const SEED_TS = '2026-07-21T12:00:00.000Z';
const agentTasks: AgentTask[] = [
  { id: 'task-seed-1', agentId: 'comms-agent', title: 'Triage overnight inbound across 4 inboxes', status: 'open', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-2', agentId: 'social-agent', title: 'Draft 3 IG hooks for the Vantage launch', status: 'open', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-3', agentId: 'gmail-worker', title: 'Follow up on 6 unreplied warm leads', status: 'open', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-4', agentId: 'adsmith-creative', title: 'Generate 5 UGC variants for the new offer', status: 'open', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-5', agentId: 'postly-publisher', title: "Schedule this week's cross-platform posts", status: 'doing', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-6', agentId: 'comms-agent', title: 'Qualify 12 new DMs from the campaign', status: 'doing', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-7', agentId: 'reelkit-editor', title: 'Cut the sales-call highlight reel', status: 'doing', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-8', agentId: 'gmail-worker', title: 'Send the Vantage proposal follow-up', status: 'done', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-9', agentId: 'slack-worker', title: 'Post the Monday standup digest', status: 'done', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-10', agentId: 'social-agent', title: 'Publish the Tuesday carousel', status: 'done', createdAt: SEED_TS, updatedAt: SEED_TS },
  { id: 'task-seed-11', agentId: 'postly-publisher', title: 'Sync follower counts across 6 platforms', status: 'done', createdAt: SEED_TS, updatedAt: SEED_TS },
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
const skills: Omit<Skill, 'markdown'>[] = [
  { id: 'skill-outbound', name: 'Cold outbound sequencing', category: 'Sales', description: 'Multi-touch DM + content cadence that opens conversations at scale.', ownerAgentId: 'postly-publisher', status: 'live', tools: ['postly', 'dmflow'], order: 0 },
  { id: 'skill-qualify', name: 'Reply qualification', category: 'Sales', description: 'Reads inbound replies, scores intent, and books the qualified ones.', ownerAgentId: 'comms-agent', status: 'live', tools: ['dmflow', 'gmail'], order: 1 },
  { id: 'skill-proposal', name: 'Proposal drafting', category: 'Sales', description: 'Turns a call transcript into a tailored, on-brand proposal.', ownerAgentId: null, status: 'learning', tools: ['proposal-gen', 'ledger'], order: 2 },
  { id: 'skill-hooks', name: 'Hook writing', category: 'Content', description: 'Short-form hooks and captions tuned to each platform.', ownerAgentId: 'social-agent', status: 'live', tools: ['postly'], order: 3 },
  { id: 'skill-ugc', name: 'UGC generation', category: 'Content', description: 'Generates ad-ready UGC variants (Veo / Sora / Kling).', ownerAgentId: 'adsmith-creative', status: 'live', tools: ['adsmith'], order: 4 },
  { id: 'skill-edit', name: 'Video editing', category: 'Content', description: 'Cuts reels and highlight clips programmatically.', ownerAgentId: 'reelkit-editor', status: 'live', tools: ['reelkit'], order: 5 },
  { id: 'skill-schedule', name: 'Cross-post scheduling', category: 'Content', description: 'Queues and publishes across every connected platform.', ownerAgentId: 'postly-publisher', status: 'live', tools: ['postly'], order: 6 },
  { id: 'skill-triage', name: 'Inbox triage', category: 'Ops', description: 'Sorts the four inboxes into work / personal / misc and flags priority.', ownerAgentId: 'gmail-worker', status: 'live', tools: ['gmail'], order: 7 },
  { id: 'skill-dm', name: 'DM management', category: 'Ops', description: 'Handles Instagram and WhatsApp DMs end to end.', ownerAgentId: 'comms-agent', status: 'live', tools: ['dmflow', 'whatsapp'], order: 8 },
  { id: 'skill-retrieval', name: 'Knowledge retrieval', category: 'Ops', description: 'Hybrid search over G-Brain so every agent shares one memory.', ownerAgentId: 'conductor', status: 'live', tools: ['gbrain'], order: 9 },
  { id: 'skill-reconcile', name: 'Payment reconciliation', category: 'Ops', description: 'Matches processor payouts to clients across Stripe and PayKit.', ownerAgentId: null, status: 'planned', tools: ['stripe', 'paykit'], order: 10 },
  { id: 'skill-attribution', name: 'Revenue attribution', category: 'Ops', description: 'Ties content and calls to closed revenue via Trakyo.', ownerAgentId: null, status: 'planned', tools: ['trakyo', 'ghl'], order: 11 },
];

export function seedDatabase(db: FounderDb): void {
  // INSERT OR REPLACE in every repo makes re-seeding idempotent by id.
  for (const d of departments) db.departments.insert(d);
  for (const a of agents) db.agents.insert(a);
  // The roster IS the runtime: rows that left the roster leave the DB too,
  // and departments that left the operating model go with them.
  db.agents.deleteWhereIdNotIn(agents.map((a) => a.id));
  db.departments.deleteWhereIdNotIn(departments.map((d) => d.id));
  for (const p of people) db.people.insert(p);
  db.people.deleteWhereIdNotIn(people.map((p) => p.id));
  for (const m of leadMagnets) db.leadMagnets.insert(m);
  db.leadMagnets.deleteWhereIdNotIn(leadMagnets.map((m) => m.id));
  for (const t of sopTasks) db.sopTasks.insert(t);
  db.sopTasks.deleteWhereIdNotIn(sopTasks.map((t) => t.id));
  for (const w of workflows) db.workflows.insert(w);
  db.workflows.deleteWhereIdNotIn(workflows.map((w) => w.id));
  for (const s of skills) db.skills.insert({ ...s, markdown: skillDoc(s) });
  db.skills.deleteWhereIdNotIn(skills.map((s) => s.id));
  for (const t of agentTasks) db.agentTasks.insert(t); // insert-by-id; user tasks coexist
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
