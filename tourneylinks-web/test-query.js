const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres.dwzdterroiptiwlrmvoa:Sh1r3L%40n3Ass0c1%40t10nOfM3n@aws-1-us-east-1.pooler.supabase.com:5432/postgres' });
async function run() {
  const result = await pool.query(`SELECT id, name, city, state FROM courses WHERE "contactInfo" IS NOT NULL LIMIT 1;`);
  console.log(result.rows);
  process.exit(0);
}
run();
