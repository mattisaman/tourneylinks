import { NextResponse } from 'next/server';
import { db, courses } from '@/lib/db';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    // 1. Fetch the raw HTML from the target golf course website
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    
    if (!response.ok) {
        return NextResponse.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: response.status });
    }

    const html = await response.text();
    
    // 2. Aggressively strip scripts, styles, and HTML tags to compress the context layer
    const cleanText = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 60000); // Prevent context-window token explosion

    // 3. Construct the deterministic schema extraction prompt
    const prompt = `You are an expert golf data parser for TourneyLinks. Analyze the following raw text scraped from a golf course website.
Extract the exact data and output ONLY valid JSON matching this schema exactly. 
If any fields cannot be found, use null (or false for booleans). Do NOT hallucinate data not found in the text.
{
  "name": "string (the official name of the golf course)",
  "address": "string (street address)",
  "city": "string",
  "state": "string (2-letter abbreviation)",
  "zip": "string",
  "phone": "string",
  "type": "string (Public, Private, Semi-Private, Resort, Municipal)",
  "holes": 18,
  "par": 72,
  "architect": "string or null",
  "yearBuilt": 1990,
  "guestPolicy": "string or null",
  "hasDrivingRange": true,
  "hasChippingArea": true,
  "hasPuttingGreen": true,
  "hasProShop": true
}

URL: ${url}
RAW TEXT: ${cleanText}`;

    // 4. Ping the Model
    const completion = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const output = completion.text || "{}";
    const data = JSON.parse(output);

    // 5. Commit directly to PostgreSQL
    const [inserted] = await db.insert(courses).values({
      ...data,
      website: url,
      isActive: true,
      rawMetadata: output
    }).returning();

    return NextResponse.json({ success: true, course: inserted });

  } catch (error: any) {
    console.error('AI Ingestion Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to instantly ingest course dataset via AI' }, { status: 500 });
  }
}
