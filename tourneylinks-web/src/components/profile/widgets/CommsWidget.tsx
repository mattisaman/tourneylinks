"use client";

import React from 'react';
import { Bell } from 'lucide-react';

export default function CommsWidget() {
  return (
    <div className="w-full bg-[rgba(255,255,255,0.02)] backdrop-blur-2xl border border-[rgba(255,255,255,0.05)] p-8 hover:border-[var(--gold)] transition-colors flex flex-col shadow-2xl rounded-2xl z-10 h-full overflow-hidden">
       <h3 className="text-sm uppercase tracking-[0.15em] font-black mb-6 flex items-center justify-between text-white border-b border-[rgba(255,255,255,0.1)] pb-4 shrink-0">
         <div className="flex items-center gap-3"><Bell size={18} className="text-[var(--gold)]" /> Command Center</div>
         <span className="bg-[var(--gold)] text-black px-2 py-0.5 rounded font-black text-[10px] animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.4)]">ALERTS</span>
       </h3>
       <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          <p className="text-sm text-[rgba(255,255,255,0.6)] leading-relaxed font-light">Internal routing system for secure transmissions directly from Hosts and Platform Support.</p>
          <div className="mt-auto flex flex-col gap-3 pt-4">
             <a href="/profile/inbox" className="w-full text-center bg-white text-black font-bold uppercase tracking-widest text-[10px] py-3 rounded hover:bg-[var(--gold)] transition-all">Access Inbox</a>
             <a href="/profile/settings" className="w-full text-center border border-[rgba(255,255,255,0.2)] text-white hover:border-[var(--gold)] hover:text-[var(--gold)] font-bold uppercase tracking-widest text-[10px] py-3 rounded transition-all">Notification Rules</a>
          </div>
       </div>
    </div>
  );
}
