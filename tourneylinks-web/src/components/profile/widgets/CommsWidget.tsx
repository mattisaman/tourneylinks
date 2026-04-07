"use client";

import React from 'react';
import { Bell } from 'lucide-react';
import WidgetCard from './WidgetCard';

export default function CommsWidget() {
  return (
    <WidgetCard className="h-full">
       <h3 className="hero-eyebrow !mb-6 flex items-center justify-between !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-sm shrink-0" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)', paddingBottom: '1rem' }}>
         <div className="flex items-center gap-3"><Bell size={20} style={{ color: 'var(--gold)' }} /> Command Center</div>
         <span className="px-3 py-1 rounded font-bold text-[10px] animate-pulse" style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>ALERTS</span>
       </h3>
       <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <p className="text-base leading-relaxed font-medium" style={{ color: 'rgba(245,240,232,0.6)' }}>Internal routing system for secure transmissions directly from Hosts and Platform Support.</p>
          <div className="mt-auto flex flex-col gap-4 pt-4">
             <a href="/profile/inbox" className="btn-primary w-full justify-center">Access Inbox</a>
             <a href="/profile/settings" className="btn-ghost w-full justify-center">Notification Rules</a>
          </div>
       </div>
    </WidgetCard>
  );
}
