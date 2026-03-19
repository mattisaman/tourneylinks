import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from './src/lib/db';
import { sql } from 'drizzle-orm';

async function check() {
  const res = await db.execute(sql`SELECT tablename FROM pg_tables WHERE schemaname='public';`);
  console.log(res.rows);
  process.exit(0);
}
check();
