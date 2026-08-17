import { afterEach, describe, expect, test } from 'vitest';
import { openDb, type FounderDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { contentAgents } from '@/lib/content';

let db: FounderDb;
afterEach(() => db?.close());

describe('contentAgents', () => {
  test('returns the content-creation crew (Marketing & Brand pillar), lead first', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    const crew = contentAgents(db.agents.all());
    expect(crew[0].id).toBe('marketing-director');
    const ids = crew.map((a) => a.id);
    for (const id of ['marketing-director', 'linkedin', 'copywriting', 'content-strategy', 'brand-positioning']) {
      expect(ids).toContain(id);
    }
  });

  test('only the content pillar — excludes other departments', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    const crew = contentAgents(db.agents.all());
    expect(crew.every((a) => a.departmentId === 'dept-marketing-brand')).toBe(true);
    expect(crew.map((a) => a.id)).not.toContain('lead-qualification');
    expect(crew.map((a) => a.id)).not.toContain('chief-of-staff');
  });

  test('deterministic + non-empty', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    const a = contentAgents(db.agents.all()).map((x) => x.id);
    const b = contentAgents(db.agents.all()).map((x) => x.id);
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThanOrEqual(5);
  });
});
