import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from '../src/lib/db';
import { isNull, and, isNotNull, ne, eq } from 'drizzle-orm';
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
        isNotNull(tournaments.registrationUrl),
        isNull(tournaments.extractedAt),
        gte(tournaments.dateStart, today.toISOString())
      )
    )
    .limit(5); // Limit to 5 for safety during testing

  if (pendingTournaments.length === 0) {
    console.log('No tournaments need checkback at this time.');
    return;
  }

  console.log(`Found ${pendingTournaments.length} tournaments to process.`);

  for (const tournament of pendingTournaments) {
    console.log(`\nProcessing [${tournament.id}] ${tournament.name}`);
    const url = tournament.registrationUrl;
    
    if (!url) continue;
    
    console.log(`- Scraping URL: ${url}`);
    let markdown = '';
    
    try {
      const scrapeResult = await firecrawl.scrape(url, { formats: ['markdown'] });
      if (!scrapeResult || !scrapeResult.markdown) {
        console.error(`  - Failed to scrape or no markdown returned`);
        // Mark as extracted so we don't retry endlessly, but with 0 confidence
        await db.update(tournaments)
          .set({ extractedAt: new Date().toISOString(), extractionConfidence: 0.1 })
          .where(eq(tournaments.id, tournament.id));
        continue;
      }
      markdown = scrapeResult.markdown || '';
    } catch (e: any) {
      console.error(`  - FireCrawl error: ${e.message}`);
      await db.update(tournaments)
        .set({ extractedAt: new Date().toISOString(), extractionConfidence: 0.1 })
        .where(eq(tournaments.id, tournament.id));
      continue;
    }

    if (!markdown || markdown.trim().length < 50) {
      console.log('  - Extracted markdown is too short, skipping.');
      await db.update(tournaments)
        .set({ extractedAt: new Date().toISOString(), extractionConfidence: 0.1 })
        .where(eq(tournaments.id, tournament.id));
      continue;
    }

    console.log(`  - Extracted ${markdown.length} bytes of markdown. Sending to Gemini...`);
    
    // Call Gemini
    const prompt = `You are a golf tournament data extraction specialist.
Analyze the following markdown content scraped from a golf tournament registration page.
Extract the relevant details and output strictly as a JSON object matching this schema:

{
  "entryFee": <number or null, the base entry fee per individual player in dollars. Just the number, e.g. 150>,
  "pricingDetails": <object, e.g. {"foursome": 600, "individual": 150, "mulligans": 20}>,
  "prizes": <array of strings, e.g. ["1st Place: $500", "Longest Drive"]>,
  "sponsors": <array of strings, e.g. ["Title Sponsor: $5000", "Hole Sponsor: $200"]>,
  "organizerName": <string or null>,
  "organizerEmail": <string or null>,
  "organizerPhone": <string or null>,
  "includes": <string or null, what is included like "Dinner, Cart, Green Fees">
}

If any piece of information is missing, use null or an empty array. Do not hallucinate data.

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
      await db.update(tournaments)
        .set({
          entryFee: data.entryFee || tournament.entryFee,
          organizerName: data.organizerName || tournament.organizerName,
          organizerEmail: data.organizerEmail || tournament.organizerEmail,
          organizerPhone: data.organizerPhone || tournament.organizerPhone,
          includes: data.includes || tournament.includes,
          pricingDetails: JSON.stringify(data.pricingDetails || {}),
          prizes: JSON.stringify(data.prizes || []),
          sponsors: JSON.stringify(data.sponsors || []),
          extractedAt: new Date().toISOString(),
          extractionConfidence: 1.0
        })
        .where(eq(tournaments.id, tournament.id));
        
      console.log('  - Successfully updated database.');
      
    } catch (e: any) {
      console.error(`  - Gemini error: ${e.message}`);
    }
  }
  
  console.log('\nFinished Checkback Engine loop.');
}

main().catch(console.error);
