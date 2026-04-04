"use client";

import React, { useState } from 'react';

export default function DigitalScorecards({ scorecards }: { scorecards: any[] }) {
  if (!scorecards || scorecards.length === 0) return null;

  const [activeTee, setActiveTee] = useState(0);
  const currentCard = scorecards[activeTee];
  
  if (!currentCard || !currentCard.holesData) return null;

  let holes = [];
  try {
     holes = typeof currentCard.holesData === 'string' ? JSON.parse(currentCard.holesData) : currentCard.holesData;
  } catch(e) {
     return null;
  }

  // Calculate totals
  const outHoles = holes.slice(0, 9);
  const inHoles = holes.slice(9, 18);
  const outPar = outHoles.reduce((acc: number, h: any) => acc + (parseInt(h.par) || 0), 0);
  const outYard = outHoles.reduce((acc: number, h: any) => acc + (parseInt(h.yardage) || 0), 0);
  const inPar = inHoles.reduce((acc: number, h: any) => acc + (parseInt(h.par) || 0), 0);
  const inYard = inHoles.reduce((acc: number, h: any) => acc + (parseInt(h.yardage) || 0), 0);
  
  const totalPar = outPar + inPar;
  const totalYard = outYard + inYard;

  return (
    <div className="w-full bg-[#050B08] py-16 px-4 md:px-12 border-t border-white/5 relative z-20">
       <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
             <div>
                <h2 className="text-3xl text-white font-serif mb-2">Digital Scorecard</h2>
                <p className="text-white/50 text-sm">Official mapping and topography data synced by the venue administration.</p>
             </div>
             <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
                {scorecards.map((card, idx) => (
                  <button 
                    key={card.id}
                    onClick={() => setActiveTee(idx)}
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeTee === idx ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                  >
                    {card.teeBoxName}
                  </button>
                ))}
             </div>
          </div>

          <div className="w-full overflow-x-auto pb-4">
             <div className="min-w-[800px] border border-white/10 rounded-sm bg-[#0A120E] shadow-2xl">
                 {/* Header Row */}
                 <div className="grid grid-cols-[80px_repeat(9,1fr)_60px_repeat(9,1fr)_60px_80px] bg-black/40 text-[10px] font-bold text-white/50 uppercase tracking-widest text-center border-b border-white/10">
                    <div className="p-3 text-left pl-6">Hole</div>
                    {Array.from({length: 9}).map((_, i) => <div key={i} className="p-3 border-l border-white/5">{i+1}</div>)}
                    <div className="p-3 border-l border-white/5 text-[var(--gold)]">OUT</div>
                    {Array.from({length: 9}).map((_, i) => <div key={i} className="p-3 border-l border-white/5">{i+10}</div>)}
                    <div className="p-3 border-l border-white/5 text-[var(--gold)]">IN</div>
                    <div className="p-3 border-l border-white/5 text-white">TOT</div>
                 </div>

                 {/* Yardage Row */}
                 <div className="grid grid-cols-[80px_repeat(9,1fr)_60px_repeat(9,1fr)_60px_80px] text-xs font-mono text-white text-center border-b border-white/5 bg-white/5">
                    <div className="p-3 text-left pl-6 flex items-center gap-2">
                       <div className="w-3 h-3 rounded-sm" style={{ background: currentCard.teeBoxColorHex || '#fff' }}></div>
                       Yards
                    </div>
                    {outHoles.map((h: any) => <div key={h.hole} className="p-3 border-l border-white/5">{h.yardage}</div>)}
                    <div className="p-3 border-l border-white/5 font-bold text-[var(--gold)]">{outYard}</div>
                    {inHoles.map((h: any) => <div key={h.hole} className="p-3 border-l border-white/5">{h.yardage}</div>)}
                    <div className="p-3 border-l border-white/5 font-bold text-[var(--gold)]">{inYard}</div>
                    <div className="p-3 border-l border-white/5 font-bold text-white">{totalYard}</div>
                 </div>

                 {/* Par Row */}
                 <div className="grid grid-cols-[80px_repeat(9,1fr)_60px_repeat(9,1fr)_60px_80px] text-xs font-mono text-white/70 text-center border-b border-white/5 relative">
                    <div className="p-3 text-left pl-6 uppercase tracking-widest text-[10px]">Par</div>
                    {outHoles.map((h: any) => <div key={h.hole} className="p-3 border-l border-white/5">{h.par}</div>)}
                    <div className="p-3 border-l border-white/5 font-bold text-white">{outPar}</div>
                    {inHoles.map((h: any) => <div key={h.hole} className="p-3 border-l border-white/5">{h.par}</div>)}
                    <div className="p-3 border-l border-white/5 font-bold text-white">{inPar}</div>
                    <div className="p-3 border-l border-white/5 font-bold text-[var(--gold)]">{totalPar}</div>
                 </div>

                 {/* Handicap Row */}
                 <div className="grid grid-cols-[80px_repeat(9,1fr)_60px_repeat(9,1fr)_60px_80px] text-[10px] font-mono text-white/40 text-center bg-black/20">
                    <div className="p-3 text-left pl-6 uppercase tracking-widest">HCP</div>
                    {outHoles.map((h: any) => <div key={h.hole} className="p-3 border-l border-white/5">{h.handicap}</div>)}
                    <div className="p-3 border-l border-white/5"></div>
                    {inHoles.map((h: any) => <div key={h.hole} className="p-3 border-l border-white/5">{h.handicap}</div>)}
                    <div className="p-3 border-l border-white/5"></div>
                    <div className="p-3 border-l border-white/5"></div>
                 </div>
             </div>
          </div>
          
          {(currentCard.slope || currentCard.rating) && (
            <div className="flex gap-4 mt-4 justify-end text-xs font-mono text-white/40 uppercase tracking-widest">
               {currentCard.rating && <div>Rating: <span className="text-white">{currentCard.rating}</span></div>}
               {currentCard.slope && <div>Slope: <span className="text-white">{currentCard.slope}</span></div>}
            </div>
          )}
       </div>
    </div>
  );
}
