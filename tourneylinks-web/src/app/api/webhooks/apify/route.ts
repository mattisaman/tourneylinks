import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { processApifyDataset } from '@/lib/apifyIngestion';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-apify-secret');
    const expectedSecret = process.env.APIFY_WEBHOOK_SECRET;

    if (!signature || signature !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized webhook request' }, { status: 401 });
    }

    const body = await req.json();
    const eventType = body.eventType;

    if (eventType !== 'ACTOR.RUN.SUCCEEDED') {
      return NextResponse.json({ message: 'Ignoring event type' });
    }

    const datasetId = body.resource?.defaultDatasetId;
    if (!datasetId) {
      return NextResponse.json({ error: 'No dataset ID found' }, { status: 400 });
    }

    // Schedule background processing
    after(async () => {
      const apifyToken = process.env.APIFY_API_TOKEN;
      if (!apifyToken) {
         console.error('[Apify Webhook] No APIFY_API_TOKEN found in environment.');
         return;
      }
      await processApifyDataset(datasetId, apifyToken);
    });

    // Return 200 OK immediately so Apify doesn't timeout
    return NextResponse.json({ success: true, message: 'Processing started in background' });
  } catch (error: any) {
    console.error('Apify Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
