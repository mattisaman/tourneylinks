import { db, tournaments } from '../src/lib/db';
import { isNull, isNotNull, eq, and, sql } from 'drizzle-orm';

async function main() {
  try {
    const total = await db.select({ count: sql<number>`count(*)` }).from(tournaments);
    
    const active = await db.select({ count: sql<number>`count(*)` })
      .from(tournaments)
      .where(eq(tournaments.status, 'active'));

    const pending = await db.select({ count: sql<number>`count(*)` })
      .from(tournaments)
      .where(
        and(
          eq(tournaments.status, 'active'),
          isNull(tournaments.extractedAt)
        )
      );

    const extracted = await db.select({ count: sql<number>`count(*)` })
      .from(tournaments)
      .where(
        and(
          eq(tournaments.status, 'active'),
          isNotNull(tournaments.extractedAt)
        )
      );

    const failed = await db.select({ count: sql<number>`count(*)` })
      .from(tournaments)
      .where(eq(tournaments.extractionConfidence, 0));

    const skipped = await db.select({ count: sql<number>`count(*)` })
      .from(tournaments)
      .where(eq(tournaments.extractionConfidence, 0.1));

    console.log(`Total Tournaments: ${total[0].count}`);
    console.log(`Active Tournaments: ${active[0].count}`);
    console.log(`Pending Normalization (Active & NULL extractedAt): ${pending[0].count}`);
    console.log(`Already Extracted (Active & NOT NULL extractedAt): ${extracted[0].count}`);
    console.log(`Failed (Confidence 0.0): ${failed[0].count}`);
    console.log(`Skipped/No Content (Confidence 0.1): ${skipped[0].count}`);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

main();
