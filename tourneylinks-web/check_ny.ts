import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { db, tournaments } from './src/lib/db';
import { ilike, or } from 'drizzle-orm';

async function main() {
  const nyTourneys = await db.select().from(tournaments).where(
    or(ilike(tournaments.courseState, '%NY%'), ilike(tournaments.courseState, '%New York%'))
  );
  console.log(`Total NY Tournaments in DB: ${nyTourneys.length}`);
  process.exit(0);
}
main().catch(console.error);
