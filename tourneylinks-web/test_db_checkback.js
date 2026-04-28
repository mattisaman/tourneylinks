const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL.replace('6543', '5432');
const pool = new Pool({ connectionString: dbUrl });

async function run() {
  const res = await pool.query("SELECT id, name, description, entry_fee FROM tournaments WHERE source = 'eventbrite-apify' ORDER BY id DESC LIMIT 5");
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit();
}
run();
