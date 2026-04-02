import { db, tournaments } from './src/lib/db';
import { ne, isNull, eq } from 'drizzle-orm';

async function probe() {
  const allT = await db.select({ id: tournaments.id, name: tournaments.name, source: tournaments.source }).from(tournaments);
  console.log('TOTAL PROD TOURNAMENTS:', allT.length);

  const weirdT = allT.filter(t => t.source !== 'scraped' && t.name !== 'Pebble Beach Golf Links');
  console.log('\nMANUALLY CREATED (NON-SCRAPED) ANOMALIES:');
  console.table(weirdT);
  
  process.exit(0);
}

probe();
