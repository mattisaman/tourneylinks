import { config } from 'dotenv';
config({ path: './.env.local' });
import { db } from './src/lib/db.ts';
import { sql } from 'drizzle-orm';

async function run() {
  const result = await db.execute(sql`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('information_schema', 'pg_catalog');
  `);
  
  console.log(JSON.stringify(result.rows, null, 2));
  process.exit(0);
}
run().catch(console.error);
