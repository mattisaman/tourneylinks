'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

type Score = {
  registrationId: number;
  holeNumber: number;
  grossScore: number;
};

type Player = {
  id: number;
  firstName: string;
  lastName: string;
};

export default function TVLeaderboard() {
  const params = useParams();
  const tournamentId = parseInt(params.id as string);

  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  // Poll for live scoring data every 10 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, scoresRes] = await Promise.all([
          fetch(`/api/admin/tournaments/${tournamentId}/registrants`),
          fetch(`/api/tournaments/${tournamentId}/scores`)
        ]);
        
        const pData = await playersRes.json();
        const sData = await scoresRes.json();
        
        if (Array.isArray(pData)) setPlayers(pData);
        if (Array.isArray(sData)) setScores(sData);
      } catch (err) {
        console.error("TV Polling Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [tournamentId]);

  // Aggregate Scores
  const leaderboard = players.map(p => {
    // For pure Gross Scramble/Stroke representation
    const pScores = scores.filter(s => s.registrationId === p.id);
    const totalStrokes = pScores.reduce((sum, s) => sum + s.grossScore, 0);
    const holesPlayed = pScores.length;
    // Assume Par 72 for 18 holes, Par 4 average -> relative to par roughly
    const relativePar = holesPlayed > 0 ? totalStrokes - (holesPlayed * 4) : 0;
    
    return {
      ...p,
      totalStrokes,
      holesPlayed,
      relativePar,
      displayScore: holesPlayed === 0 ? 'E' : relativePar > 0 ? `+${relativePar}` : relativePar === 0 ? 'E' : `${relativePar}` 
    };
  }).sort((a, b) => a.relativePar - b.relativePar);

  // Auto-scrolling logic (Infinite Loop)
  useEffect(() => {
    if (loading || leaderboard.length < 5) return; // Only scroll if there's actually a massive list
    let isResetting = false;

    const scrollInterval = setInterval(() => {
       if (isResetting) return; // Pause the downward scroll while jumping to the top

       window.scrollBy({ top: 1.5, left: 0, behavior: 'auto' });
       
       // Detect if we hit the absolute bottom of the DOM (with a small buffer)
       if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
          isResetting = true;
          // Wait 3 seconds at the bottom for people to read the last place players, then snap instantly to the top
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'auto' });
            // Resume scrolling after 3 seconds at the top
            setTimeout(() => { isResetting = false; }, 3000);
          }, 3000);
       }
    }, 50);
    
    return () => clearInterval(scrollInterval);
  }, [loading, leaderboard.length]);

  if (loading) {
    return <div style={{ background: '#05120c', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '2rem' }}>INITIALIZING LIVE FEED...</div>;
  }

  return (
    <div style={{ background: '#05120c', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* Massive TV Header */}
      <div style={{ position: 'sticky', top: 0, background: 'rgba(5, 18, 12, 0.95)', backdropFilter: 'blur(10px)', padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid var(--gold)', zIndex: 50 }}>
         <div>
            <div style={{ color: 'var(--mist)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600 }}>Live Leaderboard</div>
            <div style={{ fontSize: '2.5rem', fontFamily: 'serif', fontWeight: 900 }}>TourneyLinks Open</div>
         </div>
         <div style={{ background: 'var(--gold)', color: '#05120c', padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>
            Powered by TourneyLinks
         </div>
      </div>

      <div style={{ padding: '2rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 150px 150px', gap: '1.5rem', padding: '0.5rem 1.5rem', borderBottom: '2px solid rgba(255,255,255,0.2)', fontSize: '1.2rem', color: 'var(--mist)', textTransform: 'uppercase', fontWeight: 700 }}>
           <div>Pos</div>
           <div>Team / Player</div>
           <div style={{ textAlign: 'center' }}>Thru</div>
           <div style={{ textAlign: 'right' }}>Score</div>
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
           {leaderboard.length === 0 ? (
               <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.5rem', color: 'var(--mist)' }}>Waiting for first tee off...</div>
           ) : leaderboard.map((player, index) => (
             <div key={player.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 150px 150px', gap: '1.5rem', padding: '0.75rem 1.5rem', background: index === 0 ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)', border: index === 0 ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', alignItems: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: index === 0 ? 'var(--gold)' : 'white' }}>{index + 1}</div>
                <div>
                   <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{player.firstName} {player.lastName}</div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--mist)' }}>PGA Professional</div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 600, textAlign: 'center', color: player.holesPlayed === 18 ? 'var(--mist)' : 'white' }}>
                   {player.holesPlayed === 0 ? '1:00 PM' : player.holesPlayed === 18 ? 'F' : player.holesPlayed}
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, textAlign: 'right', color: player.relativePar < 0 ? '#ff4d4f' : player.relativePar > 0 ? 'var(--mist)' : 'white' }}>
                   {player.displayScore}
                </div>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
}
