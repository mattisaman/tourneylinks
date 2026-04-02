import { NextRequest, NextResponse } from 'next/server';
import { db, tournament_sponsors } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-util';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const tournamentId = parseInt(id);
    if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await req.json();
    const { name, logoUrl, holeAssignment } = body;

    if (!name || !logoUrl) {
      return NextResponse.json({ error: 'Missing required sponsor details' }, { status: 400 });
    }

    const inserted = await db.insert(tournament_sponsors).values({
      tournamentId,
      name,
      logoUrl,
      holeAssignment: holeAssignment ? parseInt(holeAssignment) : null,
      websiteUrl: body.websiteUrl || null,
    }).returning();

    return NextResponse.json({ success: true, sponsor: inserted[0] });
  } catch (err: any) {
    console.error('Error adding sponsor:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tournamentId = parseInt(id);
    if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const sponsors = await db.select().from(tournament_sponsors).where(eq(tournament_sponsors.tournamentId, tournamentId));
    return NextResponse.json(sponsors);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
