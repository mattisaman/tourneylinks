import { db, tournaments } from './src/lib/db';
import { eq } from 'drizzle-orm';

async function main() {
  const all = await db.select({
    id: tournaments.id,
    name: tournaments.name,
    isActive: tournaments.isActive,
    status: tournaments.status
  }).from(tournaments).where(eq(tournaments.source, 'facebook-apify')).limit(5);
  console.log(all);
}
main().catch(console.error);
