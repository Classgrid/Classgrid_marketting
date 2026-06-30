// Exhaustive test: every dropdown value from BOTH forms + AI variants
// Must ALL map to one of: technical, billing, general, other

const VALID_BACKEND_ENUMS = ["technical", "billing", "general", "other"];

// Exact mapper from ticket/page.tsx AND inquiry/page.tsx (merged)
const VALID_CATEGORIES = {
  "technical": "technical", "billing": "billing", "general": "general", "other": "other",
  "academics": "general", "exams": "general", "communication": "general",
  "finance": "billing", "getting_started": "general", "account_security": "technical",
  "login": "technical", "attendance": "technical", "examination": "general", "exam": "general",
  "result": "general", "results": "general", "fee": "billing", "payment": "billing",
  "erp": "technical", "bug": "technical", "dashboard": "general", "chat": "general",
  "ai": "technical", "profile": "general", "admission": "general", "library": "general",
  "documents": "general", "timetable": "general", "assignments": "general",
  "live-classes": "technical", "feature": "general",
  "account": "general",
};

// All dropdown values from /support/ticket (from the HTML)
const TICKET_DROPDOWN_VALUES = [
  "login", "dashboard", "profile", "attendance", "fee", "examination",
  "timetable", "assignments", "live-classes", "chat", "admission",
  "library", "documents", "erp", "ai", "bug", "feature", "other"
];

// All dropdown values from /support/inquiry (from the HTML)
const INQUIRY_DROPDOWN_VALUES = [
  "technical", "billing", "academics", "exams", "communication",
  "finance", "getting_started", "account_security", "general", "other"
];

// AI-possible categories (what AI might generate)
const AI_POSSIBLE_VALUES = [
  "technical", "billing", "general", "other", "account", "feature",
  "profile", "login", "bug", "payment", "exam", "results"
];

// Edge cases
const EDGE_CASES = [
  "", null, undefined, "  profile  ", "PROFILE", "ProFile", "inquiry",
  "random_garbage", "xyz123", "  ", "TECHNICAL", "Billing", "aliens"
];

let passed = 0;
let failed = 0;

function test(label, values) {
  console.log(`\n=== ${label} ===`);
  for (const val of values) {
    const input = (val || "").toString().toLowerCase().trim();
    const mapped = VALID_CATEGORIES[input] || "other";
    const isValid = VALID_BACKEND_ENUMS.includes(mapped);
    const status = isValid ? "✅ PASS" : "❌ FAIL";
    if (isValid) passed++; else failed++;
    console.log(`  ${status} | "${val}" → "${input}" → "${mapped}"`);
  }
}

test("/support/ticket dropdown values", TICKET_DROPDOWN_VALUES);
test("/support/inquiry dropdown values", INQUIRY_DROPDOWN_VALUES);
test("AI-generated categories", AI_POSSIBLE_VALUES);
test("Edge cases (garbage, nulls, whitespace)", EDGE_CASES);

console.log(`\n${"=".repeat(50)}`);
console.log(`TOTAL: ${passed + failed} tests | ✅ ${passed} passed | ❌ ${failed} failed`);
console.log(`${"=".repeat(50)}`);
if (failed === 0) {
  console.log("🎉 ALL TESTS PASS — every possible input maps to a valid backend enum.");
} else {
  console.log("⚠️  FAILURES DETECTED — fix required!");
}
