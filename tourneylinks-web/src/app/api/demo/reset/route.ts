import { NextResponse } from 'next/server';
import { db, users, courses, tournaments, course_holes, registrations, team_groups, split_invites, payments, store_inventory, stripe_accounts, tournament_sponsors } from '@/lib/db';

export async function POST() {
  try {
     // 1. OBLITERATE THE ENTIRE LOCAL DEMO ECOSYSTEM
     // Order matters severely due to Postgres Foreign Key cascading constraints
     await db.delete(payments);
     await db.delete(split_invites);
     await db.delete(team_groups);
     await db.delete(registrations);
     await db.delete(store_inventory);
     await db.delete(tournament_sponsors);
     await db.delete(stripe_accounts);
     await db.delete(course_holes);
     await db.delete(tournaments);
     await db.delete(courses);
     await db.delete(users);

     // 2. RECONSTRUCT THE MASTER 'PEBBLE BEACH' SALES SCRAMBLE
     
     // Master Admin / Pro
     const hostUser = await db.insert(users).values({
        clerkId: 'demo-host-123',
        email: 'host@demo.tourneylinks.com',
        fullName: 'TourneyLinks Demo Pro',
        role: 'HOST'
     }).returning({ id: users.id });
     const hostId = hostUser[0].id;

     // The Financial Gateway
     await db.insert(stripe_accounts).values({
        userId: hostId,
        stripeAccountId: 'acct_mockPebbleBeachDemo',
        payoutsEnabled: true,
        chargesEnabled: true,
     });

     // Master Course Topology
     const courseOut = await db.insert(courses).values({
        name: 'Pebble Beach Golf Links',
        city: 'Pebble Beach',
        state: 'CA',
        zip: '93953',
        holes: 18,
     }).returning({ id: courses.id });
     const courseId = courseOut[0].id;

     // Inject 18 mock holes with perfect GPS data directly simulating the actual links!
     const holePayloads = Array.from({ length: 18 }).map((_, i) => ({
         courseId,
         holeNumber: i + 1,
         par: [3,4,4,5][Math.floor(Math.random() * 4)],
         yardage: 380 + Math.floor(Math.random() * 100),
         pinLat: 36.568 + (i * 0.001),
         pinLng: -121.95 - (i * 0.0005)
     }));
     await db.insert(course_holes).values(holePayloads);

     // Master Tournament Hub
     const tournamentOut = await db.insert(tournaments).values({
        courseId,
        hostUserId: hostId,
        name: 'The Lighthouse Charity Scramble',
        sourceUrl: 'https://demo.tourneylinks.com',
        sourceId: 'demo-tgt-01',
        source: 'demo',
        courseName: 'Pebble Beach Golf Links',
        courseCity: 'Pebble Beach',
        courseState: 'CA',
        dateStart: new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        entryFee: 150,
        originalPrice: 200,
        format: 'SCRAMBLE',
        isPrivate: false,
        passFeesToRegistrant: false,
        allowOfflinePayment: true,
        isActive: true,
        registrationUrl: 'lighthouse-scramble',
     }).returning({ id: tournaments.id });
     const tournamentId = tournamentOut[0].id;

     // Seed the Store Config
     await db.insert(store_inventory).values([
         { tournamentId, title: "Mulligan Package (2 MAX)", price: 2000, maxPerPlayer: 2 },
         { tournamentId, title: "Yard of String", price: 1000, maxPerPlayer: null },
         { tournamentId, title: "Pro Drive on Hole 18", price: 5000, maxPerPlayer: 1 }
     ]);

     return NextResponse.json({ success: true, message: 'Drizzle ORM Engine completely purged and precisely rebuilt Pebble Beach Demo infrastructure.' });
  } catch(err: any) {
     console.error('Master Sandbox Refresh Failure:', err);
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
