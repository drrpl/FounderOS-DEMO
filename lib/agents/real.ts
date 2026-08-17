import type { AgentRunResult, RuntimeAgent } from '@/lib/agents/runtime';

/**
 * The real agent roster for the ILS (Innovative Leadership Strategies) fork
 * of FOUNDER OS. Every seeded agent (lib/seed.ts) maps 1:1 to an entry here
 * (enforced by tests/seed.test.ts's "no larp" check) — but per ILS's own
 * agents/README.md, only 2 of the 43 agents have a real skill built
 * (`linkedin`, `brand-positioning`). Everything else is a judgment-complete
 * persona with no automation yet, so its run() honestly reports "planned,"
 * not a fabricated live status. No server-side LLM/API calls are made here —
 * the 2 real skills live in Claude Code and are invoked there directly.
 */

const skillRun =
  (skillCommand: string, detail: string) =>
  async (): Promise<AgentRunResult> => ({
    ok: false,
    summary: `Not runnable from this app — the real skill lives in Claude Code. Run \`${skillCommand}\` there. ${detail}`,
  });

const plannedRun =
  (detail: string) =>
  async (): Promise<AgentRunResult> => ({
    ok: false,
    summary: `Planned — no automation built yet. ${detail}`,
  });

export const realAgents: RuntimeAgent[] = [
  // ── 01 Executive Office ────────────────────────────────────────────────
  {
    id: 'chief-of-staff',
    name: 'Chief of Staff',
    description: "Top of ILS's agent chain: routes escalations to Ramesh and tracks MRR as the one number that matters.",
    departmentId: 'dept-executive',
    run: plannedRun('Would synthesize department status and route escalations once departments report to it in a live system.'),
  },
  {
    id: 'executive-briefing',
    name: 'Executive Briefing',
    description: 'Synthesizes workspace state and every department’s punch list into a two-minute status brief for Ramesh.',
    departmentId: 'dept-executive',
    run: plannedRun('Would compile a dated one-page brief from workspace/STATE.md and each department’s self-reported status.'),
  },
  {
    id: 'strategy',
    name: 'Strategy',
    description: 'Holds ILS’s whole-business strategic judgment against its philosophy and contrarian beliefs.',
    departmentId: 'dept-executive',
    run: plannedRun('Would check new initiatives against creator_identity_matrix.philosophy and flag unvalidated-economics dependencies.'),
  },

  // ── 02 Sales & Business Development ───────────────────────────────────
  {
    id: 'discovery-preparation',
    name: 'Discovery Preparation',
    description: 'Preps Ramesh for the complimentary coaching session with pain points and objections in advance.',
    departmentId: 'dept-sales-bd',
    run: plannedRun('Would produce a pre-call brief mapping the prospect to documented pain points and objections.'),
  },
  {
    id: 'lead-qualification',
    name: 'Lead Qualification',
    description: 'Screens inbound interest against ILS’s 6 real qualification criteria before a session is booked.',
    departmentId: 'dept-sales-bd',
    run: plannedRun('Would check each of the 6 qualification criteria and route qualified/not-ready leads accordingly.'),
  },
  {
    id: 'pipeline',
    name: 'Pipeline',
    description: 'Tracks where prospects sit across the funnel — blocked on the in-progress CRM workflow audit.',
    departmentId: 'dept-sales-bd',
    run: plannedRun('Blocked until workspace/coach-foundation-workflows-audit.md is complete — no pipeline-stage structure exists yet.'),
  },
  {
    id: 'proposal',
    name: 'Proposal',
    description: 'Writes the post-session proposal: scope, coaching cadence, and investment.',
    departmentId: 'dept-sales-bd',
    run: plannedRun('Would draft a written proposal from a specific complimentary-session diagnosis — no template exists yet.'),
  },
  {
    id: 'sales-follow-up',
    name: 'Sales Follow-Up',
    description: 'Follows up on outstanding proposals and post-session interest without manufactured urgency.',
    departmentId: 'dept-sales-bd',
    run: plannedRun('Would check proposal status and follow up with substance, deferring to any existing CRM automation first.'),
  },

  // ── 03 Marketing & Brand ───────────────────────────────────────────────
  {
    id: 'marketing-director',
    name: 'Marketing Director',
    description: 'Diagnoses marketing requests and routes each to exactly one specialist, gated on voice check + sign-off.',
    departmentId: 'dept-marketing-brand',
    run: plannedRun('Orchestrator only — never executes a skill itself, routes to the 7 specialists below.'),
  },
  {
    id: 'brand-positioning',
    name: 'Brand & Positioning',
    description: 'Runs the voice-and-positioning check every marketing draft passes through before reaching Ramesh.',
    departmentId: 'dept-marketing-brand',
    run: skillRun('/brand-voice-audit', 'Checks banned vocabulary, register, and ICP scope against company.yaml.'),
  },
  {
    id: 'content-strategy',
    name: 'Content Strategy',
    description: 'Decides what ILS publishes against its 9 content pillars and briefs LinkedIn or Copywriting.',
    departmentId: 'dept-marketing-brand',
    run: plannedRun('Would pick a pillar and a real documented pain point, then hand a dated content brief downstream.'),
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Drafts LinkedIn posts from Content Strategy’s brief — ILS’s primary organic acquisition channel.',
    departmentId: 'dept-marketing-brand',
    run: skillRun('/linkedin-post-draft', 'Takes a Content Strategy brief and drafts hook → body → CTA in ILS’s voice.'),
  },
  {
    id: 'copywriting',
    name: 'Copywriting',
    description: 'Writes landing-page, email, and ad copy structured around "diagnose before prescribe."',
    departmentId: 'dept-marketing-brand',
    run: plannedRun('Would draft offer-ladder copy, flagging any missing proof point as a gap instead of inventing one.'),
  },
  {
    id: 'campaign-management',
    name: 'Campaign Management',
    description: 'Coordinates specialists’ output into a timed campaign push around a live offer.',
    departmentId: 'dept-marketing-brand',
    run: plannedRun('Would assemble a campaign brief: offer, funnel step, asset list with owners, and timeline.'),
  },
  {
    id: 'lead-nurture',
    name: 'Lead Nurture',
    description: 'Builds educational follow-up for interested-but-not-ready prospects — no sequence exists today.',
    departmentId: 'dept-marketing-brand',
    run: plannedRun('Would design a stage-gated nurture touch mapped to a named objection — first build, nothing to refine yet.'),
  },
  {
    id: 'marketing-analytics',
    name: 'Marketing Analytics',
    description: 'Measures marketing outcomes against the MRR north-star metric.',
    departmentId: 'dept-marketing-brand',
    run: plannedRun('Nothing is instrumented yet — first deliverable is an honest instrumentation-gap memo, not a fabricated metric.'),
  },

  // ── 04 Client Success & Coaching ───────────────────────────────────────
  {
    id: 'client-onboarding',
    name: 'Client Onboarding',
    description: 'Designs onboarding for new course members and coaching clients — a confirmed real gap.',
    departmentId: 'dept-client-success',
    run: plannedRun('Would design an onboarding flow for both the course and 1:1 coaching tracks — none exists today.'),
  },
  {
    id: 'coaching-preparation',
    name: 'Coaching Preparation',
    description: 'Preps Ramesh for recurring 1:1 sessions by carrying context forward between meetings.',
    departmentId: 'dept-client-success',
    run: plannedRun('Blocked until a session-history record exists to carry context forward from.'),
  },
  {
    id: 'session-follow-up',
    name: 'Session Follow-Up',
    description: 'Sends the post-session recap and commitment log after a 1:1 coaching session.',
    departmentId: 'dept-client-success',
    run: plannedRun('Would draft a session recap and hand confirmed commitments to the Accountability agent — no template exists yet.'),
  },
  {
    id: 'accountability',
    name: 'Accountability',
    description: 'Turns captured commitments into a check-in rhythm aligned with RAGE’s Accountability Rhythms.',
    departmentId: 'dept-client-success',
    run: plannedRun('Depends on Session Follow-Up capturing real commitments first — nothing to track yet.'),
  },
  {
    id: 'client-health',
    name: 'Client Health',
    description: 'Assesses retention risk for active coaching clients.',
    departmentId: 'dept-client-success',
    run: plannedRun('No health-scoring system or client database exists — honest answer today is "not enough data" for every client.'),
  },

  // ── 05 Programs & Curriculum ───────────────────────────────────────────
  {
    id: 'curriculum',
    name: 'Curriculum',
    description: 'Owns the structural integrity of the LEVERAGE Framework’s 10 delivered modules.',
    departmentId: 'dept-programs-curriculum',
    run: plannedRun('Would audit module sequencing against the confirmed 10-module structure before any restructuring.'),
  },
  {
    id: 'leverage-framework',
    name: 'LEVERAGE Framework',
    description: 'Protects LEVERAGE as a concept so no department uses the name as a generic buzzword.',
    departmentId: 'dept-programs-curriculum',
    run: plannedRun('Would check any LEVERAGE/RAGE reference against the real philosophy definition before it ships.'),
  },
  {
    id: 'assessment',
    name: 'Assessment',
    description: 'Owns the designed-but-unbuilt ILS Scalability Readiness Assessment.',
    departmentId: 'dept-programs-curriculum',
    run: plannedRun('Would build the assessment questions, scoring logic, and results page — the clearest unbuilt asset in the workspace.'),
  },
  {
    id: 'learning-materials',
    name: 'Learning Materials',
    description: 'Routes course-content production requests to Coach Foundation and decisions back to Ramesh.',
    departmentId: 'dept-programs-curriculum',
    run: plannedRun('Would track per-module material status and flag gaps to Curriculum — mostly a boundary-keeper role.'),
  },

  // ── 06 Operations ───────────────────────────────────────────────────────
  {
    id: 'operations-manager',
    name: 'Operations Manager',
    description: 'Owns the in-progress Coach Foundation CRM workflow audit — ILS’s richest real evidence base.',
    departmentId: 'dept-operations',
    run: plannedRun('Would finish and maintain the CRM workflow audit, then use it as the basis for ILS’s first real SOPs.'),
  },
  {
    id: 'sop',
    name: 'SOP',
    description: 'Turns ILS’s real, already-running CRM processes into documented SOPs.',
    departmentId: 'dept-operations',
    run: plannedRun('Would write the first SOPs from the CRM audit and the documented sales process once the audit is complete.'),
  },
  {
    id: 'workflow',
    name: 'Workflow',
    description: 'Owns the live catalog of ILS’s 18 Coach Foundation CRM automations.',
    departmentId: 'dept-operations',
    run: plannedRun('Ongoing manual cataloging — captures trigger/steps/timing per automation, flags truncated names as open questions.'),
  },
  {
    id: 'quality-control',
    name: 'Quality Control',
    description: 'Spot-checks output workspace-wide against the truth gate, owner-approval, and voice-fidelity invariants.',
    departmentId: 'dept-operations',
    run: plannedRun('Would spot-check recent client-facing output against INV-1/INV-2/INV-3 and report patterns to Operations Manager.'),
  },

  // ── 07 Finance ────────────────────────────────────────────────────────
  {
    id: 'financial-analysis',
    name: 'Financial Analysis',
    description: 'Works from real pricing; reports LTV:CAC and gross margin as genuinely untracked.',
    departmentId: 'dept-finance',
    run: plannedRun('No cost/spend data exists — first deliverable is an instrumentation-gap memo, not an estimated margin.'),
  },
  {
    id: 'revenue-forecasting',
    name: 'Revenue Forecasting',
    description: 'Forecasts against the MRR north-star metric.',
    departmentId: 'dept-finance',
    run: plannedRun('Blocked until Client Health, Pipeline, and Marketing Analytics each close their own instrumentation gaps.'),
  },
  {
    id: 'billing-review',
    name: 'Billing Review',
    description: 'Reviews billing and payment operations.',
    departmentId: 'dept-finance',
    run: plannedRun('The actual billing/payment system isn’t confirmed yet — that’s the first open question to resolve with Ramesh.'),
  },

  // ── 08 Research & Business Intelligence ────────────────────────────────
  {
    id: 'company-research',
    name: 'Company Research',
    description: 'Researches a specific prospect’s company ahead of a complimentary session.',
    departmentId: 'dept-research-bi',
    run: plannedRun('Would summarize a prospect’s public info against the qualification criteria before a booked session.'),
  },
  {
    id: 'market-intelligence',
    name: 'Market Intelligence',
    description: 'Owns closing the not-started market-research-brief gap.',
    departmentId: 'dept-research-bi',
    run: plannedRun('First deliverable is the market research brief foundations_status flags as not_started.'),
  },
  {
    id: 'competitive-intelligence',
    name: 'Competitive Intelligence',
    description: 'Tracks ILS’s competitive landscape — no competitor is named anywhere yet.',
    departmentId: 'dept-research-bi',
    run: plannedRun('Nothing to track beyond the documented category-level objection pattern until Ramesh names real reference points.'),
  },
  {
    id: 'strategic-research',
    name: 'Strategic Research',
    description: 'Surfaces citable concepts from Ramesh’s defended DBA dissertation for coaching and content.',
    departmentId: 'dept-research-bi',
    run: plannedRun('Would cite Switching-Cost Theory / "partial switching" per INV-8 when a question touches retention or positioning.'),
  },

  // ── 09 Technology & AI Systems ──────────────────────────────────────────
  {
    id: 'ai-systems-architect',
    name: 'AI Systems Architect',
    description: 'Owns this workspace’s own agent and skill architecture.',
    departmentId: 'dept-tech-ai',
    run: plannedRun('Would check any new agent/skill against real company.yaml evidence before it’s authored.'),
  },
  {
    id: 'automation',
    name: 'Automation',
    description: 'Owns the technical build side of ILS’s CRM automations, once the workflow audit is complete.',
    departmentId: 'dept-tech-ai',
    run: plannedRun('No platform access to Coach Foundation — would specify changes for Ramesh to implement, once the audit closes.'),
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Owns ILS’s understanding of the Coach Foundation platform itself.',
    departmentId: 'dept-tech-ai',
    run: plannedRun('Would recommend whether/how to formally mount Coach Foundation as a tool, once the workflow audit is complete.'),
  },
  {
    id: 'knowledge-management',
    name: 'Knowledge Management',
    description: 'Maintains ILS’s reference/ folder as a pointer into the shared cross-venture DBA knowledge pool.',
    departmentId: 'dept-tech-ai',
    run: plannedRun('Would periodically check that reference/academic-research stays a pointer, not a copy.'),
  },

  // ── 10 Legal, Risk & Compliance ─────────────────────────────────────────
  {
    id: 'contract-review',
    name: 'Contract Review',
    description: 'Reviews contracts and agreements — none are on file yet.',
    departmentId: 'dept-legal-risk',
    run: plannedRun('No contract exists to review — first step is asking Ramesh what agreements actually exist.'),
  },
  {
    id: 'risk-review',
    name: 'Risk Review',
    description: 'Owns the one real, concrete risk flag: the WHA confidentiality obligation on dissertation data.',
    departmentId: 'dept-legal-risk',
    run: plannedRun('Would enforce the WHA confidentiality boundary whenever Strategic Research draws on the dissertation.'),
  },
  {
    id: 'compliance',
    name: 'Compliance',
    description: 'Checks ILS’s compliance posture — no formal framework is documented yet.',
    departmentId: 'dept-legal-risk',
    run: plannedRun('No compliance scope has been established — first step is asking Ramesh what concern he actually has in mind.'),
  },
];
