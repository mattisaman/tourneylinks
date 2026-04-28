import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from './src/lib/db';
import { eq } from 'drizzle-orm';

async function main() {
  const all = await db.select().from(tournaments).where(eq(tournaments.source, 'facebook-apify'));
  let unparseable = 0;
  for (const t of all) {
    if (!t.dateStart) continue;
    const d = new Date(t.dateStart);
    if (isNaN(d.getTime())) {
        unparseable++;
        if (unparseable < 5) console.log(t.dateStart);
    }
  }
  console.log(`Unparseable: ${unparseable}`);
}

main().catch(console.error);
