import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from './src/lib/db';
import { eq, desc } from 'drizzle-orm';

async function main() {
  const events = await db.select({
    name: tournaments.name,
    createdAt: tournaments.createdAt,
    source: tournaments.source
  })
  .from(tournaments)
  .where(eq(tournaments.source, 'facebook-apify'))
  .orderBy(desc(tournaments.createdAt))
  .limit(5);
  
  console.log(events);
}
main().catch(console.error);
