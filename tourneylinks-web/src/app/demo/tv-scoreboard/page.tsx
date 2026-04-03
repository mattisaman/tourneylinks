'use client';

import React, { useEffect, useState } from 'react';

export default function TVScoreboardDemo() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
     setIsMounted(true);
  }, []);

  // Generate 30 fake teams for smooth scrolling
  const teams = [
    { pos: '1', name: 'Woods / Jordan', score: -14, thru: 'F' },
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
  ].sort((a,b) => a.score - b.score);

  if (!isMounted) return <div style={{ background: '#05120c', height: '100vh' }}></div>;

  return (
    <div style={{ background: '#05120c', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid rgba(212,175,55,0.3)', background: 'linear-gradient(180deg, rgba(26,46,26,0.8) 0%, rgba(5,18,12,0) 100%)' }}>
          <div>
              <div style={{ color: 'var(--gold)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Live Coverage</div>
              <div style={{ color: '#fff', fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}>Lakewood Classic</div>
          </div>
          <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem', fontWeight: 600 }}>Pebble Beach Golf Links</div>
              <div style={{ color: 'var(--gold)', fontSize: '1.2rem', fontWeight: 600, marginTop: '0.2rem' }}>Benefitting Good Shire Foundation</div>
          </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* LEADERBOARD SCROLL SECTION */}
          <div style={{ flex: 2, position: 'relative', overflow: 'hidden', padding: '0 4rem' }}>
              
              <div style={{ display: 'flex', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: 700, padding: '2rem 0 1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '100px', textAlign: 'center' }}>Pos</div>
                  <div style={{ flex: 1, paddingLeft: '2rem' }}>Team</div>
                  <div style={{ width: '150px', textAlign: 'center' }}>To Par</div>
                  <div style={{ width: '100px', textAlign: 'right' }}>Thru</div>
              </div>

              {/* The Scrolling Marquee */}
              <div className="tv-scroll-container" style={{ position: 'relative', height: 'calc(100% - 90px)' }}>
                 <div className="tv-scroll-track" style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Render list twice to create infinite loop effect seamlessly. We actually just need a slow scroll. */}
                    {[...teams, ...teams].map((col, idx) => (
                       <div key={idx} style={{ 
                           display: 'flex', 
                           alignItems: 'center',
                           padding: '1.5rem 0', 
                           borderBottom: '1px solid rgba(255,255,255,0.05)',
                           fontSize: '2rem',
                           color: '#fff',
                           fontWeight: 700,
                           background: (idx % teams.length) < 3 ? 'linear-gradient(90deg, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0) 100%)' : 'transparent'
                       }}>
                          <div style={{ width: '100px', textAlign: 'center', color: (idx % teams.length) < 3 ? 'var(--gold)' : 'rgba(255,255,255,0.6)' }}>{col.pos}</div>
                          <div style={{ flex: 1, paddingLeft: '2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.name}</div>
                          <div style={{ width: '150px', textAlign: 'center', color: col.score < 0 ? '#ff5f56' : (col.score > 0 ? '#3399FF' : '#fff'), fontWeight: 900 }}>
                              {col.score === 0 ? 'E' : (col.score > 0 ? `+${col.score}` : col.score)}
                          </div>
                          <div style={{ width: '100px', textAlign: 'right', color: 'rgba(255,255,255,0.8)' }}>{col.thru}</div>
                       </div>
                    ))}
                 </div>
              </div>
          </div>

          {/* JUMBOTRON ADS / SIDEBAR */}
          <div style={{ flex: 1, background: '#020604', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '3rem', position: 'relative' }}>
              
              <div style={{ color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '1rem', fontWeight: 700, textAlign: 'center', marginBottom: '4rem' }}>
                  Tournament Sponsors
              </div>

              {/* The Rotating Sponsor Module */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                 <div className="jumbotron-sponsor" style={{ textAlign: 'center' }}>
                     <div style={{ fontSize: '1.2rem', color: 'var(--mist)', marginBottom: '1rem', fontWeight: 600 }}>Title Sponsor</div>
                     <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--gold)', letterSpacing: '2px', lineHeight: 1.1, fontFamily: 'serif' }}>CHASE</div>
                     <div style={{ fontSize: '1.5rem', color: '#fff', letterSpacing: '8px', marginTop: '0.5rem' }}>WEALTH</div>
                 </div>
              </div>

              <div style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
                 <div style={{ width: '150px', height: '150px', background: '#fff', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px' }}>
                    <div style={{ fontSize: '6rem' }}>📱</div>
                 </div>
                 <div style={{ marginTop: '1.5rem', color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>Scan to view live scores on your phone</div>
              </div>

          </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        body { margin: 0; background: #05120c; }
        .tv-scroll-track {
           animation: tvScroll 60s linear infinite;
        }
        @keyframes tvScroll {
           0% { transform: translateY(0); }
           100% { transform: translateY(-50%); } /* Scrolls exactly one full height of the teams list assuming duplicated list */
        }
      `}}/>
    </div>
  );
}
