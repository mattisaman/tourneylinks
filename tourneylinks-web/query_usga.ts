import { config } from 'dotenv';
config({ path: './.env.local' });
import pg from 'pg';

async function run() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query("SELECT id, name, source_url FROM public.tournaments WHERE source_url LIKE '%lakewood-club-ekwanok%';");
    console.log("Found:", JSON.stringify(res.rows, null, 2));
    
    const res2 = await pool.query("SELECT id, url, tournaments_found FROM public.crawl_logs WHERE url LIKE '%lakewood-club-ekwanok%';");
    console.log("Log:", JSON.stringify(res2.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
