'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function PricingGuidePage() {
  const [course, setCourse] = useState('');
  const [players, setPlayers] = useState('144');
  const [type, setType] = useState('charity');
  
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleGenerate = () => {
    if (!course) return alert('Please enter a course name');
    
    setIsSynthesizing(true);
    setReport(null);

    // Simulate AI synthesis latency
    setTimeout(() => {
      // Mock AI engine logic based on course string length/type to appear realistic
      const baseFee = course.toLowerCase().includes('country club') || course.toLowerCase().includes('cc') ? 140 : 85;
      const fnb = type === 'charity' || type === 'corporate' ? 45 : 25;
      const targetMargin = type === 'charity' ? 0.35 : 0.20; // 35% margin for charity
      
      const rawCost = baseFee + fnb;
      const recommendedPrice = Math.ceil(rawCost / (1 - targetMargin) / 5) * 5; // Round to nearest 5
      const projectedGross = recommendedPrice * parseInt(players);
      const profit = projectedGross - (rawCost * parseInt(players));

      setReport({
         recommendedPrice,
         rawCost,
         profit,
         projectedGross,
         demographicNote: baseFee >= 100 
           ? "This venue indicates a premium local demographic. You can confidently command $200+ for registration if you pair it with high-end food & beverage additions." 
           : "This is a highly accessible public course. Keeping primary registration below $150 will maximize your total turnout while still leaving room for strong sponsorship margins."
      });
      setIsSynthesizing(false);
    }, 2500);
  };

  return (
    <div style={{ padding: '2rem 3rem', maxWidth: '1000px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', color: 'var(--forest)', margin: 0 }}>TourneyLinks Intelligence</h1>
          <span style={{ background: 'var(--gold)', color: '#000', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Beta</span>
       </div>
       <p style={{ color: 'var(--mist)', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '700px', lineHeight: 1.6 }}>
         Leverage our AI pricing engine to calculate the optimal registration fee for your tournament. We synthesize local course data, target demographics, and standard margins to ensure maximum profitability.
       </p>

       <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '3rem' }}>
          
          {/* Input Panel */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #eaeaea', height: 'fit-content' }}>
             <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1.5rem' }}>Tournament Parameters</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Golf Course Name</label>
                   <input 
                      type="text" 
                      value={course} 
                      onChange={(e) => setCourse(e.target.value)} 
                      placeholder="e.g. Oak Hill Country Club"
                      style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none' }}
                   />
                </div>

                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Expected Field Size</label>
                   <select 
                      value={players} 
                      onChange={(e) => setPlayers(e.target.value)} 
                      style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none', background: '#fff' }}
                   >
                      <option value="72">72 Players (Half Course)</option>
                      <option value="100">100 Players</option>
                      <option value="144">144 Players (Full Course)</option>
                   </select>
                </div>

                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Event Classification</label>
                   <select 
                      value={type} 
                      onChange={(e) => setType(e.target.value)} 
                      style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none', background: '#fff' }}
                   >
                      <option value="charity">Charity / Non-Profit</option>
                      <option value="corporate">Corporate / Networking</option>
                      <option value="recreational">Recreational / Memorial</option>
                   </select>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isSynthesizing}
                  style={{ background: 'var(--gold)', color: '#000', padding: '1.2rem', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', marginTop: '1rem', transition: '0.2s', opacity: isSynthesizing ? 0.7 : 1 }}
                >
                  {isSynthesizing ? 'Synthesizing Data...' : 'Generate Target Pricing ⚡'}
                </button>
             </div>
          </div>

          {/* AI Output Panel */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
             {!report && !isSynthesizing && (
                <div style={{ flex: 1, border: '2px dashed #ddd', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '1.1rem', background: '#fafaf9' }}>
                   Specify parameters to generate intelligence matrix.
                </div>
             )}

             {isSynthesizing && (
                <div style={{ flex: 1, border: '2px solid rgba(212,175,55,0.5)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)', fontSize: '1.2rem', background: 'rgba(212,175,55,0.05)', fontWeight: 600 }}>
                   <div className="spinner" style={{ marginBottom: '1.5rem', width: '40px', height: '40px', border: '4px solid rgba(212,175,55,0.3)', borderTop: '4px solid var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                   <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}}></style>
                   Analyzing local demographics...
                </div>
             )}

             {report && !isSynthesizing && (
                <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                   <style dangerouslySetInnerHTML={{__html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}}></style>
                   
                   <div style={{ background: 'var(--forest)', color: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 15px 40px rgba(26,46,26,0.2)', marginBottom: '2rem' }}>
                      <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.5rem' }}>AI Recommended Target</div>
                      <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>${report.recommendedPrice} <span style={{ fontSize: '1.5rem', fontWeight: 500, fontFamily: 'sans-serif', color: 'rgba(255,255,255,0.6)' }}>/ player</span></div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                         <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Projected Registration Gross</div>
                         <div style={{ fontSize: '2rem', color: 'var(--ink)', fontWeight: 800 }}>${report.projectedGross.toLocaleString()}</div>
                      </div>
                      <div style={{ background: '#f4fbf7', padding: '1.5rem', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                         <div style={{ fontSize: '0.85rem', color: 'var(--grass)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Estimated Net Profit</div>
                         <div style={{ fontSize: '2rem', color: 'var(--forest)', fontWeight: 800 }}>+${report.profit.toLocaleString()}</div>
                      </div>
                   </div>

                   <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eaeaea', borderLeft: '4px solid var(--gold)' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🧠 AI Demographic Analysis</h4>
                      <p style={{ color: '#555', lineHeight: 1.6, margin: 0 }}>
                        {report.demographicNote} At an estimated hardware cost of <strong>${report.rawCost}</strong> per player (greens fees, cart, average buffet), enforcing a primary ticket price of <strong>${report.recommendedPrice}</strong> ensures your baseline financials are fully protected, letting you rely on Hole Sponsorships for pure top-line revenue.
                      </p>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
