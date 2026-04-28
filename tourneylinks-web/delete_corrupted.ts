import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from './src/lib/db';
import { eq } from 'drizzle-orm';

async function main() {
  const result = await db.delete(tournaments).where(eq(tournaments.source, 'facebook-apify'));
  console.log(`Deleted corrupted facebook-apify events`);
}

main().catch(console.error);
