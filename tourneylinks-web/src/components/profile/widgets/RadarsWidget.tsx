"use client";

import React from 'react';
import { MapPin } from 'lucide-react';

export default function RadarsWidget({ userRadars }: { userRadars: any[] }) {
  return (
    <div className="w-full h-full relative bg-[rgba(255,255,255,0.02)] backdrop-blur-2xl border border-[rgba(255,255,255,0.05)] p-8 hover:border-[var(--gold)] transition-colors shadow-2xl rounded-2xl z-10 flex flex-col overflow-hidden">
       <h3 className="text-sm uppercase tracking-[0.15em] font-black flex items-center gap-3 text-white pb-4 border-b border-[rgba(255,255,255,0.1)] mb-4 shrink-0">
         <MapPin size={18} className="text-[var(--gold)]" /> Course Radars
       </h3>
       {userRadars.length === 0 ? (
         <div className="text-center py-10 opacity-40 flex-1 flex flex-col justify-center">
           <p className="text-sm font-light mb-3">No radar uplinks established.</p>
         </div>
       ) : (
         <div className="flex flex-col flex-1 overflow-y-auto pr-2 custom-scrollbar">
           {userRadars.map((row: any) => (
             <a href={`/courses/${row.course.id}`} key={row.radar.id} className="group block py-4 border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)] px-3 rounded-xl transition-colors">
               <div className="flex items-center justify-between">
                 <div className="min-w-0 pr-4">
                   <div className="text-lg font-bold text-white truncate group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>{row.course.name}</div>
                   <div className="text-[10px] text-[rgba(255,255,255,0.5)] mt-1 uppercase tracking-widest">{row.course.city}, {row.course.state}</div>
                 </div>
                 {row.radar.notifyOnNewTournament && (
                   <div className="w-2 h-2 bg-[#4ade80] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.6)]"></div>
                 )}
               </div>
             </a>
           ))}
         </div>
       )}
    </div>
  );
}
