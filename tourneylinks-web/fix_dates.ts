import { config } from 'dotenv';
config({ path: '.env.local' });
import fs from 'fs';
import { db, tournaments } from './src/lib/db';
import { eq, inArray } from 'drizzle-orm';

async function main() {
  const fileContent = fs.readFileSync('apify_json', 'utf8');
  const events = JSON.parse(fileContent);
  
  const all = await db.select().from(tournaments).where(eq(tournaments.source, 'facebook-apify'));
  let fixed = 0;
  for (const t of all) {
    if (!t.dateStart) continue;
    const d = new Date(t.dateStart);
    if (isNaN(d.getTime())) {
      // Find this event in the JSON
      const apifyEvent = events.find((e: any) => `fb_${e.id || e.url}` === t.sourceId);
      if (apifyEvent && apifyEvent.utcStartDate) {
         await db.update(tournaments)
           .set({ dateStart: apifyEvent.utcStartDate })
           .where(eq(tournaments.id, t.id));
         fixed++;
      } else {
         // Fallback to end date or just ignore, or parse the string manually
         console.log(`Could not fix: ${t.sourceId} - ${t.dateStart}`);
      }
    }
  }
  console.log(`Fixed ${fixed} tournament dates.`);
}

main().catch(console.error);
