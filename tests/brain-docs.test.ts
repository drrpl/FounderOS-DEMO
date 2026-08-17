import { afterEach, describe, expect, test } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { openDb, type FounderDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { buildBrainDocs, writeBrainDocs, GENERATED_MARKER } from '@/lib/brain-docs';

let db: FounderDb;

afterEach(() => {
  db?.close();
});

function seeded(): FounderDb {
  db = openDb(':memory:');
  seedDatabase(db);
  return db;
}

function docsFor(d: FounderDb) {
  return buildBrainDocs({
    departments: d.departments.all(),
    agents: d.agents.all(),
    people: d.people.all(),
    tasks: d.sopTasks.all(),
    tools: d.tools.all(),
  });
}

describe('buildBrainDocs', () => {
  test('one doc per agent, sop, tool, person and pillar', () => {
    const d = seeded();
    const docs = docsFor(d);
    const paths = new Set(docs.map((x) => x.path));
    expect(docs.filter((x) => x.path.startsWith('agents/')).length).toBe(d.agents.all().length);
    expect(docs.filter((x) => x.path.startsWith('sops/')).length).toBe(d.sopTasks.all().length);
    expect(docs.filter((x) => x.path.startsWith('tools/')).length).toBe(d.tools.all().length);
    expect(docs.filter((x) => x.path.startsWith('people/')).length).toBe(d.people.all().length);
    expect(docs.filter((x) => x.path.startsWith('org/pillar-')).length).toBe(d.departments.all().length);
    expect(paths.has('agents/linkedin.md')).toBe(true);
    expect(paths.has('sops/sop-linkedin.md')).toBe(true);
    expect(paths.has('tools/ledger.md')).toBe(true);
    // ILS is solo (company.yaml: team.structure "solo") — no people seeded.
    expect(d.people.all()).toEqual([]);
    expect(paths.has('org/pillar-marketing-brand.md')).toBe(true);
  });

  test('every doc carries the generated marker in frontmatter', () => {
    const docs = docsFor(seeded());
    for (const doc of docs) expect(doc.content).toContain(GENERATED_MARKER);
  });

  test('an agent doc holds its charter, SOP instructions and wikilinked tools', () => {
    const docs = docsFor(seeded());
    const linkedin = docs.find((x) => x.path === 'agents/linkedin.md')!.content;
    expect(linkedin).toContain('primary organic acquisition channel');
    expect(linkedin).toContain('Take the brief from Content Strategy');
    expect(linkedin).toContain('[[sop-linkedin]]');
    expect(linkedin).toContain('[[Read]]'); // Claude Code tool, wikilinked
    expect(linkedin).toContain('[[marketing-director]]'); // reports to
    expect(linkedin).toContain('[[pillar-marketing-brand]]');
  });

  test('a SOP doc is built out: purpose, owner, trigger, steps, done, escalation', () => {
    const docs = docsFor(seeded());
    const sop = docs.find((x) => x.path === 'sops/sop-linkedin.md')!.content;
    for (const section of ['## Purpose', '## Owner', '## Trigger', '## Steps', '## Definition of done', '## Escalation']) {
      expect(sop, `missing ${section}`).toContain(section);
    }
    expect(sop).toContain('complimentary coaching session');
    expect(sop).toContain('[[linkedin]]');
  });

  test('a tool doc honestly reports no users when no ILS agent is wired to it yet', () => {
    const docs = docsFor(seeded());
    // ILS agents' tools[] are Claude Code tool names (Read/Write/...), not the
    // business-tool slugs in this catalog — none is wired to a connector yet.
    const ledger = docs.find((x) => x.path === 'tools/ledger.md')!.content;
    expect(ledger).toContain('Nobody is wired to this tool yet.');
  });

  test('a pillar doc rosters its workers and SOPs', () => {
    const docs = docsFor(seeded());
    const marketing = docs.find((x) => x.path === 'org/pillar-marketing-brand.md')!.content;
    expect(marketing).toContain('[[linkedin]]');
    expect(marketing).toContain('[[brand-positioning]]');
    expect(marketing).toContain('[[sop-linkedin]]');
    expect(marketing).toContain('[[sop-brand-positioning]]');
  });

  test('deterministic output', () => {
    const d = seeded();
    expect(docsFor(d)).toEqual(docsFor(d));
  });
});

describe('writeBrainDocs', () => {
  test('writes files, is idempotent, and never clobbers a non-generated file', () => {
    const d = seeded();
    const docs = docsFor(d);
    const dir = mkdtempSync(path.join(tmpdir(), 'brain-docs-'));
    const first = writeBrainDocs(docs, dir);
    expect(first.written).toBeGreaterThan(0);
    expect(existsSync(path.join(dir, 'agents', 'linkedin.md'))).toBe(true);

    // hand-edited (non-generated) file must be left alone
    const handmade = path.join(dir, 'agents', 'linkedin.md');
    writeFileSync(handmade, '# my own notes, no marker');
    const second = writeBrainDocs(docs, dir);
    expect(readFileSync(handmade, 'utf8')).toBe('# my own notes, no marker');
    expect(second.skipped).toBeGreaterThan(0);

    // everything else regenerated cleanly
    expect(readdirSync(path.join(dir, 'sops')).length).toBe(d.sopTasks.all().length);
  });
});
