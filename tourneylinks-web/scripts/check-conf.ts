import { db, tournaments } from '../src/lib/db';
import { sql } from 'drizzle-orm';
async function main() {
  const result = await db.execute(sql`SELECT extraction_confidence, count(*) FROM tournaments WHERE "extracted_at" IS NOT NULL AND status = 'active' GROUP BY extraction_confidence`);
  console.log(result.rows);
  process.exit(0);
}
main();
