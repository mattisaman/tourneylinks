const { Pool } = require('pg');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/DATABASE_URL="([^"]+)"/);
const dbUrl = match[1];

const pool = new Pool({
  connectionString: dbUrl,
});

async function run() {
  await pool.query('ALTER TABLE "tournaments" ADD COLUMN IF NOT EXISTS "raw_description" text;');
  console.log("Column added manually parsing env file.");
  process.exit();
}
run();
