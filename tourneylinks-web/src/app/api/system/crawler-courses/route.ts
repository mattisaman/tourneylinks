import { NextResponse } from 'next/server';
import { db, courses, tournaments } from '@/lib/db';
import { and, isNotNull, lt, or, isNull, asc, eq } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';
import FirecrawlApp from '@mendable/firecrawl-js';

export const maxDuration = 300; // 5 minutes max per request to avoid timeout
export const dynamic = 'force-dynamic';

export async function POST() {
  console.log("Clubhouse Crawler API Hit");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

    // Threshold for crawling a course again is 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find just ONE eligible course
    const eligibleCourses = await db.select().from(courses)
      .where(
        and(
          isNotNull(courses.website),
          or(
            isNull(courses.lastCrawledAt),
            lt(courses.lastCrawledAt, sevenDaysAgo.toISOString())
          )
        )
      )
      .orderBy(asc(courses.id))
      .limit(1);

    if (eligibleCourses.length === 0) {
      return NextResponse.json({ complete: true, message: 'All courses crawled recently.' });
    }

    const course = eligibleCourses[0];
    const url = course.website!;
    
    // Optimistically update the lastCrawledAt to prevent duplicate crawling if this fails or times out
    await db.update(courses)
      .set({ lastCrawledAt: new Date().toISOString() })
      .where(eq(courses.id, course.id));

    let markdown = '';
    
    try {
      console.log(`Scraping ${url} for course: ${course.name}`);
      const scrapeResult = await firecrawl.scrape(url, { formats: ['markdown'] });
      
      if (!scrapeResult || !scrapeResult.markdown) {
         console.warn(`No markdown returned for ${url}`);
      } else {
         markdown = scrapeResult.markdown;
      }
    } catch (e: any) {
      console.error(`FireCrawl error for ${url}: ${e.message}`);
    }

    if (!markdown || markdown.trim().length < 50) {
       return NextResponse.json({ 
          complete: false, 
          processedId: course.id, 
          courseName: course.name,
          action: 'Failed (No Content)' 
       });
    }

    const prompt = `
You are an expert golf tournament discovery AI.
Analyze the following markdown extracted from a golf course's website.
Look for any upcoming public charity golf tournaments, scrambles, or outings.
Do NOT include standard daily tee times, leagues, or generic course information.

Extract a JSON array of event objects. Each object MUST contain:
- "name": (string) The name of the event
- "dateStart": (string) The start date and time if available (ISO format or descriptive)
- "entryFee": (number or null) The price per player
- "description": (string) A brief description of the event
- "organizerName": (string or null) The charity or host name

If no events are found, return an empty array [].

IMPORTANT: Only return the raw JSON array. Do not wrap in markdown or backticks.
Markdown Content:
${markdown.substring(0, 80000)}
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt],
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const responseText = response.text || "[]";
      let events: any[] = [];
      try {
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        events = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("Failed to parse Gemini JSON. Raw response:", responseText);
        throw new Error("Invalid JSON format from Gemini");
      }
      
      if (!Array.isArray(events)) {
         events = [events];
      }

      let insertedCount = 0;
      
      for (const event of events) {
         if (!event.name) continue;
         
         await db.insert(tournaments).values({
            name: event.name,
            sourceUrl: url,
            sourceId: `course-website-${course.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            source: 'course-website',
            dateStart: event.dateStart || null,
            entryFee: event.entryFee ? Number(event.entryFee) : null,
            description: event.description || null,
            organizerName: event.organizerName || course.name,
            courseName: course.name,
            courseCity: course.city,
            courseState: course.state,
            status: 'active'
         });
         insertedCount++;
      }
      
      return NextResponse.json({ 
        complete: false, 
        processedId: course.id, 
        courseName: course.name,
        action: \`Extracted \${insertedCount} Events\`
      });
      
    } catch (e: any) {
      console.error(`Gemini error: ${e.message}`);
      return NextResponse.json({ 
        complete: false, 
        processedId: course.id, 
        courseName: course.name,
        action: 'Failed (AI Error)' 
      });
    }

  } catch (error: any) {
    console.error('Fatal API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
