"use client";

import React from 'react';
import { Edit3 } from 'lucide-react';
import DeleteDraftButton from '@/components/profile/DeleteDraftButton';
import WidgetCard from './WidgetCard';

export default function HostedDraftsWidget({ hostedEvents }: { hostedEvents: any[] }) {
  return (
    <WidgetCard className="h-full">
       <div className="flex items-center justify-between pb-4 mb-4 shrink-0" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)' }}>
         <h3 className="hero-eyebrow !mb-0 flex items-center gap-3 !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-sm">
           <Edit3 size={20} style={{ color: 'var(--gold)' }} /> My Events
         </h3>
         <a href="/host" className="btn-ghost">+ Create</a>
       </div>
       
       <div className="flex-1 flex flex-col px-2 overflow-y-auto custom-scrollbar">
         {hostedEvents.length === 0 ? (
           <div className="w-full h-full flex flex-col items-center justify-center py-12 opacity-50">
             <p className="text-sm font-medium text-center">No hosted events found.</p>
           </div>
         ) : (
           <div className="flex flex-col gap-2">
             {hostedEvents.map((t: any) => (
               <div key={t.id} className="py-4 flex flex-col gap-4 group hover:bg-white/[0.03] px-3 rounded-xl transition-colors" style={{ borderBottom: '1px solid rgba(245,240,232,0.05)' }}>
                 <div className="min-w-0 pr-2">
                   <div className="text-xl font-semibold group-hover:text-[var(--gold)] transition-colors" style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif), serif' }}>{t.name}</div>
                   <div className="flex items-center gap-3 text-xs font-medium mt-3 uppercase tracking-wider" style={{ color: 'rgba(245,240,232,0.6)' }}>
                     <span className="flex items-center gap-1"><span style={{ color: 'var(--gold)' }}>DATE</span> {t.dateStart ? new Date(t.dateStart).toLocaleDateString() : 'TBD'}</span>
                     <span className="w-px h-3" style={{ background: 'rgba(245,240,232,0.2)' }} />
                     {t.isActive ? (
                       <span className="font-bold text-[#4ade80]">LIVE</span>
                     ) : (
                       <span className="font-bold" style={{ color: 'rgba(245,240,232,0.4)' }}>DRAFT</span>
                     )}
                   </div>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-4 mt-3 transition-opacity">
                    <a href={`/host?tournamentId=${t.id}`} className="btn-ghost flex items-center gap-2">
                       Edit
                    </a>
                    {t.isActive ? (
                       <a href={`/tournaments/${t.id}`} className="btn-primary flex items-center gap-2">
                          View Live
                       </a>
                    ) : (
                       <div className="scale-100 origin-left"><DeleteDraftButton tournamentId={t.id} /></div>
                    )}
                 </div>
               </div>
             ))}
           </div>
         )}
       </div>
    </WidgetCard>
  );
}
