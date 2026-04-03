import React from 'react';
import { db, tournaments, registrations } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import PrintButton from '@/components/admin/PrintButton';

export const dynamic = 'force-dynamic';

export default async function PrintStationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tourneyId = parseInt(resolvedParams.id);
  if (isNaN(tourneyId)) return notFound();

  // Load Tournament
  const tourneys = await db.select().from(tournaments).where(eq(tournaments.id, tourneyId)).limit(1);
  const tourney = tourneys[0];
  if (!tourney) return notFound();

  // Load Players 
  const players = await db.select()
    .from(registrations)
    .where(eq(registrations.tournamentId, tourneyId))
    .orderBy(desc(registrations.createdAt));

  // Determine Teams based on assignedTeam
  const teamsMap: Record<number, typeof players> = {};
  players.forEach(p => {
    if (p.assignedTeam) {
       if (!teamsMap[p.assignedTeam]) teamsMap[p.assignedTeam] = [];
       teamsMap[p.assignedTeam].push(p);
    }
  });
  
  const teamKeys = Object.keys(teamsMap).map(Number).sort((a,b)=>a-b);

  return (
    <div style={{ background: '#f0f0f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* GLOBAL CSS FOR PRINTING - Hide Navbars & Configure Pages */}
      <style dangerouslySetInnerHTML={{__html: `
        @page { size: letter; margin: 0; }
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          nav { display: none !important; }
          header { display: none !important; }
          .page-break { page-break-after: always; break-after: page; }
          .print-container { padding: 0 !important; margin: 0 !important; background: transparent !important; box-shadow: none !important; }
        }
        .print-btn {
          position: fixed; bottom: 2rem; right: 2rem;
          background: #4ec9a0; color: #000; padding: 1rem 2rem; border-radius: 50px;
          font-weight: bold; font-size: 1.1rem; border: none; cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 1000;
        }
        .print-btn:hover { transform: translateY(-2px); }
        .sheet {
          background: white; width: 8.5in; min-height: 11in;
          margin: 2rem auto; padding: 0.5in; box-shadow: 0 5px 20px rgba(0,0,0,0.2);
          position: relative; overflow: hidden;
        }
      `}} />

      <div className="no-print" style={{ padding: '2rem', textAlign: 'center', background: '#05120c', color: 'white' }}>
        <h1 style={{ marginBottom: '1rem' }}>🖨️ TourneyLinks Print Station</h1>
        <p style={{ color: 'var(--mist)' }}>Wait for the pages to render below, then click Print. Make sure "Background Graphics" is enabled in your print dialog.</p>
        <PrintButton />
      </div>

      <div className="print-container" style={{ padding: '2rem' }}>
        
        {/* SECTION 1: CART SIGNS (2 Teams Per Page) */}
        {teamKeys.reduce((result: number[][], item, index) => {
          if (index % 2 === 0) result.push(teamKeys.slice(index, index + 2));
          return result;
        }, []).map((teamPair, pageIndex) => (
          <div key={`cart-page-${pageIndex}`} className="sheet page-break" style={{ display: 'flex', flexDirection: 'column' }}>
            {teamPair.map((teamId, i) => {
              const teamPlayers = teamsMap[teamId];
              return (
                <div key={`cart-${teamId}`} style={{ 
                  flex: 1, border: '4px solid #05120c', borderRadius: '12px', 
                  margin: i === 0 ? '0 0 0.5in 0' : '0', 
                  padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  position: 'relative', overflow: 'hidden'
                }}>
                  {/* Subtle Background Logo */}
                  <div style={{ position: 'absolute', top: -100, right: -100, opacity: 0.05, fontSize: '300px' }}>⛳</div>

                  <div>
                    <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', color: '#666', fontWeight: 700 }}>
                      {tourney.courseName || 'TourneyLinks Event'}
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'serif', color: '#05120c', marginTop: '0.5rem', lineHeight: 1 }}>
                      {tourney.name}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                    <div style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888', marginBottom: '1rem' }}>Team {teamId}</div>
                    {teamPlayers.map(p => (
                      <div key={p.id} style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0', color: '#000' }}>
                        {p.name}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                     <div style={{ fontWeight: 600, fontSize: '1.2rem' }}>Tee Time: <span style={{ fontWeight: 400 }}>{tourney.format || 'Standard'}</span></div>
                     <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://tourneylinks.com/tournaments/${tourney.id}`} alt="Live Scoring QR" style={{ width: 80, height: 80 }} />
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* SECTION 2: BLANK SCORECARDS (1 Per Page or 2 Per Page) */}
        {teamKeys.map((teamId) => {
          const teamPlayers = teamsMap[teamId];
          return (
            <div key={`scorecard-${teamId}`} className="sheet page-break" style={{ padding: '0.5in' }}>
               <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                 <h1 style={{ fontFamily: 'serif', fontSize: '2.5rem', marginBottom: '0.5rem' }}>OFFICIAL SCORECARD</h1>
                 <h3 style={{ fontWeight: 500, color: '#444' }}>{tourney.name} • Team {teamId}</h3>
               </div>
               
               {/* 18 Hole Grid */}
               <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000', textAlign: 'center' }}>
                 <thead>
                   <tr style={{ background: '#f5f5f5' }}>
                     <th style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', width: '20%' }}>Hole</th>
                     {[1,2,3,4,5,6,7,8,9, 'OUT', 10,11,12,13,14,15,16,17,18, 'IN', 'TOT'].map(h => (
                       <th key={h} style={{ border: '1px solid #000', padding: '0.5rem', fontSize: '0.8rem', width: h === 'OUT' || h === 'IN' || h === 'TOT' ? '6%' : '4%' }}>{h}</th>
                     ))}
                   </tr>
                 </thead>
                 <tbody>
                   {/* Par Row */}
                   <tr>
                     <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', fontWeight: 'bold' }}>Par</td>
                     {[...Array(21)].map((_, i) => (
                       <td key={`par-${i}`} style={{ border: '1px solid #000', padding: '0.5rem' }}></td>
                     ))}
                   </tr>
                   {/* HDCP Row */}
                   <tr>
                     <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', fontWeight: 'bold' }}>Handicap</td>
                     {[...Array(21)].map((_, i) => (
                       <td key={`hdcp-${i}`} style={{ border: '1px solid #000', padding: '0.5rem' }}></td>
                     ))}
                   </tr>
                   {/* Player Rows */}
                   {teamPlayers.map(p => (
                     <tr key={`sc-${p.id}`} style={{ height: '2.5rem' }}>
                       <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', fontWeight: 'bold', fontSize: '1.1rem' }}>{p.name}</td>
                       {[...Array(21)].map((_, i) => (
                         <td key={`sc-${p.id}-h${i}`} style={{ border: '1px solid #000', padding: '0.5rem' }}></td>
                       ))}
                     </tr>
                   ))}
                   {/* Marker Signature */}
                 </tbody>
               </table>
               
               <div style={{ marginTop: '2in', display: 'flex', justifyContent: 'space-between' }}>
                 <div style={{ borderTop: '1px solid #000', width: '40%', paddingTop: '0.5rem', fontWeight: 'bold' }}>Scorer Signature</div>
                 <div style={{ borderTop: '1px solid #000', width: '40%', paddingTop: '0.5rem', fontWeight: 'bold' }}>Attest Signature</div>
               </div>
            </div>
          );
        })}

        {teamKeys.length === 0 && (
          <div className="sheet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            <h1>No teams have been flighted yet. Assign teams first!</h1>
          </div>
        )}

      </div>
    </div>
  );
}
