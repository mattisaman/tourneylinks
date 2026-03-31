import React from 'react';
import { db, tournaments, courses, store_inventory, tournament_sponsors } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import CampaignBuilderClient from './CampaignBuilderClient';

export default async function CampaignBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const { id } = await params;
  const tId = parseInt(id, 10);
  const tRow = await db.select().from(tournaments).where(eq(tournaments.id, tId)).limit(1);
  if (!tRow[0]) redirect('/admin');

  const tourney = tRow[0];

  const cRow = await db.select().from(courses).where(eq(courses.id, tourney.courseId)).limit(1);
  const course = cRow[0] || { name: 'Unknown Course' };

  // Fetch all related entities for the Editor
  const inventory = await db.select().from(store_inventory).where(eq(store_inventory.tournamentId, tId));
  const sponsors = await db.select().from(tournament_sponsors).where(eq(tournament_sponsors.tournamentId, tId));

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
       <div style={{ height: '60px', background: '#05120c', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 2rem', color: 'white', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <a href="/admin" style={{ color: 'var(--mist)', textDecoration: 'none', marginRight: '0.5rem' }}>← Back</a>
             Dashboard <span style={{ color: 'var(--gold)' }}>/</span> {tourney.name} <span style={{ color: 'var(--gold)' }}>/</span> Builder
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>Live Organizer Studio</div>
       </div>
       <CampaignBuilderClient
           initialTournament={tourney}
           initialCourse={course}
           initialInventory={inventory}
           initialSponsors={sponsors}
       />
    </div>
  );
}
