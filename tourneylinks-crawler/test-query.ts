import { Pool } from 'pg';
const pool = new Pool({ connectionString: 'postgresql://postgres.dwzdterroiptiwlrmvoa:Sh1r3L%40n3Ass0c1%40t10nOfM3n@aws-1-us-east-1.pooler.supabase.com:5432/postgres' });

async function run() {
  try {
    const result = await pool.query(`SELECT raw_metadata FROM courses WHERE id = 18;`);
    console.log(result.rows[0].raw_metadata);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
