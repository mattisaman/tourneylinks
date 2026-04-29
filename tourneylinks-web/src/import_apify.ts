import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments, courses } from './lib/db';
import { eq, ilike } from 'drizzle-orm';
import { mergeIfDuplicate } from './lib/deduplication';
import fs from 'fs';

async function main() {
  const filePath = 'src/apify_4_29';
  if (!fs.existsSync(filePath)) {
    console.error(`Error: ${filePath} not found.`);
    return;
  }

  console.log(`Reading ${filePath}...`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  let events: any[] = [];
  
  function extractObjects(str: string) {
    const objects = [];
    let depth = 0;
    let currentStart = -1;
    let inString = false;
    let escape = false;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '{') {
          if (depth === 0) currentStart = i;
          depth++;
        } else if (char === '}') {
          depth--;
          if (depth === 0 && currentStart !== -1) {
            objects.push(str.substring(currentStart, i + 1));
            currentStart = -1;
          }
        }
      }
    }
    return objects;
  }

  try {
    const rawObjects = extractObjects(fileContent);
    console.log(`Found ${rawObjects.length} objects.`);
    for (const raw of rawObjects) {
       try {
          events.push(JSON.parse(raw));
       } catch (e) {
          // skip malformed individual objects
       }
    }
  } catch (e) {
    console.error('Extraction failed:', e);
    return;
  }

  if (events.length === 0) {
    console.error('No events found.');
    return;
  }

  let insertedCount = 0;
  let mergedCount = 0;
  let needsReviewCount = 0;
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

    const sourceUrl = event.url || event.ticketUrl || `https://facebook.com/events/${event.id}`;
    const isEventbrite = sourceUrl.toLowerCase().includes('eventbrite.com');
    const sourceString = isEventbrite ? 'eventbrite-apify' : 'facebook-apify';
    const sourceId = isEventbrite ? `eb_${event.id || sourceUrl}` : `fb_${event.id || sourceUrl}`;
    
    const existing = await db.select().from(tournaments).where(eq(tournaments.sourceId, sourceId));
    if (existing.length > 0) {
      mergedCount++;
      continue;
    }

    let city = 'TBD City';
    let state = 'TBD State';
    let courseName = 'TBD Course';
    
    if (isEventbrite) {
      courseName = event.venue?.name || event.location?.name || event.location?.address?.name || 'TBD Course';
      city = event.venue?.city || event.venue?.address?.city || event.location?.address?.addressLocality || event.location?.city || '';
      state = event.venue?.state || event.venue?.region || event.venue?.address?.region || event.location?.address?.addressRegion || event.location?.state || '';
      const country = event.venue?.country || event.venue?.address?.country || event.location?.address?.addressCountry || '';
      if (country && country !== 'US' && country !== 'United States') {
        skippedCount++;
        continue;
      }
      if (!state && typeof event.location === 'string' && event.location.includes(',')) {
         const parts = event.location.split(',').map((p:string) => p.trim());
         if (parts.length >= 2 && parts[1].length === 2 && parts[1] !== 'US') {
           state = parts[1];
         }
      }
    } else {
      const location = event.location || {};
      const countryCode = location.countryCode || event['location.countryCode'] || '';
      if (countryCode && countryCode !== 'US') {
        skippedCount++;
        continue;
      }
      city = location.city || event['location.city'] || '';
      state = location.state || event['location.state'] || '';
      courseName = location.name || event['location.name'] || 'TBD Course';

      if (city && city.includes(',')) {
        const parts = city.split(',').map((p: string) => p.trim());
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

      if (!city && !state && courseName.includes(',')) {
        const parts = courseName.split(',').map((p: string) => p.trim());
        for (let i = 0; i < parts.length; i++) {
          const stateZipMatch = parts[i].match(/\b([A-Z]{2})\b/);
          if (stateZipMatch) {
            state = stateZipMatch[1];
            if (i > 0) city = parts[i - 1];
            break;
          }
        }
      }
    }

    if (!city) city = 'TBD City';
    if (!state) state = 'TBD State';

    const socialSignals = JSON.stringify({
      interestedCount: event.usersInterested || event.interestedCount || 0,
      goingCount: event.usersGoing || event.goingCount || 0,
    });

    const mergeResult = await mergeIfDuplicate({
      title,
      courseName,
      courseCity: city,
      courseState: state,
      dateStart: event.utcStartDate || event.startDate || event.startTime || new Date().toISOString(),
      source: sourceString,
      sourceUrl,
      description,
      socialSignals
    });

    if (mergeResult.isMerged) {
      mergedCount++;
      continue;
    }

    let registrationUrl = null;
    if (description) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = description.match(urlRegex);
      if (urls && urls.length > 0) {
        const externalUrl = urls.find((u:string) => !u.toLowerCase().includes('facebook.com'));
        if (externalUrl) registrationUrl = externalUrl;
      }
    }

    await db.insert(tournaments).values({
      name: title,
      sourceUrl,
      sourceId,
      source: sourceString,
      dateStart: event.utcStartDate || event.startDate || event.startTime || new Date().toISOString(),
      dateEnd: event.endDate || event.endTime,
      courseName,
      courseCity: city,
      courseState: state,
      format: 'Scramble',
      description,
      registrationUrl: isEventbrite ? sourceUrl : registrationUrl,
      socialSignals,
      eventSources: JSON.stringify([sourceString]),
      isActive: mergeResult.needsReview ? false : true,
      status: mergeResult.needsReview ? 'needs_review' : 'active',
    });
    
    if (mergeResult.needsReview) {
       needsReviewCount++;
    } else {
       insertedCount++;
    }
  }

  console.log(`\n✅ Finished manual ingestion.`);
  console.log(`- Inserted Active: ${insertedCount}`);
  console.log(`- Sent to Review: ${needsReviewCount}`);
  console.log(`- Merged/Duplicates: ${mergedCount}`);
  console.log(`- Skipped (Irrelevant): ${skippedCount}`);
}

main().catch(console.error);
