"use client";

import React from 'react';
import { Trophy } from 'lucide-react';
import TransferTicketModal from '@/components/profile/TransferTicketModal';
import WidgetCard from './WidgetCard';

export default function RegistrationsWidget({ userRegistrations }: { userRegistrations: any[] }) {
  return (
    <WidgetCard className="h-full">
      <div className="flex items-center justify-between pb-4 mb-4" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)' }}>
        <h3 className="hero-eyebrow !mb-0 flex items-center gap-3 !bg-none !border-none !shadow-none !backdrop-filter-none !p-0 !text-base lg:!text-lg">
          <Trophy size={22} style={{ color: 'var(--gold)' }} /> Registrations
        </h3>
        <a href="/tournaments" className="btn-ghost text-base px-5 py-2">Directory</a>
      </div>
      
      <div className="flex-1 flex flex-col px-2 overflow-y-auto max-h-[220px] custom-scrollbar">
        {userRegistrations.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center py-12 opacity-50">
            <p className="text-base lg:text-lg font-medium mb-4 text-center">No active tournament flights booked.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {userRegistrations.map((row) => (
              <div key={row.registration.id} className="py-4 flex flex-col gap-4 group px-3 rounded-xl transition-colors hover:bg-white/5" style={{ borderBottom: '1px solid rgba(245,240,232,0.05)' }}>
                <div className="min-w-0 pr-2">
                  <div className="text-2xl font-semibold group-hover:text-[var(--gold)] transition-colors" style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif), serif' }}>{row.tournament.name}</div>
                  <div className="flex items-center gap-3 text-sm mt-3 tracking-wider uppercase font-medium" style={{ color: 'rgba(245,240,232,0.6)' }}>
                    <span className="flex items-center gap-1"><span style={{ color: 'var(--gold)' }}>DATE</span> {new Date(row.tournament.dateStart || '').toLocaleDateString()}</span>
                    <span className="w-px h-3" style={{ background: 'rgba(245,240,232,0.2)' }} />
                    <span className={`font-bold ${row.registration.status === 'TRANSFERRED' ? 'text-red-400' : 'text-[#4ade80]'}`}>{row.registration.status}</span>
                  </div>
                </div>
                
                {row.registration.status === 'CONFIRMED' && (
                  <div className="flex flex-wrap items-center gap-4 mt-2 transition-opacity">
                    <a href={`/tournaments/${row.tournament.id}/scorer`} className="btn-primary flex items-center gap-2 text-base px-4 py-2.5">
                       Game Day Scorer
                    </a>
                    <div className="origin-left scale-90">
                       <TransferTicketModal registrationId={row.registration.id} tournamentName={row.tournament.name} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetCard>
  );
}
