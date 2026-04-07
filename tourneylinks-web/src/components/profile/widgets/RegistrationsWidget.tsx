"use client";

import React from 'react';
import { Trophy } from 'lucide-react';
import TransferTicketModal from '@/components/profile/TransferTicketModal';

export default function RegistrationsWidget({ userRegistrations }: { userRegistrations: any[] }) {
  return (
    <div className="w-full relative bg-[rgba(2,6,4,0.6)] backdrop-blur-2xl border-t-[3px] border-[var(--gold)] p-8 hover:border-[rgba(212,175,55,1)] transition-colors shadow-2xl flex flex-col h-full z-10 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] pb-4 mb-4">
        <h3 className="text-sm uppercase tracking-[0.15em] font-black flex items-center gap-3 text-white">
          <Trophy size={18} className="text-[var(--gold)]" /> Registrations
        </h3>
        <a href="/tournaments" className="text-[10px] text-[var(--gold)] hover:text-black hover:bg-[var(--gold)] border border-[var(--gold)] px-3 py-1.5 uppercase tracking-widest font-bold transition-all rounded">Directory</a>
      </div>
      
      <div className="flex-1 flex flex-col px-2 overflow-y-auto max-h-[400px] custom-scrollbar">
        {userRegistrations.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center py-12 opacity-50">
            <p className="text-sm font-light mb-4 text-center">No active tournament flights booked.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {userRegistrations.map((row) => (
              <div key={row.registration.id} className="py-4 border-b border-[rgba(255,255,255,0.05)] flex flex-col gap-4 group hover:bg-[rgba(255,255,255,0.03)] px-3 rounded-xl transition-colors">
                <div className="min-w-0 pr-2">
                  <div className="text-xl font-bold text-white group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>{row.tournament.name}</div>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-[rgba(255,255,255,0.6)] mt-2">
                    <span className="flex items-center gap-1"><span className="text-[var(--gold)] opacity-80">DATE</span> {new Date(row.tournament.dateStart || '').toLocaleDateString()}</span>
                    <span className="w-px h-3 bg-[rgba(255,255,255,0.3)]" />
                    <span className={`uppercase font-bold tracking-widest ${row.registration.status === 'TRANSFERRED' ? 'text-red-400' : 'text-[#4ade80]'}`}>{row.registration.status}</span>
                  </div>
                </div>
                
                {row.registration.status === 'CONFIRMED' && (
                  <div className="flex flex-wrap items-center gap-3 transition-opacity">
                    <a href={`/tournaments/${row.tournament.id}/scorer`} className="bg-[var(--gold)] text-[#050B08] uppercase font-black tracking-widest text-[10px] px-4 py-2 rounded shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:bg-white transition-colors flex items-center gap-2 whitespace-nowrap">
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
    </div>
  );
}
