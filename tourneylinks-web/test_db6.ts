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
    
  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  const filtered = rows.filter((t) => {
    if (!t.dateStart) return false;
    const parsedDate = new Date(t.dateStart);
    if (isNaN(parsedDate.getTime())) return false;
    return parsedDate >= todayAtMidnight;
  });
  
  console.log(`First 5 tournaments:`);
  for (let i=0; i<Math.min(5, filtered.length); i++) {
     console.log(filtered[i].name);
  }
}

main().catch(console.error);
