const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL.replace('6543', '5432');

const pool = new Pool({
  connectionString: dbUrl,
});

async function run() {
  await pool.query('ALTER TABLE "tournaments" ADD COLUMN IF NOT EXISTS "raw_description" text;');
  console.log("Column added via direct port.");
  process.exit();
}
run();
