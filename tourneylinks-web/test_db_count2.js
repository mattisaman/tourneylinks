const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL.replace('6543', '5432');
const pool = new Pool({ connectionString: dbUrl });

async function run() {
  const res = await pool.query("SELECT COUNT(*) FROM tournaments WHERE source = 'eventbrite-apify'");
  console.log(`Eventbrite items in DB: ${res.rows[0].count}`);
  process.exit();
}
run();
