import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load ENV and force Node.js direct driver connection BEFORE standard pool mapping
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(':6543', ':5432');
}

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
const _pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
});
const localDb = drizzle(_pool);

import { tournaments, courses } from '../lib/db';
import { eq, or, ilike } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const TARGET_REGIONS = [
  "New York, NY",
  "Albany, NY",
  "Rochester, NY",
  "Syracuse, NY",
  "Buffalo, NY",
  "Long Island, NY"
];

const SEARCH_PERMUTATIONS = [
  "Charity Golf Tournaments",
  "Golf Scramble",
  "Upcoming Golf Outings"
];

async function searchGoogleSerpApi(query: string): Promise<string[]> {
  console.log(`\n🔍 Google Search (SerpApi): "${query}"`);
  try {
    const res = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_KEY}`);
    const json = await res.json();
    
    if (!json.organic_results) {
      console.log(`  -> No results payload from SerpApi.`);
      return [];
    }
    
    // Extract top 6 URLs, filter social media
    const links = json.organic_results
      .slice(0, 6)
      .map((r: any) => r.link)
      .filter((url: string) => !url.includes('facebook') && !url.includes('instagram') && !url.includes('pinterest'));
      
    return links;
  } catch (err) {
    console.error(`Search Failed:`, err);
    return [];
  }
}

async function scrapeAndExtract(url: string, isDeepCrawl: boolean = false, previousContext: string = "") {
  if (isDeepCrawl) {
     console.log(`   --> 🤿 DEEP CRAWL INITIATED: ${url}`);
  } else {
     console.log(`🕷️ Primary Surface Crawl: ${url}`);
  }
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: controller.signal });
    clearTimeout(timeout);
    
    if (!res.ok) return null;
    
    const html = await res.text();
    let cleanText = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 45000); 

    // Combine surface text with deep text if this is a secondary pass for massive LLM context
    if (isDeepCrawl && previousContext) {
       cleanText = `=== SURFACE CONTEXT ===\n${previousContext}\n\n=== DEEP LINK CONTEXT ===\n${cleanText}`;
    }

    const prompt = `You are a professional golf tournament data extractor. Read this raw text from a website and extract all available details about the Golf Tournament.
CRITICAL INSTRUCTIONS:
- You must ONLY output valid JSON.
- If a field is not explicitly stated, use null.
- Attempt to extract exact pricing, max handicap rules, included meals/drinks, the exact Date of the event, and Organizer Info.
${!isDeepCrawl ? "- If this text is just a summary directory and you see a URL pointing to the actual registration or event details page, set 'deepCrawlUrl' to that exact absolute URL and leave the rest null/empty so we can spider it." : ""}

JSON SCHEMA:
{
  "deepCrawlUrl": "string or null",
  "name": "string (Tournament Name)",
  "dateStart": "string (YYYY-MM-DD or best guess text)",
  "courseName": "string",
  "courseCity": "string",
  "courseState": "string (2-letters)",
  "format": "string (e.g., 4-Person Scramble, Best Ball)",
  "description": "string (Long description of what the event is for)",
  "entryFee": number (null if unavailable),
  "isCharity": boolean,
  "charityName": "string (Benefiting Charity)",
  "organizerName": "string",
  "organizerEmail": "string",
  "organizerPhone": "string",
  "registrationUrl": "string or null",
  "includes": "string (e.g., dinner, cart, 18 holes, swag bag)"
}
RAW TEXT: ${cleanText}`;

    const completion = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const data = JSON.parse(completion.text || "{}");
    
    // Evaluate if a Deep Crawl is requested and possible
    if (!isDeepCrawl && data.deepCrawlUrl && data.deepCrawlUrl.startsWith('http')) {
        return scrapeAndExtract(data.deepCrawlUrl, true, cleanText); // RECURSIVE DEEP DIVE
    }

    // Ensure we actually found a tournament and not just a random news article
    if (!data.name || !data.courseName || !data.dateStart) return null;
    return data;
  } catch (err) {
    console.error(`AI Extraction Failed for ${url}`);
    return null;
  }
}

async function run() {
  console.log("🚀 Starting Phase 30 Native Tournament Discovery (New York Corridor)...\n");

  for (const region of TARGET_REGIONS) {
    for (const prefix of SEARCH_PERMUTATIONS) {
      const query = `${prefix} ${region}`;
      const urls = await searchGoogleSerpApi(query);
      
      console.log(`Found ${urls.length} targets for ${query}`);

      for (const url of urls) {
        // 1. Check if we already crawled this URL to prevent database duplication
        const existing = await localDb.select({ id: tournaments.id }).from(tournaments).where(eq(tournaments.sourceUrl, url));
        if (existing.length > 0) {
          console.log(`⏭️ Skipping (Already Indexed): ${url}`);
          continue;
        }

        // 2. Scrape & Extract (Will Auto-Route to Deep Crawl if Needed)
        const parsed = await scrapeAndExtract(url);
        if (!parsed) {
          console.log(`⚠️ Low Fidelity/Failed Parse: ${url}`);
          continue;
        }

        console.log(`\n✨ TOURNAMENT CAPTURED: ${parsed.name} @ ${parsed.courseName}`);
        
        // 3. Attempt to automatically link it to an existing Course ID in our DB
        let courseZip = null;
        const matchingCourses = await localDb.select().from(courses)
          .where(ilike(courses.name, `%${parsed.courseName}%`))
          .limit(1);
          
        if (matchingCourses.length > 0) courseZip = matchingCourses[0].zip;

        // 4. Inject into PostgreSQL
        await localDb.insert(tournaments).values({
          name: parsed.name,
          sourceUrl: url,
          sourceId: `duckduckgo-${Date.now()}`,
          source: 'NativeCrawler',
          
          dateStart: parsed.dateStart,
          courseName: parsed.courseName,
          courseCity: parsed.courseCity || region.split(',')[0].trim(),
          courseState: parsed.courseState || region.split(',')[1].trim(),
          courseZip: courseZip,
          
          format: parsed.format || 'Scramble',
          description: parsed.description,
          entryFee: parsed.entryFee,
          
          isCharity: parsed.isCharity,
          charityName: parsed.charityName,
          organizerName: parsed.organizerName,
          organizerEmail: parsed.organizerEmail,
          organizerPhone: parsed.organizerPhone,
          registrationUrl: parsed.registrationUrl || url,
          includes: parsed.includes,
          
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        console.log(`💾 Committed to Database.`);
        await new Promise(res => setTimeout(res, 4000)); // Respect Rate Limits
      }
    }
  }

  console.log(`\n🏁 Geography Scanning Complete!`);
  process.exit(0);
}

run().catch(console.error);
