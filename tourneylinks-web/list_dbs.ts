import { config } from 'dotenv';
config({ path: './.env.local' });
import { db } from './src/lib/db.ts';
import { sql } from 'drizzle-orm';

async function run() {
  const result = await db.execute(sql`
    SELECT datname FROM pg_database;
  `);
  
  console.log(JSON.stringify(result.rows, null, 2));
  process.exit(0);
}
run().catch(console.error);
