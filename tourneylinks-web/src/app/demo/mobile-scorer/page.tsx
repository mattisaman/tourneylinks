'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MobileScorerDemo() {
  const [teamScores, setTeamScores] = useState<number[]>([3,3,4,4,3,3,4,3,4, 4,4,3,5,4,0,0,0,0]);
  const [submitted, setSubmitted] = useState(false);
  const [viewScorecard, setViewScorecard] = useState(false);
  const [viewGps, setViewGps] = useState(false);
  const [viewLeaderboard, setViewLeaderboard] = useState(false);
  const [currentHole, setCurrentHole] = useState(14);

  const courseData = [
    { p: 4, y: 390 }, { p: 4, y: 410 }, { p: 3, y: 165 }, { p: 5, y: 520 }, 
    { p: 4, y: 400 }, { p: 3, y: 180 }, { p: 4, y: 420 }, { p: 4, y: 380 }, { p: 5, y: 540 },
    { p: 4, y: 415 }, { p: 4, y: 395 }, { p: 3, y: 210 }, { p: 5, y: 560 }, 
    { p: 4, y: 421 }, { p: 4, y: 385 }, { p: 3, y: 155 }, { p: 4, y: 440 }, { p: 5, y: 530 }
  ];
  const holeConfig = courseData[currentHole - 1];
  const tempScore = teamScores[currentHole - 1] === 0 ? holeConfig.p : teamScores[currentHole - 1];

  return (
    <div style={{ background: '#e0e5e2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem' }}>
      {/* Mobile Phone Constraint Wrapper */}
      <div style={{ background: '#fff', width: '100%', maxWidth: '400px', height: '800px', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', border: '8px solid #000' }}>
        
        {/* Dynamic Island fake gap */}
        <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '30px', background: '#000', borderRadius: '15px', zIndex: 100 }}></div>

        {/* Top App Bar */}
        <div style={{ background: '#05120c', color: '#fff', paddingTop: '3.5rem', paddingBottom: '1rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--gold)', fontWeight: 800 }}>Team 14 • Foursome</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>Lakewood Classic</div>
        </div>

        {/* Sponsor Banner (Rotating Top) */}
        <div style={{ background: 'linear-gradient(135deg, #f4f6f5, #eef1f0)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.25rem', textAlign: 'center', boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--mist)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '1px' }}>Hole {currentHole} Sponsored By</div>
          <div style={{ fontWeight: 900, color: '#0056b3', fontSize: '2rem', fontFamily: 'serif', lineHeight: 1 }}>CHASE <span style={{ color: '#aaa'}}>&bull;</span> PLATINUM</div>
        </div>

        {/* Scorecard Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', paddingBottom: '6rem' }}>
           
           {/* Hole Navigation & Header */}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <button 
                 onClick={() => { if(currentHole > 1) setCurrentHole(currentHole - 1); }}
                 style={{ background: '#f8faf9', border: '1px solid rgba(0,0,0,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 900, cursor: 'pointer', color: 'var(--forest)' }}>←</button>
              
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--forest)', lineHeight: 1 }}>Hole {currentHole}</div>
                 <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--mist)', marginTop: '0.2rem' }}>Par {holeConfig.p} • {holeConfig.y} yds</div>
              </div>

              <button 
                 onClick={() => { if(currentHole < 18) setCurrentHole(currentHole + 1); }}
                 style={{ background: '#f8faf9', border: '1px solid rgba(0,0,0,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 900, cursor: 'pointer', color: 'var(--forest)' }}>→</button>
           </div>

           {/* Live Leaderboard / GPS Action Row */}
           <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem' }}>
               <div onClick={() => { setViewLeaderboard(!viewLeaderboard); setViewGps(false); setViewScorecard(false); }} style={{ flex: 1, background: viewLeaderboard ? 'var(--forest)' : 'rgba(212,175,55,0.1)', color: viewLeaderboard ? '#fff' : 'inherit', border: '1px solid rgba(212,175,55,0.2)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}>
                   <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: viewLeaderboard ? 'rgba(255,255,255,0.7)' : 'var(--mist)', fontWeight: 700 }}>Rank</div>
                   <div style={{ fontSize: '0.85rem', fontWeight: 800, color: viewLeaderboard ? '#fff' : 'var(--gold)' }}>T-1st (-14)</div>
               </div>
               <div onClick={() => { setViewGps(!viewGps); setViewScorecard(false); setViewLeaderboard(false); }} style={{ flex: 1, background: viewGps ? 'var(--forest)' : '#f8faf9', color: viewGps ? '#fff' : 'var(--forest)', border: '1px solid rgba(0,0,0,0.1)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: '0.2s' }}>
                   <div style={{ fontSize: '1rem' }}>📍</div>
                   <div style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '0.1rem' }}>GPS</div>
               </div>
               <div onClick={() => { setViewScorecard(!viewScorecard); setViewGps(false); setViewLeaderboard(false); }} style={{ flex: 1, background: viewScorecard ? 'var(--forest)' : '#f8faf9', color: viewScorecard ? '#fff' : 'var(--forest)', border: '1px solid rgba(0,0,0,0.1)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: '0.2s' }}>
                   <div style={{ fontSize: '1rem' }}>📋</div>
                   <div style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '0.1rem' }}>Card</div>
               </div>
           </div>

           {/* Content Swap */}
           {viewLeaderboard ? (
               <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', height: '350px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
                  <div style={{ background: 'var(--forest)', color: '#fff', padding: '0.75rem', fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>Live Tourney Leaderboard</div>
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                      {[
                        { pos: '1', name: 'Woods / Jordan', score: -14, thru: 'F', self: true },
                        { pos: '2', name: 'Mickelson / McIlroy', score: -12, thru: '17' },
                        { pos: '3', name: 'Spieth / Fowler', score: -11, thru: '16' },
                        { pos: 'T4', name: 'Curry / Thompson', score: -10, thru: 'F' },
                        { pos: 'T4', name: 'Romo / Allen', score: -10, thru: '15' },
                        { pos: '6', name: 'Scheffler / Burns', score: -9, thru: '14' },
                        { pos: 'T7', name: 'Rahm / Garcia', score: -8, thru: '17' },
                        { pos: 'T7', name: 'Thomas / Cantlay', score: -8, thru: '16' },
                        ...Array.from({ length: 22 }, (_, i) => ({
                           pos: `T${9 + Math.floor(i/3)}`,
                           name: `Corporate Team ${i+1}`,
                           score: -7 + Math.floor(i/4),
                           thru: ['12', '13', '14', '15', 'F'][Math.floor(Math.random() * 5)]
                        }))
                      ].map((t, i) => (
                         <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', background: (t as any).self ? 'rgba(212,175,55,0.1)' : 'transparent', fontWeight: (t as any).self ? 800 : 600 }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ color: (t as any).self ? 'var(--gold)' : 'var(--mist)', width: '25px', fontSize: '0.75rem' }}>{t.pos}</div>
                                <div style={{ color: 'var(--ink)', fontSize: '0.85rem' }}>{t.name}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', textAlign: 'right', alignItems: 'center' }}>
                                <div style={{ width: '25px', color: (t as any).self ? 'var(--forest)' : (t.score < 0 ? '#ff4d4f' : 'inherit'), fontSize: '0.9rem', fontWeight: 800 }}>{t.score > 0 ? `+${t.score}` : t.score}</div>
                                <div style={{ width: '25px', color: 'var(--mist)', fontSize: '0.75rem' }}>{t.thru}</div>
                            </div>
                         </div>
                      ))}
                  </div>
               </div>
           ) : viewGps ? (
               <div style={{ background: '#e0ece0', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', height: '350px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1587174486073-ae5e1c4391a1?fm=jpg&w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
                  <div style={{ position: 'relative', zIndex: 10, padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ background: '#fff', color: 'var(--ink)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>🎯 Pin: Center</div>
                      <div style={{ background: 'var(--forest)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 900, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>{Math.max(50, holeConfig.y - 250)} Yds</div>
                  </div>
                  {/* Fake Crosshair / Lines */}
                  <div style={{ flex: 1, position: 'relative', zIndex: 10 }}>
                      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                         <line x1="50%" y1="90%" x2="50%" y2="40%" stroke="var(--gold)" strokeWidth="3" strokeDasharray="6 6" />
                         <circle cx="50%" cy="40%" r="6" fill="#ff4d4f" stroke="#fff" strokeWidth="2" />
                         <circle cx="50%" cy="90%" r="8" fill="#3399ff" stroke="#fff" strokeWidth="2" />
                      </svg>
                  </div>
               </div>
           ) : viewScorecard ? (
               <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
                  <div style={{ background: 'var(--forest)', color: '#fff', padding: '0.75rem', fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>Front 9 (-7)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', textAlign: 'center', fontSize: '0.7rem' }}>
                      {[1,2,3,4,5,6,7,8,9].map(h => <div key={h} style={{ borderBottom: '1px solid #eee', borderRight: h===9?'none':'1px solid #eee', padding: '0.5rem 0', fontWeight: 700, background: '#f8faf9' }}>{h}</div>)}
                      {[4,3,4,5,4,3,4,4,5].map((p,i) => <div key={i} style={{ borderBottom: '1px solid #eee', borderRight: i===8?'none':'1px solid #eee', padding: '0.5rem 0', color: 'var(--mist)' }}>{p}</div>)}
                      {teamScores.slice(0, 9).map((s,i) => <div key={i} style={{ borderBottom: '1px solid #eee', borderRight: i===8?'none':'1px solid #eee', padding: '0.5rem 0', fontWeight: 800, color: s===0 ? 'transparent' : (s < [4,3,4,5,4,3,4,4,5][i] ? 'var(--gold)' : (s > [4,3,4,5,4,3,4,4,5][i] ? '#ff4d4f' : 'var(--ink)')) }}>{s===0 ? '-' : s}</div>)}
                  </div>
                  <div style={{ background: 'var(--forest)', color: '#fff', padding: '0.75rem', fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>Back 9 (-7)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', textAlign: 'center', fontSize: '0.7rem' }}>
                      {[10,11,12,13,14,15,16,17,18].map((h,i) => <div key={h} style={{ borderBottom: '1px solid #eee', borderRight: i===8?'none':'1px solid #eee', padding: '0.5rem 0', fontWeight: h===currentHole?900:700, background: h===currentHole?'rgba(212,175,55,0.2)':'#f8faf9', color: h===currentHole ? 'var(--forest)' : 'inherit' }}>{h}</div>)}
                      {[4,4,3,5,4,4,3,4,5].map((p,i) => <div key={i} style={{ borderBottom: '1px solid #eee', borderRight: i===8?'none':'1px solid #eee', padding: '0.5rem 0', color: 'var(--mist)' }}>{p}</div>)}
                      {teamScores.slice(9, 18).map((s,i) => <div key={i} style={{ borderBottom: '1px solid #eee', borderRight: i===8?'none':'1px solid #eee', padding: '0.5rem 0', fontWeight: 800, color: s===0 ? 'transparent' : (s < [4,4,3,5,4,4,3,4,5][i] ? 'var(--gold)' : (s > [4,4,3,5,4,4,3,4,5][i] ? '#ff4d4f' : 'var(--ink)')) }}>{s===0 ? '-' : s}</div>)}
                  </div>
               </div>
           ) : (
               <div style={{ background: '#fff', border: '2px solid var(--forest)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 8px 20px rgba(26,46,26,0.08)' }}>
                   <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: 'var(--mist)', marginBottom: '1rem' }}>Team Score</div>
                   
                   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
                       <button 
                          onClick={() => {
                              const newScores = [...teamScores];
                              newScores[currentHole - 1] = Math.max(1, tempScore - 1);
                              setTeamScores(newScores);
                          }}
                          style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', background: '#f8faf9', color: 'var(--forest)', fontSize: '1.5rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                       >-</button>

                       <div style={{ fontSize: '3.5rem', fontWeight: 900, width: '60px', textAlign: 'center', color: tempScore < holeConfig.p ? 'var(--gold)' : (tempScore > holeConfig.p ? '#ff4d4f' : 'var(--ink)'), lineHeight: 1 }}>
                          {tempScore}
                       </div>

                       <button 
                          onClick={() => {
                              const newScores = [...teamScores];
                              newScores[currentHole - 1] = Math.min(15, tempScore + 1);
                              setTeamScores(newScores);
                          }}
                          style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'var(--forest)', color: '#fff', fontSize: '1.5rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 8px rgba(26,46,26,0.2)' }}
                       >+</button>
                   </div>
                   
                   {/* Team Roster Reference */}
                   <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 600 }}>
                       M. Jordan • T. Woods • S. Curry • T. Romo
                   </div>
               </div>
           )}
        </div>

        {/* Bottom CTA */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', padding: '1rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 -10px 20px rgba(0,0,0,0.05)', zIndex: 10 }}>
           <button 
              className={`btn-primary ${submitted ? 'success' : ''}`}
              onClick={() => {
                 if (viewGps || viewScorecard || viewLeaderboard) {
                     setViewGps(false);
                     setViewScorecard(false);
                     setViewLeaderboard(false);
                 } else {
                     setSubmitted(true);
                     setTimeout(() => setSubmitted(false), 2000);
                 }
              }}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', boxShadow: '0 4px 15px rgba(26,46,26,0.2)', transition: '0.3s', background: submitted ? '#10b981' : ((viewGps || viewScorecard || viewLeaderboard) ? '#333' : 'var(--forest)'), border: 'none' }}>
              {submitted ? '✓ Scores Recorded' : ((viewGps || viewScorecard || viewLeaderboard) ? '← Back to Score Input' : `Save Hole ${currentHole}`)}
           </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        body { margin: 0; background: #e0e5e2; }
      `}}/>
    </div>
  );
}
