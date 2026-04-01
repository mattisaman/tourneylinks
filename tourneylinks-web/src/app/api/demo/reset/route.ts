import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, users, courses, tournaments, course_holes, registrations, team_groups, split_invites, payments, store_inventory, stripe_accounts, tournament_sponsors, live_telemetry, beverage_orders, live_banter } from '@/lib/db';

export async function POST() {
  // CRITICAL SECURITY BARRIER
  if (process.env.NEXT_PUBLIC_IS_DEMO !== 'true') {
      return NextResponse.json({ error: 'ILLEGAL OPERATION: Sandbox Engine disabled in Production.' }, { status: 403 });
  }

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
     await db.delete(live_telemetry);
     await db.delete(beverage_orders);
     await db.delete(live_banter);
     // Note: course_holes and courses are now PROTECTED infrastructure. Do not delete them.
     await db.delete(tournaments);
     await db.delete(users);

     // 2. RECONSTRUCT THE 3 SHOWCASE DEMO TOURNAMENTS
     
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

     // Find or Create the Master Course Topology
     let courseId: number;
     const existingCourseQueue = await db.select().from(courses).where(eq(courses.name, 'Pebble Beach Golf Links')).limit(1);
     const existingCourse = existingCourseQueue[0];
     
     if (existingCourse) {
         courseId = existingCourse.id;
     } else {
         const courseOut = await db.insert(courses).values({
            name: 'Pebble Beach Golf Links',
            city: 'Pebble Beach',
            state: 'CA',
            zip: '93953',
            holes: 18,
         }).returning({ id: courses.id });
         courseId = courseOut[0].id;
         
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
     }

     // === TOURNAMENT 1: The Corporate Whale (Pebble Beach) ===
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

     // Seed GeoFenced Sponsors
     await db.insert(tournament_sponsors).values([
         {
            tournamentId,
            name: 'Local Ford Dealership',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_Motor_Company_Logo.svg',
            holeAssignment: 2, 
            popupAdCopy: 'FORD DEALERSHIP: WIN A NEW F-150 WITH A HOLE-IN-ONE TODAY!'
         }
     ]);

     // === TOURNAMENT 2: The Core Municipal Championship ===
     await db.insert(tournaments).values({
        hostUserId: hostId,
        name: 'City of Denver Amateur Championship',
        sourceUrl: 'https://demo.tourneylinks.com',
        sourceId: 'demo-tgt-02',
        source: 'demo',
        courseName: 'City Park Golf Course',
        courseCity: 'Denver',
        courseState: 'CO',
        dateStart: new Date(new Date().getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        entryFee: 45,
        originalPrice: 45,
        format: 'STROKE_INDIVIDUAL',
        isPrivate: false,
        passFeesToRegistrant: true,
        allowOfflinePayment: true, // Offline cash collection
        isActive: true,
        registrationUrl: 'denver-amateur',
        themeColor: '#005A36'
     });

     // === TOURNAMENT 3: The Ultra-Premium Private Outing ===
     const t3Out = await db.insert(tournaments).values({
        hostUserId: hostId,
        name: 'Pine Valley Member-Guest Invitational',
        sourceUrl: 'https://demo.tourneylinks.com',
        sourceId: 'demo-tgt-03',
        source: 'demo',
        courseName: 'Pine Valley Golf Club',
        courseCity: 'Pine Valley',
        courseState: 'NJ',
        dateStart: new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        entryFee: 2500,
        originalPrice: 3000,
        format: 'BEST_BALL',
        isPrivate: true, // Hidden from global search
        passFeesToRegistrant: false,
        allowOfflinePayment: false,
        isActive: true,
        registrationUrl: 'pine-valley-invitational',
        themeColor: '#1A1A1A'
     }).returning({ id: tournaments.id });
     const pineValleyId = t3Out[0].id;

     await db.insert(store_inventory).values([
         { tournamentId: pineValleyId, title: "VIP Caddy Fee", price: 15000, maxPerPlayer: 1 },
         { tournamentId: pineValleyId, title: "Steakhouse Dinner Ticket", price: 8500, maxPerPlayer: 4 }
     ]);

     return NextResponse.json({ success: true, message: 'Drizzle ORM Engine completely purged and precisely rebuilt 3 Ultra-Premium Demo Tournaments. (Courses protected).' });
  } catch(err: any) {
     console.error('Master Sandbox Refresh Failure:', err);
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
