import fs from 'fs';

const fileContent = fs.readFileSync('apify_json_full_1', 'utf8');
const events = JSON.parse(fileContent);

console.log("Analyzing skipped events...");

for (const event of events) {
  const title = event.title || event.name || '';
  const description = event.description || '';
  const isGolf = /golf|scramble|tournament|classic/i.test(title) || /golf|scramble/i.test(description);
  const isMiniGolf = /mini\s*golf|minigolf|putt\s*putt|top\s*golf|pickle\s*ball|pickleball|tennis|clays/i.test(title) || /mini\s*golf|minigolf|putt\s*putt|top\s*golf|pickle\s*ball|pickleball/i.test(description);
  
  if (!isGolf) {
    console.log(`- Skipped (Not Golf): "${title}"`);
  } else if (isMiniGolf) {
    console.log(`- Skipped (MiniGolf/Pickleball/Tennis/Clays): "${title}"`);
  }
}
