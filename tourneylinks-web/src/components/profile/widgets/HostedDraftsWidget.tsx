"use client";

import React from 'react';
import { Edit3 } from 'lucide-react';
import DeleteDraftButton from '@/components/profile/DeleteDraftButton';

export default function HostedDraftsWidget({ hostedEvents }: { hostedEvents: any[] }) {
  return (
    <div className="w-full relative bg-[rgba(255,255,255,0.02)] backdrop-blur-2xl border border-[rgba(255,255,255,0.05)] p-8 hover:border-[var(--gold)] transition-colors shadow-2xl rounded-2xl z-10 flex flex-col h-full overflow-hidden">
       <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] pb-4 mb-4 shrink-0">
         <h3 className="text-sm uppercase tracking-[0.15em] font-black flex items-center gap-3 text-white">
           <Edit3 size={18} className="text-[var(--gold)]" /> My Events
         </h3>
         <a href="/host" className="text-[10px] bg-[var(--gold)] text-black hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] px-3 py-1.5 uppercase tracking-widest font-bold transition-all rounded">+ Create</a>
       </div>
       
       <div className="flex-1 flex flex-col px-2 overflow-y-auto custom-scrollbar">
         {hostedEvents.length === 0 ? (
           <div className="w-full h-full flex flex-col items-center justify-center py-12 opacity-50">
             <p className="text-sm font-light text-center">No hosted events found.</p>
           </div>
         ) : (
           <div className="flex flex-col gap-2">
             {hostedEvents.map((t: any) => (
               <div key={t.id} className="py-4 border-b border-[rgba(255,255,255,0.05)] flex flex-col gap-4 group hover:bg-[rgba(255,255,255,0.03)] px-3 rounded-xl transition-colors">
                 <div className="min-w-0 pr-2">
                   <div className="text-xl font-bold text-white group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>{t.name}</div>
                   <div className="flex items-center gap-3 text-[10px] font-mono text-[rgba(255,255,255,0.6)] mt-2">
                     <span className="flex items-center gap-1"><span className="text-[var(--gold)] opacity-80">DATE</span> {t.dateStart ? new Date(t.dateStart).toLocaleDateString() : 'TBD'}</span>
                     <span className="w-px h-3 bg-[rgba(255,255,255,0.3)]" />
                     {t.isActive ? (
                       <span className="uppercase font-bold tracking-widest text-[#4ade80]">LIVE</span>
                     ) : (
                       <span className="uppercase font-bold tracking-widest text-[#f1c40f]">DRAFT</span>
                     )}
                   </div>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-3 mt-1 transition-opacity">
                    <a href={`/host?tournamentId=${t.id}`} className="bg-transparent border border-[rgba(255,255,255,0.4)] text-[rgba(255,255,255,0.8)] hover:border-[var(--gold)] hover:text-[var(--gold)] uppercase font-black tracking-widest text-[10px] px-4 py-2 rounded transition-colors flex items-center gap-2 whitespace-nowrap">
                       Edit
                    </a>
                    {t.isActive ? (
                       <a href={`/tournaments/${t.id}`} className="bg-[var(--gold)] text-[#050B08] uppercase font-black tracking-widest text-[10px] px-4 py-2 rounded hover:bg-white transition-colors flex items-center gap-2 whitespace-nowrap">
                          View Live
                       </a>
                    ) : (
                       <div className="scale-90 origin-left"><DeleteDraftButton tournamentId={t.id} /></div>
                    )}
                 </div>
               </div>
             ))}
           </div>
         )}
       </div>
    </div>
  );
}
