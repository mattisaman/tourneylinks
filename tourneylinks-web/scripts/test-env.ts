import { db, tournaments } from '../src/lib/db';
import { sql } from 'drizzle-orm';
async function main() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.extractedAt} IS NULL AND ${tournaments.status} = 'active'`);
  const total = await db.select({ count: sql<number>`count(*)` }).from(tournaments).where(sql`${tournaments.status} = 'active'`);
  console.log('TSX count:', result[0].count, total[0].count);
  console.log('TSX DB:', process.env.DATABASE_URL?.substring(0, 30));
  process.exit(0);
}
main();
