import { NextResponse } from 'next/server';
import { getVentures } from '@/lib/ventures';
import { getCurrentWorkspaceId } from '@/lib/workspace-context';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ ventures: getVentures(getCurrentWorkspaceId()) });
}
