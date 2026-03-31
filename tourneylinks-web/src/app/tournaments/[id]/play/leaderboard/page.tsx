import React from 'react';
import { db, tournaments, registrations, player_scores } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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

  // 2) Fetch massive dump of all Scores
  const scores = await db.select().from(player_scores); // Realistically we'd filter by round, but we don't know the round ID yet

  // 3) Perform Arithmetic
  const leaderboard = mappedPlayers.map(p => {
    const pScores = scores.filter(s => s.registrationId === p.id);
    const totalStrokes = pScores.reduce((sum, current) => sum + current.grossScore, 0);
    const holesPlayed = pScores.length;

    // Relative to Par (assuming Par 4 everywhere for demo)
    const relativePar = holesPlayed > 0 ? totalStrokes - (holesPlayed * 4) : 0;
    
    let displayScore = holesPlayed === 0 ? 'E' : relativePar > 0 ? `+${relativePar}` : relativePar === 0 ? 'E' : `${relativePar}`;

    return {
       ...p,
       totalStrokes,
       holesPlayed,
       relativePar,
       displayScore
    };
  }).sort((a, b) => {
     // Sort by lowest relative par, and then most holes played
     if (a.relativePar === b.relativePar) {
         return b.holesPlayed - a.holesPlayed; 
     }
     return a.relativePar - b.relativePar;
  });

  return (
    <div style={{ background: '#05120c', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', paddingBottom: '90px' }}>
      
      {/* Mobile Top App Bar */}
      <div style={{ position: 'sticky', top: 0, background: 'rgba(5, 18, 12, 0.95)', backdropFilter: 'blur(10px)', padding: '1rem', borderBottom: '2px solid rgba(212,175,55,0.3)', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mobile Leaderboard</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'serif', fontWeight: 800 }}>{tournament.name}</div>
         </div>
      </div>

      <div style={{ padding: '1rem' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
           {leaderboard.length === 0 ? (
               <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mist)' }}>Awaiting Scores...</div>
           ) : leaderboard.map((player, index) => (
             <div key={player.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: index === 0 ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)', border: index === 0 ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '25px', fontSize: '1.2rem', fontWeight: 900, color: index === 0 ? 'var(--gold)' : 'var(--mist)', textAlign: 'right' }}>{index + 1}</div>
                    <div>
                       <div style={{ fontSize: '1.1rem', fontWeight: 700, color: index === 0 ? 'var(--gold)' : 'white' }}>{player.name}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Thru {player.holesPlayed === 18 ? 'F' : player.holesPlayed === 0 ? '-' : player.holesPlayed}</div>
                    </div>
                </div>
                
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: player.relativePar < 0 ? '#ff4d4f' : player.relativePar > 0 ? 'var(--mist)' : 'white' }}>
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
