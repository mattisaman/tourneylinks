"use client";

import React from 'react';
import { MapPin } from 'lucide-react';
import WidgetCard from './WidgetCard';

export default function RadarsWidget({ userRadars }: { userRadars: any[] }) {
  return (
    <WidgetCard className="h-full">
       <h3 className="hero-eyebrow !mb-4 flex items-center gap-3 !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-base" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)', paddingBottom: '1rem' }}>
         <MapPin size={20} style={{ color: 'var(--gold)' }} /> Course Radars <span className="text-xs text-[var(--mist)] lowercase opacity-60 ml-2">(saved searches)</span>
       </h3>
       {userRadars.length === 0 ? (
         <div className="text-center py-10 opacity-40 flex-1 flex flex-col justify-center">
           <p className="text-sm font-light mb-3">No radar uplinks established.</p>
         </div>
       ) : (
         <div className="flex flex-col flex-1 overflow-y-auto pr-2 custom-scrollbar">
           {userRadars.map((row: any) => (
             <a href={`/courses/${row.course.id}`} key={row.radar.id} className="group block py-4 hover:bg-white/[0.03] px-3 rounded-xl transition-colors" style={{ borderBottom: '1px solid rgba(245,240,232,0.05)' }}>
               <div className="flex items-center justify-between">
                 <div className="min-w-0 pr-4">
                   <div className="text-xl lg:text-2xl font-semibold truncate group-hover:text-[var(--gold)] transition-colors" style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif), serif' }}>{row.course.name}</div>
                   <div className="text-sm mt-2 uppercase tracking-wider font-medium" style={{ color: 'rgba(245,240,232,0.6)' }}>{row.course.city}, {row.course.state}</div>
                 </div>
                 {row.radar.notifyOnNewTournament && (
                   <div className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.6)]" style={{ background: 'var(--gold)' }}></div>
                 )}
               </div>
             </a>
           ))}
         </div>
       )}
    </WidgetCard>
  );
}
