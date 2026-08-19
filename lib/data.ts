import path from 'node:path';
import fs from 'node:fs';
import { openDb, type FounderDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { getCurrentWorkspaceId } from '@/lib/workspace-context';
import { getWorkspace, type WorkspaceId } from '@/lib/workspaces';

/**
 * App-level singleton — one per workspace. Larp-first, real-ready: every page
 * and API route reads through this seeded SQLite database, so swapping in
 * live sources later is a repo-level change, not a UI rewrite.
 *
 * Each of the three companies gets its own physical SQLite file (see
 * lib/workspaces.ts) — departments, agents, skills, workflows, and the
 * G-Brain graph derived from them never cross a workspace boundary. Callers
 * that don't pass a workspace id (almost every page/route) get whichever
 * company is selected in the founderos_workspace cookie.
 */
const instances = new Map<WorkspaceId, FounderDb>();

export function getDb(workspaceId?: WorkspaceId): FounderDb {
  const id = workspaceId ?? getCurrentWorkspaceId();
  const cached = instances.get(id);
  if (cached) return cached;

  // FOUNDER_OS_DB stays a full override (tests use :memory:) — it bypasses
  // per-workspace file naming and still gets seeded for whichever workspace
  // asked for it, so `FOUNDER_OS_DB=:memory:` test suites keep working
  // unchanged for callers that never pass a workspace id.
  const dbPath = process.env.FOUNDER_OS_DB ?? path.join(process.cwd(), 'data', getWorkspace(id).dbFile);
  if (dbPath !== ':memory:') fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const instance = openDb(dbPath);
  // Seed on first touch so a fresh clone boots looking alive. Each clause
  // back-fills databases created before that table existed; seedDatabase is
  // idempotent (INSERT OR REPLACE), so re-running only adds what's missing.
  if (
    instance.departments.all().length === 0 ||
    instance.workflows.all().length === 0 ||
    instance.skills.all().length === 0 ||
    instance.social.accounts().length === 0 ||
    instance.emailList.snapshots().length === 0 ||
    instance.social.dmSnapshots().length === 0 ||
    instance.social.dmMessages().length === 0 ||
    instance.leadMagnets.all().length === 0
  ) {
    seedDatabase(instance, id);
  }
  instances.set(id, instance);
  return instance;
}
