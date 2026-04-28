import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from './src/lib/db';
import { like, or } from 'drizzle-orm';

async function main() {
  const deleted = await db.delete(tournaments).where(
    or(
      like(tournaments.name, '%mini golf%'),
      like(tournaments.name, '%Mini Golf%'),
      like(tournaments.name, '%Putt Putt%'),
      like(tournaments.name, '%Pickleball%'),
      like(tournaments.name, '%Tennis%')
    )
  ).returning();
  console.log("Deleted", deleted.length, "tournaments");
}

main().catch(console.error);
