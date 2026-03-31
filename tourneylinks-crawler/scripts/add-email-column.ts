import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  console.log('Adding email column to courses table safely...');
  await pool.query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS email text');
  console.log('Done!');
  process.exit(0);
}

run().catch(console.error);
