import { NextRequest, NextResponse } from 'next/server';
import { db, player_scores, tournament_rounds } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tournamentId = parseInt(id);
    if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid config' }, { status: 400 });

    const body = await req.json();
    const { registrationId, holeNumber, grossScore, putts, gir, fir } = body;
    let { tournamentRoundId } = body;

    // Failsafe: If no Round ID was passed from the client, find the first round for this tournament
    if (!tournamentRoundId) {
        const rounds = await db.select().from(tournament_rounds).where(eq(tournament_rounds.tournamentId, tournamentId)).limit(1);
        if (rounds.length > 0) {
            tournamentRoundId = rounds[0].id;
        } else {
            // Failsafe: Create an implicit Round 1 if the organizer never clicked "Initialize Round"
            const newRound = await db.insert(tournament_rounds).values({
                tournamentId,
                roundNumber: 1,
                dateString: new Date().toISOString().split('T')[0],
                scoringFormat: 'STROKE_NET'
            }).returning();
            tournamentRoundId = newRound[0].id;
        }
    }

    if (!registrationId || !holeNumber || grossScore === undefined) {
      return NextResponse.json({ error: 'Missing core scoring metrics' }, { status: 400 });
    }

    // Upsert Logic: Check if player already recorded this hole
    const existing = await db.select()
      .from(player_scores)
      .where(and(
         eq(player_scores.registrationId, registrationId),
         eq(player_scores.tournamentRoundId, tournamentRoundId),
         eq(player_scores.holeNumber, holeNumber)
      )).limit(1);

    if (existing.length > 0) {
        // Update existing score
        const updated = await db.update(player_scores)
          .set({ grossScore, putts, gir, fir, updatedAt: new Date() })
          .where(eq(player_scores.id, existing[0].id))
          .returning();
        return NextResponse.json({ success: true, score: updated[0] });
    } else {
        // Insert new score
        const inserted = await db.insert(player_scores).values({
            registrationId,
            tournamentRoundId,
            holeNumber,
            grossScore,
            putts,
            gir,
            fir
        }).returning();
        return NextResponse.json({ success: true, score: inserted[0] });
    }
  } catch (err: any) {
    console.error('Score submission failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tournamentId = parseInt(id);
    
    // In a real query, we join via rounds. For now, fetch ALL rounds then their scores.
    const rounds = await db.select().from(tournament_rounds).where(eq(tournament_rounds.tournamentId, tournamentId));
    if (rounds.length === 0) return NextResponse.json([]); // No scoring yet

    const roundIds = rounds.map(r => r.id);
    
    // Instead of using complex `inArray` which requires precise imports, we query all scores and filter. 
    // Usually we use `inArray(player_scores.tournamentRoundId, roundIds)`
    const allScores = await db.select().from(player_scores);
    const tournamentScores = allScores.filter(s => roundIds.includes(s.tournamentRoundId));

    return NextResponse.json(tournamentScores);
  } catch(err: any){
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
