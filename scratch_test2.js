const cheerio = require('cheerio');
require('dotenv').config({ path: 'c:\\classgrid_marketting\\Classgrid_marketting\\.env' });

async function runTest() {
  console.log("=== URL SPECIFIC TEST ===");

  const urlsToTest = [
    "https://classgrid.in/docs",
    "https://classgrid.in/docs/introduction"
  ];

  for (const url of urlsToTest) {
    console.log(`\\nTesting URL: ${url}`);
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
      });
      console.log(`HTTP Status: ${res.status}`);
      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);
        const title = $('title').text();
        console.log(`✅ SUCCESS! Page title: ${title}`);
      } else {
        console.log(`❌ FAILED! Website rejected the request with status ${res.status}`);
      }
    } catch (e) {
      console.log(`❌ CRASHED: ${e.message}`);
    }
  }
}

runTest();
