"use client";

import React from 'react';
import { Flag } from 'lucide-react';
import WidgetCard from './WidgetCard';

export default function CommsWidget() {
  return (
    <WidgetCard className="h-full">
       <h3 className="hero-eyebrow !mb-6 flex items-center justify-between !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-sm lg:!text-base shrink-0" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)', paddingBottom: '1rem' }}>
         <div className="flex items-center gap-4">
           <div className="relative inline-flex items-center justify-center">
             <Flag size={20} className="text-red-500 fill-red-500 animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
             <span className="absolute -top-2.5 -right-3.5 bg-red-600 border border-black text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,1)]">3</span>
           </div>
           Command Center
         </div>
       </h3>
       <div className="flex-1 flex flex-col gap-6 pt-2">
          <p className="text-lg lg:text-xl leading-relaxed font-normal text-white/80 text-center px-2">Internal routing system for secure transmissions directly from Hosts and Platform Support.</p>
          <div className="flex flex-col items-center gap-3">
             <a href="/profile/inbox" className="btn-primary w-[85%] justify-center text-base py-3">Access Inbox</a>
             <a href="/profile/settings" className="btn-ghost w-[85%] justify-center text-base py-3">Notification Rules</a>
          </div>
       </div>
    </WidgetCard>
  );
}
