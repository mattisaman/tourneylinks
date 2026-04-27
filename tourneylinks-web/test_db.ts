import { config } from 'dotenv';
config({ path: './.env.local' });
import { db, crawlLogs, tournaments } from './src/lib/db';
import { desc, inArray } from 'drizzle-orm';

async function run() {
  const recentLogs = await db.select().from(crawlLogs).orderBy(desc(crawlLogs.crawledAt)).limit(10);
  const logUrls = recentLogs.map(l => l.url);
  console.log("Log URLs:", logUrls);
  
  const recentTournaments = await db.select({
      id: tournaments.id,
      sourceUrl: tournaments.sourceUrl,
      name: tournaments.name
    }).from(tournaments).where(inArray(tournaments.sourceUrl, logUrls));
  
  console.log("Recent Tournaments found:", recentTournaments);
  process.exit(0);
}
run();
