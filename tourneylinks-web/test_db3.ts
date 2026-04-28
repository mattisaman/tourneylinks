import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from './src/lib/db';
import { eq } from 'drizzle-orm';

async function main() {
  const all = await db.select().from(tournaments).where(eq(tournaments.source, 'facebook-apify'));
  let pastCount = 0;
  let futureCount = 0;
  
  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  for (const t of all) {
    if (!t.dateStart) {
        pastCount++; continue;
    }
    const d = new Date(t.dateStart);
    if (d < todayAtMidnight) {
        pastCount++;
    } else {
        futureCount++;
    }
  }
  
  console.log(`Past: ${pastCount}, Future: ${futureCount}`);
}

main().catch(console.error);
