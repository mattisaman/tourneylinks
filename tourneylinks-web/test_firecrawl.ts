import { config } from 'dotenv';
config({ path: '.env.local' });
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
console.log(typeof app.scrape);
console.log(typeof (app as any).v1?.scrapeUrl);
