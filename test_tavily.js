async function testTavily() {
  console.log("Fetching from Tavily...");
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: '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',
        query: 'Please search the web for the latest breaking business news in August 2026 regarding McKesson. Which specific company did McKesson just acquire, and exactly how much did they pay for it in billions of dollars? Provide a very short, clear answer.',
        include_answer: true,
        search_depth: 'advanced'
      })
    });
    const data = await response.json();
    console.log("\n================ TAVILY RAW ANSWER ================\n");
    console.log(data.answer);
    console.log("\n===================================================\n");
  } catch (error) {
    console.error("Error:", error);
  }
}

testTavily();
