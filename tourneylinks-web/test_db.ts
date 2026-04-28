import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from './src/lib/db';
import { eq } from 'drizzle-orm';

async function main() {
  const allTournaments = await db.select().from(tournaments);
  console.log(`Total tournaments in DB: ${allTournaments.length}`);
  const activeTournaments = allTournaments.filter(t => t.isActive);
  console.log(`Total active tournaments in DB: ${activeTournaments.length}`);
}

main().catch(console.error);
