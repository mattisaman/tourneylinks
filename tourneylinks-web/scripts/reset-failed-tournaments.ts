import { db, tournaments } from '../src/lib/db';
import { eq } from 'drizzle-orm';

async function main() {
  try {
    const result = await db.update(tournaments)
      .set({ extractedAt: null })
      .where(eq(tournaments.extractionConfidence, 0.0));
      
    console.log(`Successfully reset failed tournaments. Please check your dashboard.`);
  } catch (err) {
    console.error("Error resetting tournaments:", err);
  }
  process.exit(0);
}

main();
