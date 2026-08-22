const text = `... support resources. | SUBJECT: Attendance Display Issue & Chat Access Blocked | CATEGORY: technical | PRIORITY: high]
On Sat, Aug 22, 2026 at 2:17 PM, romantic wrote:`;

const cleaned = text.replace(/(?:\[ESCALATE:[\s\S]*?)?\|\s*SUBJECT:[\s\S]*?\|\s*CATEGORY:[\s\S]*?\|\s*PRIORITY:[\s\S]*?\]/g, "");

console.log("=== ORIGINAL ===");
console.log(text);
console.log("\n=== CLEANED ===");
console.log(cleaned.trim());
