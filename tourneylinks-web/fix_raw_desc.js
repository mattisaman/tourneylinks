const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await pool.query('ALTER TABLE "tournaments" ADD COLUMN IF NOT EXISTS "raw_description" text;');
  console.log("Column added.");
  process.exit();
}
run();
