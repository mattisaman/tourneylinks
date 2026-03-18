import 'dotenv/config';
import fs from 'fs';
import { parse } from 'csv-parse';
import { getDb } from './src/pipeline/database';
import { courses } from './src/pipeline/database';

async function run() {
  const db = getDb();
  console.log('Starting seed from CSV...');

  const parser = fs.createReadStream('../Golf Courses-USA.csv').pipe(
    parse({ delimiter: ',', trim: true, relax_column_count: true })
  );

  let batch: any[] = [];
  let count = 0;

  for await (const record of parser) {
    if (!record || record.length < 4) continue;
    
    // [0] = Lng, [1] = Lat, [2] = Name-City,State, [3] = Details
    const lng = parseFloat(record[0]);
    const lat = parseFloat(record[1]);
    const nameCol = record[2] || '';
    const detailsCol = record[3] || '';

    // Extract Name
    const lastHyphen = nameCol.lastIndexOf('-');
    const name = lastHyphen > 0 ? nameCol.substring(0, lastHyphen).trim() : nameCol.trim();

    // Extract Type (Public, Private, etc)
    const typeMatch = detailsCol.match(/^\(([^)]+)\)/);
    const type = typeMatch ? typeMatch[1] : null;

    // Extract Holes
    const holesMatch = detailsCol.match(/\((\d+)\s+Holes\)/i);
    const holes = holesMatch ? parseInt(holesMatch[1], 10) : 18;

    // Extract Phone
    const phoneMatch = detailsCol.match(/\(\d{3}\)\s\d{3}-\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : null;

    // Extract City/State/Zip roughly from the end of the details (before phone)
    // E.g. "(Public) (9 Holes), Mylofritz Ave, Anchor Point,AK 99556, (907) 226-2582"
    let address = null;
    let city = 'Unknown';
    let state = 'US';
    let zip = null;

    const parts = detailsCol.split(',').map(s => s.trim());
    
    // Look for the part that has State Zip (e.g. "AK 99556" or "AK")
    for (let i = 0; i < parts.length; i++) {
        const stateZipMatch = parts[i].match(/^([A-Z]{2})(?:\s+(\d{5}(-\d{4})?))?$/);
        if (stateZipMatch) {
            state = stateZipMatch[1];
            zip = stateZipMatch[2] || null;
            if (i > 0) city = parts[i - 1]; // City is usually right before state
            if (i > 1) {
                // Address is usually right before City, skipping the (Public)(Holes) part if possible
                let addrStr = parts.slice(1, i - 1).join(', ');
                if (addrStr && !addrStr.includes('Holes)')) {
                    address = addrStr;
                }
            }
            break;
        }
    }

    batch.push({
      name,
      address,
      city,
      state,
      zip,
      latitude: lat,
      longitude: lng,
      phone,
      type,
      holes,
      rawMetadata: detailsCol, // save raw in case of bad parsing
    });

    if (batch.length === 500) {
      await db.insert(courses).values(batch);
      count += batch.length;
      console.log(`Inserted ${count} courses...`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await db.insert(courses).values(batch);
    count += batch.length;
    console.log(`Inserted ${count} courses...`);
  }

  console.log(`Done! Seeded ${count} total golf courses.`);
  process.exit(0);
}

run().catch(console.error);
