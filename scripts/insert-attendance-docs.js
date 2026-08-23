const mongoose = require('mongoose');
const { embedText } = require('../lib/ai/embedding');

const DOCUMENT_ID = "attendance-api-docs";

const CUSTOM_KNOWLEDGE = `
The Classgrid Attendance System supports multiple attendance modes: **GPS-verified live sessions**, **manual quick-mark**, and **daily batch submission**. It includes built-in anti-fraud detection (device fingerprinting, paste detection, GPS radius checks) and automated absence notifications.

## How Attendance Works

### 1. Faculty Starts a Live Session

A faculty member opens their classroom and starts an attendance session by providing:
- A **secret code** (3–30 characters) that students must type
- Their **GPS location** (latitude/longitude) — required
- A **duration** (30–600 seconds, default 90s)
- A **radius** (10–100 meters, default 40m)

**API:** \`POST /api/attendance/:classroomId/start\`

The system:
1. Checks if today is a **holiday** (blocked if yes)
2. Verifies no active session already exists (prevents duplicates)
3. Hashes the code with bcrypt
4. Creates an \`AttendanceSession\` document with status \`active\`
5. Generates a unique \`sessionToken\` (UUID)
6. Sends push notifications to all enrolled students via \`bulkDispatchNotification\`
7. Fires attendance-started emails in the background

### 2. Student Marks Attendance

Students open the attendance module and enter the code displayed by the faculty.

**API:** \`POST /api/attendance/:classroomId/mark\`

Required fields: \`code\`, \`sessionToken\`, \`studentLat\`, \`studentLng\`, \`deviceFingerprint\`

The system validates:
- **Session token** matches an active session
- **Expiry** — rejects if session has expired (HTTP 410)
- **Code** — bcrypt comparison against stored hash
- **GPS radius** — calculates distance between student and teacher coordinates using the Haversine formula
- **Device fingerprint** — blocks if same device used by another student in this session (proxy detection)
- **Paste detection** — flags if the code was pasted rather than typed

Attendance records are queued via **BullMQ** (\`attendanceQueue\`) to handle spike loads during the 60-second window.

**Statuses:**
- \`present\` — clean attendance
- \`present_suspicious\` — marked present but flagged (GPS far, paste detected, device mismatch)
- \`absent\` — no record submitted

### 3. Faculty Quick-Mark (Manual)

Faculty can manually tick students as present without a code or GPS.

**API:** \`POST /api/attendance/:classroomId/quick-mark\`

Body: \`{ studentIds: [...], sessionDate: "2026-08-02" }\`

Creates an immediately-expired manual session and bulk-inserts attendance records.

### 4. Faculty Stops a Session Early

**API:** \`POST /api/attendance/:classroomId/stop\`

Immediately expires the active session. Sends "Attendance Recorded" or "Attendance Missed" notifications to all enrolled students.

## Student Views

### My Overview (Cross-Classroom)

**API:** \`GET /api/attendance/my-overview\`

Query params: \`month\`, \`year\`, \`startDate\`, \`endDate\`, \`classroom\`

Returns per-classroom breakdown:
- \`totalSessions\`, \`present\`, \`absent\`, \`percentage\`
- \`isDefaulter\` flag (true if percentage < 75%)
- Overall aggregate across all classrooms

### My Detailed (Per-Session)

**API:** \`GET /api/attendance/my-detailed\`

Supports filters: \`week\`, \`semester\`, or \`month/year\`

Returns individual session records with \`present\`/\`absent\` status for each.

## Faculty Views

### Session Detail

**API:** \`GET /api/attendance/session/:sessionId/detail\`

Returns:
- Full student list with status, \`markedAt\` timestamp, distance in meters, suspicion reasons
- Summary: total, present, absent, suspicious counts
- Session metadata: GPS coordinates, radius, duration, mode

## Anti-Fraud System

| Check | Behavior |
|---|---|
| **GPS Radius** | Student must be within configured radius (default 40m). In \`testing\` mode: flagged. In \`strict\` mode: blocked. |
| **Device Fingerprint** | If same device used by 2+ students in one session → second student is **blocked**, first is retroactively flagged as \`present_suspicious\` |
| **Paste Detection** | Frontend sends \`pasteDetected: true\` if code was pasted → flagged |
| **Device Mismatch** | If student has a bound device and uses a different one → flagged |

All proxy blocks are logged to \`AdminAuditLog\` with action \`attendance_proxy_blocked\`.

## Auto-Expiry

Sessions that pass their \`expiresAt\` timestamp are automatically expired by \`expireStale()\`. Absent students receive push notifications with the message "You were marked absent."

## Role Permissions

| Role | Can Start Session | Can Quick-Mark | Can View Reports | Can Mark Own |
|---|---|---|---|---|
| Faculty (classroom owner) | ✅ | ✅ | ✅ | ❌ |
| Student (classroom member) | ❌ | ❌ | Own only | ✅ |
| Org Admin | ❌ | ❌ | All | ❌ |

## Key Models

- **AttendanceSession** — \`classroom\`, \`faculty\`, \`codeHash\`, \`startsAt\`, \`expiresAt\`, \`status\`, \`teacherLat\`, \`teacherLng\`, \`radiusMeters\`, \`sessionToken\`, \`presentCount\`
- **AttendanceRecord** — \`session\`, \`classroom\`, \`student\`, \`status\`, \`markedAt\`, \`distanceMeters\`, \`pasteDetected\`, \`deviceFingerprint\`, \`suspicionReasons\`
- **AttendanceAppeal** — allows students to appeal an absence
`;

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

  const schema = new mongoose.Schema({
    documentId: String,
    documentType: String,
    chunkIndex: Number,
    chunkText: String,
    pageSlug: String,
    pageTitle: String,
    section: String,
    contentType: String,
    sourceUrl: String,
    embedding: [Number],
  }, { collection: 'rag_chunks', strict: false });

  const RagChunk = mongoose.model('RagChunk', schema);

  console.log("Embedding Custom API Documentation...");
  const embedding = await embedText(CUSTOM_KNOWLEDGE);

  await RagChunk.findOneAndUpdate(
    { documentId: DOCUMENT_ID },
    {
      documentId: DOCUMENT_ID,
      documentType: "apiDocs",
      chunkIndex: 1,
      chunkText: CUSTOM_KNOWLEDGE,
      pageSlug: "attendance-api",
      pageTitle: "Attendance System Architecture & APIs",
      section: "API Reference",
      contentType: "technicalDocs",
      sourceUrl: "/docs/attendance",
      embedding: embedding
    },
    { upsert: true }
  );
  
  console.log("\n✅ SUCCESSFULLY UPLOADED ATTENDANCE API DOCS!");
  process.exit(0);
}

main().catch(console.error);
