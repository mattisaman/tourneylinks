import React from 'react';
import { db, tournament_sponsors, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth-util';
import { redirect } from 'next/navigation';
import SponsorDashboardClient from '@/components/sponsors/SponsorDashboardClient';

export const dynamic = 'force-dynamic';

export default async function SponsorDashboardServer() {
  const { userId } = await getUserId();
  if (!userId) redirect('/');

  // Query actual Sponsorship relations
  const mySponsorships = await db.select()
     .from(tournament_sponsors)
     .where(eq(tournament_sponsors.clerkUserId, userId));

  // If Real, map the actual target tournament names into the payload
  const resolvedSponsorships: any[] = [];
  if (mySponsorships.length > 0) {
      for (const sponsorRow of mySponsorships) {
          const tournamentRow = await db.select().from(tournaments).where(eq(tournaments.id, sponsorRow.tournamentId)).limit(1);
          resolvedSponsorships.push({
              ...sponsorRow,
              tournamentName: tournamentRow[0]?.name || 'Unknown Tournament'
          });
      }
  }

  const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === 'true';

  let finalPayload = resolvedSponsorships;

  // Demo fallback strictly if they have no real sponsorships
  if (resolvedSponsorships.length === 0) {
      if (isDemo) {
          finalPayload = [
              {
                  id: 9991,
                  name: 'Mercedes-Benz of Rochester',
                  tournamentName: 'The Lighthouse Charity Scramble',
                  sponsorType: 'TITLE SPONSOR',
                  amountPaid: 1000000, // $10,000 (cents)
                  purchasedAt: new Date().toISOString()
              },
              {
                  id: 9992,
                  name: 'Mercedes-Benz of Rochester',
                  tournamentName: 'Regional Classic',
                  sponsorType: 'HOLE SPONSOR (HOLE 8)',
                  amountPaid: 250000, // $2,500 (cents)
                  purchasedAt: new Date().toISOString()
              }
          ];
      }
  }

  return <SponsorDashboardClient sponsorData={finalPayload} isDemo={isDemo} />
}
