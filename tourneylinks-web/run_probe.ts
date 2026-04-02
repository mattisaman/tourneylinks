import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { isNull, eq } from 'drizzle-orm';

const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://postgres.dwzdterroiptiwlrmvoa:Sh1r3L%40n3Ass0c1%40t10nOfM3n@aws-1-us-east-1.pooler.supabase.com:6543/postgres' });
const db = drizzle(pool);

const tournaments = pgTable('tournaments', {
  id: serial('id').primaryKey(),
  name: text('name'),
  source: text('source')
});

async function probe() {
  const allT = await db.select().from(tournaments).limit(50);
  console.log('Production Tournaments:');
  console.table(allT);
  process.exit(0);
}

probe();
