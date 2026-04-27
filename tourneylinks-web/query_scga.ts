import { config } from 'dotenv';
config({ path: './.env.local' });
import pg from 'pg';

async function run() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query("SELECT name, date_start, is_active FROM public.tournaments WHERE name ILIKE '%scga%' LIMIT 3;");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
