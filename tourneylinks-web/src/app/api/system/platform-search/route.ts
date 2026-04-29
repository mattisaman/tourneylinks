import { NextResponse } from 'next/server';
import { db, tournaments, crawlLogs } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { mergeIfDuplicate } from '@/lib/deduplication';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("Platform Search API Hit");
  try {
    const { platform, query } = await req.json();
    if (!platform || !query) {
      return NextResponse.json({ error: 'Platform and query are required' }, { status: 400 });
    }

    // Construct the exact Google Search Query
    const searchQuery = `${query} site:${platform}`;
    console.log(`Executing Search: ${searchQuery}`);

    // FireCrawl search endpoint via REST
    const searchRes = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 25
      })
    });

    const searchResponse = await searchRes.json();

    if (!searchResponse.success) {
      throw new Error(`Firecrawl search failed: ${searchResponse.error}`);
    }

    const results = searchResponse.data || [];
    let insertedCount = 0;
    let duplicatesSkipped = 0;
    let newTitles: string[] = [];

    // Process each returned URL
    for (const result of results) {
      const url = result.url;
      if (!url) continue;

      // Extract a basic sourceId based on the URL to prevent exact URL duplicates immediately
      const sourceId = `web_${url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100)}`;
      
      const existing = await db.select().from(tournaments).where(eq(tournaments.sourceId, sourceId));
      if (existing.length > 0) {
        duplicatesSkipped++;
        continue;
      }

      // We don't have full details yet, just the URL and Title from Google
      const title = result.title || 'Discovered Tournament';
      
      const inserted = await db.insert(tournaments).values({
        sourceId: sourceId,
        source: `search-${platform}`,
        sourceUrl: url,
        name: title,
        dateStart: 'TBD Date',
        format: 'Scramble',
        courseName: 'TBD Course',
        courseCity: 'TBD City',
        courseState: 'TBD State',
        // Important: Leave isFullyNormalized as false so the Checkback Normalizer picks it up
        isFullyNormalized: false, 
      }).returning();
      
      // Run the initial deduplication sweep
      if (inserted && inserted.length > 0) {
        const keptEvent = await mergeIfDuplicate(inserted[0]);
        if (keptEvent.id === inserted[0].id) {
          insertedCount++;
          newTitles.push(title);
        } else {
          duplicatesSkipped++;
        }
      }
    }

    // Log the run
    await db.insert(crawlLogs).values({
      cycleId: `search_${Date.now()}`,
      url: `search://${platform}?q=${encodeURIComponent(query)}`,
      sourceId: `search-${platform}`,
      searchVector: searchQuery,
      status: 'success',
      tournamentsFound: insertedCount,
      details: JSON.stringify({
        titlesFound: newTitles,
        duplicatesSkipped,
        totalSearchResults: results.length
      })
    });

    return NextResponse.json({ 
      success: true, 
      inserted: insertedCount, 
      skipped: duplicatesSkipped,
      searched: results.length
    });

  } catch (error: any) {
    console.error('Fatal API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
