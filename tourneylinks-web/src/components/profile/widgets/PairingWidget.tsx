"use client";

import React from 'react';
import { UserPlus } from 'lucide-react';

export default function PairingWidget() {
  return (
    <div className="w-full h-full bg-[rgba(255,255,255,0.01)] backdrop-blur-2xl border border-[rgba(255,255,255,0.05)] p-8 hover:border-[var(--gold)] transition-colors flex flex-col shadow-2xl cursor-not-allowed group rounded-2xl z-10 overflow-hidden">
       <h3 className="text-sm uppercase tracking-[0.15em] font-black mb-4 text-[rgba(255,255,255,0.5)] pb-4 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-3 shrink-0">
         <UserPlus size={18} /> Pairing Network
       </h3>
       <div className="flex-1 flex flex-col items-center justify-center text-center">
         <p className="text-xs text-[rgba(255,255,255,0.4)] font-light leading-relaxed mb-4">Invite playing partners using their verified email address to let the Auto-Flight Engine securely pair you together.</p>
         <div className="inline-block text-[10px] text-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.03)] px-4 py-2 uppercase tracking-widest font-bold rounded shadow-inner">
           Sync Unavailable
         </div>
       </div>
    </div>
  );
}
