import { NextRequest, NextResponse } from 'next/server';
import { db, tournaments, registrations, player_scores, tournament_rounds, course_holes } from '@/lib/db';
import { FormatEngine } from '@/lib/scoring-engine';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tournamentId = parseInt(id);
    if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const tourneyList = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId));
    if (tourneyList.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const tournament = tourneyList[0];

    const players = await db.select().from(registrations).where(eq(registrations.tournamentId, tournamentId));
    const mappedPlayers = players.map(p => ({ id: p.id, name: p.name, handicap: p.handicap || 0 }));
    
    // Default config if DB empty
    if (mappedPlayers.length === 0) {
        return NextResponse.json([]);
    }

    const holesData = await db.select().from(course_holes).where(eq(course_holes.courseId, tournament.courseId!));
    const roundData = await db.select().from(tournament_rounds).where(eq(tournament_rounds.tournamentId, tournamentId)).limit(1);
    const activeFormat = roundData.length > 0 ? roundData[0].scoringFormat : 'STROKE_GROSS';
    const scores = await db.select().from(player_scores);

    const engine = new FormatEngine(
      activeFormat,
      holesData as any,
      mappedPlayers as any,
      scores as any
    );

    const leaderboard = engine.computeLeaderboard();
    return NextResponse.json({ format: activeFormat, leaderboard });

  } catch (err: any) {
    console.error('Leaderboard API failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
