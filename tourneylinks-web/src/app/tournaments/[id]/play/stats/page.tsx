import React from 'react';
import { db, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StatsClient from './StatsClient';

export const dynamic = 'force-dynamic';

export default async function MobileStatsPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ hole?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const tourneyId = parseInt(resolvedParams.id);
  const activeHole = resolvedSearch.hole || '1';
  
  const tourneyList = await db.select().from(tournaments).where(eq(tournaments.id, tourneyId));
  if (tourneyList.length === 0) return notFound();
  const tournament = tourneyList[0];

  return (
    <div style={{ background: '#05120c', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', paddingBottom: '90px' }}>
      
      {/* Mobile Top App Bar */}
      <div style={{ position: 'sticky', top: 0, background: 'rgba(5, 18, 12, 0.95)', backdropFilter: 'blur(10px)', padding: '1rem', borderBottom: '2px solid rgba(212,175,55,0.3)', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Field Statistics</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'serif', fontWeight: 800 }}>{tournament.name}</div>
         </div>
      </div>

      <StatsClient tournamentId={tourneyId} />

      {/* FIXED BOTTOM NAVIGATION */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '80px', background: 'rgba(5, 18, 12, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', paddingBottom: '20px' }}>
         <Link href={`/tournaments/${tourneyId}/play?hole=${activeHole}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>✏️</div>
            <div style={{ color: 'var(--mist)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600 }}>Score</div>
         </Link>
         <Link href={`/tournaments/${tourneyId}/play/leaderboard?hole=${activeHole}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>🏆</div>
            <div style={{ color: 'var(--mist)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600 }}>Leaderboard</div>
         </Link>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '3px solid var(--gold)', marginTop: '-1px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>📊</div>
            <div style={{ color: 'var(--gold)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800 }}>Stats</div>
         </div>
      </div>
      
    </div>
  );
}
