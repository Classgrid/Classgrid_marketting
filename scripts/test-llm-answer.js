require('dotenv').config({ path: '.env.local' });
const { generateClassgridRagAnswer } = require('../lib/ai/rag-answer');

async function main() {
  console.log("Asking LLM...");
  const result = await generateClassgridRagAnswer({
    question: "Which fort is famously associated with Chhatrapati Shivaji Maharaj and served as an important capital of the Maratha Empire?",
    channel: "web",
    userName: "Test User"
  });

  console.log("\n\n🤖 LLM ANSWER:");
  console.log("==========================================");
  console.log(result.answer);
  console.log("==========================================");
  process.exit(0);
}

main().catch(console.error);
