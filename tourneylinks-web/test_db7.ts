import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from './src/lib/db';
import { ilike } from 'drizzle-orm';

async function main() {
  const t = await db.select().from(tournaments).where(ilike(tournaments.name, '%Carolinas%'));
  console.log(`Found ${t.length} Carolinas tournaments`);
}

main().catch(console.error);
