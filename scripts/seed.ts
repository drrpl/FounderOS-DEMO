import path from 'node:path';
import fs from 'node:fs';
import { openDb } from '../lib/db';
import { seedDatabase } from '../lib/seed';
import { WORKSPACES } from '../lib/workspaces';

// FOUNDER_OS_DB stays a full override for a single db (tests, CI) — seeds only
// the default workspace into that one path. Otherwise every company gets its
// own file under data/, same as the app resolves at runtime (lib/data.ts).
const override = process.env.FOUNDER_OS_DB;
const targets = override ? [{ id: WORKSPACES[0].id, dbPath: override }] : WORKSPACES.map((w) => ({
  id: w.id,
  dbPath: path.join(process.cwd(), 'data', w.dbFile),
}));

for (const { id, dbPath } of targets) {
  if (dbPath !== ':memory:') fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = openDb(dbPath);
  seedDatabase(db, id);
  console.log(`Seeded ${id} -> ${dbPath}`);
  console.log(`  departments: ${db.departments.all().length}`);
  console.log(`  agents:      ${db.agents.all().length}`);
  console.log(`  skills:      ${db.skills.all().length}`);
  console.log(`  workflows:   ${db.workflows.all().length}`);
  console.log(`  tools:       ${db.tools.all().length}`);
  console.log(`  roadmap:     ${db.roadmap.all().length}`);
  db.close();
}
