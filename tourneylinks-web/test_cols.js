const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL.replace('6543', '5432');

const pool = new Pool({
  connectionString: dbUrl,
});

async function run() {
  const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='tournaments';");
  console.log(res.rows.map(r => r.column_name).join(', '));
  process.exit();
}
run();
