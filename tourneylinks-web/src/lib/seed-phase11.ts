import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments, sponsorship_tiers, users, stripe_accounts } from './db';

async function seed() {
  try {
    // 1. Create a dummy host user
    const host = await db.insert(users).values({
      clerkId: 'mock_enterprise_host_' + Date.now(),
      email: 'host@enterprise.com',
      fullName: 'Mock Enterprise Host',
      role: 'HOST',
    }).returning();
    const hostId = host[0].id;

    // 2. Create a stripe account for them so the UI shows Stripe checkout availability
    await db.insert(stripe_accounts).values({
      userId: hostId,
      stripeAccountId: 'acct_1MockStripeAccount000',
      chargesEnabled: true,
      payoutsEnabled: true,
    });

    // 3. Create the Enterprise Tournament
    const tourney = await db.insert(tournaments).values({
      name: 'The 2026 Enterprise Charity Invitational',
      courseName: 'Pebble Beach Golf Links',
      courseCity: 'Pebble Beach',
      courseState: 'CA',
      dateStart: '2026-08-15',
      format: '4-Man Scramble',
      entryFee: 750, // $750 Active Price
      originalPrice: 1000, // $1000 Strikethrough
      passFeesToRegistrant: true,
      allowOfflinePayment: true, // Pay Cash/Check on-site
      isCharity: true,
      acceptsDonations: true,
      charityName: "St. Jude Children's Research Hospital",
      isPrivate: false,
      hostUserId: hostId,
      isActive: true,
      description: 'A beautifully mocked tournament designed specifically to test all Phase 11 Enterprise Payment flows including Strikethrough UI, Cash On-Site Options, Charity Donation integrations, and full Corporate Sponsorships!',
      source: 'MANUAL',
      sourceId: 'mock_enterprise_event_1',
      sourceUrl: 'https://tourneylinks.com',
    }).returning();
    
    const tId = tourney[0].id;

    // 4. Create Sponsorship Tiers
    await db.insert(sponsorship_tiers).values([
      { tournamentId: tId, name: 'Title Sponsor', price: 5000, description: 'Premium logo placement on all carts and digital leaderboards.', spotsAvailable: 1 },
      { tournamentId: tId, name: 'Beverage Cart Sponsor', price: 1500, description: 'Brand the beverage cart circulating the course all day.', spotsAvailable: 2 },
      { tournamentId: tId, name: 'Hole Sponsor', price: 500, description: 'Signage on the 1st Tee Box.', spotsAvailable: 18 }
    ]);

    console.log(`✅ Seeded Successfully! Visit localhost:3000/tournaments/${tId}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed Failed:", err);
    process.exit(1);
  }
}

seed();
