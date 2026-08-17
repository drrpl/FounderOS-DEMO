import { afterEach, describe, expect, test } from 'vitest';
import { openDb, type FounderDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

let db: FounderDb;

afterEach(() => {
  db?.close();
});

describe('seedDatabase', () => {
  test('populates every entity', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    expect(db.departments.all().length).toBeGreaterThanOrEqual(5);
    expect(db.agents.all().length).toBeGreaterThanOrEqual(5);
    expect(db.tools.all().length).toBeGreaterThanOrEqual(8);
    expect(db.roadmap.all().length).toBeGreaterThanOrEqual(10);
    expect(db.metrics.all().length).toBeGreaterThanOrEqual(4);
    expect(db.domains.all().length).toBeGreaterThanOrEqual(8);
    expect(db.phases.all().length).toBeGreaterThanOrEqual(3);
    expect(db.workflows.all().length).toBeGreaterThanOrEqual(2);
    expect(db.workflows.all().every((w) => w.steps.length >= 3)).toBe(true);
    expect(db.skills.all().length).toBeGreaterThanOrEqual(8);
    expect(db.agentTasks.all().length).toBeGreaterThanOrEqual(8);
  });

  test('every agent belongs to an existing department', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    const deptIds = new Set(db.departments.all().map((d) => d.id));
    for (const agent of db.agents.all()) {
      expect(deptIds.has(agent.departmentId)).toBe(true);
    }
  });

  test('every seeded agent maps to a real runtime agent — no larp', async () => {
    const { realAgents } = await import('@/lib/agents/real');
    db = openDb(':memory:');
    seedDatabase(db);
    const runtimeIds = new Set(realAgents.map((a) => a.id));
    for (const agent of db.agents.all()) {
      expect(runtimeIds.has(agent.id)).toBe(true);
    }
  });

  test('the ten ILS departments, in order', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    expect(db.departments.all().map((d) => d.name)).toEqual([
      'Executive Office',
      'Sales & Business Development',
      'Marketing & Brand',
      'Client Success & Coaching',
      'Programs & Curriculum',
      'Operations',
      'Finance',
      'Research & Business Intelligence',
      'Technology & AI Systems',
      'Legal, Risk & Compliance',
    ]);
  });

  test('agents are homed in the right department', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    const byId = new Map(db.agents.all().map((a) => [a.id, a.departmentId]));
    expect(byId.get('chief-of-staff')).toBe('dept-executive');
    expect(byId.get('strategy')).toBe('dept-executive');
    // Sales & Business Development
    for (const id of ['discovery-preparation', 'lead-qualification', 'pipeline', 'proposal', 'sales-follow-up']) {
      expect(byId.get(id)).toBe('dept-sales-bd');
    }
    // Marketing & Brand: the 7 specialists + director
    for (const id of [
      'marketing-director',
      'brand-positioning',
      'content-strategy',
      'linkedin',
      'copywriting',
      'campaign-management',
      'lead-nurture',
      'marketing-analytics',
    ]) {
      expect(byId.get(id)).toBe('dept-marketing-brand');
    }
    expect(db.agents.all().filter((a) => a.departmentId === 'dept-marketing-brand').length).toBe(8);
    // Operations: manager + 3 specialists
    for (const id of ['operations-manager', 'sop', 'workflow', 'quality-control']) {
      expect(byId.get(id)).toBe('dept-operations');
    }
    // Technology & AI Systems
    for (const id of ['ai-systems-architect', 'automation', 'crm', 'knowledge-management']) {
      expect(byId.get(id)).toBe('dept-tech-ai');
    }
  });

  test('the reporting chain: Marketing specialists to the Director, Operations specialists to the Manager, everyone else straight to Chief of Staff', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    const byId = new Map(db.agents.all().map((a) => [a.id, a]));

    expect(byId.get('chief-of-staff')?.parentId).toBeNull();
    expect(byId.get('chief-of-staff')?.tier).toBe('lead');

    for (const id of [
      'brand-positioning',
      'content-strategy',
      'linkedin',
      'copywriting',
      'campaign-management',
      'lead-nurture',
      'marketing-analytics',
    ]) {
      expect(byId.get(id)?.parentId).toBe('marketing-director');
      expect(byId.get(id)?.tier).toBe('specialist');
    }
    expect(byId.get('marketing-director')?.parentId).toBe('chief-of-staff');
    expect(byId.get('marketing-director')?.tier).toBe('lead');

    for (const id of ['sop', 'workflow', 'quality-control']) {
      expect(byId.get(id)?.parentId).toBe('operations-manager');
    }
    expect(byId.get('operations-manager')?.parentId).toBe('chief-of-staff');
    expect(byId.get('operations-manager')?.tier).toBe('lead');

    // No named head elsewhere — every other specialist routes straight to Chief of Staff.
    for (const id of ['strategy', 'lead-qualification', 'curriculum', 'financial-analysis', 'compliance']) {
      expect(byId.get(id)?.parentId).toBe('chief-of-staff');
    }
  });

  test('only the 2 grounded agents are active; the other 41 are honestly planned', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    const all = db.agents.all();
    const active = all.filter((a) => a.status === 'active').map((a) => a.id).sort();
    expect(active).toEqual(['brand-positioning', 'linkedin']);
    expect(all.filter((a) => a.status === 'planned').length).toBe(41);
  });

  test('re-seeding removes departments that left the model', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    db.departments.insert({ id: 'dept-ghost', name: 'Ghost', slug: 'ghost', tagline: '', color: '#fff', order: 99 });
    seedDatabase(db);
    expect(db.departments.all().some((d) => d.id === 'dept-ghost')).toBe(false);
  });

  test('re-seeding removes agents that left the roster', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    db.agents.insert({
      id: 'ghost', departmentId: 'dept-tech-ai', name: 'Ghost', role: 'r', status: 'active',
      tier: 'lead', description: '', model: 'm', tools: [], parentId: null, instance: 'builtin',
    });
    seedDatabase(db);
    expect(db.agents.all().some((a) => a.id === 'ghost')).toBe(false);
  });

  test('is idempotent — seeding twice does not duplicate rows', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    const counts = {
      departments: db.departments.all().length,
      agents: db.agents.all().length,
      tools: db.tools.all().length,
    };
    seedDatabase(db);
    expect(db.departments.all().length).toBe(counts.departments);
    expect(db.agents.all().length).toBe(counts.agents);
    expect(db.tools.all().length).toBe(counts.tools);
  });

  test('email list reflects the real Beehiiv account, not the retired ~30k larp', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    const snaps = db.emailList.snapshots();
    expect(snaps.length).toBeGreaterThan(0);
    // Latest count is the real "Alex's Newsletter" active subscriber count
    // (pulled from Beehiiv 2026-07-07). Bumped deliberately as the list grows.
    expect(db.emailList.latest()?.subscribers).toBe(1850);
    // Honest shape: the list only exists from its 2026-05-28 bulk import — no
    // pre-import history, and nowhere near the old dummy ~30k ramp.
    expect(snaps[0].capturedAt >= '2026-05-28').toBe(true);
    for (const s of snaps) expect(s.subscribers).toBeLessThan(6000);
  });

  test('re-seeding reconciles email history: stale dummy dropped, live snapshots kept', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    // an older DB still holding retired ~30k dummy history + a live Beehiiv snapshot
    db.emailList.insertSnapshot({ capturedAt: '2026-03-14', subscribers: 25800, source: 'seed-dummy' });
    db.emailList.insertSnapshot({ capturedAt: '2026-07-07', subscribers: 4830, source: 'beehiiv' });
    seedDatabase(db);
    const snaps = db.emailList.snapshots();
    // retired dummy history is reconciled away on re-seed...
    expect(snaps.some((s) => s.source === 'seed-dummy')).toBe(false);
    expect(snaps.some((s) => s.subscribers > 6000)).toBe(false);
    // ...but a real live-synced snapshot survives
    expect(snaps.find((s) => s.capturedAt === '2026-07-07')?.source).toBe('beehiiv');
  });

  test('seeded data passes schema validation end to end', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    // openDb repos parse rows through Zod on the way out, so a full read
    // of every table proves the seed data conforms to every schema.
    expect(() => {
      db.departments.all();
      db.agents.all();
      db.tools.all();
      db.roadmap.all();
      db.metrics.all();
      db.domains.all();
      db.phases.all();
    }).not.toThrow();
  });
});

describe('roadmap grouping', () => {
  test('groups roadmap items by quarter in chronological order', async () => {
    const { groupRoadmapByQuarter } = await import('@/lib/roadmap');
    db = openDb(':memory:');
    seedDatabase(db);
    const grouped = groupRoadmapByQuarter(db.roadmap.all());
    const quarters = grouped.map((g) => g.quarter);
    expect(quarters.length).toBeGreaterThanOrEqual(3);
    expect([...quarters].sort()).toEqual(quarters);
    for (const group of grouped) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });
});
