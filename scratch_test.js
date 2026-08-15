const cheerio = require('cheerio');
require('dotenv').config({ path: 'c:\\classgrid_marketting\\Classgrid_marketting\\.env' });

async function runTest() {
  console.log("=== DIAGNOSTIC TEST START ===");

  // 1. Test Tavily Search
  console.log("\\n1. Testing Web Search (Tavily)...");
  const tavilyKey = process.env.TAVILY_API_KEY;
  if (!tavilyKey) {
    console.log("❌ TAVILY_API_KEY is missing from .env!");
  } else {
    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query: "Classgrid",
          search_depth: "basic",
          max_results: 1
        })
      });
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Tavily Search SUCCESS! Found results:", data.results.length);
      } else {
        const errorText = await res.text();
        console.log("❌ Tavily Search FAILED with status", res.status, errorText);
      }
    } catch (e) {
      console.log("❌ Tavily Search CRASHED:", e.message);
    }
  }

  // 2. Test URL Reading
  console.log("\\n2. Testing URL Reading (Fetch)...");
  try {
    const res = await fetch("https://classgrid.in", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    });
    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);
      const title = $('title').text();
      console.log("✅ URL Read SUCCESS! Page title:", title);
    } else {
      console.log("❌ URL Read FAILED with status", res.status);
    }
  } catch (e) {
    console.log("❌ URL Read CRASHED:", e.message);
  }
  
  console.log("\\n=== DIAGNOSTIC TEST END ===");
}

runTest();
