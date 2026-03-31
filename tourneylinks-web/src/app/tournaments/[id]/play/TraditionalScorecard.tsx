'use client';

import React, { useState, useEffect } from 'react';

type AIHole = {
  holeNumber: number;
  par: number;
  yardage: number;
  handicapData: number;
};

type ScoreMeta = {
  registrationId: number;
  holeNumber: number;
  grossScore: number;
};

export default function TraditionalScorecard({ tournamentId, courseId }: { tournamentId: number, courseId: number }) {
  const [courseGrid, setCourseGrid] = useState<AIHole[]>([]);
  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
  const [teamScores, setTeamScores] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  // Natively intercept the Postgres DB to construct the active matrix
  useEffect(() => {
     const scrapeData = async () => {
        try {
           // Fetch course physical data, and live tournament scores natively in parallel
           const [regsRes, scoresRes, courseRes] = await Promise.all([
              fetch(`/api/admin/tournaments/${tournamentId}/registrants`),
              fetch(`/api/tournaments/${tournamentId}/scores`),
              fetch(`/api/courses/${courseId}`)
           ]);

           if (regsRes.ok && scoresRes.ok) {
               const regs = await regsRes.json();
               const scoresData: ScoreMeta[] = await scoresRes.json();

               if (regs.length > 0) {
                  const myId = regs[0].id; // Mocking "Team Woods"
                  setActiveTeamId(myId);

                  const mappedScores: Record<number, number> = {};
                  scoresData.filter((s: any) => s.registrationId === myId).forEach((s: any) => {
                     mappedScores[s.holeNumber] = s.grossScore;
                  });
                  setTeamScores(mappedScores);
               }
           }
           
           if (courseRes.ok) {
              const cData = await courseRes.json();
              if (Array.isArray(cData) && cData.length > 0) {
                 setCourseGrid(cData.sort((a: any, b: any) => a.holeNumber - b.holeNumber));
              } else {
                 console.log("Course layout returned empty array.");
              }
           } else {
              console.error("Course fetch failed:", courseRes.status);
           }
        } catch(err) {
           console.error("Scorecard overlay sync failed:", err);
        } finally {
           setLoading(false);
        }
     };
     
     scrapeData();

     // Listen for dynamic score pushes from the Interactive HUD
     window.addEventListener('scoreSaved', scrapeData);
     return () => window.removeEventListener('scoreSaved', scrapeData);
  }, [tournamentId, courseId]);

  if (loading) return null; // Invisible until dynamically evaluated

  if (courseGrid.length === 0) {
     return (
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', textAlign: 'center', margin: '2rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📷</div>
            <div style={{ color: 'var(--mist)', fontSize: '0.85rem' }}>The Organizer has not uploaded the physical Course Scorecard layout yet.</div>
        </div>
     );
  }

  // Mathematics Engine
  const front9 = courseGrid.slice(0, 9);
  const back9 = courseGrid.slice(9, 18);
  
  const frontPar = front9.reduce((s, h) => s + h.par, 0);
  const backPar = back9.reduce((s, h) => s + h.par, 0);
  const totalPar = frontPar + backPar;

  const frontYds = front9.reduce((s, h) => s + h.yardage, 0);
  const backYds = back9.reduce((s, h) => s + h.yardage, 0);
  const totalYds = frontYds + backYds;

  const getStrokesForRange = (start: number, end: number) => {
     let total = 0;
     for (let i = start; i <= end; i++) {
        if (teamScores[i]) total += teamScores[i];
     }
     return total;
  };

  const frontScore = getStrokesForRange(1, 9);
  const backScore = getStrokesForRange(10, 18);
  const totalScore = frontScore + backScore;

  const tableHeaderStyle = { padding: '0.6rem 0.2rem', color: 'var(--mist)', fontSize: '0.6rem', textTransform: 'uppercase' as const, fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.2)' };
  const cellStyle = { padding: '0.5rem 0.2rem', textAlign: 'center' as const, fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' };
  const totalStyle = { ...cellStyle, fontWeight: 800, background: 'rgba(255,255,255,0.05)' };

  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
       <div style={{ fontSize: '0.75rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: '0.5rem' }}>Traditional View</div>
       
       <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
             <thead>
                <tr>
                   <th style={{ ...tableHeaderStyle, width: '60px', textAlign: 'left', paddingLeft: '1rem' }}>Hole</th>
                   {front9.map(h => <th key={h.holeNumber} style={tableHeaderStyle}>{h.holeNumber}</th>)}
                   <th style={{ ...tableHeaderStyle, color: 'white' }}>OUT</th>
                   {back9.map(h => <th key={h.holeNumber} style={tableHeaderStyle}>{h.holeNumber}</th>)}
                   <th style={{ ...tableHeaderStyle, color: 'white' }}>IN</th>
                   <th style={{ ...tableHeaderStyle, color: 'var(--gold)' }}>TOT</th>
                </tr>
             </thead>
             <tbody>
                {/* Yardages row */}
                <tr>
                   <td style={{ ...cellStyle, textAlign: 'left', paddingLeft: '1rem', color: 'var(--mist)', fontSize: '0.65rem' }}>Yards</td>
                   {front9.map(h => <td key={`y${h.holeNumber}`} style={{...cellStyle, color: 'var(--mist)'}}>{h.yardage}</td>)}
                   <td style={{...totalStyle, color: 'white'}}>{frontYds}</td>
                   {back9.map(h => <td key={`y${h.holeNumber}`} style={{...cellStyle, color: 'var(--mist)'}}>{h.yardage}</td>)}
                   <td style={{...totalStyle, color: 'white'}}>{backYds}</td>
                   <td style={{...totalStyle, color: 'var(--gold)'}}>{totalYds}</td>
                </tr>
                {/* Pars row */}
                <tr>
                   <td style={{ ...cellStyle, textAlign: 'left', paddingLeft: '1rem', fontWeight: 800 }}>Par</td>
                   {front9.map(h => <td key={`p${h.holeNumber}`} style={{...cellStyle, fontWeight: 800}}>{h.par}</td>)}
                   <td style={{...totalStyle, color: 'white'}}>{frontPar}</td>
                   {back9.map(h => <td key={`p${h.holeNumber}`} style={{...cellStyle, fontWeight: 800}}>{h.par}</td>)}
                   <td style={{...totalStyle, color: 'white'}}>{backPar}</td>
                   <td style={{...totalStyle, color: 'var(--gold)'}}>{totalPar}</td>
                </tr>
                {/* Active Scores row */}
                <tr>
                   <td style={{ ...cellStyle, textAlign: 'left', paddingLeft: '1rem', fontWeight: 800, color: 'var(--cream)' }}>Score</td>
                   {front9.map(h => {
                       const sc = teamScores[h.holeNumber];
                       const color = sc ? (sc < h.par ? '#4CAF50' : sc > h.par ? '#ff4d4f' : 'white') : 'var(--mist)';
                       const bgShape = sc ? (sc < h.par ? '50%' : sc > h.par ? '4px' : '0') : '0';
                       return (
                          <td key={`s${h.holeNumber}`} style={{...cellStyle, fontWeight: 800, color}}>
                             {sc ? <span style={{ display: 'inline-block', minWidth: '20px', padding: '0.15rem', background: sc !== h.par ? 'rgba(255,255,255,0.05)' : 'none', borderRadius: bgShape, border: sc !== h.par ? `1px solid ${color}` : 'none' }}>{sc}</span> : '-'}
                          </td>
                       );
                   })}
                   <td style={{...totalStyle, color: 'white'}}>{frontScore || '-'}</td>
                   {back9.map(h => {
                       const sc = teamScores[h.holeNumber];
                       const color = sc ? (sc < h.par ? '#4CAF50' : sc > h.par ? '#ff4d4f' : 'white') : 'var(--mist)';
                       const bgShape = sc ? (sc < h.par ? '50%' : sc > h.par ? '4px' : '0') : '0';
                       return (
                          <td key={`s${h.holeNumber}`} style={{...cellStyle, fontWeight: 800, color}}>
                             {sc ? <span style={{ display: 'inline-block', minWidth: '20px', padding: '0.15rem', background: sc !== h.par ? 'rgba(255,255,255,0.05)' : 'none', borderRadius: bgShape, border: sc !== h.par ? `1px solid ${color}` : 'none' }}>{sc}</span> : '-'}
                          </td>
                       );
                   })}
                   <td style={{...totalStyle, color: 'white'}}>{backScore || '-'}</td>
                   <td style={{...totalStyle, color: 'var(--gold)'}}>{totalScore || '-'}</td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  );
}
