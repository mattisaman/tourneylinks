import { NextResponse } from 'next/server';
import { db, courses } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';
import FirecrawlApp from '@mendable/firecrawl-js';

export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

    const { courseId, url } = await req.json();

    if (!courseId || !url) {
      return NextResponse.json({ error: 'Missing courseId or url' }, { status: 400 });
    }

    // 1. Scrape the documentation URL using FireCrawl
    const scrapeResult = await firecrawl.scrapeUrl(url, { formats: ['markdown'] });
    
    if (!scrapeResult || !scrapeResult.markdown) {
      return NextResponse.json({ error: 'Failed to extract content from the provided URL' }, { status: 400 });
    }

    const markdown = scrapeResult.markdown;

    // 2. Feed the raw documentation to Gemini to extract Rules and FAQs
    const prompt = `You are a golf course documentation specialist.
Analyze the following text content scraped from a golf course's website, rulebook, or tournament outing guide.
Extract the rules and frequently asked questions, and format them into beautiful Markdown.

Respond strictly with a JSON object matching this schema:
{
  "normalizedRules": <string, Markdown formatted list of rules, dress code, pace of play, and policies>,
  "normalizedFaq": <string, Markdown formatted Q&A section for common questions regarding outings, tournaments, and general play>
}

If the text does not contain enough information for one of the sections, return an empty string or a polite fallback message indicating that specific rules were not found in the document. Do not hallucinate or invent rules not present in the text.

CONTENT:
${markdown.slice(0, 30000)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const responseText = response.text || "{}";
    const data = JSON.parse(responseText);

    const existingCourse = await db.select().from(courses).where(eq(courses.id, courseId));
    const currentDocs = existingCourse[0]?.originalDocumentUrls ? JSON.parse(existingCourse[0].originalDocumentUrls as string) : [];

    // Append this URL to their sources
    if (!currentDocs.includes(url)) {
      currentDocs.push(url);
    }

    // 3. Update the database
    await db.update(courses)
      .set({
        normalizedRules: data.normalizedRules || null,
        normalizedFaq: data.normalizedFaq || null,
        originalDocumentUrls: JSON.stringify(currentDocs)
      })
      .where(eq(courses.id, courseId));

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('Doc Extraction Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
