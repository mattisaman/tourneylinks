import { db } from '../lib/db';
import { tournaments, courses } from '../lib/db';
import { eq, ilike, or } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const SERPAPI_KEY = process.env.SERPAPI_KEY;

const TARGET_REGIONS = [
  "Austin, TX"
];

// Phase 36: The $86/mo "Perfect Efficiency" Hack
// Target 500 Regions x 2 Permutations = 1,000 queries per weekly execution.
const SEARCH_PERMUTATIONS = [
  "Charity Golf Tournaments",
  "Golf Scramble"
];

// Phase 33 Tier 1: The Zero-Cost Aggregator (SerpApi Sniper)
async function searchSerpApi(query: string): Promise<string[]> {
  console.log(`\n🔍 Sniper Search (SerpApi): "${query}"`);
  try {
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&num=10`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`SerpApi: ${res.status}`);
    
    const data = await res.json();
    if (!data.organic_results) return [];

    const links: string[] = [];
    for (const item of data.organic_results) {
      if (item.link) links.push(item.link);
    }
    return links;
  } catch (err) {
    console.error(`Search Failed:`, err);
    return [];
  }
}

// Phase 33 Tier 2: The Deep-Dive Page Extractor (Hub-and-Spoke)
async function processDeepLink(url: string, depth: number = 0) {
  if (depth > 1) return; // Prevent infinite recursive crawling traps
  console.log(`\n🕷️ [Tier ${depth + 1}] Crawling: ${url}`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: controller.signal });
    clearTimeout(timeout);
    
    if (!res.ok) return;
    
    const html = await res.text();
    // Heavy DOM purification to save Gemini Tokens
    const cleanText = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 45000);

    const prompt = `You are a professional Golf Tournament Extractor API. 
Analyze this website text thoroughly. 
First, determine if this page is a "DIRECTORY" (meaning it lists multiple golf tournaments with links to click into them) or a "SINGLE_EVENT" (meaning this page is dedicated to one specific tournament).

1. If it is a DIRECTORY: Find and extract the full http URLs pointing to the individual tournament pages.
2. If it is a SINGLE_EVENT: Extract the Golf Tournament details.

CRITICAL INSTRUCTIONS:
- You must ONLY output valid JSON. Do not include markdown blocks.
- If a field is not explicitly stated, use null.
- Extract absolute maximum detail for description and format rules.
- **TEMPORAL CONSTRAINT:** Today is the year 2026. If a tournament year is omitted on the page, you MUST map it to 2026 or 2027 depending on the month context. NEVER output historical years such as 1999 or 2001.

JSON SCHEMA:
{
  "pageType": "DIRECTORY" or "SINGLE_EVENT" or "UNKNOWN",
  "directoryLinks": ["https://example.com/tourney1", "https://example.com/tourney2"] (only if DIRECTORY, else empty array),
  "tournamentData": {
    "name": "string (Tournament Name)",
    "dateStart": "string (YYYY-MM-DD or formal text. MUST belong to 2026 or 2027 context)",
    "courseName": "string",
    "courseCity": "string",
    "courseState": "string (2-letters)",
    "format": "string (e.g., 4-Person Scramble, Best Ball)",
    "description": "string (Long description and rules)",
    "entryFee": number (null if unavailable),
    "isCharity": boolean,
    "charityName": "string (Benefiting Charity)",
    "organizerName": "string",
    "organizerEmail": "string",
    "organizerPhone": "string",
    "registrationUrl": "string or null",
    "includes": "string (e.g., dinner, cart, 18 holes)",
    "schedule": [{"time": "string (e.g. 10:00 AM)", "event": "string"}] (Extract the timeline/agenda if available, else null),
    "prizes": ["string (e.g. 1st Place Team: $1000 Pro Shop Credit)", "string (e.g. Grand Prize: Scotty Cameron Putter)"] (Extract detailed prizes/contests if available, else null)
  } (null if DIRECTORY or UNKNOWN)
}
RAW TEXT: ${cleanText}`;

    console.log(`🧠 AI Matrix Analyzing DOM Payload...`);
    const completion = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(completion.text || "{}");
    
    // Hub Branching Execution
    if (parsed.pageType === "DIRECTORY" && parsed.directoryLinks?.length > 0) {
      console.log(`🔀 AI identified ${parsed.directoryLinks.length} child events. Launching Spokes...`);
      for (const childUrl of parsed.directoryLinks) {
        // Recursively crawl the spokes
        await processDeepLink(childUrl, depth + 1);
        await new Promise(r => setTimeout(r, 4000)); // Respect Rate Limits
      }
    } else if (parsed.pageType === "SINGLE_EVENT" && parsed.tournamentData?.name) {
      const t = parsed.tournamentData;
      console.log(`✨ TOURNAMENT CAPTURED: ${t.name} @ ${t.courseName}`);
      
      // Prevent duplicates by Name OR SourceUrl
      const existing = await db.select({ id: tournaments.id }).from(tournaments)
        .where(
          or(
            eq(tournaments.sourceUrl, url),
            eq(tournaments.name, t.name)
          )
        );
        
      if (existing.length > 0) {
        console.log(`⏭️ Skipping (Duplicate Tournament Detected).`);
        return;
      }

      // Automatically link to an existing Course ID
      let courseZip = null;
      let hostMatch = null;
      if (t.courseName) {
        const matchingCourses = await db.select().from(courses).where(ilike(courses.name, `%${t.courseName}%`)).limit(1);
        if (matchingCourses.length > 0) {
            courseZip = matchingCourses[0].zip;
            // Optionally set the host user or linked reference
        }
      }

      // Inject into PostgreSQL
      await db.insert(tournaments).values({
        name: t.name,
        sourceUrl: url,
        sourceId: `hub-spoke-${Date.now()}`,
        source: 'GoogleSearchBot',
        
        dateStart: t.dateStart || '',
        courseName: t.courseName || 'Unknown Course',
        courseCity: t.courseCity || '',
        courseState: t.courseState || '',
        courseZip: courseZip,
        
        format: t.format || 'Scramble',
        description: t.description,
        entryFee: t.entryFee,
        
        isCharity: t.isCharity || false,
        charityName: t.charityName,
        organizerName: t.organizerName,
        organizerEmail: t.organizerEmail,
        organizerPhone: t.organizerPhone,
        registrationUrl: t.registrationUrl || url,
        includes: t.includes,
        schedule: t.schedule ? JSON.stringify(t.schedule) : null,
        prizes: t.prizes ? JSON.stringify(t.prizes) : null,
        
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`💾 Saved to Database!`);
    } else {
        console.log(`⚠️ AI determined URL is not a tournament or directory. Ignoring.`);
    }

  } catch (err) {
    console.error(`AI Extraction Failed [Tier ${depth + 1}] for ${url}`);
  }
}

async function run() {
  console.log("🚀 Starting Phase 33 Two-Tier Hub-and-Spoke Scraper...\n");

  for (const region of TARGET_REGIONS) {
    for (const prefix of SEARCH_PERMUTATIONS) {
      const query = `site:eventbrite.com OR site:golfsoftware.com OR site:perfectgolfevent.com ${prefix} ${region}`;
      const urls = await searchSerpApi(query);
      
      console.log(`Found ${urls.length} root domains for ${query}`);

      for (const url of urls) {
        await processDeepLink(url, 0);
        await new Promise(res => setTimeout(res, 3000));
      }
    }
  }

  console.log(`\n🏁 Geographic Block Scrape Complete!`);
  process.exit(0);
}

run().catch(console.error);
