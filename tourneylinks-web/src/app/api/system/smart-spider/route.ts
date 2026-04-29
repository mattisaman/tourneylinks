import { NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { db, tournaments, crawlLogs } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { mergeIfDuplicate } from '@/lib/deduplication';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

function normalizeText(text: string): string {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

export async function POST(req: Request) {
  let browser;
  try {
    const { region } = await req.json();
    if (!region) {
      return NextResponse.json({ error: 'Region is required' }, { status: 400 });
    }

    const searchQuery = `charity golf tournament ${region}`;
    const url = `https://www.facebook.com/events/search/?q=${encodeURIComponent(searchQuery)}`;
    
    console.log(`[Smart Spider] Spinning up headless browser for: ${searchQuery}`);
    
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    console.log(`[Smart Spider] Navigating to Facebook: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait a moment for dynamic content
    await page.waitForTimeout(3000);

    // Scroll down a few times to load events
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(1500);
    }

    // Extract raw events from the DOM
    const rawEvents = await page.evaluate(() => {
      const eventCards = Array.from(document.querySelectorAll('a[href*="/events/"]'));
      
      const uniqueEvents = new Map();
      
      eventCards.forEach((card) => {
        const href = (card as HTMLAnchorElement).href;
        if (href && href.includes('/events/') && !href.includes('/search/')) {
          // Attempt to extract title
          const titleEl = card.querySelector('span[dir="auto"]');
          const title = titleEl ? titleEl.textContent || 'Unknown Title' : 'Unknown Title';
          
          const cleanUrl = href.split('?')[0];
          uniqueEvents.set(cleanUrl, { url: cleanUrl, title });
        }
      });
      
      return Array.from(uniqueEvents.values());
    });

    console.log(`[Smart Spider] Scraped ${rawEvents.length} raw URLs from search results.`);

    let insertedCount = 0;
    let duplicatesSkipped = 0;
    let newTitles: string[] = [];

    // Pre-click deduplication loop
    for (const event of rawEvents) {
      // 1. Source ID Exact Deduplication (Has this URL ever been seen?)
      const sourceId = `facebook-smart-${event.url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100)}`;
      
      const existing = await db.select().from(tournaments).where(eq(tournaments.sourceId, sourceId));
      if (existing.length > 0) {
        duplicatesSkipped++;
        continue;
      }

      // 2. Pre-click Title Comparison against database
      // If we already have a tournament with this exact name, skip it to avoid wasting a click
      const normalizedNewTitle = normalizeText(event.title);
      const possibleDupes = await db.select().from(tournaments);
      const isDuplicateByName = possibleDupes.some(
        (t) => normalizeText(t.name) === normalizedNewTitle && t.name !== 'Unknown Title'
      );

      if (isDuplicateByName) {
        console.log(`[Smart Spider] Skipped apparent duplicate by title: ${event.title}`);
        duplicatesSkipped++;
        continue;
      }

      // If we made it here, it's totally new!
      // In Phase 2, we would click into the page here to extract dates/cities. 
      // For now, we insert it as raw and let the AI Normalizer handle extraction to keep scraping fast and undetected.
      
      console.log(`[Smart Spider] New discovery! Adding: ${event.title}`);
      
      await db.insert(tournaments).values({
        sourceId: sourceId,
        source: `facebook-spider`,
        sourceUrl: event.url,
        name: event.title,
        dateStart: 'TBD Date',
        format: 'Scramble',
        courseName: 'TBD Course',
        courseCity: 'TBD City',
        courseState: 'NY', // Hardcoded to NY for the NY State Dispatcher
        isFullyNormalized: false, 
      });
      
      insertedCount++;
      newTitles.push(event.title);
    }

    await browser.close();

    // Log the run
    await db.insert(crawlLogs).values({
      cycleId: `spider_${Date.now()}`,
      url: url,
      sourceId: `spider-facebook`,
      searchVector: searchQuery,
      status: 'success',
      tournamentsFound: insertedCount,
      details: JSON.stringify({
        titlesFound: newTitles,
        duplicatesSkipped,
        totalRawScraped: rawEvents.length
      })
    });

    return NextResponse.json({ 
      success: true, 
      scraped: rawEvents.length,
      inserted: insertedCount, 
      skipped: duplicatesSkipped,
      titles: newTitles
    });

  } catch (error: any) {
    if (browser) await browser.close();
    console.error('Fatal API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
