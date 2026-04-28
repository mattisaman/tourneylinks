import fs from 'fs';

async function main() {
  const content = fs.readFileSync('apify_json', 'utf8');
  const events = JSON.parse(content);
  
  let noLocation = 0;
  let hasLocation = 0;
  let hasCity = 0;
  let hasState = 0;

  for (const event of events) {
    if (!event.location) noLocation++;
    else {
      hasLocation++;
      if (event.location.city) hasCity++;
      if (event.location.state) hasState++;
    }
  }
  
  console.log(`Total events: ${events.length}`);
  console.log(`No location obj: ${noLocation}`);
  console.log(`Has location obj: ${hasLocation}`);
  console.log(`Has city: ${hasCity}`);
  console.log(`Has state: ${hasState}`);
}

main().catch(console.error);
