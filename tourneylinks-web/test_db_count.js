const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const res = await pool.query("SELECT COUNT(*) FROM tournaments WHERE source = 'eventbrite-apify'");
  console.log(`Eventbrite items in DB: ${res.rows[0].count}`);
  
  const res2 = await pool.query("SELECT COUNT(*) FROM tournaments WHERE source = 'facebook-apify'");
  console.log(`Facebook items in DB: ${res2.rows[0].count}`);
  process.exit();
}
run();
