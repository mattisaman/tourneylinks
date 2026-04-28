import { config } from 'dotenv';
config({ path: '.env.local' });
import { getExistingTournaments } from './src/lib/db';

async function main() {
  const tournaments = await getExistingTournaments();
  
  const getStatus = (t: any) => {
    if (!t.registrationDeadline) return "OPEN";
    const deadline = new Date(t.registrationDeadline);
    if (deadline < new Date()) return "CLOSED";
    return "OPEN";
  };

  const openTournaments = tournaments.filter(t => getStatus(t) === 'OPEN');
  
  console.log(`Total tournaments: ${tournaments.length}`);
  console.log(`Open tournaments: ${openTournaments.length}`);
}

main().catch(console.error);
