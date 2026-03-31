import { NextRequest, NextResponse } from 'next/server';
import { db, tournament_rounds } from '@/lib/db';
import { eq, asc } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const tournamentId = parseInt(id);
    if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await req.json();
    const { roundNumber, dateString, scoringFormat, courseId } = body;

    if (!roundNumber || !dateString || !scoringFormat) {
      return NextResponse.json({ error: 'Missing required round details' }, { status: 400 });
    }

    const inserted = await db.insert(tournament_rounds).values({
      tournamentId,
      roundNumber: parseInt(roundNumber),
      dateString,
      scoringFormat,
      courseId: courseId ? parseInt(courseId) : null,
    }).returning();

    return NextResponse.json({ success: true, round: inserted[0] });
  } catch (err: any) {
    console.error('Error adding round:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tournamentId = parseInt(id);
    if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const rounds = await db.select().from(tournament_rounds)
      .where(eq(tournament_rounds.tournamentId, tournamentId))
      .orderBy(asc(tournament_rounds.roundNumber));
      
    return NextResponse.json(rounds);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const roundIdStr = url.searchParams.get('roundId');
    if (!roundIdStr) return NextResponse.json({ error: 'Missing roundId' }, { status: 400 });
    
    await db.delete(tournament_rounds).where(eq(tournament_rounds.id, parseInt(roundIdStr)));
    return NextResponse.json({ success: true });
  } catch(err: any){
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
