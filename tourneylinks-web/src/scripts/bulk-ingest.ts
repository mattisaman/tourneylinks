import { db } from '../lib/db';
import { courses } from '../lib/db';
import { isNull, eq, and, or, ilike } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load Env
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function searchDuckDuckGo(query: string): Promise<string | null> {
  console.log(`\n🔍 Searching DuckDuckGo for: ${query}`);
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await res.text();
    // DuckDuckGo puts actual links in class="result__url"
    const match = html.match(/class="result__url"[^>]*href="([^"]+)"/i);
    if (!match) return null;
    
    let url = match[1];
    if (url.startsWith('//')) url = 'https:' + url;
    return url;
  } catch (err) {
    console.error(`DuckDuckGo Search Failed:`, err);
    return null;
  }
}

async function scrapeAndExtract(url: string, courseName: string) {
  console.log(`🕷️ Crawling URL: ${url}`);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const html = await res.text();
    const cleanText = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 50000);

    console.log(`🧠 Sending payload to Gemini 2.5 Flash...`);
    
    const prompt = `You are an expert golf data parser. Analyze this raw text scraped from the official website of ${courseName}.
Extract the exact data and output ONLY valid JSON matching this schema exactly. 
If any fields cannot be found, use null (or false for booleans). Do NOT hallucinate data.
{
  "type": "string (Public, Private, Semi-Private, Resort, Municipal)",
  "holes": 18,
  "par": 72,
  "architect": "string or null",
  "yearBuilt": 1990,
  "guestPolicy": "string or null",
  "email": "string or null (Look explicitly for info@, gm@, contact, or tournament director emails)",
  "hasDrivingRange": true,
  "hasChippingArea": true,
  "hasPuttingGreen": true,
  "hasProShop": true
}
RAW TEXT: ${cleanText}`;

    const completion = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(completion.text || "{}");
  } catch (err) {
    console.error(`AI Extraction Failed for ${url}:`, err);
    return null;
  }
}

async function run() {
  console.log("🚀 Starting Phase 32 Unattended Autonomous AI Crawler...");
  
  while (true) {
    console.log(`\n\n[System] Pulling Database Block...`);
    // Grab 10 unindexed courses at a time
    const targets = await db.select().from(courses)
      .where(and(eq(courses.isActive, true), isNull(courses.website)))
      .limit(10);

    if (targets.length === 0) {
      console.log("✅ All courses completely indexed!");
      process.exit(0);
    }

    for (const course of targets) {
      console.log(`\n================================`);
      console.log(`🎯 TARGET: ${course.name} (${course.city}, ${course.state})`);
      
      // 1. Discover Official URL
      const searchString = `${course.name} ${course.city} ${course.state} official golf website`;
      let url = course.website;
      
      if (!url) {
        url = await searchDuckDuckGo(searchString);
        if (!url) {
          console.log(`❌ Could not discover URL via DuckDuckGo.`);
          continue;
        }
        console.log(`✅ Discovered URL: ${url}`);
      }

      // 2. Scrape & Extract via Gemini
      const extractedData = await scrapeAndExtract(url, course.name);
      if (!extractedData) continue;

      console.log(`✨ AI Extraction Complete. Found Email: ${extractedData.email || 'None'}`);

      // 3. Commit to PostgreSQL
      await db.update(courses).set({
        ...extractedData,
        website: url,
        rawMetadata: JSON.stringify(extractedData),
        updatedAt: new Date()
      }).where(eq(courses.id, course.id));
      
      console.log(`💾 PostgreSQL Updated Successfully!`);
      
      // Throttle to respect DuckDuckGo & Gemini rate limits
      await new Promise(res => setTimeout(res, 5000));
    }
    
    console.log(`\n⏳ Batch completed. Sleeping for 15 seconds to flush IP Cloudflare buffers...`);
    await new Promise(res => setTimeout(res, 15000));
  }
}

run().catch(console.error);
