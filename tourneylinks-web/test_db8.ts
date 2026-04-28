import { config } from 'dotenv';
config({ path: '.env.local' });
import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const res = await pool.query("SELECT name, source FROM tournaments WHERE name ILIKE '%Carolinas%'");
  console.log(res.rows);
  const count = await pool.query("SELECT COUNT(*) FROM tournaments");
  console.log(`Total count in pg: ${count.rows[0].count}`);
  await pool.end();
}

main().catch(console.error);
