import { NextRequest, NextResponse } from 'next/server';
import { db, player_scores, tournament_rounds, tournaments, course_holes } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tournamentId = parseInt(id);
    if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid config' }, { status: 400 });

    // 1. Fetch Tournament Context & Target Course
    const tournament = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).then(res => res[0]);
    if (!tournament || !tournament.courseId) {
      return NextResponse.json({ error: 'Tournament or linked course missing' }, { status: 404 });
    }

    // 2. Fetch Course Architecture (Pars per hole)
    const architecture = await db.select().from(course_holes).where(eq(course_holes.courseId, tournament.courseId));
    const parMap: Record<number, number> = {};
    architecture.forEach(h => {
        parMap[h.holeNumber] = h.par;
    });

    // 3. Fetch all raw scores tied to this tournament (using Rounds)
    const rounds = await db.select().from(tournament_rounds).where(eq(tournament_rounds.tournamentId, tournamentId));
    if (rounds.length === 0) return NextResponse.json({ 
        courseAverages: null, 
        holeDifficulties: [] 
    });

    const roundIds = rounds.map(r => r.id);
    const allScores = await db.select().from(player_scores);
    const tournamentScores = allScores.filter(s => roundIds.includes(s.tournamentRoundId));

    if (tournamentScores.length === 0) return NextResponse.json({ 
        courseAverages: null, 
        holeDifficulties: [] 
    });

    // 4. Aggregation Engines

    // A. Course Wide Averages
    let totalPutts = 0; let totalPuttHoles = 0;
    let totalFIR = 0; let firEligibleHoles = 0;
    let totalGIR = 0; let girEligibleHoles = 0;
    let totalGross = 0; let totalGrossHoles = 0;

    // B. Hole-by-Hole Distribution Tracking
    type HoleDist = {
       holeNumber: number;
       par: number;
       totalStrokes: number;
       plays: number;
       birdiesOrBetter: number;
       pars: number;
       bogeys: number;
       doublesOrWorse: number;
    };
    
    const holeMatrix: Record<number, HoleDist> = {};
    for (let h = 1; h <= 18; h++) {
        holeMatrix[h] = {
            holeNumber: h,
            par: parMap[h] || 4, // fallback if course not fully modeled
            totalStrokes: 0,
            plays: 0,
            birdiesOrBetter: 0,
            pars: 0,
            bogeys: 0,
            doublesOrWorse: 0
        };
    }

    // Pipeline Data
    for (const score of tournamentScores) {
        // Course Wide Maths
        if (score.putts !== null && score.putts !== undefined) {
            totalPutts += score.putts;
            totalPuttHoles++;
        }
        if (score.gir !== null) {
            totalGIR += score.gir ? 1 : 0;
            girEligibleHoles++;
        }
        
        const holePar = parMap[score.holeNumber] || 4;
        
        // FIR is only eligible on Par 4s and Par 5s
        if (score.fir !== null && holePar > 3) {
            totalFIR += score.fir ? 1 : 0;
            firEligibleHoles++;
        }

        totalGross += score.grossScore;
        totalGrossHoles++;

        // Hole-by-Hole Math
        const m = holeMatrix[score.holeNumber];
        if (m) {
            m.plays++;
            m.totalStrokes += score.grossScore;
            
            const rel = score.grossScore - m.par;
            if (rel <= -1) m.birdiesOrBetter++;
            else if (rel === 0) m.pars++;
            else if (rel === 1) m.bogeys++;
            else if (rel >= 2) m.doublesOrWorse++;
        }
    }

    // Resolve hole metrics
    const holeDifficulties = Object.values(holeMatrix)
        .filter(m => m.plays > 0)
        .map(Math => ({
           ...Math,
           avgScore: Math.totalStrokes / Math.plays,
           avgToPar: (Math.totalStrokes / Math.plays) - Math.par
        }))
        // Sort highest avgtoPar to lowest -> hardest holes first
        .sort((a, b) => b.avgToPar - a.avgToPar);
    
    // Map rank to them: 1 is hardest
    holeDifficulties.forEach((h, idx) => {
        (h as any).difficultyRank = idx + 1;
    });

    return NextResponse.json({
        courseAverages: {
            averageGrossScore: totalGrossHoles ? (totalGross / totalGrossHoles) : null,
            averagePutts: totalPuttHoles ? (totalPutts / totalPuttHoles) : null,
            girPercentage: girEligibleHoles > 0 ? (totalGIR / girEligibleHoles) * 100 : null,
            firPercentage: firEligibleHoles > 0 ? (totalFIR / firEligibleHoles) * 100 : null,
        },
        holeDifficulties
    });

  } catch (err: any) {
    console.error('Stats engine failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
