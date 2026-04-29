import { NextResponse } from 'next/server';
import { after } from 'next/server';
import { db, tournaments, crawlLogs } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { mergeIfDuplicate } from '@/lib/deduplication';

export const maxDuration = 300; // Allow up to 5 minutes on Vercel

export async function POST(req: Request) {
  try {
    // 1. Verify the webhook signature or token (Optional but recommended)
    // Using x-apify-secret to avoid Clerk intercepting Authorization: Bearer
    const authHeader = req.headers.get('x-apify-secret') || req.headers.get('authorization');
    const secret = process.env.APIFY_WEBHOOK_SECRET;
    
    if (secret && authHeader !== secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized webhook request' }, { status: 401 });
    }

    const payload = await req.json();

    // 2. Apify Webhook Payload Validation
    const datasetId = payload?.resource?.defaultDatasetId;
    if (!datasetId) {
      return NextResponse.json({ error: 'Missing datasetId in webhook payload' }, { status: 400 });
    }

    const apifyToken = process.env.APIFY_API_TOKEN;
    if (!apifyToken) {
      console.warn('APIFY_API_TOKEN not configured. Skipping dataset fetch.');
      return NextResponse.json({ error: 'APIFY_API_TOKEN missing' }, { status: 500 });
    }

    // 3. Process the dataset in the background to prevent Vercel timeouts
    after(async () => {
      try {
        console.log(`[Apify Webhook] Starting background processing for dataset: ${datasetId}`);
        const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}`;
        const datasetRes = await fetch(datasetUrl);
        
        if (!datasetRes.ok) {
          console.error('[Apify Webhook] Failed to fetch dataset from Apify:', await datasetRes.text());
          return;
        }

        const events = await datasetRes.json();
        let insertedCount = 0;

        // 4. Map and Insert Events
        for (const event of events) {
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
          if (existing.length > 0) continue;

          let city = 'TBD City';
          let state = 'TBD State';
          let courseName = 'TBD Course';
          
          if (isEventbrite) {
            // Eventbrite Schema parsing (newpo/eventbrite-scraper)
            courseName = event.venue?.name || event.location?.name || event.location?.address?.name || 'TBD Course';
            city = event.venue?.city || event.venue?.address?.city || event.location?.address?.addressLocality || event.location?.city || '';
            state = event.venue?.state || event.venue?.region || event.venue?.address?.region || event.location?.address?.addressRegion || event.location?.state || '';
            const country = event.venue?.country || event.venue?.address?.country || event.location?.address?.addressCountry || '';
            if (country && country !== 'US' && country !== 'United States') continue; // Only US events
            
            // If state is missing, try to infer from the raw 'location' string if it's "City, State"
            if (!state && typeof event.location === 'string' && event.location.includes(',')) {
               const parts = event.location.split(',').map((p:string) => p.trim());
               if (parts.length >= 2 && parts[1].length === 2 && parts[1] !== 'US') {
                 state = parts[1]; // e.g. "Rochester, NY"
               }
            }
          } else {
            // Facebook Schema parsing
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

          let courseId = null;
          let courseAddress = null;

          const socialSignals = JSON.stringify({
            interestedCount: event.usersInterested || event.interestedCount || 0,
            goingCount: event.usersGoing || event.goingCount || 0,
          });

          // Eventbrite might include ticket info in the payload natively!
          let entryFee = null;
          if (isEventbrite) {
            if (event.ticketPrice && event.ticketPrice !== 'Free') {
              // Usually a string like "$150.00" or "$150"
              const match = event.ticketPrice.match(/[\d,.]+/);
              if (match) {
                 entryFee = parseFloat(match[0].replace(/,/g, ''));
              }
            } else if (event.tickets && Array.isArray(event.tickets)) {
              const individualTicket = event.tickets.find((t: any) => t.name && (t.name.toLowerCase().includes('individual') || t.name.toLowerCase().includes('single')));
              if (individualTicket && individualTicket.cost && individualTicket.cost.value) {
                 entryFee = individualTicket.cost.value / 100; // Eventbrite usually uses cents
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

          if (wasMerged) continue;

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
        }
        
        await db.insert(crawlLogs).values({
          url: `apify://dataset/${datasetId}`,
          searchVector: `Apify Batch Ingestion (${events.length} events)`,
          sourceId: 'APIFY WEBHOOK',
          cycleId: datasetId,
          tournamentsFound: insertedCount,
          durationMs: 0,
          status: 'success'
        });
        
        console.log(`[Apify Webhook] Finished processing dataset: ${datasetId}. Inserted: ${insertedCount}`);
      } catch (err) {
        console.error('[Apify Webhook] Error during background processing:', err);
      }
    });

    // Return 200 OK immediately so Apify doesn't timeout
    return NextResponse.json({ success: true, message: 'Processing started in background' });
  } catch (error: any) {
    console.error('Apify Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
