import React from 'react';
import Tournaments from '@/components/ui/Tournaments';

export const dynamic = 'force-dynamic';

export default function TournamentsPage() {
  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh', paddingTop: '2rem' }}>
      <Tournaments showAll />
    </div>
  );
}
