/**
 * Server-only resolution of "which company is selected right now." Reads the
 * founderos_workspace cookie set by the switcher (components/WorkspaceSwitcher.tsx
 * via app/api/workspace/route.ts). Never import this from a 'use client' file —
 * next/headers throws outside a request; scripts and tests fall back to the
 * default workspace instead of throwing.
 */
import { cookies } from 'next/headers';
import { DEFAULT_WORKSPACE_ID, isWorkspaceId, type WorkspaceId } from '@/lib/workspaces';

export const WORKSPACE_COOKIE = 'founderos_workspace';

export function getCurrentWorkspaceId(): WorkspaceId {
  try {
    const raw = cookies().get(WORKSPACE_COOKIE)?.value;
    return isWorkspaceId(raw) ? raw : DEFAULT_WORKSPACE_ID;
  } catch {
    // Outside request scope (vitest, scripts/seed.ts) — default workspace.
    return DEFAULT_WORKSPACE_ID;
  }
}
