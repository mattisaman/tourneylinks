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

  // --- MOCK DATA ENGINE ---
  const isDemoEnv = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_IS_DEMO === 'true';
  const effectivePlayers = (players.length === 0 && isDemoEnv) ? [
    { id: 901, name: "Tiger Woods", handicap: 0, assignedTeam: 1, email: 'tiger@demo.com' },
    { id: 902, name: "Charlie Woods", handicap: 2, assignedTeam: 1, email: 'charlie@demo.com' },
    { id: 903, name: "Rory McIlroy", handicap: -1, assignedTeam: 1, email: 'rory@demo.com' },
    { id: 904, name: "Scottie Scheffler", handicap: -2, assignedTeam: 1, email: 'scottie@demo.com' },
    { id: 905, name: "Rickie Fowler", handicap: 1, assignedTeam: 2, email: 'rickie@demo.com' },
    { id: 906, name: "Justin Thomas", handicap: 0, assignedTeam: 2, email: 'jt@demo.com' },
    { id: 907, name: "Jordan Spieth", handicap: 1, assignedTeam: 2, email: 'jordan@demo.com' },
    { id: 908, name: "Max Homa", handicap: 2, assignedTeam: 2, email: 'max@demo.com' }
  ] : players;

  const effectiveTeamKeys = (teamKeys.length === 0 && isDemoEnv) ? [1, 2] : teamKeys;
  const effectiveTeamsMap = (Object.keys(teamsMap).length === 0 && isDemoEnv) ? {
    1: effectivePlayers.slice(0, 4),
    2: effectivePlayers.slice(4, 8)
  } : teamsMap;

  // Sorting Ledger Data
  let displayPlayers = [...effectivePlayers];
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
            <div className="sheet page-break flyer-container" style={{ padding: 0, border: '1px solid #ccc', background: '#fff', position: 'relative' }}>
               <style dangerouslySetInnerHTML={{__html: `
                  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Pinyon+Script&display=swap');
               `}} />
               
               {/* Hero Background */}
               <div style={{ position: 'relative', height: '4in', backgroundImage: 'url("/flyer_bg.png")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '1in' }}>
                  <div style={{ fontFamily: '"Pinyon Script", cursive', fontSize: '100px', color: '#164E2A', textShadow: '2px 2px 4px rgba(255,255,255,0.7)', zIndex: 10, lineHeight: '0.6', transform: 'rotate(-4deg)' }}>
                    {flyerSubtitle.split(' ')[0] || 'Charity'}
                  </div>
                  <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '65px', color: '#C06616', textShadow: '2px 2px 4px rgba(255,255,255,0.8)', zIndex: 10, lineHeight: 1, textTransform: 'uppercase', marginTop: '0px' }}>
                    {flyerSubtitle.substring(flyerSubtitle.indexOf(' ') + 1) || 'Golf Tournament'}
                  </div>
               </div>

               {/* Orange Ribbon */}
               <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-30px', zIndex: 20, position: 'relative' }}>
                 <div style={{ borderTop: '25px solid transparent', borderBottom: '25px solid transparent', borderRight: '25px solid #D95C14' }} />
                 <div style={{ background: '#D95C14', color: '#fff', padding: '0 2rem', display: 'flex', alignItems: 'center', fontSize: '1.4rem', letterSpacing: '0.15em', textTransform: 'uppercase', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                    Benefitting {tourney.charityName || 'A Local Family in Need'}
                 </div>
                 <div style={{ borderTop: '25px solid transparent', borderBottom: '25px solid transparent', borderLeft: '25px solid #D95C14' }} />
               </div>

               {/* Body Content */}
               <div style={{ padding: '0.5in 1in' }}>
                   <div style={{ textAlign: 'center', fontSize: '1.4rem', fontFamily: 'serif', color: '#333', marginBottom: '1.5rem' }}>
                       Join us for a day of golf to support an amazing local family facing a challenging time.
                   </div>

                   <hr style={{ border: 'none', borderTop: '2px solid #ddd', margin: '0 40px 10px 40px' }} />

                   <div style={{ textAlign: 'center' }}>
                       <div style={{ fontSize: '2.5rem', color: '#164E2A', fontWeight: 800, fontFamily: 'serif' }}>{tourney.courseName || 'Eagle Vale'}</div>
                       <div style={{ fontSize: '1.6rem', color: '#B24D0A', fontFamily: 'serif', fontWeight: 700, margin: '10px 0' }}>
                           {tourney.dateStart || 'June 19th'} • {tourney.format || 'Shotgun Start'} at 9AM
                       </div>
                   </div>

                   <hr style={{ border: 'none', borderTop: '2px solid #ddd', margin: '10px 40px' }} />

                   <div style={{ textAlign: 'center', margin: '20px 0', color: '#B24D0A', fontSize: '1.4rem', fontWeight: 700 }}>
                       {tourney.entryFee ? `$${Math.round(tourney.entryFee/100)}` : '$175'} per Golfer • {tourney.entryFee ? `$${Math.round(tourney.entryFee/100) * 4}` : '$700'} per Foursome
                   </div>
                   
                   <div style={{ textAlign: 'center', color: '#333', fontSize: '1.1rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                       {tourney.courseAddress || '4344 Fairport Nine Mile Point Rd, Fairport, NY 14450'}
                   </div>

                   {/* We are seeking */}
                   <div style={{ margin: '30px 40px' }}>
                       <div style={{ textAlign: 'center', color: '#B24D0A', fontSize: '1.8rem', fontStyle: 'italic', fontFamily: 'serif', marginBottom: '10px' }}>— We are seeking: —</div>
                       <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '1.3rem', gap: '5px', color: '#333', fontWeight: 600 }}>
                          <li><span style={{color: '#B24D0A'}}>•</span> Golfers & Foursomes</li>
                          <li><span style={{color: '#B24D0A'}}>•</span> Event Sponsors</li>
                          <li><span style={{color: '#B24D0A'}}>•</span> Raffle Basket Donors</li>
                          <li><span style={{color: '#B24D0A'}}>•</span> Beer, Wine & Liquor Donors</li>
                       </ul>
                   </div>

                   <div style={{ background: '#EAE1B8', padding: '10px', textAlign: 'center', fontWeight: 'bold', margin: '30px 40px', fontSize: '1.4rem', color: '#333', border: '1px solid #d4c9a3' }}>
                       Lunch & Dinner Provided
                   </div>
               </div>

               {/* Footer Banner */}
               <div style={{ background: '#D95C14', color: '#fff', padding: '20px 0', textAlign: 'center', fontSize: '1.3rem', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                   {tourney.courseAddress || '4344 Fairport Nine Mile Point Rd, Fairport, NY 14450'}
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
                       <th style={{ padding: '0.75rem', border: '1px solid #ddd', width: '60px', textAlign: 'center' }}>Here</th>
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
                         <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>
                            <div style={{ width: '20px', height: '20px', border: '2px solid #ccc', borderRadius: '4px', margin: '0 auto' }}></div>
                         </td>
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

         {activeDoc === 'cart' && effectiveTeamKeys.reduce((result: number[][], item, index) => {
            if (index % 2 === 0) result.push(effectiveTeamKeys.slice(index, index + 2));
            return result;
          }, []).map((teamPair, pageIndex) => (
            <div key={`cart-page-${pageIndex}`} className="sheet page-break" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
              {teamPair.map((teamId, i) => {
                const teamPlayers = effectiveTeamsMap[teamId];
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

         {activeDoc === 'scorecard' && effectiveTeamKeys.map((teamId) => {
            const teamPlayers = effectiveTeamsMap[teamId];
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

         {activeDoc !== 'flyer' && activeDoc !== 'ledger' && effectiveTeamKeys.length === 0 && (
            <div className="sheet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', background: '#fff' }}>
              <h1>No teams have been flighted yet. Assign teams first!</h1>
            </div>
         )}
      </div>
    </div>
  );
}
