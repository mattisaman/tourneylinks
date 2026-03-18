import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/node-postgres';
import { registrations, tournaments } from './src/lib/db';
import { eq } from 'drizzle-orm';
import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL?.replace(':6543', ':5432')
});
const db = drizzle(pool);

async function seed() {
  console.log('Seeding mock registrants for Admin Dashboard Auto-Flighting...');

  // Get the first tournament to attach to
  const allTourneys = await db.select().from(tournaments).limit(1);
  if (allTourneys.length === 0) {
    console.error('No tournaments found in database to attach registrations. Please crawl first.');
    process.exit(1);
  }
  
  const tourneyId = allTourneys[0].id;
  console.log(`Attaching registrants to Tournament ID: ${tourneyId} (${allTourneys[0].name})`);

  // Clear existing
  await db.delete(registrations).where(eq(registrations.tournamentId, tourneyId));

  // Create 20 mock registrations
  // Mix of singles, twosomes, scratch, and high handicappers
  const mockData = [
    // Twosome Request
    { name: 'Mike Reynolds', email: 'mike@example.com', handicap: 14.2, pairingRequest: 'Tom Harrington' },
    { name: 'Tom Harrington', email: 'tom@example.com', handicap: 22.1, pairingRequest: 'Mike Reynolds' },
    
    // Threesome Request
    { name: 'Sarah Chen', email: 'sarah@example.com', handicap: 8.7, pairingRequest: 'James, Karen' },
    { name: 'James Park', email: 'james@example.com', handicap: 3.4, pairingRequest: 'Sarah' },
    { name: 'Karen Williams', email: 'karen@example.com', handicap: 18.0, pairingRequest: 'Sarah, James' },

    // Twosome Request
    { name: 'Dave Patel', email: 'dave@example.com', handicap: 11.5, pairingRequest: 'Chris Lee' },
    { name: 'Chris Lee', email: 'chris@example.com', handicap: 9.2, pairingRequest: 'Dave Patel' },

    // Singles (No requests)
    { name: 'Linda Martinez', email: 'linda@example.com', handicap: 26.8, pairingRequest: null },
    { name: 'Robert Jenkins', email: 'robert@example.com', handicap: 2.1, pairingRequest: null },
    { name: 'Emily Davis', email: 'emily@example.com', handicap: 16.5, pairingRequest: null },
    { name: 'John Smith', email: 'john@example.com', handicap: 12.0, pairingRequest: null },
    { name: 'Alex Wong', email: 'alex@example.com', handicap: 5.5, pairingRequest: null },
    { name: 'Jessica Taylor', email: 'jessica@example.com', handicap: 20.3, pairingRequest: null },
    { name: 'Brian Miller', email: 'brian@example.com', handicap: 15.1, pairingRequest: null },
    { name: 'Amanda Clark', email: 'amanda@example.com', handicap: 8.9, pairingRequest: null },
    { name: 'Kevin Brown', email: 'kevin@example.com', handicap: 13.7, pairingRequest: null },
    { name: 'Rachel Green', email: 'rachel@example.com', handicap: 24.0, pairingRequest: null },
    { name: 'Daniel White', email: 'daniel@example.com', handicap: 6.8, pairingRequest: null },
    { name: 'Michelle Lee', email: 'michelle@example.com', handicap: 19.2, pairingRequest: null },
    { name: 'Justin Adams', email: 'justin@example.com', handicap: 10.4, pairingRequest: null },
  ];

  for (const mock of mockData) {
    await db.insert(registrations).values({
      tournamentId: tourneyId,
      name: mock.name,
      email: mock.email,
      handicap: mock.handicap,
      pairingRequest: mock.pairingRequest,
      paymentStatus: 'COMPLETED',
    });
  }

  console.log('Successfully seeded 20 mock registrations.');
  process.exit(0);
}

seed().catch(console.error);
