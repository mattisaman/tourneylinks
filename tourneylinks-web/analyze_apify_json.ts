import fs from 'fs';

async function main() {
  const content = fs.readFileSync('apify_json', 'utf8');
  const events = JSON.parse(content);
  
  let validDates = 0;
  let unparseableDates = 0;
  let pastDates = 0;
  let futureDates = 0;
  
  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  for (const event of events) {
    const rawDate = event.startDate || event.startTime || event.utcStartDate;
    if (!rawDate) {
      unparseableDates++;
      continue;
    }
    
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) {
      unparseableDates++;
    } else {
      validDates++;
      if (d < todayAtMidnight) pastDates++;
      else futureDates++;
    }
  }
  
  console.log(`Total events: ${events.length}`);
  console.log(`Valid dates: ${validDates}`);
  console.log(`Unparseable dates: ${unparseableDates}`);
  console.log(`Past dates: ${pastDates}`);
  console.log(`Future dates: ${futureDates}`);
}

main().catch(console.error);
