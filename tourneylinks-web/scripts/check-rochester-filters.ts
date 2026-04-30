import { db, tournaments } from '../src/lib/db';
import { sql, and, notInArray, eq, asc } from 'drizzle-orm';
async function main() {
  const rows = await db.select().from(tournaments)
    .where(and(
      eq(tournaments.isActive, true),
      notInArray(tournaments.source, ['state-associations', 'usga-events']),
      sql`${tournaments.formatDetails} NOT LIKE '%Sanctioned/Pro%' OR ${tournaments.formatDetails} IS NULL`
    ))
    .orderBy(asc(tournaments.dateStart));
    
  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  const filtered = rows.filter((t) => {
    if (!t.dateStart) return false;
    const parsedDate = new Date(t.dateStart);
    if (isNaN(parsedDate.getTime())) return false;
    if (parsedDate < todayAtMidnight) return false;
    
    const lowerName = t.name.toLowerCase();
    const lowerUrl = (t.sourceUrl || '').toLowerCase();
    const lowerOrg = (t.organizerName || '').toLowerCase();
    
    const isStateAssoc = [
      'usga', 'vsga', 'ncga', 'scga', 'nysga', 'cga', 'riga', 
      'csga', 'njsga', 'fsga', 'gsga', 'cdga', 'iga', 'wga', 
      'moga', 'txga', 'okga', 'oga', 'azgolf', 'state golf association',
      'amateur championship', 'open championship'
    ].some(keyword => 
      lowerName.includes(keyword) || 
      lowerUrl.includes(keyword) || 
      lowerOrg.includes(keyword)
    );
    
    if (isStateAssoc) return false;
    if (lowerName.includes('league')) return false;
    return true;
  });

  const rochesterFiltered = filtered.filter(t => 
    t.courseCity && (t.courseCity.toLowerCase().includes('rochester') || t.courseCity.toLowerCase() === 'victor')
  );

  console.log(`Rochester Area after DB filters: ${rochesterFiltered.length}`);
  rochesterFiltered.forEach(t => console.log(`- ${t.name} (${t.courseCity})`));
  process.exit(0);
}
main();
