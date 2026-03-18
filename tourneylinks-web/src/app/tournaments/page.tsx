import React from 'react';
import { getExistingTournaments } from '@/lib/db';
import TournamentDirectory from '@/components/ui/TournamentDirectory';

export const dynamic = 'force-dynamic';

export default async function TournamentsPage() {
  const tournaments = await getExistingTournaments();

  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh' }}>
      <TournamentDirectory initialTournaments={tournaments} />
    </div>
  );
}
