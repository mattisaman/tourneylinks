import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import pg from 'pg';
import { tournaments } from './pipeline/database.js';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  console.log('Seeding mock tournament data into PostgreSQL...');

  const mockTournaments = [
    {
      name: "Monroe Invitational Championship",
      sourceUrl: "https://example.com/monroe",
      sourceId: "mock_1",
      source: "manual",
      dateStart: "2024-06-14",
      dateEnd: "2024-06-17",
      courseName: "Monroe Golf Club",
      courseCity: "Pittsford",
      courseState: "NY",
      format: "Stroke Play",
      formatDetail: "72-hole Amateur Stroke Play",
      entryFee: 250.00,
      maxPlayers: 120,
      spotsRemaining: 42,
      isActive: true,
      isCharity: false,
      extractedAt: new Date().toISOString()
    },
    {
      name: "RDGA Mid-Amateur Championship",
      sourceUrl: "https://example.com/rdga",
      sourceId: "mock_2",
      source: "manual",
      dateStart: "2024-08-11",
      dateEnd: "2024-08-12",
      courseName: "Stafford Country Club",
      courseCity: "Stafford",
      courseState: "NY",
      format: "Stroke Play",
      entryFee: 130.00,
      maxPlayers: 84,
      spotsRemaining: 84, // 0 filled
      isActive: true,
      extractedAt: new Date().toISOString()
    },
    {
      name: "Cobblestone Creek Charity Scramble",
      sourceUrl: "https://example.com/cobblestone",
      sourceId: "mock_3",
      source: "manual",
      dateStart: "2024-09-08",
      courseName: "Cobblestone Creek CC",
      courseCity: "Victor",
      courseState: "NY",
      format: "4-Man Scramble",
      entryFee: 600.00,
      maxPlayers: 144, // 36 teams of 4
      spotsRemaining: 96, // 12/36 teams filled = 48 players registered
      isActive: true,
      isCharity: true,
      extractedAt: new Date().toISOString()
    }
  ];

  try {
    for (const t of mockTournaments) {
        // Just directly insert, ignoring potential conflicts for this simple seed script
        await db.insert(tournaments).values({
            ...t,
        });
    }
    console.log('Mock data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await pool.end();
  }
}

seed();
