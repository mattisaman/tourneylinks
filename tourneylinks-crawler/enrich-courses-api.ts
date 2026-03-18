import 'dotenv/config';
import fs from 'fs';
import { eq, gt } from 'drizzle-orm';
import { getDb } from './src/pipeline/database';
import { courses } from './src/pipeline/database';

const RAPID_API_KEY = '5ea23a48ccmsh48bb33e6b92f5c7p1e7423jsn2169f6d119f8';
const RAPID_API_HOST = 'golf-course-api.p.rapidapi.com';
const PROGRESS_FILE = '.enrichment-progress';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to convert state abbr to full name for matching (e.g. "NY" -> "New York")
const stateMap: Record<string, string> = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
  "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
  "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
  "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
  "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
  "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
  "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};

async function fetchCourseFromAPI(name: string) {
  try {
    const url = `https://${RAPID_API_HOST}/search?name=${encodeURIComponent(name.replace(/-/g, ' '))}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPID_API_HOST,
        'x-rapidapi-key': RAPID_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (res.status === 429) {
      console.log('Rate limited! Cooling down for 10 seconds...');
      await sleep(10000);
      return null;
    }

    if (!res.ok) {
      console.log(`Failed HTTP for ${name}: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`API Error for ${name}:`, error);
    return null;
  }
}

async function run() {
  const db = getDb();
  console.log('Starting background course enrichment worker...');

  let lastProcessedId = 0;
  if (fs.existsSync(PROGRESS_FILE)) {
    lastProcessedId = parseInt(fs.readFileSync(PROGRESS_FILE, 'utf-8'), 10);
    console.log(`Resuming from internal ID: ${lastProcessedId}`);
  }

  const batchSize = 10;
  
  while (true) {
    // Fetch batch
    const items = await db.select().from(courses)
      .where(gt(courses.id, lastProcessedId))
      .orderBy(courses.id)
      .limit(batchSize);

    if (items.length === 0) {
      console.log('Finished processing all courses!');
      break;
    }

    for (const course of items) {
      console.log(`Fetching: [${course.id}] ${course.name}...`);
      
      const apiResults = await fetchCourseFromAPI(course.name);
      
      if (apiResults && apiResults.length > 0) {
        // Find best match based on State or City
        const courseStateFull = stateMap[course.state.toUpperCase()] || course.state;
        
        const match = apiResults.find((r: any) => 
          r.state?.toLowerCase() === courseStateFull.toLowerCase() ||
          r.city?.toLowerCase() === course.city.toLowerCase()
        );

        if (match) {
          console.log(`   -> ✨ MATCH FOUND in ${match.city}, ${match.state}! Updating DB...`);
          
          let parsedHoles = course.holes;
          if (match.holes) parsedHoles = parseInt(match.holes, 10) || course.holes;
          
          let updateData: any = {
             website: match.website || course.website,
             // Save the rich JSON into rawMetadata so the UI can parse scorecard and teeBoxes later!
             rawMetadata: JSON.stringify(match)
          };
          
          // Optionally grab phone if missing
          if (!course.phone && match.phone) updateData.phone = match.phone;

          await db.update(courses)
            .set(updateData)
            .where(eq(courses.id, course.id));
        } else {
          console.log(`   -> No locational match among ${apiResults.length} API results.`);
        }
      } else {
        console.log(`   -> No results from API.`);
      }

      // Respect RapidAPI rate limits (usually 1 or 2 req / sec, so 1 second sleep)
      await sleep(1000);
      lastProcessedId = course.id;
      fs.writeFileSync(PROGRESS_FILE, lastProcessedId.toString());
    }
  }

  process.exit(0);
}

run().catch(console.error);
