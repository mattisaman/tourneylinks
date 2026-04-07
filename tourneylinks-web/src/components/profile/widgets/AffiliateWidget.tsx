"use client";

import React from 'react';
import WidgetCard from './WidgetCard';

export default function AffiliateWidget({ dbUser, userId }: { dbUser: any, userId: string }) {
  return (
    <WidgetCard className="h-full">
       <h3 className="hero-eyebrow !mb-6 flex items-center justify-between !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-lg lg:!text-xl shrink-0" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)', paddingBottom: '1rem' }}>
          Credit Bank <span style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>$0.00</span>
       </h3>
       <div className="flex flex-col flex-1 justify-between h-full pt-2">
         <p className="text-lg lg:text-xl font-medium leading-relaxed mb-4 text-white">
           Earn <strong style={{ color: 'var(--gold)' }}>$25</strong> for every Director that registers a tournament via your link.
         </p>
         
         <div className="mt-auto">
             <div className="mb-5">
                <p className="text-sm uppercase font-bold tracking-widest mb-1.5 opacity-80 text-[var(--gold)]">Your Link</p>
                <div className="font-mono text-lg lg:text-xl tracking-tight select-all cursor-pointer hover:text-[var(--cream)] transition-colors" style={{ color: 'white' }}>
                   tourneylinks.com/r/{dbUser?.id ? String(dbUser.id).substring(0,8) : "link"}
                </div>
             </div>
             
             <div className="flex items-center gap-3 text-base font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.8)' }}>
                <span><strong className="text-white text-lg font-mono mr-1.5">0</strong> Clicks</span>
                <span className="opacity-30">&bull;</span>
                <span><strong className="text-[#4ade80] text-lg font-mono mr-1.5">0</strong> Signups</span>
             </div>
         </div>
       </div>
    </WidgetCard>
  );
}
