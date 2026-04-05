'use client';
import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, MapPin, Flag, Save } from 'lucide-react';
import Link from 'next/link';

export default function MobileScorerPlaceholder() {
  const [currentHole, setCurrentHole] = useState(1);
  const [score, setScore] = useState(4);

  const isLastHole = currentHole === 18;
  const isFirstHole = currentHole === 1;

  return (
    <div className="fixed inset-0 bg-[#050B08] flex flex-col z-50 overflow-hidden">
      
      {/* Mobile Scorer Header */}
      <div className="w-full bg-[var(--ink)] border-b border-[rgba(255,255,255,0.05)] px-4 py-4 flex items-center justify-between">
         <Link href="/profile" className="text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
            <ArrowLeft size={20} />
         </Link>
         <div className="text-center">
            <div className="text-[10px] text-[var(--gold)] uppercase font-black tracking-widest">Live Scorer</div>
            <div className="text-white font-bold text-sm">The Masters Scramble</div>
         </div>
         <div className="w-5" /> {/* Spacer */}
      </div>

      {/* Main Scorer Interface */}
      <div className="flex-1 w-full bg-[url('/hero-bg-4.jpg')] bg-cover bg-center relative flex flex-col">
         <div className="absolute inset-0 bg-[#050B08]/90 mix-blend-multiply pointer-events-none" />
         <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] to-transparent pointer-events-none" />

         <div className="relative z-10 flex-1 flex flex-col p-6 items-center justify-center">
            
            {/* Hole Telemetry */}
            <div className="flex items-center gap-4 text-[rgba(255,255,255,0.6)] mb-8">
               <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Par</span>
                  <span className="text-lg text-white font-mono font-bold">4</span>
               </div>
               <div className="w-px h-8 bg-[rgba(255,255,255,0.1)]" />
               <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold border-b border-[var(--gold)] text-[var(--gold)] pb-0.5">Hole</span>
                  <span className="text-4xl text-white font-mono font-black">{currentHole}</span>
               </div>
               <div className="w-px h-8 bg-[rgba(255,255,255,0.1)]" />
               <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Yards</span>
                  <span className="text-lg text-white font-mono font-bold">410</span>
               </div>
            </div>

            {/* Score Input Ring */}
            <div className="relative w-48 h-48 rounded-full border-4 border-[rgba(212,175,55,0.2)] flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(212,175,55,0.05)] bg-[rgba(0,0,0,0.5)] backdrop-blur-md">
               <button onClick={() => setScore(Math.max(1, score - 1))} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[var(--ink)] border border-[rgba(255,255,255,0.1)] text-white flex items-center justify-center active:scale-95 transition-transform">
                  <ChevronLeft size={24} />
               </button>
               
               <div className="flex flex-col items-center text-center">
                 <span className="text-6xl font-black text-white font-mono leading-none">{score}</span>
                 <span className="text-[9px] text-[rgba(255,255,255,0.4)] uppercase tracking-widest mt-2">{score === 4 ? 'Par' : score < 4 ? 'Under' : 'Over'}</span>
               </div>

               <button onClick={() => setScore(Math.min(15, score + 1))} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full bg-[var(--ink)] border border-[rgba(255,255,255,0.1)] text-white flex items-center justify-center active:scale-95 transition-transform">
                  <ChevronRight size={24} />
               </button>
            </div>

            <button className="bg-[var(--gold)] text-black w-full max-w-xs py-4 rounded-full font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2 active:scale-95 transition-transform text-xs">
               <Save size={16} /> Save Score
            </button>

         </div>
      </div>

      {/* Navigation Footer */}
      <div className="w-full bg-[#030604] border-t border-[rgba(255,255,255,0.05)] px-6 py-4 flex items-center justify-between pb-8">
         <button 
           onClick={() => !isFirstHole && setCurrentHole(c => c - 1)}
           disabled={isFirstHole}
           className={`flex flex-col items-center gap-1 uppercase tracking-widest font-bold text-[9px] ${isFirstHole ? 'text-[rgba(255,255,255,0.2)]' : 'text-white'}`}
         >
            <ChevronLeft size={20} /> Prev
         </button>
         
         <button className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-3 rounded-full text-white">
            <Flag size={20} />
         </button>
         
         <button 
           onClick={() => !isLastHole && setCurrentHole(c => c + 1)}
           disabled={isLastHole}
           className={`flex flex-col items-center gap-1 uppercase tracking-widest font-bold text-[9px] ${isLastHole ? 'text-[rgba(255,255,255,0.2)]' : 'text-white'}`}
         >
            <ChevronRight size={20} /> Next
         </button>
      </div>

    </div>
  );
}
