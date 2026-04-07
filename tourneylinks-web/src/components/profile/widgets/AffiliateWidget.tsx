"use client";

import React from 'react';

export default function AffiliateWidget({ dbUser, userId }: { dbUser: any, userId: string }) {
  return (
    <div className="w-full h-full relative bg-[rgba(5,11,8,0.7)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] p-8 shadow-2xl rounded-2xl overflow-hidden hover:border-[var(--gold)] transition-colors z-10 flex flex-col">
       <div className="absolute inset-0 bg-[url('/hero-bg-4.jpg')] opacity-[0.02] pointer-events-none mix-blend-overlay" />
       <h3 className="text-sm uppercase tracking-[0.15em] font-black mb-4 text-white pb-4 border-b border-[rgba(255,255,255,0.1)] relative z-10 flex items-center justify-between shrink-0">
          Credit Bank <span className="text-[var(--gold)] text-base">$0.00</span>
       </h3>
       <div className="flex-1 flex flex-col overflow-y-auto">
         <p className="text-xs text-[rgba(255,255,255,0.6)] mb-4 font-light leading-relaxed relative z-10">
           Earn <strong className="text-white font-bold">$25</strong> automatically when a Director registers their first tournament via your link.
         </p>
         <div className="bg-black border border-[rgba(255,255,255,0.2)] p-3 mb-4 flex items-center justify-between group cursor-pointer hover:border-[var(--gold)] transition-all relative z-10 rounded mt-auto">
            <span className="text-[10px] font-mono text-[var(--gold)] truncate select-all opacity-90 group-hover:opacity-100 pl-1">tourneylinks.com/r/{dbUser?.id}T{userId?.substring(userId.length-4)}</span>
         </div>
         <div className="grid grid-cols-2 gap-3 relative z-10 shrink-0">
            <div className="text-center border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] py-4 rounded-xl">
               <div className="text-[9px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.2em] mb-1 font-bold">Clicks</div>
               <div className="text-xl font-black text-white font-mono">0</div>
            </div>
            <div className="text-center border border-[rgba(74,222,128,0.3)] bg-[rgba(74,222,128,0.05)] py-4 rounded-xl">
               <div className="text-[9px] text-[#4ade80] opacity-90 uppercase tracking-[0.2em] mb-1 font-bold">Convs</div>
               <div className="text-xl font-black text-[#4ade80] font-mono">0</div>
            </div>
         </div>
       </div>
    </div>
  );
}
