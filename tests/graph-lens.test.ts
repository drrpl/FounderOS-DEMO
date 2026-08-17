import { describe, expect, test } from 'vitest';
import { openDb, type FounderDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { buildKnowledgeGraph } from '@/lib/knowledge-graph';
import { ACTION_LENSES, ALL_LENSES, ENTITY_LENSES, FUNCTION_LENSES, lensNodeSet, type LensContext } from '@/lib/graph-lens';

function contextFromSeed(): LensContext {
  const db: FounderDb = openDb(':memory:');
  seedDatabase(db);
  const graph = buildKnowledgeGraph(db.agents.all(), db.departments.all(), db.people.all(), db.sopTasks.all());
  // dept resolver mirroring the component's teamForFocus: worker → its dept
  const deptOf = new Map<string, string>();
  for (const a of db.agents.all()) deptOf.set(`emp:${a.id}`, `team:${a.departmentId}`);
  for (const p of db.people.all()) deptOf.set(`person:${p.id}`, `team:${p.departmentId}`);
  return { nodes: graph.nodes, teamOf: (id) => deptOf.get(id) ?? null };
}

const ctx = contextFromSeed();

describe('graph lenses — ILS taxonomy', () => {
  test('the requested categories all exist', () => {
    expect(ENTITY_LENSES.map((l) => l.label)).toEqual([
      'All people', 'Sub-agents', 'Tools', 'Workflows', 'SOPs', 'Projects', 'Teams', 'Departments',
    ]);
    expect(FUNCTION_LENSES.map((l) => l.label)).toEqual(['Core', 'Enabling']);
    expect(ACTION_LENSES).toHaveLength(11);
    expect(new Set(ALL_LENSES.map((l) => l.id)).size).toBe(ALL_LENSES.length);
  });

  test('entity lenses match by node kind against the real seeded graph', () => {
    expect(lensNodeSet('ent-subagents', ctx).size).toBe(43);
    expect(lensNodeSet('ent-departments', ctx).size).toBe(10);
    expect(lensNodeSet('ent-sops', ctx).size).toBeGreaterThan(0);
    expect(lensNodeSet('ent-tools', ctx).size).toBeGreaterThan(0);
  });

  test('teams, workflows, and projects are honestly empty until modeled', () => {
    expect(lensNodeSet('ent-teams', ctx).size).toBe(0);
    expect(lensNodeSet('ent-workflows', ctx).size).toBe(0);
    expect(lensNodeSet('ent-projects', ctx).size).toBe(0);
  });

  test('core and enabling split the departments cleanly and light whole sectors', () => {
    const core = lensNodeSet('fn-core', ctx);
    const enabling = lensNodeSet('fn-enabling', ctx);
    expect(core.has('team:dept-sales-bd')).toBe(true);
    expect(core.has('team:dept-marketing-brand')).toBe(true);
    expect(enabling.has('team:dept-tech-ai')).toBe(true);
    expect(enabling.has('team:dept-finance')).toBe(true);
    // a node is never both core and enabling
    for (const id of core) expect(enabling.has(id), id).toBe(false);
    // sectors include their workers, not just the department gateway
    expect(core.has('emp:lead-qualification')).toBe(true);
    expect(enabling.has('emp:operations-manager')).toBe(true);
  });

  test('action lenses only resolve where ILS has a real agent doing that job', () => {
    const mapped = ['act-lead-generation', 'act-content-ideation', 'act-content-scripts', 'act-competitor-intel', 'act-icp-simulation', 'act-channel-budget'];
    const unmapped = ['act-ad-creation', 'act-content-repurposing', 'act-social-sentiment', 'act-social-scheduler', 'act-ai-visuals'];
    for (const id of mapped) {
      const set = lensNodeSet(id, ctx);
      expect(set.size, id).toBeGreaterThan(0);
      for (const nodeId of set) expect(nodeId.startsWith('emp:'), `${id} → ${nodeId}`).toBe(true);
    }
    for (const id of unmapped) {
      expect(lensNodeSet(id, ctx).size, id).toBe(0);
    }
  });

  test('specific action mappings hold', () => {
    expect(lensNodeSet('act-content-ideation', ctx).has('emp:content-strategy')).toBe(true);
    expect(lensNodeSet('act-content-scripts', ctx).has('emp:linkedin')).toBe(true);
    expect(lensNodeSet('act-content-scripts', ctx).has('emp:copywriting')).toBe(true);
    expect(lensNodeSet('act-lead-generation', ctx).has('emp:lead-qualification')).toBe(true);
    expect(lensNodeSet('act-channel-budget', ctx).has('emp:campaign-management')).toBe(true);
  });

  test('unknown lens returns an empty set, never throws', () => {
    expect(lensNodeSet('nope', ctx).size).toBe(0);
  });
});
