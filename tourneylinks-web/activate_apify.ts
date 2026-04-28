import { db, tournaments } from './src/lib/db';
import { eq } from 'drizzle-orm';

async function main() {
  const result = await db.update(tournaments)
    .set({ isActive: true })
    .where(eq(tournaments.source, 'facebook-apify'));
  
  console.log(`Activated ${result.rowCount || result.length || 'many'} tournaments from Apify.`);
}
main().catch(console.error);
