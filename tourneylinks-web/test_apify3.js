require('dotenv').config({ path: '.env.local' });

async function run() {
  const apifyToken = process.env.APIFY_API_TOKEN;
  
  const url = `https://api.apify.com/v2/actor-runs?token=${apifyToken}&desc=true&limit=10`;
  const res = await fetch(url);
  const data = await res.json();
  
  for (let i = 0; i < 5; i++) {
     const lastRun = data.data.items[i];
     console.log(`\nRun ID: ${lastRun.id} | Dataset: ${lastRun.defaultDatasetId}`);
     
     const datasetUrl = `https://api.apify.com/v2/datasets/${lastRun.defaultDatasetId}/items?token=${apifyToken}`;
     const datasetRes = await fetch(datasetUrl);
     const dataset = await datasetRes.json();
     console.log(`Length: ${dataset.length}`);
     if (dataset.length > 0) {
        console.log(`First item keys:`, Object.keys(dataset[0]));
        console.log(`First item values:`, JSON.stringify(dataset[0]).substring(0, 300));
     }
  }
}
run();
