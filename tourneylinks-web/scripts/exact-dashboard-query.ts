import { db, tournaments } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NULL AND ${tournaments.status} = 'active'`);
    console.log(`Dashboard query result: ${res[0].count}`);

    const all = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.status} = 'active'`);
    console.log(`All active tournaments: ${all[0].count}`);

    const extracted = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NOT NULL AND ${tournaments.status} = 'active'`);
    console.log(`Already extracted: ${extracted[0].count}`);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
main();
