import { db, tournaments } from '../src/lib/db';
import { sql } from 'drizzle-orm';
async function main() {
  const total = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.status} = 'active'`);
  const pending = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NULL AND ${tournaments.status} = 'active'`);
  const failed = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NOT NULL AND ${tournaments.extractionConfidence} = 0.0 AND ${tournaments.status} = 'active'`);
  const skipped = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NOT NULL AND ${tournaments.extractionConfidence} = 0.1 AND ${tournaments.status} = 'active'`);
  const successful = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NOT NULL AND ${tournaments.extractionConfidence} = 1.0 AND ${tournaments.status} = 'active'`);
  
  console.log(`Active Tournaments: ${total[0].count}`);
  console.log(`Pending: ${pending[0].count}`);
  console.log(`Failed (0.0): ${failed[0].count}`);
  console.log(`Skipped (0.1): ${skipped[0].count}`);
  console.log(`Successfully Normalized (1.0): ${successful[0].count}`);
  process.exit(0);
}
main();
