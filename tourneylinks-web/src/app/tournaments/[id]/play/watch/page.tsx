import React from 'react';
import { db, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import WatchScorerClient from './WatchScorerClient';

export const dynamic = 'force-dynamic';

export default async function WatchScoringPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ hole?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const tourneyId = parseInt(resolvedParams.id);
  const activeHole = resolvedSearch.hole ? parseInt(resolvedSearch.hole) : 1;
  
  const tourneyList = await db.select().from(tournaments).where(eq(tournaments.id, tourneyId));
  if (tourneyList.length === 0) return notFound();
  const tournament = tourneyList[0];

  return <WatchScorerClient tournamentId={tourneyId} courseId={tournament.courseId || 1} holeQuery={activeHole} />;
}
