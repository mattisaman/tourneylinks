require('dotenv').config({ path: '.env.local' });

async function run() {
  const apifyToken = process.env.APIFY_API_TOKEN;
  
  // Get user's actor runs
  const url = `https://api.apify.com/v2/actor-runs?token=${apifyToken}&desc=true&limit=5`;
  const res = await fetch(url);
  const data = await res.json();
  
  // Find the last eventbrite run
  const eventbriteRun = data.data.items.find(i => i.actId || i.actorId); 
  
  if (data.data.items.length > 0) {
     const lastRun = data.data.items[0];
     console.log("Last Run ID:", lastRun.id);
     console.log("Dataset ID:", lastRun.defaultDatasetId);
     
     const datasetUrl = `https://api.apify.com/v2/datasets/${lastRun.defaultDatasetId}/items?token=${apifyToken}`;
     const datasetRes = await fetch(datasetUrl);
     const dataset = await datasetRes.json();
     console.log("First item sample:", JSON.stringify(dataset[0], null, 2));
  }
}
run();
