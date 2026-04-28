const { Pool } = require('pg');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/DATABASE_URL="([^"]+)"/);
const dbUrl = match[1].replace('6543', '5432');

const pool = new Pool({
  connectionString: dbUrl,
});

async function run() {
  await pool.query(`
    ALTER TABLE "courses" 
    ADD COLUMN IF NOT EXISTS "normalized_rules" text,
    ADD COLUMN IF NOT EXISTS "normalized_faq" jsonb,
    ADD COLUMN IF NOT EXISTS "original_document_urls" jsonb;
  `);
  console.log("Course documentation columns added.");
  process.exit();
}
run();
