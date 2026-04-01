import React from 'react';
import { db, tournaments, registrations, player_scores, tournament_rounds, course_holes } from '@/lib/db';
import { FormatEngine } from '@/lib/scoring-engine';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BanterStream from './BanterStream';

export const dynamic = 'force-dynamic';

export default async function MobileLeaderboardPage({ 
  params,
  searchParams
}: { 
  params: { id: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const tourneyId = parseInt(params.id);
  const activeHole = searchParams.hole || '1'; // Pass through backward compatibility
  
  const tourneyList = await db.select().from(tournaments).where(eq(tournaments.id, tourneyId));
  if (tourneyList.length === 0) return notFound();
  const tournament = tourneyList[0];

  // 1) Fetch all participants
  let players = await db.select().from(registrations).where(eq(registrations.tournamentId, tourneyId));
  
  if (players.length === 0) {
      // Fake Teams just in case DB is fully empty so we don't crash
      players = [
          { id: 881, tournamentId: tourneyId, name: 'Team Woods', email: '', status: 'CONFIRMED' } as any
      ];
  }

  // Map to "Team LastName" if it's a squad
  const mappedPlayers = players.map(p => {
      const lastName = p.name.split(' ').pop();
      const teamName = p.name.toLowerCase().includes('team') ? p.name : `Team ${lastName}`;
      return { id: p.id, name: teamName, handicap: p.handicap || 0 };
  });

  // 2) Fetch Course Architecture to power the Format Engine
  const holesData = await db.select().from(course_holes).where(eq(course_holes.courseId, tournament.courseId!));

  // 3) Fetch the active Round format
  const roundData = await db.select().from(tournament_rounds).where(eq(tournament_rounds.tournamentId, tourneyId)).limit(1);
  const activeFormat = roundData.length > 0 ? roundData[0].scoringFormat : 'STROKE_GROSS';

  // 4) Fetch massive dump of all Scores
  const scores = await db.select().from(player_scores);

  // 5) Hydrate and Ignite the 30+ Scoring Formats Engine
  const engine = new FormatEngine(
      activeFormat,
      holesData as any,
      mappedPlayers as any,
      scores as any
  );

  const leaderboard = engine.computeLeaderboard();

  return (
    <div style={{ background: '#05120c', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', paddingBottom: '90px' }}>
      
      {/* Mobile Top App Bar */}
      <div style={{ position: 'sticky', top: 0, background: 'rgba(5, 18, 12, 0.95)', backdropFilter: 'blur(10px)', padding: '1rem', borderBottom: '2px solid rgba(212,175,55,0.3)', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mobile Leaderboard</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'serif', fontWeight: 800 }}>{tournament.name}</div>
         </div>
      </div>

      <BanterStream tournamentId={tourneyId} />

      <div style={{ padding: '1rem' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
           {leaderboard.length === 0 ? (
               <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mist)' }}>Awaiting Scores...</div>
           ) : leaderboard.map((player, index) => (
             <div key={player.registrationId} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: index === 0 ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)', border: index === 0 ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '25px', fontSize: '1.2rem', fontWeight: 900, color: index === 0 ? 'var(--gold)' : 'var(--mist)', textAlign: 'right' }}>{index + 1}</div>
                    <div>
                       <div style={{ fontSize: '1.1rem', fontWeight: 700, color: index === 0 ? 'var(--gold)' : 'white' }}>{player.name}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Thru {player.holesPlayed === 18 ? 'F' : player.holesPlayed === 0 ? '-' : player.holesPlayed}</div>
                    </div>
                </div>
                
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: player.displayScore.startsWith('+') ? '#ff4d4f' : player.displayScore === 'E' || player.displayScore === '--' ? 'white' : 'var(--mist)' }}>
                   {player.displayScore}
                </div>
             </div>
           ))}
         </div>
      </div>

      {/* FIXED BOTTOM NAVIGATION */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '80px', background: 'rgba(5, 18, 12, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', paddingBottom: '20px' }}>
         <Link href={`/tournaments/${tourneyId}/play?hole=${activeHole}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>✏️</div>
            <div style={{ color: 'var(--mist)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600 }}>Score</div>
         </Link>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '3px solid var(--gold)', marginTop: '-1px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>🏆</div>
            <div style={{ color: 'var(--gold)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800 }}>Leaderboard</div>
         </div>
         <Link href={`/tournaments/${tourneyId}/play/stats?hole=${activeHole}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>📊</div>
            <div style={{ color: 'var(--mist)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600 }}>Stats</div>
         </Link>
      </div>
      
    </div>
  );
}
