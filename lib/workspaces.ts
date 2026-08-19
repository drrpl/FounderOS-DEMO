/**
 * The three real companies this OS runs, side by side. One app, one codebase,
 * three completely independent SQLite files (see lib/data.ts) — switching
 * workspaces never mixes a department, agent, skill, workflow, or G-Brain
 * node from one company into another.
 *
 * This file is imported by client components too (the switcher itself), so
 * it stays free of server-only imports (no next/headers here — see
 * lib/workspace-context.ts for cookie resolution).
 */

export type WorkspaceId = 'ils' | 'eloan4home' | 'real-estate-os';

export type Workspace = {
  id: WorkspaceId;
  name: string;
  shortLabel: string;
  tagline: string;
  /** Accent color for the switcher chip — distinct from every life-area/venture color already in use. */
  color: string;
  /** SQLite filename under data/ — one physical database per workspace. */
  dbFile: string;
};

export const WORKSPACES: Workspace[] = [
  {
    id: 'ils',
    name: 'Innovative Leadership Strategies',
    shortLabel: 'ILS',
    tagline: 'Executive coaching & the LEVERAGE Framework',
    color: '#0A66C2',
    dbFile: 'founder-os-ils.db',
  },
  {
    id: 'eloan4home',
    name: 'Eloan4Home',
    shortLabel: 'Eloan4Home',
    tagline: 'Residential mortgage brokerage · Sacramento, CA',
    color: '#16A34A',
    dbFile: 'founder-os-eloan4home.db',
  },
  {
    id: 'real-estate-os',
    name: 'Real Estate OS',
    shortLabel: 'Real Estate OS',
    tagline: 'Brokerage · Development · Temp Housing',
    color: '#B45309',
    dbFile: 'founder-os-real-estate-os.db',
  },
];

export const DEFAULT_WORKSPACE_ID: WorkspaceId = 'ils';

export function isWorkspaceId(value: string | undefined | null): value is WorkspaceId {
  return !!value && WORKSPACES.some((w) => w.id === value);
}

export function getWorkspace(id: string | undefined | null): Workspace {
  return WORKSPACES.find((w) => w.id === id) ?? WORKSPACES.find((w) => w.id === DEFAULT_WORKSPACE_ID)!;
}
