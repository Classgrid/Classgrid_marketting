// Patch the roles table into Terms of Service using raw HTTP mutations API
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env.local") });

const PROJECT_ID = "a4wk6kp5";
const DATASET = "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN?.replace(/"/g, "");

const ROLES_TABLE = {
  _type: "legalTable",
  _key: "rolesTable2026",
  headers: ["Role", "Created By", "Access Level"],
  rows: [
    { _key: "r01", _type: "row", cells: ["Org Admin", "Company or Tenant Organization", "Full administrative control of the Tenant Organization, including user management, billing, classrooms, and configuration"] },
    { _key: "r02", _type: "row", cells: ["Faculty", "Org Admin (via invitation)", "Classroom management, attendance, grading, assignments, and student interactions"] },
    { _key: "r03", _type: "row", cells: ["Student", "Org Admin, Admissions Module, or self-registration via Honor Code", "Classroom participation, assignments, notes, grades, and attendance records"] },
    { _key: "r04", _type: "row", cells: ["HOD (Head of Department)", "Org Admin", "Department-level oversight, faculty supervision, and academic coordination"] },
    { _key: "r05", _type: "row", cells: ["Principal", "Org Admin", "Institution-level administrative access and oversight of all departments"] },
    { _key: "r06", _type: "row", cells: ["Vice Principal", "Org Admin", "Supporting institution-level administrative access"] },
    { _key: "r07", _type: "row", cells: ["Exam Controller", "Org Admin", "Examination scheduling, grading policies, and result management"] },
    { _key: "r08", _type: "row", cells: ["Fee Manager", "Org Admin", "Fee structure configuration, invoice generation, and payment tracking"] },
    { _key: "r09", _type: "row", cells: ["Admission Head", "Org Admin", "Admissions pipeline management, application review, and enrollment decisions"] },
    { _key: "r10", _type: "row", cells: ["Admission Verifier", "Org Admin", "Document verification and applicant credential review"] },
    { _key: "r11", _type: "row", cells: ["Admission Counselor", "Org Admin", "Applicant guidance, inquiry handling, and follow-up management"] },
    { _key: "r12", _type: "row", cells: ["Admission Clerk", "Org Admin", "Administrative data entry and applicant record maintenance"] },
    { _key: "r13", _type: "row", cells: ["TPO Officer", "Org Admin", "Training and placement operations, company liaison, and student career services"] },
    { _key: "r14", _type: "row", cells: ["Transport Manager", "Org Admin", "Vehicle fleet, route planning, and student transport logistics"] },
    { _key: "r15", _type: "row", cells: ["Library Manager", "Org Admin", "Library catalog management, issue/return tracking, and inventory"] },
    { _key: "r16", _type: "row", cells: ["Counselor", "Org Admin", "Student well-being, academic advising, and pastoral support"] },
    { _key: "r17", _type: "row", cells: ["Coordinator", "Org Admin", "Cross-functional coordination, event management, and workflow facilitation"] },
  ],
};

async function main() {
  try {
    // 1. Fetch the doc first to get current sections (prefer draft)
    const queryUrl = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(`*[_type == "legalPage" && _id in ["legal-terms", "drafts.legal-terms"]] | order(_updatedAt desc)[0]{_id, sections}`)}`;
    
    const queryRes = await fetch(queryUrl, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const { result: doc } = await queryRes.json();
    
    if (!doc) {
      console.error("❌ Terms of Service not found.");
      process.exit(1);
    }

    console.log(`✅ Found: ${doc._id}, ${doc.sections.length} sections`);

    // Find section 3 (ACCOUNT TYPES AND ROLES / ACCOUNT REGISTRATION)
    const sIdx = doc.sections.findIndex(s => s.title?.toLowerCase().includes("account types") || s.title?.toLowerCase().includes("account registration"));
    if (sIdx === -1) { console.error("❌ Section not found."); process.exit(1); }
    
    console.log(`✅ Section ${sIdx}: "${doc.sections[sIdx].title}"`);

    // Find existing table or append
    const section = doc.sections[sIdx];
    const tableIdx = section.content.findIndex(b => b._type === "legalTable");
    
    let mutations;
    if (tableIdx !== -1) {
      // Replace existing table in content
      section.content[tableIdx] = ROLES_TABLE;
      mutations = [{
        patch: {
          id: doc._id,
          set: {
            [`sections[${sIdx}].content[${tableIdx}]`]: ROLES_TABLE
          }
        }
      }];
      console.log(`🔄 Replacing table at content[${tableIdx}]`);
    } else {
      // Insert at end
      mutations = [{
        patch: {
          id: doc._id,
          insert: {
            after: `sections[${sIdx}].content[-1]`,
            items: [ROLES_TABLE]
          }
        }
      }];
      console.log(`➕ Appending table to section content`);
    }

    // 2. Send mutation
    const mutateUrl = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`;
    const mutateRes = await fetch(mutateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    });

    const result = await mutateRes.json();
    
    if (!mutateRes.ok) {
      console.error("❌ Mutation failed:", JSON.stringify(result, null, 2));
      process.exit(1);
    }

    console.log("\n🎉 Done! 17-row RBAC roles table added to Terms of Service in Sanity.");
    console.log("👉 Refresh studio.classgrid.in to see it.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
