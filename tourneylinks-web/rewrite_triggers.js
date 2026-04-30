const fs = require('fs');

const replacements = [
  {
    file: 'src/app/system/dashboard/ApifySyncTrigger.tsx',
    search: "Phase 1: Apify Sync",
    replace: "Step 1: Sync External Scrapers"
  },
  {
    file: 'src/app/system/dashboard/ApifySyncTrigger.tsx',
    search: "Pull raw webhook payloads from the Apify actor queue.",
    replace: "Pull raw event data from our external scraping partners."
  },
  {
    file: 'src/components/dashboard/SmartSpiderTrigger.tsx',
    search: "Phase 2: Smart Spider",
    replace: "Step 2: Search Local Web"
  },
  {
    file: 'src/components/dashboard/SmartSpiderTrigger.tsx',
    search: "Crawl target URLs to discover native golf tournaments.",
    replace: "Search the web for local golf tournaments in target regions."
  },
  {
    file: 'src/app/system/dashboard/PlatformSearchTrigger.tsx',
    search: "Phase 3: SaaS Platforms",
    replace: "Step 3: Search Event Platforms"
  },
  {
    file: 'src/app/system/dashboard/PlatformSearchTrigger.tsx',
    search: "Query FB and Eventbrite for regional tournaments.",
    replace: "Query Facebook and Eventbrite for regional tournaments."
  },
  {
    file: 'src/app/system/dashboard/CheckbackTrigger.tsx',
    search: "Phase 4: Universal AI Normalizer",
    replace: "Step 4: Clean & Format Raw Data"
  },
  {
    file: 'src/app/system/dashboard/CheckbackTrigger.tsx',
    search: "Process raw JSON into structured relational records.",
    replace: "Use AI to clean raw data and format it perfectly for the directory."
  },
  {
    file: 'src/app/system/dashboard/CrawlerTrigger.tsx',
    search: "Phase 5: Course Intelligence",
    replace: "Step 5: Fetch Course Logos & Amenities"
  },
  {
    file: 'src/app/system/dashboard/CrawlerTrigger.tsx',
    search: "Crawl club sites for logos, amenities, and contact info.",
    replace: "Automatically fetch missing logos and course details from club websites."
  }
];

for (const rep of replacements) {
  let content = fs.readFileSync(rep.file, 'utf8');
  content = content.replace(rep.search, rep.replace);
  fs.writeFileSync(rep.file, content, 'utf8');
}
console.log("Triggers renamed.");
