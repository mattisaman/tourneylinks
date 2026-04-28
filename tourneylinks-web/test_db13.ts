import { config } from 'dotenv';
config({ path: '.env.local' });
import { getExistingTournaments } from './src/lib/db';

async function main() {
  const tournaments = await getExistingTournaments();
  console.log(`Total tournaments from getExistingTournaments: ${tournaments.length}`);
  
  const fbTournaments = tournaments.filter(t => t.source === 'facebook-apify');
  console.log(`Total facebook-apify from getExistingTournaments: ${fbTournaments.length}`);
}

main().catch(console.error);
