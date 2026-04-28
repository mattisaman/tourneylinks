import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from './src/lib/db';
import { eq, and, sql, notInArray, asc } from 'drizzle-orm';

async function main() {
  const rows = await db.select().from(tournaments)
    .where(and(
      eq(tournaments.isActive, true),
      notInArray(tournaments.source, ['state-associations', 'usga-events']),
      sql`${tournaments.formatDetails} NOT LIKE '%Sanctioned/Pro%' OR ${tournaments.formatDetails} IS NULL`
    ))
    .orderBy(asc(tournaments.dateStart));
    
  console.log(`Rows from DB before date filtering: ${rows.length}`);
  
  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  const filtered = rows.filter((t) => {
    if (!t.dateStart) return false;
    const parsedDate = new Date(t.dateStart);
    if (isNaN(parsedDate.getTime())) return false;
    return parsedDate >= todayAtMidnight;
  });
  
  console.log(`Rows after date filtering: ${filtered.length}`);
  
  // also let's just see how many facebook-apify events we have in total
  const apify = await db.select().from(tournaments).where(eq(tournaments.source, 'facebook-apify'));
  console.log(`Total facebook-apify events in DB: ${apify.length}`);
}

main().catch(console.error);
