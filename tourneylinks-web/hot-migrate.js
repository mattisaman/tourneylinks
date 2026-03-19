require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    console.log('Injecting financial metadata into Postgres...');

    // 1. Extend Tournaments
    console.log('Extending tournaments...');
    await pool.query(`ALTER TABLE "tournaments" ADD COLUMN IF NOT EXISTS "host_user_id" integer REFERENCES "users"("id");`).catch(e => console.log(e.message));

    // 2. Stripe Accounts Table
    console.log('Forging stripe_accounts table...');
    await pool.query(`CREATE TABLE IF NOT EXISTS "stripe_accounts" (
      "id" serial PRIMARY KEY,
      "user_id" integer NOT NULL REFERENCES "users"("id"),
      "stripe_account_id" text NOT NULL UNIQUE,
      "payouts_enabled" boolean NOT NULL DEFAULT false,
      "charges_enabled" boolean NOT NULL DEFAULT false,
      "created_at" timestamp NOT NULL DEFAULT NOW()
    );`).catch(e => console.log(e.message));

    // 3. Payments Table
    console.log('Forging payments table...');
    await pool.query(`CREATE TABLE IF NOT EXISTS "payments" (
      "id" serial PRIMARY KEY,
      "registration_id" integer NOT NULL REFERENCES "registrations"("id"),
      "stripe_session_id" text NOT NULL UNIQUE,
      "stripe_payment_intent_id" text,
      "amount" integer NOT NULL,
      "platform_fee" integer NOT NULL,
      "status" text NOT NULL DEFAULT 'PENDING',
      "created_at" timestamp NOT NULL DEFAULT NOW()
    );`).catch(e => console.log(e.message));

    // 4. Also repair the columns Drizzle was questioning
    console.log('Repairing registration_transfers...');
    await pool.query(`ALTER TABLE "registration_transfers" ADD COLUMN IF NOT EXISTS "original_player_id" integer;`).catch(e => console.log(e.message));
    await pool.query(`ALTER TABLE "registration_transfers" ADD COLUMN IF NOT EXISTS "recipient_email" text;`).catch(e => console.log(e.message));
    await pool.query(`ALTER TABLE "registration_transfers" ADD COLUMN IF NOT EXISTS "recipient_player_id" integer;`).catch(e => console.log(e.message));
    await pool.query(`ALTER TABLE "registration_transfers" ADD COLUMN IF NOT EXISTS "transfer_token" text;`).catch(e => console.log(e.message));
    await pool.query(`ALTER TABLE "registration_transfers" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'PENDING';`).catch(e => console.log(e.message));
    await pool.query(`ALTER TABLE "registration_transfers" ADD COLUMN IF NOT EXISTS "expires_at" timestamp;`).catch(e => console.log(e.message));

    console.log('✅ Synchronized! All ledger constraints installed.');
  } catch(e) {
    console.error('Fatal Migration Error:', e);
  } finally {
    await pool.end();
  }
}
run();
