import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments, courses } from './src/lib/db';
import { eq, ilike } from 'drizzle-orm';
import { mergeIfDuplicate } from './src/lib/deduplication';
import fs from 'fs';

async function main() {
  if (!fs.existsSync('apify_json_full_1')) {
    console.error('Error: apify_json_full_1 not found in the current directory.');
    return;
  }

  console.log('Reading apify_json_full_1...');
  const fileContent = fs.readFileSync('apify_json_full_1', 'utf8');
  let events;
  try {
    events = JSON.parse(fileContent);
  } catch (e) {
    console.error('Failed to parse apify_json:', e);
    return;
  }

  if (!Array.isArray(events)) {
    console.error('Expected an array of events in data.json');
    return;
  }

  let insertedCount = 0;
  let mergedCount = 0;
  let skippedCount = 0;

  console.log(`Processing ${events.length} events...`);

  for (const event of events) {
    const title = event.title || event.name || '';
    const description = event.description || '';
    const isGolf = /golf|scramble|tournament|classic/i.test(title) || /golf|scramble/i.test(description);
    const isMiniGolf = /mini\s*golf|minigolf|putt\s*putt|top\s*golf|pickle\s*ball|pickleball|tennis|clays/i.test(title) || /mini\s*golf|minigolf|putt\s*putt|top\s*golf|pickle\s*ball|pickleball/i.test(description);
    
    if (!isGolf || isMiniGolf) {
      skippedCount++;
      continue;
    }

    const sourceId = `fb_${event.id || event.url}`;
    const existing = await db.select().from(tournaments).where(eq(tournaments.sourceId, sourceId));
    if (existing.length > 0) {
      // Already exists, skip
      continue;
    }

    const countryCode = event.location?.countryCode || event['location.countryCode'] || '';
    
    if (countryCode && countryCode !== 'US') {
      skippedCount++;
      continue; // Skip non-US tournaments
    }

    let city = event.location?.city || event['location.city'] || '';
    let state = event.location?.state || event['location.state'] || '';
    let courseName = event.location?.name || event['location.name'] || 'TBD Course';

    if (city && city.includes(',')) {
      const parts = city.split(',').map(p => p.trim());
      city = parts[0];
      if (!state && parts.length > 1) {
        for (let i = 1; i < parts.length; i++) {
          const stateZipMatch = parts[i].match(/\b([A-Z]{2})\b/);
          if (stateZipMatch) {
            state = stateZipMatch[1];
            break;
          }
        }
      }
    }

    // Fallback: If city/state are empty but location.name looks like an address
    if (!city && !state && courseName.includes(',')) {
      const parts = courseName.split(',').map(p => p.trim());
      
      // Look for a state abbreviation (e.g., TX, FL, NY) or state name + zip
      for (let i = 0; i < parts.length; i++) {
        const stateZipMatch = parts[i].match(/\b([A-Z]{2})\b/);
        if (stateZipMatch) {
          state = stateZipMatch[1];
          if (i > 0) {
            city = parts[i - 1]; // Usually the part right before the state is the city
          }
          break;
        }
      }
    }

    if (!city) city = 'TBD City';
    if (!state) state = 'TBD State';

    let courseId = null;
    let courseAddress = null;

    if (courseName !== 'TBD Course') {
      let searchName = courseName.replace(/^(The |A )/i, '').trim();
      const firstWord = searchName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
      if (firstWord.length > 2) {
        const matchingCourses = await db.select().from(courses).where(ilike(courses.name, `%${firstWord}%`));
        if (matchingCourses.length > 0) {
          const stateMatch = matchingCourses.find(c => c.state === state);
          if (stateMatch) {
            courseId = stateMatch.id;
            courseAddress = stateMatch.address;
          } else if (matchingCourses.length === 1) {
            courseId = matchingCourses[0].id;
            courseAddress = matchingCourses[0].address;
          }
        }
      }
    }

    const wasMerged = await mergeIfDuplicate({
      title,
      courseCity: city,
      courseState: state,
      dateStart: event.utcStartDate || event.startDate || event.startTime || new Date().toISOString(),
      source: 'facebook-apify',
      sourceUrl: event.url || `https://facebook.com/events/${event.id}`,
      description,
      socialSignals: JSON.stringify({ interestedCount: event.usersInterested || event.interestedCount || 0, goingCount: event.usersGoing || event.goingCount || 0 })
    });

    if (wasMerged) {
      mergedCount++;
      continue;
    }

    let registrationUrl = null;
    if (description) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = description.match(urlRegex);
      if (urls && urls.length > 0) {
        const externalUrl = urls.find(u => !u.toLowerCase().includes('facebook.com'));
        if (externalUrl) registrationUrl = externalUrl;
      }
    }

    await db.insert(tournaments).values({
      name: title,
      sourceUrl: event.url || `https://facebook.com/events/${event.id}`,
      sourceId: sourceId,
      source: 'facebook-apify',
      dateStart: event.utcStartDate || event.startDate || event.startTime || new Date().toISOString(),
      dateEnd: event.endDate || event.endTime,
      courseName: courseName,
      courseId: courseId,
      courseAddress: courseAddress,
      courseCity: city,
      courseState: state,
      format: 'Scramble',
      description: description,
      registrationUrl: registrationUrl,
      socialSignals: JSON.stringify({ interestedCount: event.usersInterested || event.interestedCount || 0, goingCount: event.usersGoing || event.goingCount || 0 }),
      eventSources: JSON.stringify(['facebook-apify']),
      isActive: true,
      status: 'active',
    });
    insertedCount++;
  }

  console.log(`\n✅ Finished manual ingestion.`);
  console.log(`- Inserted: ${insertedCount}`);
  console.log(`- Merged (Duplicates skipped): ${mergedCount}`);
  console.log(`- Skipped (Not Golf related): ${skippedCount}`);
}

main().catch(console.error);
