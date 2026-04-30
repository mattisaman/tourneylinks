import { db, tournaments } from '../src/lib/db';
import { isNull, sql } from 'drizzle-orm';

async function main() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingAll = await db.select({ count: sql<number>`count(*)` })
      .from(tournaments)
      .where(isNull(tournaments.extractedAt));

    const pendingValid = await db.select({ count: sql<number>`count(*)` })
      .from(tournaments)
      .where(sql`${tournaments.extractedAt} IS NULL AND ${tournaments.status} = 'active' AND ${tournaments.dateStart} >= ${today.toISOString()}`);

    const pendingNullDates = await db.select({ count: sql<number>`count(*)` })
      .from(tournaments)
      .where(sql`${tournaments.extractedAt} IS NULL AND ${tournaments.dateStart} IS NULL`);

    const pendingPastDates = await db.select({ count: sql<number>`count(*)` })
      .from(tournaments)
      .where(sql`${tournaments.extractedAt} IS NULL AND ${tournaments.dateStart} < ${today.toISOString()}`);

    console.log(`Total Pending (Dashboard): ${pendingAll[0].count}`);
    console.log(`Valid for API (dateStart >= today): ${pendingValid[0].count}`);
    console.log(`Blocked by API (dateStart IS NULL): ${pendingNullDates[0].count}`);
    console.log(`Blocked by API (dateStart < today): ${pendingPastDates[0].count}`);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

main();
