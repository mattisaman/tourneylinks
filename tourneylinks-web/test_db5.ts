import { config } from 'dotenv';
config({ path: '.env.local' });
import { db, tournaments } from './src/lib/db';

async function main() {
  const all = await db.select().from(tournaments);
  const sources = new Map<string, number>();
  for (const t of all) {
     const s = t.source || 'null';
     sources.set(s, (sources.get(s) || 0) + 1);
  }
  console.log(sources);
}

main().catch(console.error);
