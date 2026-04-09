'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SponsorPipelineBoard from './components/SponsorPipelineBoard';
import AdminSidebar from '@/components/admin/AdminSidebar';

function CRMContent() {
  const searchParams = useSearchParams();
  const tidParam = searchParams.get('tournamentId');
  const tournamentId = tidParam ? parseInt(tidParam) : 1;

  // Mock tournaments payload required by the AdminSidebar
  const mockTournaments = [
    { id: 991, name: 'Lakewood Classic' },
    { id: tournamentId, name: 'The Lighthouse Scramble' },
  ];

  return (
    <div className="flex h-screen bg-[#050b08] relative overflow-hidden" style={{ paddingTop: '90px' }}>
      
      {/* 1. Left Nav: Injected Host Hub Admin Nav */}
      <AdminSidebar tournamentId={tournamentId} mockTournaments={mockTournaments} />

      {/* 2. Main Payload Area */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden bg-[#FDFBF7] rounded-tl-3xl shadow-[-10px_0_40px_rgba(0,0,0,0.5)]">
        
        {/* 3. The Dashboard Frame */}
        <main className="flex-1 relative z-30 w-full h-full overflow-hidden flex flex-col" style={{ padding: '56px' }}>
          {/* Header Typography within the Dashboard */}
          <div className="mb-6 shrink-0">
            <h1 className="text-4xl font-bold tracking-tight text-[#0a120e]" style={{ 
              fontFamily: 'var(--font-serif), var(--font-cinzel), serif', 
            }}>Sponsor Pipeline Tracker</h1>
            <p className="text-neutral-500 text-sm font-semibold mt-1 tracking-widest uppercase">Manage B2B Relationships</p>
          </div>

          {/* The Kanban Board Tile Wrapper */}
          <div className="flex-1 overflow-hidden flex">
            <SponsorPipelineBoard tournamentId={tournamentId} />
          </div>
        </main>
      </div>

    </div>
  );
}

export default function CRMPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-500">Loading CRM Pipeline...</div>}>
      <CRMContent />
    </Suspense>
  );
}
