import { NextRequest, NextResponse } from 'next/server';
import { processApifyDataset } from '@/lib/apifyIngestion';

export async function POST(req: NextRequest) {
  try {
    const apifyToken = process.env.APIFY_API_TOKEN;
    if (!apifyToken) {
       return NextResponse.json({ error: 'Missing Apify API Token' }, { status: 500 });
    }

    // Fetch the latest run of the facebook-events-scraper
    // We sort by descending and limit 1 to get the most recent run
    const runsUrl = `https://api.apify.com/v2/acts/apify~facebook-events-scraper/runs?token=${apifyToken}&desc=true&limit=1`;
    const runsRes = await fetch(runsUrl);
    
    if (!runsRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch runs from Apify' }, { status: 500 });
    }

    const runsData = await runsRes.json();
    const latestRun = runsData.data?.items?.[0];

    if (!latestRun) {
       return NextResponse.json({ error: 'No recent Apify runs found' }, { status: 404 });
    }

    const datasetId = latestRun.defaultDatasetId;
    if (!datasetId) {
       return NextResponse.json({ error: 'No dataset found for the latest run' }, { status: 404 });
    }

    // Process the dataset inline (since this is triggered manually, the user wants the result)
    const result = await processApifyDataset(datasetId, apifyToken);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, inserted: result.inserted, total: result.eventsTotal });

  } catch (error: any) {
    console.error('Apify Sync Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
