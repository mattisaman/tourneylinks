import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  const res = await client.query('SELECT name, is_active, date_start FROM tournaments ORDER BY created_at DESC LIMIT 3;');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
run().catch(console.error);
