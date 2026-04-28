import fs from 'fs';

const fileContent = fs.readFileSync('apify_json_full_1', 'utf8');
const events = JSON.parse(fileContent);

console.log("Analyzing skipped events...");

for (const event of events) {
  const title = event.title || event.name || '';
  const description = event.description || '';
  const isGolf = /golf|scramble|tournament|classic/i.test(title) || /golf|scramble/i.test(description);
  const isMiniGolf = /mini\s*golf|minigolf|putt\s*putt|top\s*golf|pickle\s*ball|pickleball|tennis|clays/i.test(title) || /mini\s*golf|minigolf|putt\s*putt|top\s*golf|pickle\s*ball|pickleball/i.test(description);
  
  if (!isGolf || isMiniGolf) continue;

  const countryCode = event.location?.countryCode || event['location.countryCode'] || '';
  if (countryCode && countryCode !== 'US') {
    console.log(`- Skipped (Non-US): "${title}" - Country: ${countryCode}`);
    continue;
  }
}
