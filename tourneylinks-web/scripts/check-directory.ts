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
      source: tournaments.source,
      extractionConfidence: tournaments.extractionConfidence
  }).from(tournaments).where(sql`${tournaments.status} = 'active'`);
  
  let validDate = 0;
  let futureDate = 0;
  let nyState = 0;
  let rochesterArea = 0;

  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  for (const t of rows) {
      if (t.state && (t.state.toLowerCase() === 'ny' || t.state.toLowerCase() === 'new york')) nyState++;
      if (t.city && (t.city.toLowerCase() === 'rochester' || t.city.toLowerCase() === 'victor' || t.city.toLowerCase() === 'pittsford')) rochesterArea++;

      if (t.dateStart) {
          const d = new Date(t.dateStart);
          if (!isNaN(d.getTime())) {
              validDate++;
              if (d >= todayAtMidnight) futureDate++;
          }
      }
  }

  console.log(`Total Active: ${rows.length}`);
  console.log(`Valid Dates: ${validDate}`);
  console.log(`Future Dates: ${futureDate}`);
  console.log(`NY State: ${nyState}`);
  console.log(`Rochester Area (City Name Match): ${rochesterArea}`);
  process.exit(0);
}
main();
