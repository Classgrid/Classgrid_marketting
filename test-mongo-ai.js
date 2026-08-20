const https = require('https');

const API_KEY = "al-yo-c9o08Qka3wSbvQAoS44H363blyV7EBQbWrwdvgIW".replace(/\s+/g, ''); // removing any spaces
const HOST = "ai.mongodb.com";
const PATH = "/v1/embeddings";

function makeRequest(index) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      input: [`Test request number ${index}`],
      model: "voyage-3-large"
    });

    const options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': data.length
      }
    };

    const startTime = Date.now();
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const elapsed = Date.now() - startTime;
        if (res.statusCode === 200) {
          console.log(`✅ Request ${index}: SUCCESS in ${elapsed}ms (Status: 200)`);
          resolve(true);
        } else {
          console.log(`❌ Request ${index}: FAILED in ${elapsed}ms (Status: ${res.statusCode}) - ${body}`);
          if (res.statusCode === 429) {
            console.log(`\n🛑 RATE LIMITED on request ${index}. The 3 RPM limit is STILL active.`);
          }
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`❌ Request ${index}: FATAL ERROR - ${e.message}`);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

async function testRateLimit() {
  console.log(`🚀 Testing MongoDB AI endpoint with new key: ${API_KEY.slice(0, 10)}...`);
  console.log(`   Sending 5 requests back-to-back to test the 3 RPM limit...\n`);

  let allSuccess = true;
  for (let i = 1; i <= 20; i++) {
    const success = await makeRequest(i);
    if (!success) allSuccess = false;
  }

  if (allSuccess) {
    console.log(`\n🎉 All 5 requests succeeded! The 3 RPM limit has been successfully BYPASSED!`);
  } else {
    console.log(`\n⚠️ Some requests failed.`);
  }
}

testRateLimit();
