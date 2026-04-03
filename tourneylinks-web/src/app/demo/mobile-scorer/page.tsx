'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MobileScorerDemo() {
  const [score1, setScore1] = useState(4);
  const [score2, setScore2] = useState(4);
  const [score3, setScore3] = useState(4);
  const [score4, setScore4] = useState(4);
  const [submitted, setSubmitted] = useState(false);

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
        <div style={{ background: 'linear-gradient(135deg, #f4f6f5, #eef1f0)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--mist)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>Hole Sponsored By</div>
          <div style={{ fontWeight: 900, color: '#0056b3', fontSize: '1.2rem', fontFamily: 'serif' }}>CHASE <span style={{ color: '#aaa'}}>&bull;</span> PLATINUM</div>
        </div>

        {/* Scorecard Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', paddingBottom: '6rem' }}>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                 <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--forest)', lineHeight: 1 }}>14</div>
                 <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--mist)' }}>421 yds</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '0.85rem', color: 'var(--mist)', textTransform: 'uppercase', fontWeight: 800 }}>Par</div>
                 <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)' }}>4</div>
              </div>
           </div>

           {/* Player Inputs */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                 { name: 'Michael Jordan', val: score1, set: setScore1, hcp: 2.1 },
                 { name: 'Tiger Woods', val: score2, set: setScore2, hcp: 0.0 },
                 { name: 'Stephen Curry', val: score3, set: setScore3, hcp: 1.1 },
                 { name: 'Tony Romo', val: score4, set: setScore4, hcp: 0.5 }
              ].map((p, i) => (
                 <div key={i} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div>
                       <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>{p.name}</div>
                       <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>HCP: {p.hcp}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                       <button 
                          onClick={() => p.set(Math.max(1, p.val - 1))}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', background: '#f8faf9', color: 'var(--forest)', fontSize: '1.2rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                       >-</button>
                       <div style={{ fontSize: '1.4rem', fontWeight: 800, width: '30px', textAlign: 'center', color: p.val < 4 ? 'var(--gold)' : (p.val > 4 ? '#ff4d4f' : 'var(--ink)') }}>
                          {p.val}
                       </div>
                       <button 
                          onClick={() => p.set(Math.min(15, p.val + 1))}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'var(--forest)', color: '#fff', fontSize: '1.2rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(26,46,26,0.2)' }}
                       >+</button>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', padding: '1rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 -10px 20px rgba(0,0,0,0.05)', zIndex: 10 }}>
           <button 
              className={`btn-primary ${submitted ? 'success' : ''}`}
              onClick={() => {
                 setSubmitted(true);
                 setTimeout(() => setSubmitted(false), 2000);
              }}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(26,46,26,0.2)', transition: '0.3s', background: submitted ? '#10b981' : 'var(--forest)' }}>
              {submitted ? '✓ Scores Recorded' : 'Submit Hole 14'}
           </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        body { margin: 0; background: #e0e5e2; }
      `}}/>
    </div>
  );
}
