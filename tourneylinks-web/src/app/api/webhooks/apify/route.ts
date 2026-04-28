import { NextResponse } from 'next/server';
import { db, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { mergeIfDuplicate } from '@/lib/deduplication';

export async function POST(req: Request) {
  try {
    // 1. Verify the webhook signature or token (Optional but recommended)
    const authHeader = req.headers.get('authorization');
    if (process.env.APIFY_WEBHOOK_SECRET && authHeader !== `Bearer ${process.env.APIFY_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();

    // 2. Apify Webhook Payload Validation
    // Apify sends run details, the dataset ID is in resource.defaultDatasetId
    const datasetId = payload?.resource?.defaultDatasetId;
    if (!datasetId) {
      return NextResponse.json({ error: 'Missing datasetId in webhook payload' }, { status: 400 });
    }

    // 3. Fetch the actual dataset items from Apify
    const apifyToken = process.env.APIFY_API_TOKEN;
    if (!apifyToken) {
      console.warn('APIFY_API_TOKEN not configured. Skipping dataset fetch.');
      return NextResponse.json({ error: 'APIFY_API_TOKEN missing' }, { status: 500 });
    }

    const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}`;
    const datasetRes = await fetch(datasetUrl);
    
    if (!datasetRes.ok) {
      console.error('Failed to fetch dataset from Apify:', await datasetRes.text());
      return NextResponse.json({ error: 'Failed to fetch dataset' }, { status: 500 });
    }

    const events = await datasetRes.json();
    let insertedCount = 0;

    // 4. Map and Insert Events
    for (const event of events) {
      // Basic validation to ensure it's a golf event
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
        format: 'Scramble', // Default assumption for Facebook charity events
        description: description,
        socialSignals: socialSignals,
        eventSources: JSON.stringify(['facebook-apify']),
        isActive: false, // Default to inactive until manually verified
        status: 'active',
      });
      insertedCount++;
    }

    return NextResponse.json({ success: true, processed: events.length, inserted: insertedCount });
  } catch (error: any) {
    console.error('Apify Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
