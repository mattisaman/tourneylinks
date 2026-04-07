"use client";

import React from 'react';
import WidgetCard from './WidgetCard';

export default function AffiliateWidget({ dbUser, userId }: { dbUser: any, userId: string }) {
  return (
    <WidgetCard className="h-full">
       <h3 className="hero-eyebrow !mb-6 flex items-center justify-between !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-sm shrink-0" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)', paddingBottom: '1rem' }}>
          Credit Bank <span style={{ color: 'var(--gold)', fontSize: '1.25rem' }}>$0.00</span>
       </h3>
       <div className="flex-1 flex flex-col overflow-y-auto">
         <p className="text-sm mb-6 font-medium leading-relaxed z-10" style={{ color: 'rgba(245,240,232,0.6)' }}>
           Earn <strong style={{ color: 'var(--cream)' }}>$25</strong> automatically when a Director registers their first tournament via your link.
         </p>
         <div className="p-4 mb-6 flex items-center justify-between group cursor-pointer transition-all z-10 rounded-lg mt-auto" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
            <span className="text-xs font-mono truncate select-all group-hover:opacity-100 pl-1" style={{ color: 'var(--gold)', opacity: 0.8 }}>tourneylinks.com/r/{dbUser?.id}T{userId?.substring(userId.length-4)}</span>
         </div>
         <div className="grid grid-cols-2 gap-4 z-10 shrink-0">
            <div className="text-center py-6 rounded-xl transition-colors" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
               <div className="text-[10px] uppercase tracking-widest mb-2 font-bold" style={{ color: 'rgba(245,240,232,0.4)' }}>Clicks</div>
               <div className="text-3xl font-bold font-mono" style={{ color: 'var(--cream)' }}>0</div>
            </div>
            <div className="text-center py-6 rounded-xl" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
               <div className="text-[10px] uppercase tracking-widest mb-2 font-bold" style={{ color: 'rgba(74,222,128,0.8)' }}>Convs</div>
               <div className="text-3xl font-bold text-[#4ade80] font-mono">0</div>
            </div>
         </div>
       </div>
    </WidgetCard>
  );
}
