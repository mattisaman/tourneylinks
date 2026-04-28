const { Pool } = require('pg');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/DATABASE_URL="([^"]+)"/);
const dbUrl = match[1].replace('6543', '5432');

const pool = new Pool({
  connectionString: dbUrl,
});

async function run() {
  const missing = await pool.query(`SELECT count(*) FROM tournaments WHERE extracted_at IS NULL AND description IS NULL`);
  const premium = await pool.query(`SELECT count(*) FROM tournaments WHERE extracted_at IS NULL AND description IS NOT NULL`);
  console.log("Missing (Checkbacks):", missing.rows[0]);
  console.log("Need Premium:", premium.rows[0]);
  process.exit();
}
run();
