import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from '../src/lib/db';
import { eq, and, isNull, isNotNull, gte, inArray, desc, like } from 'drizzle-orm';
import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';
import { GoogleGenAI } from '@google/genai';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  console.log('Starting Checkback Engine...');
  
  if (!process.env.FIRECRAWL_API_KEY) {
    console.error('Missing FIRECRAWL_API_KEY');
    return;
  }
  if (!process.env.GEMINI_API_KEY) {
    console.error('Missing GEMINI_API_KEY');
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find tournaments that need checkback
  const pendingTournaments = await db.select().from(tournaments)
    .where(
      and(
        eq(tournaments.status, 'active'),
        isNull(tournaments.extractedAt),
        like(tournaments.registrationUrl, '%eventbrite.com%'),
        gte(tournaments.dateStart, today.toISOString())
      )
    )
    .orderBy(desc(tournaments.id))
    .limit(5);

  if (pendingTournaments.length === 0) {
    console.log('No tournaments need checkback at this time.');
    return;
  }

  console.log(`Found ${pendingTournaments.length} tournaments to process.`);

  for (const tournament of pendingTournaments) {
    console.log(`\nProcessing [${tournament.id}] ${tournament.name}`);
    const url = tournament.registrationUrl;
    
    let markdown = '';
    
    if (url) {
      console.log(`- Scraping URL: ${url}`);
      try {
        const scrapeResult = await firecrawl.scrape(url, { formats: ['markdown'] });
        if (!scrapeResult || !scrapeResult.markdown) {
          console.error(`  - Failed to scrape or no markdown returned, falling back to raw description`);
          markdown = tournament.description || '';
        } else {
          markdown = scrapeResult.markdown || '';
        }
      } catch (e: any) {
        console.error(`  - FireCrawl error: ${e.message}, falling back to raw description`);
        markdown = tournament.description || '';
      }
    } else {
      console.log(`- No URL found. Using raw Facebook description for extraction.`);
      markdown = tournament.description || '';
    }

    if (!markdown || markdown.trim().length < 50) {
      console.log('  - Extracted markdown/description is too short, skipping.');
      await db.update(tournaments)
        .set({ extractedAt: new Date().toISOString(), extractionConfidence: 0.1 })
        .where(eq(tournaments.id, tournament.id));
      continue;
    }

    console.log(`  - Feeding ${markdown.length} bytes of content to Gemini...`);
    
    // Call Gemini
    const prompt = `You are a golf tournament data extraction specialist.
Analyze the following text content scraped from a golf tournament registration page or raw Facebook description.
Extract the relevant details and output strictly as a JSON object matching this schema:

{
  "eventName": <string or null, the actual name of the tournament/event>,
  "dateStart": <string or null, ISO 8601 format of when the event starts, e.g. "2026-06-15T08:00:00Z">,
  "courseName": <string or null, name of the golf course or venue>,
  "courseCity": <string or null, city of the golf course>,
  "courseState": <string or null, 2-letter state code of the golf course, e.g. "NY">,
  "entryFee": <number or null, the base entry fee per individual player in dollars. Just the number, e.g. 150>,
  "pricingDetails": <object, e.g. {"foursome": 600, "individual": 150, "mulligans": 20}>,
  "prizes": <array of strings, e.g. ["1st Place: $500", "Longest Drive"]>,
  "sponsors": <array of strings, e.g. ["Title Sponsor: $5000", "Hole Sponsor: $200"]>,
  "organizerName": <string or null>,
  "organizerEmail": <string or null>,
  "organizerPhone": <string or null>,
  "includes": <string or null, what is included like "Dinner, Cart, Green Fees">,
  "cleanDescription": <string, rewrite the raw event description into a professional, premium 2-3 paragraph 'Event Overview' that sounds enticing. Remove all messy hashtags, emojis, and raw formatting. Do not invent details.>
}

If any piece of information is missing, use null or an empty array. Do not hallucinate data. If the event is in the past, still extract the date exactly as written.

CONTENT:
${markdown.slice(0, 30000)} // Truncating to avoid massive context
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const responseText = response.text || "{}";
      const data = JSON.parse(responseText);
      
      console.log('  - Extraction complete. Extracted data:', JSON.stringify(data, null, 2));
      
      // Update the DB
      const updateData: any = {
        entryFee: data.entryFee || tournament.entryFee,
        organizerName: data.organizerName || tournament.organizerName,
        organizerEmail: data.organizerEmail || tournament.organizerEmail,
        organizerPhone: data.organizerPhone || tournament.organizerPhone,
        includes: data.includes || tournament.includes,
        pricingDetails: JSON.stringify(data.pricingDetails || {}),
        prizes: JSON.stringify(data.prizes || []),
        sponsors: JSON.stringify(data.sponsors || []),
        rawDescription: tournament.rawDescription || tournament.description, // Preserve raw text
        description: data.cleanDescription || tournament.description, // Overwrite with premium text
        extractedAt: new Date().toISOString(),
        extractionConfidence: 1.0
      };

      // Only override fundamental details if they were clearly missing/TBD originally
      if (data.eventName && (tournament.name === 'TBD Event' || tournament.name.includes('TBD'))) {
         updateData.name = data.eventName;
      }
      if (data.dateStart && tournament.dateStart && tournament.dateStart.includes(new Date().getFullYear().toString())) {
         updateData.dateStart = data.dateStart;
      }
      if (data.courseName && (tournament.courseName === 'TBD Course' || !tournament.courseName)) {
         updateData.courseName = data.courseName;
      }
      if (data.courseCity && (tournament.courseCity === 'TBD City' || !tournament.courseCity)) {
         updateData.courseCity = data.courseCity;
      }
      if (data.courseState && (tournament.courseState === 'TBD State' || !tournament.courseState || tournament.courseState === 'US')) {
         updateData.courseState = data.courseState;
      }

      await db.update(tournaments)
        .set(updateData)
        .where(eq(tournaments.id, tournament.id));
        
      console.log('  - Successfully updated database.');
      
    } catch (e: any) {
      console.error(`  - Gemini error: ${e.message}`);
    }
  }
  
  console.log('\nFinished Checkback Engine loop.');
}

main().catch(console.error);
