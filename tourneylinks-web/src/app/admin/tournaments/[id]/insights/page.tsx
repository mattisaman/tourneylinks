import React from 'react';
import { db, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import AdminInsightsClient from './AdminInsightsClient';

export default async function InsightsPage({ params }: { params: Promise<{ id: string }> }) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const { id } = await params;
  const tId = parseInt(id, 10);
  const tRow = await db.select().from(tournaments).where(eq(tournaments.id, tId)).limit(1);
  if (!tRow[0]) redirect('/admin');

  const tourney = tRow[0];

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
       {/* Breadcrumb Navigation Header */}
       <div style={{ height: '60px', background: '#05120c', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 2rem', color: 'white', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <a href="/admin" style={{ color: 'var(--mist)', textDecoration: 'none', marginRight: '0.5rem' }}>← Back</a>
             Dashboard <span style={{ color: 'var(--gold)' }}>/</span> {tourney.name} <span style={{ color: 'var(--gold)' }}>/</span> Insights
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--mist)', display: 'flex', gap: '1rem' }}>
             <a href={`/admin/tournaments/${tId}/builder`} style={{ color: 'var(--mist)', textDecoration: 'none', transition: 'color 0.2s' }}>Builder</a>
             <a href={`/admin/tournaments/${tId}/print`} style={{ color: 'var(--mist)', textDecoration: 'none', transition: 'color 0.2s' }}>Print Center</a>
             <span style={{ color: 'var(--gold)', fontWeight: 800 }}>Insights</span>
          </div>
       </div>
       
       <AdminInsightsClient tournamentId={tId} tourneyName={tourney.name} />
    </div>
  );
}
