"use client";

import React, { useState } from 'react';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import WidgetCard from './WidgetCard';

export default function PairingWidget() {
  const [email, setEmail] = useState('');
  const [synced, setSynced] = useState(false);

  const handleSync = () => {
    if(!email) return;
    setSynced(true);
    setTimeout(() => { setSynced(false); setEmail(''); }, 3000);
  };

  return (
    <WidgetCard className="h-full">
       <h3 className="hero-eyebrow !mb-4 flex items-center gap-3 !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-lg lg:!text-xl shrink-0" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)', paddingBottom: '1rem' }}>
         <UserPlus size={24} style={{ color: 'var(--mist)' }} /> Auto-Flight Sync
       </h3>
       <div className="flex flex-col flex-1 justify-between h-full">
         <p className="text-lg lg:text-xl font-normal leading-relaxed text-white/80">
           Enter the email address of your playing partners to securely sync profiles. The Auto-Flight Engine will automatically pair you together in registered events and notify organizers of your pairing preference. If they are not on the platform, an invite will be sent.
         </p>
         
         <div className="flex items-center gap-3 mt-4">
            <input 
              type="email" 
              placeholder="Partner's Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-5 py-4 rounded-sm text-xl outline-none flex-1 transition-all border-2 border-[rgba(255,255,255,0.3)] focus:border-[var(--gold)] shadow-inner bg-[rgba(255,255,255,0.15)] text-white placeholder-white/80 font-medium"
            />
            <button 
              onClick={handleSync}
              className="btn-primary px-8 py-4 font-bold tracking-wide flex items-center justify-center min-w-[7rem] rounded-sm text-black hover:bg-white transition-colors text-xl"
            >
              {synced ? <CheckCircle2 size={18} /> : 'Sync'}
            </button>
         </div>
       </div>
    </WidgetCard>
  );
}
