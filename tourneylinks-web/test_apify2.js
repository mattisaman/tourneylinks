require('dotenv').config({ path: '.env.local' });

async function run() {
  const apifyToken = process.env.APIFY_API_TOKEN;
  
  // Get user's actor runs
  const url = `https://api.apify.com/v2/actor-runs?token=${apifyToken}&desc=true&limit=10`;
  const res = await fetch(url);
  const data = await res.json();
  
  // Print latest runs and their default datasets
  for (let i = 0; i < Math.min(3, data.data.items.length); i++) {
     const lastRun = data.data.items[i];
     console.log(`\nRun ID: ${lastRun.id} | Actor: ${lastRun.actId || lastRun.actorId} | Dataset: ${lastRun.defaultDatasetId}`);
     
     const datasetUrl = `https://api.apify.com/v2/datasets/${lastRun.defaultDatasetId}/items?token=${apifyToken}`;
     const datasetRes = await fetch(datasetUrl);
     const dataset = await datasetRes.json();
     console.log(`Dataset isArray: ${Array.isArray(dataset)}, Length: ${dataset.length}`);
     if (dataset.length > 0) {
        console.log(`First item sample keys:`, Object.keys(dataset[0]));
        console.log(`First item sample:`, JSON.stringify(dataset[0]).substring(0, 500));
     }
  }
}
run();
