import { db, tournaments, crawlLogs } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { mergeIfDuplicate } from '@/lib/deduplication';

export async function processApifyDataset(datasetId: string, apifyToken: string) {
  console.log(`[Apify Ingestion] Starting processing for dataset: ${datasetId}`);
  const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}`;
  const datasetRes = await fetch(datasetUrl);
  
  if (!datasetRes.ok) {
    console.error('[Apify Ingestion] Failed to fetch dataset from Apify:', await datasetRes.text());
    return { success: false, error: 'Failed to fetch dataset from Apify' };
  }

  const events = await datasetRes.json();
  let insertedCount = 0;
  let duplicatesSkipped = 0;
  let newTitles: string[] = [];

  for (const event of events) {
    try {
      const title = event.title || event.name || '';
      const description = event.description || '';
      const isGolf = /golf|scramble|tournament|classic/i.test(title) || /golf|scramble/i.test(description);
      const isMiniGolf = /mini\s*golf|minigolf|putt\s*putt|top\s*golf|pickle\s*ball|pickleball|tennis|clays/i.test(title) || /mini\s*golf|minigolf|putt\s*putt|top\s*golf|pickle\s*ball|pickleball/i.test(description);
      
      if (!isGolf || isMiniGolf) continue;

      const sourceUrl = event.url || event.ticketUrl || `https://facebook.com/events/${event.id}`;
      const isEventbrite = sourceUrl.toLowerCase().includes('eventbrite.com');
      const sourceString = isEventbrite ? 'eventbrite-apify' : 'facebook-apify';
      const sourceId = isEventbrite ? `eb_${event.id || sourceUrl}` : `fb_${event.id || sourceUrl}`;
      
      const existing = await db.select().from(tournaments).where(eq(tournaments.sourceId, sourceId));
      if (existing.length > 0) {
        duplicatesSkipped++;
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
        if (country && country !== 'US' && country !== 'United States') continue; 
        
        if (!state && typeof event.location === 'string' && event.location.includes(',')) {
           const parts = event.location.split(',').map((p:string) => p.trim());
           if (parts.length >= 2 && parts[1].length === 2 && parts[1] !== 'US') {
             state = parts[1];
           }
        }
      } else {
        const location = event.location || {};
        const countryCode = location.countryCode || event['location.countryCode'] || '';
        if (countryCode && countryCode !== 'US') continue;

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

      let entryFee = null;
      if (isEventbrite) {
        if (event.ticketPrice && event.ticketPrice !== 'Free') {
          const match = event.ticketPrice.match(/[\d,.]+/);
          if (match) entryFee = parseFloat(match[0].replace(/,/g, ''));
        } else if (event.tickets && Array.isArray(event.tickets)) {
          const individualTicket = event.tickets.find((t: any) => t.name && (t.name.toLowerCase().includes('individual') || t.name.toLowerCase().includes('single')));
          if (individualTicket && individualTicket.cost && individualTicket.cost.value) {
             entryFee = individualTicket.cost.value / 100;
          }
        }
      }

      const resolvedStartDate = event.startAt || event.utcStartDate || event.startDate || event.startTime || event.start?.utc || new Date().toISOString();

      const wasMerged = await mergeIfDuplicate({
        title,
        courseCity: city,
        courseState: state,
        dateStart: resolvedStartDate,
        source: sourceString,
        sourceUrl: sourceUrl,
        description,
        socialSignals
      });

      if (wasMerged) {
        duplicatesSkipped++;
        continue;
      }

      let registrationUrl = isEventbrite ? sourceUrl : null;
      if (!isEventbrite && description) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = description.match(urlRegex);
        if (urls && urls.length > 0) {
          const externalUrl = urls.find((u: string) => !u.toLowerCase().includes('facebook.com'));
          if (externalUrl) registrationUrl = externalUrl;
        }
      }

      await db.insert(tournaments).values({
        name: title,
        sourceUrl: sourceUrl,
        sourceId: sourceId,
        source: sourceString,
        dateStart: resolvedStartDate,
        dateEnd: event.endDate || event.endTime || event.end?.utc,
        courseName: courseName,
        courseCity: city,
        courseState: state,
        format: 'Scramble',
        description: description,
        entryFee: entryFee,
        organizerName: isEventbrite ? (event.organizer?.name || null) : null,
        registrationUrl: registrationUrl,
        socialSignals: socialSignals,
        eventSources: JSON.stringify([sourceString]),
        isActive: true,
        status: 'active',
      });
      insertedCount++;
      newTitles.push(title);
    } catch (e) {
      console.error('[Apify Ingestion] Event parsing/insert error:', e);
    }
  }
  
  const detailsPayload = JSON.stringify({
    titlesFound: newTitles,
    duplicatesSkipped: duplicatesSkipped,
    newInserted: insertedCount
  });

  await db.insert(crawlLogs).values({
    url: `apify://dataset/${datasetId}`,
    searchVector: `Apify Batch Ingestion (${events.length} events)`,
    sourceId: 'APIFY SYNC',
    cycleId: datasetId,
    tournamentsFound: insertedCount,
    durationMs: 0,
    status: 'success',
    details: detailsPayload
  });
  
  console.log(`[Apify Ingestion] Finished processing dataset: ${datasetId}. Inserted: ${insertedCount}`);
  return { success: true, inserted: insertedCount, eventsTotal: events.length };
}
