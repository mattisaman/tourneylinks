import { getDb, tournaments } from './src/pipeline/database.js';
import { desc } from 'drizzle-orm';

async function run() {
  const db = getDb();
  const result = await db.select({
    name: tournaments.name,
    city: tournaments.courseCity,
    url: tournaments.sourceUrl
  }).from(tournaments).orderBy(desc(tournaments.createdAt)).limit(3);
  
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}
run().catch(console.error);
