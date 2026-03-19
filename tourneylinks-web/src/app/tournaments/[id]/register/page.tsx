import React from 'react';
import { getTournamentById } from '@/lib/db';
import { notFound } from 'next/navigation';
import RegistrationClient from './RegistrationClient';

export default async function RegistrationGatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tournamentId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(tournamentId)) {
    notFound();
  }

  const tournament = await getTournamentById(tournamentId);

  if (!tournament || !tournament.entryFee) {
    notFound();
  }

  // Pre-serialize simple data to pass down to Client Component
  const eventDetails = {
    id: tournament.id,
    name: tournament.name,
    entryFee: tournament.entryFee,
    originalPrice: tournament.originalPrice,
    passFeesToRegistrant: tournament.passFeesToRegistrant
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf9', paddingTop: '80px', paddingBottom: '6rem' }}>
      <div className="section-wrapper" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--forest)', marginBottom: '0.5rem', fontWeight: 800 }}>
          Registration Gateway
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--mist)', marginBottom: '3rem' }}>
          {tournament.name}
        </p>

        <RegistrationClient tournament={eventDetails} />
      </div>
    </div>
  );
}
