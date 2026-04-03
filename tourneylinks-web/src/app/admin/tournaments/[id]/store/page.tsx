import React from 'react';
import Link from 'next/link';
import { db, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import ScrambleStoreManager from '@/components/admin/ScrambleStoreManager';

export const dynamic = 'force-dynamic';

export default async function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tournamentId = parseInt(resolvedParams.id);
  if (isNaN(tournamentId)) return notFound();

  const tourneyResult = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);
  const tourney = tourneyResult[0];
  if (!tourney) return notFound();

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: '#f4f3ef', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ paddingBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: 'var(--forest)', marginBottom: '0.5rem' }}>Swag & E-Commerce Store</h1>
              <div style={{ color: 'var(--mist)', fontSize: '0.9rem' }}>
                Sell hats, t-shirts, and mulligans. This is separate from event registration.
              </div>
            </div>
            
            <Link href={`/admin`} className="btn-ghost" style={{ color: 'var(--forest)', border: '1px solid rgba(26,46,26,0.2)' }}>
              ← Return to Main Dashboard
            </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem' }}>
           <ScrambleStoreManager tournamentId={tournamentId} />
        </div>
      </div>
    </div>
  );
}
