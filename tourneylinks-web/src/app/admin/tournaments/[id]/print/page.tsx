import React from 'react';
import { db, tournaments, registrations } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import PrintButton from '@/components/admin/PrintButton';
import SocialMediaHub from '@/components/admin/SocialMediaHub';

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
        <h1 style={{ marginBottom: '1rem' }}>🖨️ TourneyLinks Print & Post Hub</h1>
        <p style={{ color: 'var(--mist)', marginBottom: '2rem' }}>Wait for the pages to render below, then click Print. Make sure "Background Graphics" is enabled in your print dialog.</p>
        
        {/* The new Social Media action center blocks out the top area before rendering the PDF previews */}
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
           <SocialMediaHub tournament={tourney} />
        </div>

        <PrintButton />
      </div>

      <div className="print-container" style={{ padding: '2rem', background: '#f4f3ef' }}>
        
        {/* --- NEW: SPONSORSHIP PROMOTIONAL FLYER --- */}
        <div className="sheet page-break" style={{ padding: 0, border: '1px solid #ccc' }}>
           <div style={{ minHeight: '30vh', background: 'linear-gradient(to bottom, var(--forest), #112211)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
              <div style={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>Charity Golf Tournament</div>
              <h1 style={{ fontSize: '3.5rem', fontFamily: "'Playfair Display', serif", margin: '0.5rem 0', lineHeight: 1.1 }}>{tourney.name}</h1>
              <div style={{ fontSize: '1.2rem', opacity: 0.9, marginTop: '1rem' }}>Benefiting local charities. Hosted at {tourney.courseName}.</div>
           </div>

           <div style={{ padding: '3rem' }}>
              <h2 style={{ textAlign: 'center', color: 'var(--forest)', fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid var(--gold)', paddingBottom: '1rem', display: 'inline-block', width: '100%' }}>
                 Sponsorship Opportunities
              </h2>
              <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#555', marginBottom: '3rem' }}>
                 Become a sponsor and join us in making an impact in our local community.
              </p>

              {/* Dynamic Tiers based on current standards */}
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                 <div style={{ background: '#faf9f6', borderLeft: '8px solid var(--gold)', padding: '1.5rem 2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--forest)', margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                       <span>Hole Sponsor</span>
                       <span style={{ color: '#000', fontWeight: 800 }}>$150</span>
                    </h3>
                    <ul style={{ margin: '1rem 0 0 0', paddingLeft: '1.5rem', color: '#444' }}>
                       <li>Yard Sign at Specific Hole</li>
                       <li>Online Recognition on GPS Dashboard</li>
                    </ul>
                 </div>

                 <div style={{ background: '#faf9f6', borderLeft: '8px solid var(--gold)', padding: '1.5rem 2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--forest)', margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                       <span>Silver Sponsor</span>
                       <span style={{ color: '#000', fontWeight: 800 }}>$750</span>
                    </h3>
                    <ul style={{ margin: '1rem 0 0 0', paddingLeft: '1.5rem', color: '#444' }}>
                       <li>Complimentary Foursome Entry</li>
                       <li>Big Screen Recognition</li>
                       <li>Yard Sign at Specific Hole</li>
                    </ul>
                 </div>

                 <div style={{ background: '#faf9f6', borderLeft: '8px solid var(--forest)', padding: '1.5rem 2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--forest)', margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                       <span>Title Executive Sponsor</span>
                       <span style={{ color: '#000', fontWeight: 800 }}>$2,500</span>
                    </h3>
                    <ul style={{ margin: '1rem 0 0 0', paddingLeft: '1.5rem', color: '#444' }}>
                       <li>Premium Large Banner Placement at Check-In</li>
                       <li>Complimentary Two Foursome Entries</li>
                       <li>Digital App Takeover Logo</li>
                       <li>Exclusive Dinner Recognition</li>
                    </ul>
                 </div>
              </div>

              <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '4rem' }}>
                 <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>Register securely online at:</div>
                 <div style={{ color: 'var(--forest)', fontSize: '1.5rem', marginTop: '0.5rem' }}>tourneylinks.com/t/{tourney.id}</div>
              </div>
           </div>
        </div>

        {/* --- NEW: REGISTRANT WALK-UP LEDGER --- */}
        <div className="sheet page-break" style={{ padding: '0.5in', border: '1px solid #ccc' }}>
           <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'var(--forest)' }}>Registrant Walk-Up Ledger</h1>
           <p style={{ color: '#666', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '2rem' }}>
             {tourney.name} • {players.length} Total Registrants
           </p>

           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#eee' }}>
                   <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Player Name</th>
                   <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Flight / Team</th>
                   <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>HDCP</th>
                   <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Add-Ons Purchased</th>
                   <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                     <td style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: 600 }}>{p.name}</td>
                     <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{p.assignedTeam ? `Team ${p.assignedTeam}` : 'Unassigned'}</td>
                     <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{p.handicap || 'N/A'}</td>
                     <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                        {/* Mocking Add-On purchases which would normally be parsed from db JSON */}
                        {i % 4 === 0 ? '2x Mulligans' : i % 7 === 0 ? 'Mulligans, Raffle Box' : 'None'}
                     </td>
                     <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                        {/* Status Checkbox System for Door operators */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <div style={{ width: '16px', height: '16px', border: '1px solid #000', background: i % 5 !== 0 ? '#4ec9a0' : 'transparent' }} />
                           {i % 5 !== 0 ? 'Paid Online' : <span style={{ color: 'red', fontWeight: 600 }}>Owes $150 Cash</span>}
                        </div>
                     </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
        
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
