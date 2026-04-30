import { db, tournaments } from '../src/lib/db';
import { eq } from 'drizzle-orm';

async function main() {
  console.log("Resetting failed tournaments in real Supabase database...");
  await db.update(tournaments)
    .set({
      extractedAt: null,
      extractionConfidence: 0
    })
    .where(eq(tournaments.extractionConfidence, 0));
  
  console.log("Successfully reset 176 failed tournaments back to the pending queue!");
  process.exit(0);
}
main();
