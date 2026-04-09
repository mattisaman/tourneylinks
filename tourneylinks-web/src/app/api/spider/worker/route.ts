import { NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs';
import { db, tournaments, courses, crawlLogs } from '@/lib/db';
import { eq, ilike } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';
import FirecrawlApp from '@mendable/firecrawl-js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "mock_gemini_key" });
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY || "mock_firecrawl_key" });

export const maxDuration = 60; // Allow Vercel functions to run up to 60s
export const dynamic = 'force-dynamic';

async function searchGoogleSerpApi(query: string): Promise<string[]> {
  console.log(`\n🔍 [QSTASH WORKER] Google Search (SerpApi): "${query}"`);
  try {
    const res = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_KEY}`);
    const json = await res.json();
    
    if (!json.organic_results) return [];
    
    const links = json.organic_results
      .slice(0, 3) 
      .map((r: any) => r.link)
      .filter((url: string) => !url.includes('facebook') && !url.includes('instagram') && !url.includes('pinterest'));
      
    return links;
  } catch (err) {
    console.error(`Search Failed:`, err);
    return [];
  }
}

interface TourneyPayload {
  name?: string;
  courseName?: string;
  courseCity?: string;
  courseState?: string;
  dateStart?: string;
  format?: string;
  description?: string;
  entryFee?: number;
  isCharity?: boolean;
  organizerName?: string;
  organizerEmail?: string;
  registrationUrl?: string;
  deepCrawlUrl?: string;
  requiresJsEngine?: boolean;
}

interface ExtractionResult {
  payload: TourneyPayload;
  usedFirecrawl: boolean;
}

async function scrapeAndExtract(url: string, isDeepCrawl: boolean = false, previousContext: string = "", usedFirecrawlInitially: boolean = false): Promise<ExtractionResult | null> {
  try {
    // -------------------------------------------------------------
    // ENGINE 1: Native High-Speed Fetch (Cost: $0.00)
    // -------------------------------------------------------------
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: controller.signal });
    clearTimeout(timeout);
    
    let sourceText = "";
    if (res.ok) {
      const html = await res.text();
      sourceText = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 40000);
    }

    if (isDeepCrawl && previousContext) {
       sourceText = `=== SURFACE CONTEXT ===\n${previousContext}\n\n=== DEEP LINK CONTEXT ===\n${sourceText}`;
    }

    let prompt = `You are a professional golf tournament data extractor. Read this raw text and extract all available details about the Golf Tournament.
CRITICAL INSTRUCTIONS:
- ONLY output valid JSON. If a field is not explicitly stated, use null.
- If the page looks completely blank, warns about needing Javascript, or looks like a Cloudflare Anti-Bot wall, set 'requiresJsEngine' to true!
${!isDeepCrawl ? "- If this is just a directory and you see a URL pointing to the actual registration details page, set 'deepCrawlUrl' to that exact absolute URL and leave the rest null." : ""}

JSON SCHEMA:
{
  "requiresJsEngine": boolean,
  "deepCrawlUrl": "string or null",
  "name": "string",
  "dateStart": "string (YYYY-MM-DD)",
  "courseName": "string",
  "courseCity": "string",
  "courseState": "string",
  "format": "string",
  "description": "string",
  "entryFee": number,
  "isCharity": boolean,
  "organizerName": "string",
  "organizerEmail": "string",
  "organizerPhone": "string",
  "registrationUrl": "string"
}
RAW TEXT: ${sourceText}`;

    let completion = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    let data = JSON.parse(completion.text || "{}");
    let usedFirecrawl = usedFirecrawlInitially;

    // -------------------------------------------------------------
    // ENGINE 2 FAILOVER: Firecrawl Headless Rendering (Cost: 1 Credit)
    // -------------------------------------------------------------
    if (data.requiresJsEngine || (!res.ok && !isDeepCrawl)) {
        console.log(`   --> 🧱 [ENGINE 1 BLOCKED] JS-Wall Detected at ${url}. Failing over to Engine 2 (FireCrawl)...`);
        
        try {
            const scrapeResult = await (firecrawl as any).scrapeUrl(url, { formats: ['markdown'] }) as any;
            if (!scrapeResult.success && !scrapeResult.markdown) {
                console.log(`   --> ❌ [ENGINE 2 FAILED] Could not render page.`);
                return null;
            }

            usedFirecrawl = true;
            console.log(`   --> 🔥 [ENGINE 2 SUCCESS] Extracted ${scrapeResult.markdown.length} bytes of raw markdown.`);
            
            // Re-prompt Gemini without the JS warning flags, purely on the markdown
            prompt = prompt.replace(/- If the page looks completely blank.+true!/g, '')
                           .replace(/"requiresJsEngine": boolean,/g, '');
            prompt = prompt.replace(`RAW TEXT: ${sourceText}`, `RAW MARKDOWN: ${scrapeResult.markdown.substring(0, 40000)}`);
            
            completion = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: { responseMimeType: "application/json" }
            });

            data = JSON.parse(completion.text || "{}");
        } catch (fcErr) {
            console.error(`   --> ❌ [ENGINE 2 ERROR] Firecrawl timeout/crash.`);
            return null;
        }
    }
    
    // Deep Crawl Router
    if (!isDeepCrawl && data.deepCrawlUrl && data.deepCrawlUrl.startsWith('http')) {
        return scrapeAndExtract(data.deepCrawlUrl, true, sourceText, usedFirecrawl); 
    }

    if (!data.name || !data.courseName || !data.dateStart) return null;
    return { payload: data, usedFirecrawl };
  } catch (err) {
    return null;
  }
}

// -------------------------------------------------------------------------------- //
// THE WORKER CORE 
// -------------------------------------------------------------------------------- //
async function workerHandler(req: Request) {
  const startTime = Date.now();
  let cycleTracker = `QSTASH-${Date.now()}`;
  let targetRegion = "UNKNOWN";

  try {
    const { query, region } = await req.json();
    targetRegion = region || query;
    console.log(`\n🚀 [WORKER INITIATED] Processing Chunk: ${query}`);

    const urls = await searchGoogleSerpApi(query);
    let ingested = 0;
    let creditsBurned = 0;
    
    for (const url of urls) {
      const existing = await db.select({ id: tournaments.id }).from(tournaments).where(eq(tournaments.sourceUrl, url));
      if (existing.length > 0) continue;

      const result = await scrapeAndExtract(url);
      if (!result) continue;
      
      const parsed = result.payload;
      if (result.usedFirecrawl) creditsBurned++;

      let courseZip = null;
      let courseIdLink = null;
      const matchingCourses = await db.select().from(courses)
        .where(ilike(courses.name, `%${parsed.courseName}%`)).limit(1);
        
      if (matchingCourses.length > 0) {
          courseZip = matchingCourses[0].zip;
          courseIdLink = matchingCourses[0].id;
      }

      await db.insert(tournaments).values({
        name: parsed.name || "Unknown Tournament",
        sourceUrl: url,
        sourceId: cycleTracker,
        source: 'GlobalSpider',
        dateStart: parsed.dateStart || "TBD",
        courseName: parsed.courseName || "Unknown Course",
        courseId: courseIdLink,
        courseCity: parsed.courseCity || region?.split(',')[0]?.trim(),
        courseState: parsed.courseState || region?.split(',')[1]?.trim(),
        courseZip: courseZip,
        format: parsed.format || 'Scramble',
        description: parsed.description,
        entryFee: parsed.entryFee,
        isCharity: parsed.isCharity,
        organizerName: parsed.organizerName,
        organizerEmail: parsed.organizerEmail || null,
        registrationUrl: parsed.registrationUrl || url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      ingested++;
      console.log(`✅ [WORKER SUCCESS] Indexed: ${parsed.name}`);
    } // end loop

    const duration = Date.now() - startTime;
    
    // Telemetry Sync: Push the exact cost/duration footprint into the DB for Dashboard reports
    await db.insert(crawlLogs).values({
        cycleId: cycleTracker,
        sourceId: 'Worker Node',
        url: targetRegion,
        searchVector: targetRegion,
        status: 'SUCCESS',
        tournamentsFound: ingested,
        durationMs: duration,
        fireCrawlCreditsUsed: creditsBurned,
        totalCosts: creditsBurned * 0.005, // Approximation: Firecrawl average scaling cost
    });

    return NextResponse.json({ success: true, targetsCrawled: urls.length, successfullyIngested: ingested, durationMs: duration, creditsBurned });

  } catch (e: any) {
    console.error("[WORKER CATASTROPHE]", e);
    const duration = Date.now() - startTime;
    await db.insert(crawlLogs).values({
        cycleId: cycleTracker,
        sourceId: 'Worker Node',
        url: targetRegion,
        searchVector: targetRegion,
        status: 'FAILED',
        tournamentsFound: 0,
        durationMs: duration,
        fireCrawlCreditsUsed: 0,
        error: e.message
    });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Wrap the route with Upstash's signature verification middleware
// Note: We provide fallback dummy keys to prevent Next.js static build from crashing if Vercel env vars aren't populated at build time.
export const POST = verifySignatureAppRouter(workerHandler, {
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "build_dummy_current_key",
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "build_dummy_next_key"
});
