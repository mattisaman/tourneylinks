import { db, tournaments } from '../lib/db';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function scrub() {
  console.log('Initiating duplicate tournament scrub...');
  const records = await db.select().from(tournaments);
  const seen = new Set();
  let deleted = 0;
  
  for (const record of records) {
    if (seen.has(record.name)) {
      await db.delete(tournaments).where(eq(tournaments.id, record.id));
      console.log(`🗑️ Deleted Duplicate: ${record.name}`);
      deleted++;
    } else {
      seen.add(record.name);
    }
  }
  console.log(`✅ Scrub complete. Removed ${deleted} duplicates.`);
  process.exit(0);
}
scrub().catch(console.error);
