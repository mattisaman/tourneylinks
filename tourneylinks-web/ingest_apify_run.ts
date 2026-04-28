import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from './src/lib/db';
import { eq } from 'drizzle-orm';
import { mergeIfDuplicate } from './src/lib/deduplication';

async function main() {
  const apifyToken = process.env.APIFY_API_TOKEN;
  if (!apifyToken) throw new Error("Missing APIFY_API_TOKEN");

  const datasetId = 'bAHTraM8Po4jCcHYp';
  console.log(`Fetching dataset ${datasetId}...`);
  const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}`;
  const datasetRes = await fetch(datasetUrl);
  
  if (!datasetRes.ok) {
    console.error('Failed to fetch dataset', await datasetRes.text());
    return;
  }

  const events = await datasetRes.json();
  let insertedCount = 0;
  let mergedCount = 0;
  let skippedCount = 0;

  for (const event of events) {
    const title = event.title || event.name || '';
    const description = event.description || '';
    const isGolf = /golf|scramble|tournament|classic/i.test(title) || /golf|scramble/i.test(description);
    
    if (!isGolf) {
      skippedCount++;
      continue;
    }

    const sourceId = `fb_${event.id || event.url}`;
    const existing = await db.select().from(tournaments).where(eq(tournaments.sourceId, sourceId));
    if (existing.length > 0) {
      continue;
    }

    const location = event.location || {};
    const city = location.city || 'TBD City';
    const state = location.state || 'TBD State';

    const wasMerged = await mergeIfDuplicate({
      title,
      courseCity: city,
      courseState: state,
      dateStart: event.startDate || event.startTime || new Date().toISOString(),
      source: 'facebook-apify',
      sourceUrl: event.url || `https://facebook.com/events/${event.id}`,
      description,
      socialSignals: JSON.stringify({ interestedCount: event.interestedCount || 0, goingCount: event.goingCount || 0 })
    });

    if (wasMerged) {
      mergedCount++;
      continue;
    }

    await db.insert(tournaments).values({
      name: title,
      sourceUrl: event.url || `https://facebook.com/events/${event.id}`,
      sourceId: sourceId,
      source: 'facebook-apify',
      dateStart: event.startDate || event.startTime || new Date().toISOString(),
      dateEnd: event.endDate || event.endTime,
      courseName: location.name || 'TBD Course',
      courseCity: city,
      courseState: state,
      format: 'Scramble',
      description: description,
      socialSignals: JSON.stringify({ interestedCount: event.interestedCount || 0, goingCount: event.goingCount || 0 }),
      eventSources: JSON.stringify(['facebook-apify']),
      isActive: true,
      status: 'active',
    });
    insertedCount++;
  }

  console.log(`Finished processing. Inserted: ${insertedCount}, Merged: ${mergedCount}, Skipped (Not Golf): ${skippedCount}`);
}

main().catch(console.error);
