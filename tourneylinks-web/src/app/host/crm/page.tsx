'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SponsorPipelineBoard from './components/SponsorPipelineBoard';
import { ArrowLeft } from 'lucide-react';

function CRMContent() {
  const searchParams = useSearchParams();
  const tidParam = searchParams.get('tournamentId');
  const tournamentId = tidParam ? parseInt(tidParam) : 1; // Default to 1 for demo purposes if not provided

  return (
    <div className="flex flex-col h-screen bg-[#071510] relative overflow-hidden" style={{ paddingTop: '90px' }}>
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="ambient-orb ambient-orb-1" />
         <div className="ambient-orb ambient-orb-2" />
         <div className="absolute inset-0 bg-gradient-to-br from-[rgba(7,21,16,0.9)] via-[#071510] to-[#040806]" />
      </div>

      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-center px-8 py-6 relative z-10 border-b border-[rgba(212,175,55,0.15)]">
        {/* Absolute positioned Back Arrow to avoid shifting center alignment */}
        <div className="absolute left-6">
          <a 
            href={`/host${tidParam ? `?tournamentId=${tidParam}` : ''}`}
            className="p-2 text-[var(--gold)] flex items-center justify-center hover:text-white hover:bg-[rgba(212,175,55,0.1)] rounded-lg transition-colors border border-transparent hover:border-[rgba(212,175,55,0.3)]"
          >
            <ArrowLeft className="w-6 h-6" />
          </a>
        </div>
        
        {/* Centered Typography */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight drop-shadow-md mx-auto" style={{ 
            fontFamily: 'var(--font-serif), var(--font-cinzel), serif', 
            backgroundImage: 'linear-gradient(to bottom, #fffdf2 0%, #dfb962 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block'
          }}>Sponsor Pipeline Tracker</h1>
          <p className="text-[var(--mist)] text-sm font-medium mt-1 tracking-wide">Manage B2B relationships and close deals faster.</p>
        </div>
      </header>

      {/* Main Board Area */}
      <main className="flex-1 overflow-hidden relative z-10 w-full h-full">
        <SponsorPipelineBoard tournamentId={tournamentId} />
      </main>
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
