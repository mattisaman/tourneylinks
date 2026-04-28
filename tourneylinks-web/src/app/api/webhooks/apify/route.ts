import { NextResponse } from 'next/server';
import { after } from 'next/server';
import { db, tournaments } from '@/lib/db';
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
          
          if (!isGolf) continue;

          const sourceId = `fb_${event.id || event.url}`;
          
          // Check if we already have it
          const existing = await db.select().from(tournaments).where(eq(tournaments.sourceId, sourceId));
          if (existing.length > 0) continue;

          // Extract details
          const location = event.location || {};
          const courseName = location.name || 'TBD Course';
          const city = location.city || 'TBD City';
          const state = location.state || 'TBD State';

          const socialSignals = JSON.stringify({
            interestedCount: event.interestedCount || 0,
            goingCount: event.goingCount || 0,
          });

          // 5. Deduplication (Golden Record Engine)
          const wasMerged = await mergeIfDuplicate({
            title,
            courseCity: city,
            courseState: state,
            dateStart: event.startDate || event.startTime || new Date().toISOString(),
            source: 'facebook-apify',
            sourceUrl: event.url || `https://facebook.com/events/${event.id}`,
            description,
            socialSignals
          });

          if (wasMerged) continue;

          await db.insert(tournaments).values({
            name: title,
            sourceUrl: event.url || `https://facebook.com/events/${event.id}`,
            sourceId: sourceId,
            source: 'facebook-apify',
            dateStart: event.startDate || event.startTime || new Date().toISOString(),
            dateEnd: event.endDate || event.endTime,
            courseName: courseName,
            courseCity: city,
            courseState: state,
            format: 'Scramble',
            description: description,
            socialSignals: socialSignals,
            eventSources: JSON.stringify(['facebook-apify']),
            isActive: true, // Set to active by default
            status: 'active',
          });
          insertedCount++;
        }
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
