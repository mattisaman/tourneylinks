import { db } from '../lib/db';
import { tournaments, courses } from '../lib/db';
import { eq, or, ilike } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The regions we want to scan
const TARGET_REGIONS = [
  "Rochester, NY",
  "Buffalo, NY",
  "Syracuse, NY"
];

// Permutations to catch 100% of event naming conventions
const SEARCH_PERMUTATIONS = [
  "Charity Golf Tournaments",
  "Golf Scramble",
  "Golf Classic",
  "Upcoming Golf Outings"
];

async function searchDuckDuckGo(query: string): Promise<string[]> {
  console.log(`\n🔍 DuckDuckGo: "${query}"`);
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
      }
    });
    const html = await res.text();
    
    // Extract top 5 URLs from the search results
    const links: string[] = [];
    const regex = /class="result__url"[^>]*href="([^"]+)"/gi;
    let match;
    while ((match = regex.exec(html)) !== null && links.length < 5) {
      let url = match[1];
      if (url.startsWith('//')) url = 'https:' + url;
      // Skip generic proxy aggregators or non-event URLs
      if (url.includes('duckduckgo') || url.includes('facebook') || url.includes('instagram')) continue;
      links.push(url);
    }
    
    return links;
  } catch (err) {
    console.error(`Search Failed:`, err);
    return [];
  }
}

async function scrapeAndExtract(url: string) {
  console.log(`🕷️ Crawling URL: ${url}`);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: controller.signal });
    clearTimeout(timeout);
    
    if (!res.ok) return null;
    
    const html = await res.text();
    const cleanText = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 45000); // Gemini 2.5 Flash token bounds

    const prompt = `You are a professional golf tournament data extractor. Read this raw text from a website and extract all available details about the Golf Tournament.
CRITICAL INSTRUCTIONS:
- You must ONLY output valid JSON.
- If a field is not explicitly stated, use null.
- Attempt to extract exact pricing, max handicap rules, included meals/drinks, the exact Date of the event, and the Organizer Info.

JSON SCHEMA:
{
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
    // Ensure we actually found a tournament and not just a random news article
    if (!data.name || !data.courseName || !data.dateStart) return null;
    return data;
  } catch (err) {
    console.error(`AI Extraction Failed for ${url}`);
    return null;
  }
}

async function run() {
  console.log("🚀 Starting Phase 30 Native Tournament Discovery...\n");

  for (const region of TARGET_REGIONS) {
    for (const prefix of SEARCH_PERMUTATIONS) {
      const query = `${prefix} ${region}`;
      const urls = await searchDuckDuckGo(query);
      
      console.log(`Found ${urls.length} targets for ${query}`);

      for (const url of urls) {
        // 1. Check if we already crawled this URL to prevent database duplication
        const existing = await db.select({ id: tournaments.id }).from(tournaments).where(eq(tournaments.sourceUrl, url));
        if (existing.length > 0) {
          console.log(`⏭️ Skipping (Already Indexed): ${url}`);
          continue;
        }

        // 2. Scrape & Extract
        const parsed = await scrapeAndExtract(url);
        if (!parsed) {
          console.log(`⚠️ Low Fidelity/Failed Parse: ${url}`);
          continue;
        }

        console.log(`\n✨ TOURNAMENT CAPTURED: ${parsed.name} @ ${parsed.courseName}`);
        
        // 3. Attempt to automatically link it to an existing Course ID in our DB
        let courseZip = null;
        const matchingCourses = await db.select().from(courses)
          .where(ilike(courses.name, `%${parsed.courseName}%`))
          .limit(1);
          
        if (matchingCourses.length > 0) courseZip = matchingCourses[0].zip;

        // 4. Inject into PostgreSQL
        await db.insert(tournaments).values({
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
