const { generateClassgridRagAnswer } = require('./lib/ai/rag-answer');

async function test() {
  const result = await generateClassgridRagAnswer({
    question: "I have a problem",
    channel: "web",
    userName: "Test User",
    isGuest: false,
  });
  console.log("Turn 1 (I have a problem):", result.answer);

  const result2 = await generateClassgridRagAnswer({
    question: "My dashboard is not loading and I get a 404 error.",
    channel: "web",
    userName: "Test User",
    isGuest: false,
    history: [
      { role: "user", content: "I have a problem" },
      { role: "assistant", content: result.answer }
    ]
  });
  console.log("Turn 2 (Context provided):", result2.answer);
}

test().catch(console.error);
