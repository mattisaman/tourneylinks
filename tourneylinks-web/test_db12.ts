import fs from 'fs';

async function main() {
  const content = fs.readFileSync('apify_json', 'utf8');
  const events = JSON.parse(content);
  
  let hasCity = 0;
  let hasState = 0;
  let hasCountry = 0;

  for (const event of events) {
    if (event['location.city']) hasCity++;
    if (event['location.state']) hasState++;
    if (event['location.countryCode']) hasCountry++;
  }
  
  console.log(`Total events: ${events.length}`);
  console.log(`Has city: ${hasCity}`);
  console.log(`Has state: ${hasState}`);
  console.log(`Has country: ${hasCountry}`);
}

main().catch(console.error);
