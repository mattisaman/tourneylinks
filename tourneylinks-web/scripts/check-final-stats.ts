import { db, tournaments } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const total = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.status} = 'active'`);
    const pending = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NULL AND ${tournaments.status} = 'active'`);
    const success = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NOT NULL AND ${tournaments.extractionConfidence} = 1.0 AND ${tournaments.status} = 'active'`);
    const skipped = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NOT NULL AND ${tournaments.extractionConfidence} = 0.1 AND ${tournaments.status} = 'active'`);
    const failed = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NOT NULL AND ${tournaments.extractionConfidence} = 0.0 AND ${tournaments.status} = 'active'`);

    console.log(`Active Tournaments: ${total[0].count}`);
    console.log(`Pending: ${pending[0].count}`);
    console.log(`Successfully Normalized (1.0): ${success[0].count}`);
    console.log(`Skipped / No Content (0.1): ${skipped[0].count}`);
    console.log(`Failed / 503 Overloaded (0.0): ${failed[0].count}`);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
main();
