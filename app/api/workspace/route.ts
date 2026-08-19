import { NextRequest, NextResponse } from 'next/server';
import { WORKSPACES, isWorkspaceId } from '@/lib/workspaces';
import { getCurrentWorkspaceId, WORKSPACE_COOKIE } from '@/lib/workspace-context';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ current: getCurrentWorkspaceId(), workspaces: WORKSPACES });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const workspaceId = body?.workspaceId;
  if (!isWorkspaceId(workspaceId)) {
    return NextResponse.json({ error: 'invalid workspace id' }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true, current: workspaceId });
  res.cookies.set(WORKSPACE_COOKIE, workspaceId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return res;
}
