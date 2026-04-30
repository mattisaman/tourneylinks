import { db, tournaments } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  const result = await db.execute(sql`SELECT count(*) FROM tournaments WHERE "extractedAt" IS NULL`);
  console.log('Raw count:', result);
  process.exit(0);
}
main();
