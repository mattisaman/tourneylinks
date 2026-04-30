import { NextResponse } from 'next/server';
import { db, tournaments } from '@/lib/db';
import { and, eq, isNull, gte, asc } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';
import FirecrawlApp from '@mendable/firecrawl-js';

export const maxDuration = 300; // 5 minutes max per request to avoid timeout
export const dynamic = 'force-dynamic';

export async function POST() {
  console.log("Normalizer API Hit");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find just ONE pending tournament
    const pendingTournaments = await db.select().from(tournaments)
      .where(
        and(
          eq(tournaments.status, 'active'),
          isNull(tournaments.extractedAt),
          gte(tournaments.dateStart, today.toISOString())
        )
      )
      .orderBy(asc(tournaments.id))
      .limit(1);

    if (pendingTournaments.length === 0) {
      return NextResponse.json({ complete: true, message: 'All caught up.' });
    }

    const tournament = pendingTournaments[0];
    let url = tournament.registrationUrl || tournament.sourceUrl;
    
    // Facebook blocks scrapers, and we already have the full description from Apify anyway.
    if (url && url.includes('facebook.com')) {
        url = null; 
    }
    
    let markdown = '';
    let screenshotUrl: string | null = null;
    
    if (url) {
      try {
        const scrapeResult = await firecrawl.scrape(url, { formats: ['markdown', 'screenshot'] });
        if (!scrapeResult || (!scrapeResult.markdown && !scrapeResult.screenshot)) {
          markdown = tournament.description || '';
        } else {
          markdown = scrapeResult.markdown || '';
        }
        screenshotUrl = scrapeResult.screenshot || null;
      } catch (e: any) {
        console.error(`FireCrawl error: ${e.message}`);
        markdown = tournament.description || '';
      }
    } else {
      markdown = tournament.description || '';
    }

    if (!markdown || markdown.trim().length < 50) {
      await db.update(tournaments)
        .set({ extractedAt: new Date().toISOString(), extractionConfidence: 0.1 })
        .where(eq(tournaments.id, tournament.id));
      return NextResponse.json({ 
        complete: false, 
        processedId: tournament.id, 
        tournamentName: tournament.name,
        action: 'Skipped (No Content)' 
      });
    }

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
  "schedule": <array of objects, e.g. [{"time": "10:00 AM", "event": "Registration"}, {"time": "12:00 PM", "event": "Shotgun Start"}]>,
  "cleanDescription": <string, rewrite the raw event description into a professional, premium 2-3 paragraph 'Event Overview' that sounds enticing. Remove all messy hashtags, emojis, and raw formatting. Do not invent details.>
}

If any piece of information is missing, use null or an empty array. Do not hallucinate data. If the event is in the past, still extract the date exactly as written.

CONTENT:
${markdown.slice(0, 30000)}
`;

    try {
      const contents: any[] = [prompt];
      
      if (screenshotUrl) {
        try {
          const imgRes = await fetch(screenshotUrl);
          const arrayBuffer = await imgRes.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          contents.push({
            inlineData: {
              data: base64,
              mimeType: 'image/jpeg'
            }
          });
        } catch (imgErr) {
          console.error("Failed to fetch screenshot for AI:", imgErr);
        }
      }

      let response;
      let retries = 3;
      let delay = 1000;
      
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
              responseMimeType: "application/json",
            }
          });
          break; // Success, exit retry loop
        } catch (apiError: any) {
          retries--;
          if (retries === 0 || !apiError.message?.includes('503')) {
            throw apiError; // Throw if out of retries or not a 503
          }
          console.log(`[Gemini] 503 Service Unavailable. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
      
      const responseText = response?.text || "{}";
      let data = {};
      try {
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        data = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("Failed to parse Gemini JSON. Raw response:", responseText);
        throw new Error("Invalid JSON format from Gemini");
      }

      const updateData: any = {
        entryFee: data.entryFee || tournament.entryFee,
        organizerName: data.organizerName || tournament.organizerName,
        organizerEmail: data.organizerEmail || tournament.organizerEmail,
        organizerPhone: data.organizerPhone || tournament.organizerPhone,
        includes: data.includes || tournament.includes,
        pricingDetails: JSON.stringify(data.pricingDetails || {}),
        prizes: JSON.stringify(data.prizes || []),
        sponsors: JSON.stringify(data.sponsors || []),
        schedule: JSON.stringify(data.schedule || []),
        rawDescription: tournament.rawDescription || tournament.description,
        description: data.cleanDescription || tournament.description,
        extractedAt: new Date().toISOString(),
        extractionConfidence: 1.0
      };

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
        
      return NextResponse.json({ 
        complete: false, 
        processedId: tournament.id, 
        tournamentName: tournament.name || updateData.name,
        action: 'Normalized'
      });
      
    } catch (e: any) {
      console.error(`Gemini error: ${e.message}`);
      // Mark as extracted so we don't get stuck in an infinite loop on failure
      await db.update(tournaments)
        .set({ extractedAt: new Date().toISOString(), extractionConfidence: 0.0 })
        .where(eq(tournaments.id, tournament.id));
        
      return NextResponse.json({ 
        complete: false, 
        processedId: tournament.id, 
        tournamentName: tournament.name,
        action: `Failed (${e.message.substring(0, 30)})` 
      });
    }

  } catch (error: any) {
    console.error('Fatal API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
