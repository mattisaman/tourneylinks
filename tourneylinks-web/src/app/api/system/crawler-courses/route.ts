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
            lt(courses.lastCrawledAt, sevenDaysAgo)
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
      .set({ lastCrawledAt: new Date() })
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
You are an expert golf course intelligence AI.
Analyze the following markdown extracted from a golf course's website.
Look for any information related to hosting charity golf tournaments, scrambles, or corporate outings.

Extract a JSON object with the following fields:
- "hasTournaments": (boolean) True if the course hosts public tournaments or outings
- "tournamentPageUrls": (array of strings) Any URLs pointing to dedicated "Host an Event" or "Tournaments" pages found in the text
- "tournamentFiles": (array of strings) Any URLs to PDFs, DOCs, or brochures related to outings
- "contactEmail": (string or null) The best email address for tournament/outing coordination. If none found, return null.
- "contactPhone": (string or null) The best phone number for tournament coordination. If none found, return null.

IMPORTANT: Only return the raw JSON object. Do not wrap in markdown or backticks.
Markdown Content:
${markdown.substring(0, 80000)}
`;

    try {
      let response;
      let retries = 3;
      let delay = 1000;
      
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [prompt],
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
      let data: any = {};
      try {
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        data = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("Failed to parse Gemini JSON. Raw response:", responseText);
        throw new Error("Invalid JSON format from Gemini");
      }

      // Update the course record with the extracted intelligence
      const updatePayload: any = {};
      
      // Update email and phone if we found them and they don't already exist on the course
      if (data.contactEmail && !course.email) {
         updatePayload.email = data.contactEmail;
      }
      if (data.contactPhone && !course.phone) {
         updatePayload.phone = data.contactPhone;
      }

      // Handle raw metadata (tournament pages)
      if (data.tournamentPageUrls && data.tournamentPageUrls.length > 0) {
         try {
           const existingMeta = course.rawMetadata ? JSON.parse(course.rawMetadata) : {};
           existingMeta.tournamentPageUrls = data.tournamentPageUrls;
           updatePayload.rawMetadata = JSON.stringify(existingMeta);
         } catch(e) {}
      }

      // Handle PDF files
      if (data.tournamentFiles && data.tournamentFiles.length > 0) {
         try {
           const existingDocs = course.originalDocumentUrls ? JSON.parse(course.originalDocumentUrls) : [];
           const mergedDocs = Array.from(new Set([...existingDocs, ...data.tournamentFiles]));
           updatePayload.originalDocumentUrls = JSON.stringify(mergedDocs);
         } catch(e) {}
      }

      if (Object.keys(updatePayload).length > 0) {
         await db.update(courses).set(updatePayload).where(eq(courses.id, course.id));
      }
      
      return NextResponse.json({ 
        complete: false, 
        processedId: course.id, 
        courseName: course.name,
        action: data.hasTournaments ? 'Found Outing Info' : 'No Outing Info'
      });
      
    } catch (e: any) {
      console.error(`Gemini error: ${e.message}`);
      return NextResponse.json({ 
        complete: false, 
        processedId: course.id, 
        courseName: course.name,
        action: `Failed (${e.message.substring(0, 30)})` 
      });
    }

  } catch (error: any) {
    console.error('Fatal API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
