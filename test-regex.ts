// test-regex.ts
const ESCALATE_RE_G = /\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?(?:\s*\|\s*DRAFT:\s*([\s\S]+?))?\]/g;
const ESCALATE_RE = /\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?(?:\s*\|\s*DRAFT:\s*([\s\S]+?))?\]/;

const sampleAiResponse = `I apologize for the issues with your attendance and chat. I am forwarding this to our senior technical team for immediate review.
[ESCALATE: Amit is experiencing a persistent technical issue where his attendance records are not displaying on Classgrid despite multiple troubleshooting attempts. His chat access is also blocked. | SUBJECT: Attendance and Chat Blocked | CATEGORY: technical | PRIORITY: high | DRAFT: Dear Amit, we apologize for the disruption. Our engineers are investigating the attendance sync and removing the chat block. We will update you shortly.]`;

console.log("=== Original AI Response ===");
console.log(sampleAiResponse);
console.log("\n===========================\n");

const match = sampleAiResponse.match(ESCALATE_RE);
if (match) {
  console.log("✅ Regex successfully matched the tag!");
  console.log("Extracted Summary:", match[1].trim());
  console.log("Extracted Subject:", match[2]?.trim());
  console.log("Extracted Category:", match[3]?.trim());
  console.log("Extracted Priority:", match[4]?.trim());
  
  const aiDraft = match[5]?.trim();
  console.log("Extracted AI Draft:", aiDraft);
  
  if (aiDraft) {
    console.log("\n✅ SUCCESS: aiDraft variable is perfectly extracted and will no longer crash the API!");
  } else {
    console.log("\n❌ FAIL: aiDraft not found.");
  }
} else {
  console.log("❌ Regex failed to match.");
}

const cleanedBody = sampleAiResponse.replace(ESCALATE_RE_G, "").trim();
console.log("\n=== Cleaned Body (Sent to Customer) ===");
console.log(cleanedBody);
console.log("\n===========================\n");

if (!cleanedBody.includes("]") && !cleanedBody.includes("DRAFT")) {
  console.log("✅ SUCCESS: No leaked brackets or draft text in the customer-facing email!");
} else {
  console.log("❌ FAIL: Leaked bracket or text detected.");
}
