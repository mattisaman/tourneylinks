import { config } from 'dotenv';
config({ path: '.env.local' });
import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const scrapeResult = await firecrawl.scrape('https://www.teamalaska.org/page/show/9061276-from-fairways-to-the-arctic-stage-register-for-the-2nd-annual-team-alaska-arctic-classic-today-', { formats: ['markdown', 'screenshot'] });
  console.log('has screenshot?', !!scrapeResult.screenshot);
  
  if (scrapeResult.screenshot) {
    const imgRes = await fetch(scrapeResult.screenshot);
    const arrayBuffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    
    console.log('Got image, length:', base64.length);
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
           "What is the schedule of events in this image? Return just text.",
           { inlineData: { data: base64, mimeType: 'image/jpeg' } }
        ]
      });
      console.log('Gemini says:', response.text);
    } catch(e) {
      console.error('Gemini error:', e);
    }
  }
}

run();
