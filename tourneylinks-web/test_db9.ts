import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from './src/lib/db';
import { eq } from 'drizzle-orm';

async function main() {
  const all = await db.select().from(tournaments).where(eq(tournaments.source, 'facebook-apify'));
  console.log(`Total facebook-apify events in Supabase: ${all.length}`);
}

main().catch(console.error);
