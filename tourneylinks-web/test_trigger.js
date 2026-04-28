const datasetId = '34kh6MYJgiinj0avd';

async function run() {
  const res = await fetch('http://localhost:3000/api/webhooks/apify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-apify-secret': 'TourneyLinks_Apify_Secure_2026_C1nd3r3ll@9192015'
    },
    body: JSON.stringify({
      resource: { defaultDatasetId: datasetId }
    })
  });
  console.log(await res.text());
}
run();
