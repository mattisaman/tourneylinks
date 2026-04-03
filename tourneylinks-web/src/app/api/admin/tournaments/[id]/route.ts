import { NextRequest, NextResponse } from 'next/server';
import { db, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-util';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const tournamentId = parseInt(id);
    if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const tourneys = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);
    const tourney = tourneys[0];
    if (!tourney) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(tourney);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
