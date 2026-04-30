import { db, tournaments } from '../src/lib/db';
import { sql } from 'drizzle-orm';
async function main() {
  const rows = await db.select({
      id: tournaments.id,
      name: tournaments.name,
      dateStart: tournaments.dateStart,
      city: tournaments.courseCity,
      state: tournaments.courseState,
      zip: tournaments.courseZip,
      status: tournaments.status,
  }).from(tournaments).where(sql`${tournaments.status} = 'active'`);
  
  let rochesterCount = 0;
  let futureRochester = 0;

  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  for (const t of rows) {
      if (t.city && (t.city.toLowerCase() === 'rochester' || t.city.toLowerCase() === 'victor' || t.city.toLowerCase() === 'pittsford')) {
          rochesterCount++;
          if (t.dateStart) {
              const d = new Date(t.dateStart);
              if (!isNaN(d.getTime()) && d >= todayAtMidnight) {
                  futureRochester++;
              }
          }
      }
  }

  console.log(`Rochester Area Total: ${rochesterCount}`);
  console.log(`Rochester Area Future: ${futureRochester}`);
  process.exit(0);
}
main();
