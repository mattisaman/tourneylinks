import { db, crawlLogs } from './src/lib/db';

async function resetLogs() {
  console.log('Clearing crawl_logs table...');
  await db.delete(crawlLogs);
  console.log('Done! Pipeline cost is now refreshed to zero.');
  process.exit(0);
}

resetLogs().catch(console.error);
