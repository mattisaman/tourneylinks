const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const res = await pool.query("SELECT COUNT(*) FROM tournaments WHERE registration_url LIKE '%eventbrite.com%'");
  console.log(`Tournaments with Eventbrite Registration URL: ${res.rows[0].count}`);
  
  process.exit();
}
run();
