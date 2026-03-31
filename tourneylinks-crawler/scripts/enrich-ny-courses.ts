import 'dotenv/config';
import { getDb, courses } from '../src/pipeline/database';
import { eq, and, isNull } from 'drizzle-orm';
import { chromium } from 'playwright';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const db = getDb();

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function extractFromWebsite(url: string) {
  console.log(`[Playwright] Navigating to ${url}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' });
  const page = await context.newPage();
  
  try {
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    // Attempt to load page, timeout heavily restricted to 15s to keep scanner fast
    await page.goto(safeUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Attempt to find a tournament/outing/golf page to prioritize
    const links = await page.$$eval('a', elements => 
      elements.map(el => ({ text: el.textContent?.toLowerCase() || '', href: el.href }))
    );
    
    const outingLink = links.find(l => l.text.includes('tournament') || l.text.includes('outing') || l.text.includes('event'));
    
    if (outingLink && outingLink.href && outingLink.href.startsWith('http')) {
      console.log(`[Playwright] Found High-Value Internal Link: ${outingLink.href}`);
      await page.goto(outingLink.href, { waitUntil: 'domcontentloaded', timeout: 15000 });
    }
    
    // Extract fully rendered text from the best page
    const textContent = await page.evaluate(() => document.body.innerText);
    await browser.close();
    
    if (!textContent || textContent.length < 50) return null;
    
    console.log(`[Gemini 1.5 Flash] Analyzing ${textContent.length} characters of course data...`);
    
    // Cut massive sites down to Gemini context window if necessary (1m tokens is plenty, but we'll safely slice string to 30k chars)
    const promptText = textContent.slice(0, 30000);
    
    const prompt = `
      You are an expert data extractor parsing a global Golf Course's website.
      I need you to extract the following information out of this messy website text, explicitly searching for Tournament, Guest, or Outing Policies and general Contact info.
      
      Output ONLY valid JSON matching this schema exactly, nothing else:
      {
        "email": "string or null if not found",
        "guestPolicy": "A concise, well-written multi-sentence string summarizing their tournament rules, outing packages, pricing, or guest policy. Max 3 sentences. Null if entirely absent."
      }
      
      Website Text:
      "${promptText}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-pro',
      contents: prompt,
    });

    let resultText = response.text || '';
    resultText = resultText.replace(/```json\n?|\n?```/g, '').trim();
    if (!resultText) return null;
    
    const parsed = JSON.parse(resultText);
    return parsed;

  } catch (error) {
    console.log(`[Error] Failed scraping ${url}:`, (error as Error).message);
    await browser.close();
    return null;
  }
}

async function runNYEnrichment() {
  console.log('Fetching NY Courses missing emails or policies...');
  
  // Get all NY courses that have a website but are missing email or guestPolicy
  const targets = await db.select().from(courses)
    .where(
        and(
            eq(courses.state, 'NY'),
            // eq(courses.website, '...'), // In a real SQL query we'd enforce website NOT NULL
        )
    );
    
  const validTargets = targets.filter(c => c.website && c.website.length > 5 && (!c.email || !c.guestPolicy));
  console.log(`Found ${validTargets.length} courses in NY ready for Gemini enrichment.`);

  for (let i = 0; i < validTargets.length; i++) {
    const course = validTargets[i];
    console.log(`\n--- [${i+1}/${validTargets.length}] Analyzing: ${course.name} ---`);
    if (!course.website) continue;
    
    const extractedData = await extractFromWebsite(course.website);
    
    if (extractedData) {
      console.log(`[Result] Email: ${extractedData.email || 'None'} | Policy: ${extractedData.guestPolicy ? 'Found' : 'None'}`);
      
      // Update the database!
      const payloads: any = {};
      if (extractedData.email && !course.email) payloads.email = extractedData.email;
      if (extractedData.guestPolicy && !course.guestPolicy) payloads.guestPolicy = extractedData.guestPolicy;
      
      if (Object.keys(payloads).length > 0) {
        await db.update(courses).set(payloads).where(eq(courses.id, course.id));
        console.log(`[Database] Successfully patched ${course.name}`);
      }
    }
    
    // Wait 2 seconds between scraping to avoid IP bans
    await delay(2000);
  }
  
  console.log('\n✅ NY Pipeline Complete.');
  process.exit(0);
}

runNYEnrichment().catch(console.error);
