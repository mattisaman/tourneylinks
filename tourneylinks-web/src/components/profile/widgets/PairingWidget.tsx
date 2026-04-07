"use client";

import React from 'react';
import { UserPlus } from 'lucide-react';
import WidgetCard from './WidgetCard';

export default function PairingWidget() {
  return (
    <WidgetCard className="h-full">
       <h3 className="hero-eyebrow !mb-4 flex items-center gap-3 !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-sm shrink-0" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)', paddingBottom: '1rem' }}>
         <UserPlus size={20} style={{ color: 'var(--mist)' }} /> Pairing Network
       </h3>
       <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 grayscale px-4">
         <p className="text-sm font-medium leading-relaxed mb-6" style={{ color: 'rgba(245,240,232,0.6)' }}>Invite playing partners using their verified email address to let the Auto-Flight Engine securely pair you together.</p>
         <div className="inline-block text-xs px-6 py-3 uppercase tracking-widest font-bold rounded-lg" style={{ color: 'rgba(245,240,232,0.3)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
           Sync Unavailable
         </div>
       </div>
    </WidgetCard>
  );
}
