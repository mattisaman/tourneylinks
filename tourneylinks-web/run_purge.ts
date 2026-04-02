import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { isNull, eq } from 'drizzle-orm';

const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://postgres.dwzdterroiptiwlrmvoa:Sh1r3L%40n3Ass0c1%40t10nOfM3n@aws-1-us-east-1.pooler.supabase.com:6543/postgres' });
const db = drizzle(pool);

const tournaments = pgTable('tournaments', {
  id: serial('id').primaryKey(),
  name: text('name'),
  source: text('source')
});

async function purge() {
  console.log('Connecting to Live Production Cluster...');
  
  // Find all manually created test tournaments where source is null or empty.
  const anomalies = await db.select().from(tournaments).where(
      isNull(tournaments.source)
  );
  
  if (anomalies.length > 0) {
      console.log(`Found ${anomalies.length} manual test records. Deleting...`);
      for (const anomaly of anomalies) {
          console.log(`- Deleting: ${anomaly.name}`);
          await db.delete(tournaments).where(eq(tournaments.id, anomaly.id));
      }
      console.log('Production Database completely purified!');
  } else {
      console.log('No manual test anomalies found. Production is pure.');
  }

  process.exit(0);
}

purge();
