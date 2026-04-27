import { config } from 'dotenv';
config({ path: './.env.local' });
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { sql } from 'drizzle-orm';

async function run() {
  const url = process.env.DATABASE_URL!.replace('/postgres', '/teetime');
  const pool = new pg.Pool({ connectionString: url });
  const db = drizzle(pool);
  
  const result = await db.execute(sql`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('information_schema', 'pg_catalog');
  `);
  
  console.log(JSON.stringify(result.rows, null, 2));
  process.exit(0);
}
run().catch(console.error);
