'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type PaceMetrics = {
  teamId: number;
  teamName: string;
  holesPlayed: number;
  lastHole: number | null;
  lastUpdated: string | null;
  paceMins: number | null;
  isBehindPace: boolean;
};

export default function LiveTelemetry({ tournamentId, showProLink }: { tournamentId: number, showProLink?: boolean }) {
  const [metrics, setMetrics] = useState<PaceMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const streamPace = async () => {
        try {
           if (process.env.NEXT_PUBLIC_IS_DEMO === 'true') {
              setMetrics([
                  { teamId: 1, teamName: 'Jordan / Woods', holesPlayed: 14, lastHole: 14, paceMins: 13.5, lastUpdated: new Date().toISOString(), isBehindPace: false },
                  { teamId: 2, teamName: 'Mickelson / McIlroy', holesPlayed: 12, lastHole: 12, paceMins: 16.2, lastUpdated: new Date(Date.now() - 300000).toISOString(), isBehindPace: true },
                  { teamId: 3, teamName: 'Spieth / Fowler', holesPlayed: 15, lastHole: 15, paceMins: 12.8, lastUpdated: new Date().toISOString(), isBehindPace: false }
              ]);
              return;
           }

           const res = await fetch(`/api/admin/tournaments/${tournamentId}/telemetry`);
           const data = await res.json();
           if (Array.isArray(data)) setMetrics(data);
        } catch(err) {
           console.error("Telemetry failed to stream");
        } finally {
           setLoading(false);
        }
     };

     streamPace();
     const interval = setInterval(streamPace, 15000);
     return () => clearInterval(interval);
  }, [tournamentId]);

  if (loading) {
     return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mist)' }}>Loading Live Course Telemetry...</div>;
  }

  return (
     <div className="dash-card">
        <div className="dash-card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
           <div className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ff4d4f', boxShadow: '0 0 10px #ff4d4f', animation: 'pulse 2s infinite' }}></span>
              Live Tournament Telemetry
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link href={`/demo/mobile-scorer`} target="_blank" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.8rem', background: 'var(--forest)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                 📱 Launch Mobile Scorer
              </Link>
              <Link href={`/demo/tv-scoreboard`} target="_blank" style={{ color: '#000', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.8rem', background: 'var(--gold)', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.2)' }}>
                 📺 TV Leaderboard
              </Link>
              {showProLink && (
                 <Link href={`/tournaments/${tournamentId}/pro`} target="_blank" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.8rem', background: 'rgba(212,175,55,0.1)', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.2)' }}>
                    ↗ Ranger Radar
                 </Link>
              )}
              <span className="status-pill status-paid" style={{ fontSize: '0.75rem' }}>Live</span>
           </div>
        </div>
        
        <div style={{ padding: '0.5rem 0' }}>
           {metrics.length === 0 ? (
               <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mist)' }}>No teams are actively out on the course. Waiting for first hole completion...</div>
           ) : (
               <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table className="registrant-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                     <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--mist)', fontSize: '0.8rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Team Name</th>
                          <th style={{ textAlign: 'center', padding: '1rem', color: 'var(--mist)', fontSize: '0.8rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Location</th>
                          <th style={{ textAlign: 'center', padding: '1rem', color: 'var(--mist)', fontSize: '0.8rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Pace Avg</th>
                          <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--mist)', fontSize: '0.8rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        {metrics.map(team => (
                           <tr key={team.teamId} style={{ background: team.isBehindPace ? 'rgba(255, 77, 79, 0.05)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: '1rem', fontWeight: 700, color: team.isBehindPace ? '#ff4d4f' : 'white' }}>
                                 {team.teamName}
                                 {team.isBehindPace && <span style={{ marginLeft: '1rem', fontSize: '0.7rem', textTransform: 'uppercase', background: '#ff4d4f', color: '#1a0505', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 900 }}>Pace Warning</span>}
                              </td>
                              <td style={{ padding: '1rem', textAlign: 'center' }}>
                                 <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Hole {team.lastHole}</div>
                                 <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>{team.holesPlayed} Completed</div>
                              </td>
                              <td style={{ padding: '1rem', textAlign: 'center' }}>
                                 {team.paceMins ? (
                                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: team.isBehindPace ? '#ff4d4f' : 'var(--mist)' }}>
                                       {team.paceMins} <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--mist)' }}>mins/hole</span>
                                    </div>
                                 ) : (
                                    <div style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--mist)' }}>Calculating...</div>
                                 )}
                              </td>
                              <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.8rem' }}>
                                 {team.lastUpdated ? new Date(team.lastUpdated).toLocaleTimeString([], { hour: 'numeric', minute:'2-digit' }) : 'Unknown'}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
           )}
        </div>
        
        <style dangerouslySetInnerHTML={{ __html: `
            @keyframes pulse {
                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7); }
                70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 77, 79, 0); }
                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 77, 79, 0); }
            }
        `}} />
     </div>
  );
}
