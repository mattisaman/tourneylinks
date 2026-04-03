'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MobileScorerDemo() {
  const [score1, setScore1] = useState(4);
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', paddingBottom: '6rem' }}>
           
           {/* Hole Navigation & Header */}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <button style={{ background: '#f8faf9', border: '1px solid rgba(0,0,0,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 900, cursor: 'pointer', color: 'var(--forest)' }}>←</button>
              
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--forest)', lineHeight: 1 }}>Hole 14</div>
                 <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--mist)', marginTop: '0.2rem' }}>Par 4 • 421 yds</div>
              </div>

              <button style={{ background: '#f8faf9', border: '1px solid rgba(0,0,0,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 900, cursor: 'pointer', color: 'var(--forest)' }}>→</button>
           </div>

           {/* Live Leaderboard / GPS Action Row */}
           <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
               <div style={{ flex: 1, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', padding: '0.6rem', borderRadius: '8px', textAlign: 'center' }}>
                   <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--mist)', fontWeight: 700 }}>Current Standing</div>
                   <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--gold)' }}>T-1st (-14)</div>
               </div>
               <div style={{ flex: 1, background: '#f8faf9', border: '1px solid rgba(0,0,0,0.1)', padding: '0.6rem', borderRadius: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                   <div style={{ fontSize: '1rem' }}>📍</div>
                   <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--forest)', marginTop: '0.1rem' }}>Course GPS</div>
               </div>
           </div>

           {/* Team Scramble Input */}
           <div style={{ background: '#fff', border: '2px solid var(--forest)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 8px 20px rgba(26,46,26,0.08)' }}>
               <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: 'var(--mist)', marginBottom: '1rem' }}>Team Score</div>
               
               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
                   <button 
                      onClick={() => setScore1(Math.max(1, score1 - 1))}
                      style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', background: '#f8faf9', color: 'var(--forest)', fontSize: '1.5rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                   >-</button>

                   <div style={{ fontSize: '3.5rem', fontWeight: 900, width: '60px', textAlign: 'center', color: score1 < 4 ? 'var(--gold)' : (score1 > 4 ? '#ff4d4f' : 'var(--ink)'), lineHeight: 1 }}>
                      {score1}
                   </div>

                   <button 
                      onClick={() => setScore1(Math.min(15, score1 + 1))}
                      style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'var(--forest)', color: '#fff', fontSize: '1.5rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 8px rgba(26,46,26,0.2)' }}
                   >+</button>
               </div>
               
               {/* Team Roster Reference */}
               <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 600 }}>
                   M. Jordan • T. Woods • S. Curry • T. Romo
               </div>
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
