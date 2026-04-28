const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await pool.query("DELETE FROM tournaments WHERE source = 'eventbrite-apify'");
  process.exit();
}
run();
