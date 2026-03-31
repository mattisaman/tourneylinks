import { NextResponse } from 'next/server';
import { db, player_scores, registrations } from '@/lib/db';
import { eq, desc, asc, and } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
     const resolvedParams = await params;
     const tournamentId = parseInt(resolvedParams.id);

     const allScores = await db.select().from(player_scores).orderBy(asc(player_scores.updatedAt));
     const allRegs = await db.select().from(registrations).where(eq(registrations.tournamentId, tournamentId));

     // Construct Pace of Play array
     const telemetry = allRegs.map(reg => {
        const teamScores = allScores.filter(s => s.registrationId === reg.id);
        
        const holesPlayed = teamScores.length;
        let paceMins = null;
        let lastUpdated = null;
        let isBehindPace = false;

        if (holesPlayed > 1) {
            // First score entered vs latest score entered
            const firstTime = new Date(teamScores[0].updatedAt).getTime();
            const lastTime = new Date(teamScores[teamScores.length - 1].updatedAt).getTime();
            
            lastUpdated = teamScores[teamScores.length - 1].updatedAt;

            // Difference in minutes divided by (holes completed - 1)
            const msDelta = lastTime - firstTime;
            const minutesDelta = msDelta / 1000 / 60;
            paceMins = Math.round(minutesDelta / (holesPlayed - 1));
            
            // Pace SLA Violation (Course average should realistically be ~12-14 mins per hole)
            if (paceMins > 16) {
                isBehindPace = true;
            }
        } else if (holesPlayed === 1) {
            lastUpdated = teamScores[0].updatedAt;
        }

        const lastName = reg.name.split(' ').pop();
        const teamName = reg.name.toLowerCase().includes('team') ? reg.name : `Team ${lastName}`;

        return {
           teamId: reg.id,
           teamName: reg.assignedTeam ? `Group ${reg.assignedTeam} (${teamName})` : teamName,
           holesPlayed,
           lastHole: holesPlayed > 0 ? teamScores[holesPlayed - 1].holeNumber : null,
           lastUpdated,
           paceMins,
           isBehindPace
        };
     }).filter(t => t.holesPlayed > 0); // Only track teams actively out on the course!

     // Sort by lowest holes played (the laggards), then by longest pace
     telemetry.sort((a, b) => {
         if (b.isBehindPace && !a.isBehindPace) return 1;
         if (a.isBehindPace && !b.isBehindPace) return -1;
         return b.paceMins! - a.paceMins!;
     });

     return NextResponse.json(telemetry);

  } catch(err: any) {
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
