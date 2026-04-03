'use client';

import React, { useState } from 'react';

type DocumentType = 'flyer' | 'ledger' | 'cart' | 'scorecard';

export default function DocumentHub({ 
  tourney, 
  players, 
  teamsMap, 
  teamKeys 
}: { 
  tourney: any, 
  players: any[], 
  teamsMap: Record<number, any[]>, 
  teamKeys: number[] 
}) {
  const [activeDoc, setActiveDoc] = useState<DocumentType>('flyer');
  
  // Editor State
  const [flyerSubtitle, setFlyerSubtitle] = useState('Charity Golf Tournament');
  const [ledgerSort, setLedgerSort] = useState<'name' | 'team' | 'payment'>('name');
  const [ledgerUnpaidOnly, setLedgerUnpaidOnly] = useState(false);
  const [cartShowQR, setCartShowQR] = useState(true);
  const [cartShowSponsor, setCartShowSponsor] = useState(false);
  const [scorecardSize, setScorecardSize] = useState<18 | 9>(18);

  // Sorting Ledger Data
  let displayPlayers = [...players];
  if (ledgerUnpaidOnly) {
     displayPlayers = displayPlayers.filter((p, index) => index % 5 === 0);
  }
  
  if (ledgerSort === 'name') {
    displayPlayers.sort((a, b) => a.name.localeCompare(b.name));
  } else if (ledgerSort === 'team') {
    displayPlayers.sort((a, b) => (a.assignedTeam || 999) - (b.assignedTeam || 999));
  } else if (ledgerSort === 'payment') {
    displayPlayers.sort((a, b) => {
       const aOwes = displayPlayers.indexOf(a) % 5 === 0 ? 1 : 0;
       const bOwes = displayPlayers.indexOf(b) % 5 === 0 ? 1 : 0;
       return bOwes - aOwes;
    });
  }

  return (
    <div className="document-hub-wrapper" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '2rem', alignItems: 'start', maxWidth: '1400px', margin: '0 auto', textAlign: 'left' }}>
      
      {/* LEFT PANE: NAVIGATION & CONTROLS */}
      <div className="no-print" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', position: 'sticky', top: '2rem' }}>
         <div style={{ padding: '1.5rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Document Hub</h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#666' }}>Select a collateral type to generate and configure.</p>
         </div>

         {/* Document Selector Navigation */}
         <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { id: 'flyer', icon: '📢', label: 'Promo Flyer' },
              { id: 'ledger', icon: '📋', label: 'Walk-Up Ledger' },
              { id: 'cart', icon: '⛳', label: 'Cart Signs' },
              { id: 'scorecard', icon: '📝', label: 'Blank Scorecards' }
            ].map(doc => (
              <button
                 key={doc.id}
                 onClick={() => setActiveDoc(doc.id as DocumentType)}
                 style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem',
                    background: activeDoc === doc.id ? '#ecfdf5' : 'transparent',
                    border: 'none', borderBottom: '1px solid #e5e7eb',
                    color: activeDoc === doc.id ? '#059669' : '#333',
                    fontWeight: activeDoc === doc.id ? 700 : 500,
                    cursor: 'pointer', textAlign: 'left', transition: '0.1s'
                 }}
              >
                 <span style={{ fontSize: '1.2rem' }}>{doc.icon}</span>
                 {doc.label}
              </button>
            ))}
         </div>

         {/* Contextual Editor Controls */}
         <div style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', marginBottom: '1rem', fontWeight: 800 }}>Configuration Rules</h4>

            {activeDoc === 'flyer' && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                     Flyer Sub-title
                     <input type="text" value={flyerSubtitle} onChange={e => setFlyerSubtitle(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '6px' }} />
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#666' }}>Flyers automatically pull standard Sponsorship Pricing logic currently set in your campaign builder.</p>
               </div>
            )}

            {activeDoc === 'ledger' && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                     Sort Ledger By
                     <select value={ledgerSort} onChange={e => setLedgerSort(e.target.value as any)} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '6px' }}>
                        <option value="name">Alphabetical (Last Name)</option>
                        <option value="team">Assigned Team / Flight</option>
                        <option value="payment">Payment Status (Owes Cash)</option>
                     </select>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                     <input type="checkbox" checked={ledgerUnpaidOnly} onChange={e => setLedgerUnpaidOnly(e.target.checked)} />
                     Hide Paid Players (Unpaid Only)
                  </label>
               </div>
            )}

            {activeDoc === 'cart' && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                     <input type="checkbox" checked={cartShowQR} onChange={e => setCartShowQR(e.target.checked)} />
                     Inject Live Scoring QR Codes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                     <input type="checkbox" checked={cartShowSponsor} onChange={e => setCartShowSponsor(e.target.checked)} />
                     Allow Sponsor Logo Takeover
                  </label>
               </div>
            )}

            {activeDoc === 'scorecard' && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                     Grid Layout Format
                     <select value={scorecardSize} onChange={e => setScorecardSize(parseInt(e.target.value) as any)} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '6px' }}>
                        <option value={18}>18-Holes (Continuous)</option>
                        <option value={9}>9-Holes (Front/Back)</option>
                     </select>
                  </label>
               </div>
            )}
            
            <button 
               onClick={() => window.print()}
               style={{ width: '100%', marginTop: '2rem', background: '#05120c', color: '#fff', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
            >
               Print {activeDoc.charAt(0).toUpperCase() + activeDoc.slice(1)}
            </button>
         </div>
      </div>

      {/* RIGHT PANE: LIVE PREVIEW CONTAINER */}
      <div className="document-preview-pane" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
         <style dangerouslySetInnerHTML={{__html: `
            @media screen {
               .document-preview-pane > .sheet {
                  transform: scale(0.85);
                  transform-origin: top center;
                  box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
                  border: none !important;
                  margin-bottom: -150px;
               }
               @media (max-width: 1400px) {
                  .document-preview-pane > .sheet { transform: scale(0.7); margin-bottom: -300px; }
               }
            }
         `}} />

         {/* --- CONDITIONAL RENDERS FOR DOCUMENTS --- */}

         {activeDoc === 'flyer' && (
            <div className="sheet page-break" style={{ padding: 0, border: '1px solid #ccc', background: '#fff' }}>
               <div style={{ minHeight: '30vh', background: 'linear-gradient(to bottom, var(--forest), #112211)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                  <div style={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>{flyerSubtitle}</div>
                  <h1 style={{ fontSize: '3.5rem', fontFamily: "'Playfair Display', serif", margin: '0.5rem 0', lineHeight: 1.1 }}>{tourney.name}</h1>
                  <div style={{ fontSize: '1.2rem', opacity: 0.9, marginTop: '1rem' }}>Hosted at {tourney.courseName}.</div>
               </div>

               <div style={{ padding: '3rem' }}>
                  <h2 style={{ textAlign: 'center', color: 'var(--forest)', fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid var(--gold)', paddingBottom: '1rem', display: 'inline-block', width: '100%' }}>
                     Sponsorship Opportunities
                  </h2>
                  <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#555', marginBottom: '3rem' }}>
                     Become a sponsor and join us in making an impact in our local community.
                  </p>

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
                        </ul>
                     </div>
                  </div>

                  <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '4rem' }}>
                     <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>Register securely online at:</div>
                     <div style={{ color: 'var(--forest)', fontSize: '1.5rem', marginTop: '0.5rem' }}>tourneylinks.com/t/{tourney.id}</div>
                  </div>
               </div>
            </div>
         )}

         {activeDoc === 'ledger' && (
            <div className="sheet page-break" style={{ padding: '0.5in', border: '1px solid #ccc', background: '#fff' }}>
               <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'var(--forest)' }}>Registrant Walk-Up Ledger</h1>
               <p style={{ color: '#666', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '2rem' }}>
                 {tourney.name} • {displayPlayers.length} Registrants Listed
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
                    {displayPlayers.map((p, i) => (
                      <tr key={p.id || i} style={{ borderBottom: '1px solid #ddd' }}>
                         <td style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: 600 }}>{p.name}</td>
                         <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{p.assignedTeam ? `Team ${p.assignedTeam}` : 'Unassigned'}</td>
                         <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{p.handicap || 'N/A'}</td>
                         <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                            {i % 4 === 0 ? '2x Mulligans' : i % 7 === 0 ? 'Mulligans, Raffle Box' : 'None'}
                         </td>
                         <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
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
         )}

         {activeDoc === 'cart' && teamKeys.reduce((result: number[][], item, index) => {
            if (index % 2 === 0) result.push(teamKeys.slice(index, index + 2));
            return result;
          }, []).map((teamPair, pageIndex) => (
            <div key={`cart-page-${pageIndex}`} className="sheet page-break" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
              {teamPair.map((teamId, i) => {
                const teamPlayers = teamsMap[teamId];
                return (
                  <div key={`cart-${teamId}`} style={{ 
                    flex: 1, border: '4px solid #05120c', borderRadius: '12px', 
                    margin: i === 0 ? '0 0 0.5in 0' : '0', 
                    padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    position: 'relative', overflow: 'hidden'
                  }}>
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
                      {cartShowSponsor && (
                         <div style={{ color: 'var(--forest)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Sponsored by Default Sponsor</div>
                      )}
                      <div style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888', marginBottom: '1rem' }}>Team {teamId}</div>
                      {teamPlayers.map(p => (
                        <div key={p.id} style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.5rem 0', color: '#000' }}>
                          {p.name}
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                       <div style={{ fontWeight: 600, fontSize: '1.2rem' }}>Tee Time: <span style={{ fontWeight: 400 }}>{tourney.format || 'Standard'}</span></div>
                       {cartShowQR && (
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://tourneylinks.com/tournaments/${tourney.id}`} alt="Live Scoring QR" style={{ width: 80, height: 80 }} />
                       )}
                    </div>
                  </div>
                );
              })}
            </div>
         ))}

         {activeDoc === 'scorecard' && teamKeys.map((teamId) => {
            const teamPlayers = teamsMap[teamId];
            return (
               <div key={`scorecard-${teamId}`} className="sheet page-break" style={{ padding: '0.5in', background: '#fff' }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontFamily: 'serif', fontSize: '2.5rem', marginBottom: '0.5rem' }}>OFFICIAL SCORECARD</h1>
                    <h3 style={{ fontWeight: 500, color: '#444' }}>{tourney.name} • Team {teamId}</h3>
                  </div>
                  
                  {scorecardSize === 18 && (
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
                         <tr>
                           <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', fontWeight: 'bold' }}>Par</td>
                           {[...Array(21)].map((_, i) => <td key={`par-${i}`} style={{ border: '1px solid #000', padding: '0.5rem' }}></td>)}
                         </tr>
                         <tr>
                           <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', fontWeight: 'bold' }}>Handicap</td>
                           {[...Array(21)].map((_, i) => <td key={`hdcp-${i}`} style={{ border: '1px solid #000', padding: '0.5rem' }}></td>)}
                         </tr>
                         {teamPlayers.map(p => (
                           <tr key={`sc-${p.id}`} style={{ height: '2.5rem' }}>
                             <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', fontWeight: 'bold', fontSize: '1.1rem' }}>{p.name}</td>
                             {[...Array(21)].map((_, i) => <td key={`sc-${p.id}-h${i}`} style={{ border: '1px solid #000', padding: '0.5rem' }}></td>)}
                           </tr>
                         ))}
                       </tbody>
                     </table>
                  )}

                  {scorecardSize === 9 && (
                     <>
                     <h4 style={{textAlign: 'left', marginBottom: '0.5rem'}}>FRONT 9</h4>
                     <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000', textAlign: 'center', marginBottom: '2rem' }}>
                       <thead>
                         <tr style={{ background: '#f5f5f5' }}>
                           <th style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', width: '20%' }}>Hole</th>
                           {[1,2,3,4,5,6,7,8,9, 'OUT'].map(h => (
                             <th key={h} style={{ border: '1px solid #000', padding: '0.5rem', fontSize: '0.8rem', width: '8%' }}>{h}</th>
                           ))}
                         </tr>
                       </thead>
                       <tbody>
                           <tr style={{ height: '2.5rem' }}>
                             <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', fontWeight: 'bold', fontSize: '1.1rem' }}>Player</td>
                             {[...Array(10)].map((_, i) => <td key={`f-${i}`} style={{ border: '1px solid #000', padding: '0.5rem' }}></td>)}
                           </tr>
                       </tbody>
                     </table>

                     <h4 style={{textAlign: 'left', marginBottom: '0.5rem'}}>BACK 9</h4>
                     <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000', textAlign: 'center' }}>
                       <thead>
                         <tr style={{ background: '#f5f5f5' }}>
                           <th style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', width: '20%' }}>Hole</th>
                           {[10,11,12,13,14,15,16,17,18, 'IN', 'TOT'].map(h => (
                             <th key={h} style={{ border: '1px solid #000', padding: '0.5rem', fontSize: '0.8rem', width: '7%' }}>{h}</th>
                           ))}
                         </tr>
                       </thead>
                       <tbody>
                           <tr style={{ height: '2.5rem' }}>
                             <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', fontWeight: 'bold', fontSize: '1.1rem' }}>Player</td>
                             {[...Array(11)].map((_, i) => <td key={`b-${i}`} style={{ border: '1px solid #000', padding: '0.5rem' }}></td>)}
                           </tr>
                       </tbody>
                     </table>
                     </>
                  )}
                  
                  <div style={{ marginTop: '1in', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ borderTop: '1px solid #000', width: '40%', paddingTop: '0.5rem', fontWeight: 'bold', textAlign: 'left' }}>Scorer Signature</div>
                    <div style={{ borderTop: '1px solid #000', width: '40%', paddingTop: '0.5rem', fontWeight: 'bold', textAlign: 'left' }}>Attest Signature</div>
                  </div>
               </div>
            );
         })}

         {activeDoc !== 'flyer' && activeDoc !== 'ledger' && teamKeys.length === 0 && (
            <div className="sheet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', background: '#fff' }}>
              <h1>No teams have been flighted yet. Assign teams first!</h1>
            </div>
         )}
      </div>
    </div>
  );
}
