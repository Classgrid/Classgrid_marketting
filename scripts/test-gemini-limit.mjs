import "dotenv/config";

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyB60vMuWPjIuDI0LP64dMQwqblRwN7UN6c";
  
  if (!apiKey) {
    console.error("No GEMINI_API_KEY found.");
    return;
  }

  const url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  console.log("Testing Gemini API...");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.replace(/"/g, '')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [{ role: "user", content: "Hello, this is a test from Classgrid." }],
        max_tokens: 10
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ API is WORKING!");
      console.log("Response:", data.choices[0].message.content);
    } else {
      const errorText = await response.text();
      console.log(`❌ API Error: HTTP ${response.status} ${response.statusText}`);
      console.log("Error details:", errorText);
      
      // Checking for specific rate limit issues
      if (response.status === 429) {
        console.log("\n⚠️ You have hit the rate limit (Too Many Requests).");
        console.log("If this is a per-minute limit (RPM), it resets in 1 minute.");
        console.log("If this is a daily quota (RPD), it resets at midnight Pacific Time (PT).");
      }
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

testGemini();
