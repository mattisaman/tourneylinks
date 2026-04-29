import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from './src/lib/db';
import { crawlLogs } from './src/lib/db';
import { desc } from 'drizzle-orm';

async function main() {
  const logs = await db.select().from(crawlLogs).orderBy(desc(crawlLogs.crawledAt)).limit(5);
  console.log(logs);
}

main().catch(console.error);
