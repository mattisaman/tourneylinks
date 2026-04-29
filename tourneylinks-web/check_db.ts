import { db, tournaments } from './src/lib/db';
import { desc, eq, sql } from 'drizzle-orm';

async function check() {
   const fbCount = await db.select({ count: sql<number>\`count(*)\` }).from(tournaments).where(eq(tournaments.source, 'facebook-apify'));
   console.log("Facebook-Apify Count:", fbCount[0].count);
   
   const t = await db.select().from(tournaments).where(eq(tournaments.source, 'facebook-apify')).orderBy(desc(tournaments.createdAt)).limit(5);
   console.log("\nRECENT FACEBOOK TOURNAMENTS:");
   t.forEach(x => console.log(`- ${x.name} | URL: ${x.sourceUrl}`));
   
   process.exit(0);
}

check();
