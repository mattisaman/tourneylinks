import { db, tournaments } from './src/lib/db';
import { eq } from 'drizzle-orm';

async function main() {
  const all = await db.select().from(tournaments).where(eq(tournaments.source, 'facebook-apify'));
  console.log(`Found ${all.length} tournaments from Apify.`);
}
main().catch(console.error);
