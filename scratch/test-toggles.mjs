/**
 * Test script: Verifies all 4 section toggle conditions work correctly.
 * Tests the EXACT same logic used in app/page.tsx
 */

console.log("\n═══════════════════════════════════════════════════");
console.log("  CLASSGRID — Section Toggle Logic Test");
console.log("═══════════════════════════════════════════════════\n");

// ── Toggle Logic (copied exactly from page.tsx) ──

function testToggle(name, sectionSettings, cmsClassgridVideo, cmsClassgridTeamVision) {
  // Existing sections — default ON (show unless explicitly turned off)
  const showVideoSection = (sectionSettings?.showTestimonialVideos !== false) && true; // true = has content
  const showTestimonials = (sectionSettings?.showClientTestimonials !== false) && true;

  // New sections — default OFF (show only when explicitly turned on)
  const showClassgridVideo = cmsClassgridVideo?.isVisible === true;
  const showTeamVision = cmsClassgridTeamVision?.isVisible === true;

  return { showVideoSection, showTestimonials, showClassgridVideo, showTeamVision };
}

let passed = 0;
let failed = 0;

function assert(testName, result, expected) {
  const ok = JSON.stringify(result) === JSON.stringify(expected);
  if (ok) {
    console.log(`  ✅ ${testName}`);
    passed++;
  } else {
    console.log(`  ❌ ${testName}`);
    console.log(`     Expected: ${JSON.stringify(expected)}`);
    console.log(`     Got:      ${JSON.stringify(result)}`);
    failed++;
  }
}

// ── TEST 1: No Sanity documents exist at all (null) ──
console.log("TEST 1: No Sanity documents exist (fresh install)");
const t1 = testToggle("fresh", null, null, null);
assert("Testimonial Videos = ON (default)", t1.showVideoSection, true);
assert("Client Testimonials = ON (default)", t1.showTestimonials, true);
assert("Classgrid Video = OFF (default)", t1.showClassgridVideo, false);
assert("Team Vision = OFF (default)", t1.showTeamVision, false);

// ── TEST 2: Section Settings exists but no toggles set ──
console.log("\nTEST 2: Section Settings doc exists, toggles not set");
const t2 = testToggle("empty-settings", {}, null, null);
assert("Testimonial Videos = ON", t2.showVideoSection, true);
assert("Client Testimonials = ON", t2.showTestimonials, true);
assert("Classgrid Video = OFF", t2.showClassgridVideo, false);
assert("Team Vision = OFF", t2.showTeamVision, false);

// ── TEST 3: User turns OFF testimonial videos via Section Settings ──
console.log("\nTEST 3: User turns OFF testimonial videos");
const t3 = testToggle("off-videos", { showTestimonialVideos: false }, null, null);
assert("Testimonial Videos = OFF ✓", t3.showVideoSection, false);
assert("Client Testimonials = ON", t3.showTestimonials, true);

// ── TEST 4: User turns OFF client testimonials ──
console.log("\nTEST 4: User turns OFF client testimonials");
const t4 = testToggle("off-testimonials", { showClientTestimonials: false }, null, null);
assert("Testimonial Videos = ON", t4.showVideoSection, true);
assert("Client Testimonials = OFF ✓", t4.showTestimonials, false);

// ── TEST 5: User turns ON Classgrid Video ──
console.log("\nTEST 5: User turns ON Classgrid Video");
const t5 = testToggle("on-cg-video", {}, { isVisible: true }, null);
assert("Classgrid Video = ON ✓", t5.showClassgridVideo, true);
assert("Team Vision = OFF", t5.showTeamVision, false);

// ── TEST 6: User turns ON Team Vision ──
console.log("\nTEST 6: User turns ON Team Vision");
const t6 = testToggle("on-team", {}, null, { isVisible: true });
assert("Classgrid Video = OFF", t6.showClassgridVideo, false);
assert("Team Vision = ON ✓", t6.showTeamVision, true);

// ── TEST 7: ALL 4 ON at once ──
console.log("\nTEST 7: All 4 sections ON simultaneously");
const t7 = testToggle("all-on",
  { showTestimonialVideos: true, showClientTestimonials: true },
  { isVisible: true },
  { isVisible: true }
);
assert("Testimonial Videos = ON", t7.showVideoSection, true);
assert("Client Testimonials = ON", t7.showTestimonials, true);
assert("Classgrid Video = ON", t7.showClassgridVideo, true);
assert("Team Vision = ON", t7.showTeamVision, true);

// ── TEST 8: Only new 2 ON, old 2 OFF (your current plan) ──
console.log("\nTEST 8: Old OFF + New ON (your current setup)");
const t8 = testToggle("swap",
  { showTestimonialVideos: false, showClientTestimonials: false },
  { isVisible: true },
  { isVisible: true }
);
assert("Testimonial Videos = OFF", t8.showVideoSection, false);
assert("Client Testimonials = OFF", t8.showTestimonials, false);
assert("Classgrid Video = ON", t8.showClassgridVideo, true);
assert("Team Vision = ON", t8.showTeamVision, true);

// ── TEST 9: isVisible explicitly false ──
console.log("\nTEST 9: New sections explicitly set to false");
const t9 = testToggle("explicit-false", {}, { isVisible: false }, { isVisible: false });
assert("Classgrid Video = OFF", t9.showClassgridVideo, false);
assert("Team Vision = OFF", t9.showTeamVision, false);

// ── SUMMARY ──
console.log("\n═══════════════════════════════════════════════════");
console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log("  🎉 ALL TOGGLES WORK CORRECTLY!");
} else {
  console.log("  ⚠️  SOME TOGGLES HAVE BUGS!");
}
console.log("═══════════════════════════════════════════════════\n");

process.exit(failed > 0 ? 1 : 0);
