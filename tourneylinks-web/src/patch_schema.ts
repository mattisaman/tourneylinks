import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from './lib/db';
import { sql } from 'drizzle-orm';

async function fixSchema() {
  try {
     await db.execute(sql`ALTER TABLE tournaments ADD COLUMN raw_description text;`);
     console.log('Added raw_description to tournaments');
  } catch (e) { console.log(e.message); }
  
  try {
     await db.execute(sql`ALTER TABLE courses ADD COLUMN normalized_rules text;`);
     console.log('Added normalized_rules to courses');
  } catch (e) { console.log(e.message); }

  try {
     await db.execute(sql`ALTER TABLE courses ADD COLUMN normalized_faq text;`);
     console.log('Added normalized_faq to courses');
  } catch (e) { console.log(e.message); }
  
  try {
     await db.execute(sql`ALTER TABLE courses ADD COLUMN original_document_urls text;`);
     console.log('Added original_document_urls to courses');
  } catch (e) { console.log(e.message); }
  
  try {
     await db.execute(sql`ALTER TABLE courses ADD COLUMN last_crawled_at timestamp;`);
     console.log('Added last_crawled_at to courses');
  } catch (e) { console.log(e.message); }

  try {
     await db.execute(sql`ALTER TABLE crawl_logs ADD COLUMN details text;`);
     console.log('Added details to crawl_logs');
  } catch (e) { console.log(e.message); }

  console.log('Schema patch complete!');
  process.exit(0);
}
fixSchema();
