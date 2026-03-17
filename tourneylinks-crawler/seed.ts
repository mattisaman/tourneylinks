import 'dotenv/config';
import { insertTournament } from './src/pipeline/database.js';

async function seed() {
  console.log('Seeding initial tournaments...');
  
  const mockTournaments = [
    {
      name: 'Pacific Coast Amateur Championship',
      sourceUrl: 'https://example.com/pca',
      sourceId: 'mock-1',
      source: 'MockAgent',
      dateStart: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], // 30 days from now
      courseName: 'Chambers Bay Golf Course',
      courseCity: 'University Place',
      courseState: 'WA',
      format: 'Stroke Play',
      entryFee: 350,
      maxPlayers: 144,
      spotsRemaining: 12,
      description: 'The Pacific Coast Amateur Championship is one of the premier amateur events in the United States, featuring a world-class field competing at the stunning Chambers Bay.',
      includes: '- 3 rounds of tournament golf\n- Practice round\n- Player gift package\n- Awards dinner',
      isActive: true,
      extractionConfidence: 0.99,
      extractedAt: new Date().toISOString()
    },
    {
      name: 'Northwest Charity Scramble',
      sourceUrl: 'https://example.com/nwcs',
      sourceId: 'mock-2',
      source: 'MockAgent',
      dateStart: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0], // 15 days from now
      courseName: 'Sahalee Country Club',
      courseCity: 'Sammamish',
      courseState: 'WA',
      format: '4-Man Scramble',
      isCharity: true,
      entryFee: 150,
      maxPlayers: 120,
      spotsRemaining: 30,
      description: 'Join us for a fun day of golf supporting local youth programs. Great prizes, food, and drinks provided.',
      includes: '- 18 holes of golf with cart\n- Lunch and Dinner\n- Hole-in-one contests\n- Raffle tickets',
      isActive: true,
      extractionConfidence: 0.95,
      extractedAt: new Date().toISOString()
    }
  ];

  try {
    for (const t of mockTournaments) {
        // @ts-ignore
        await insertTournament(t);
        console.log(`Inserted: ${t.name}`);
    }
    console.log('Seeding complete.');
  } catch (e) {
      console.error('Error seeding:', e);
  }
  process.exit(0);
}

seed();
