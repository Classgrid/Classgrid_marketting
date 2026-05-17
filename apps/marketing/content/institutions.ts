export type InstitutionType = "college" | "junior-college" | "coaching" | "school";

export const adaptiveHeroProfiles: Record<
  InstitutionType,
  {
    label: string;
    headline: string;
    subline: string;
    capabilities: string[];
    counters: Array<{ label: string; value: number; suffix?: string }>;
  }
> = {
  college: {
    label: "College",
    headline: "Complete Digital System for Colleges",
    subline:
      "Run admissions, academics, compliance, and outcomes on one deeply integrated institutional platform.",
    capabilities: [
      "CAP round admission workflows",
      "Placement and alumni readiness pipelines",
      "NAAC/NBA accreditation reporting",
    ],
    counters: [
      { label: "Students managed", value: 5000, suffix: "+" },
      { label: "Exam attempts", value: 1200000, suffix: "+" },
      { label: "Attendance records", value: 1000000, suffix: "+" },
    ],
  },
  "junior-college": {
    label: "Junior College",
    headline: "Unified Operations for XI-XII Programs",
    subline:
      "Manage admissions, timetables, attendance, and parent communication for junior college programs in one stack.",
    capabilities: [
      "Subject-group and stream setup",
      "Board exam readiness tracking",
      "Parent and student communication hub",
    ],
    counters: [
      { label: "Streams managed", value: 120, suffix: "+" },
      { label: "Daily attendance scans", value: 180000, suffix: "+" },
      { label: "Parent updates", value: 240000, suffix: "+" },
    ],
  },
  coaching: {
    label: "Coaching",
    headline: "Run Your Institute Like a Platform",
    subline:
      "Coordinate batches, test series, rank analytics, and payment operations with high-speed control.",
    capabilities: [
      "Course-batch hierarchy automation",
      "Test series and rank intelligence",
      "Rapid fee and parent communication loops",
    ],
    counters: [
      { label: "Batch sessions", value: 180000, suffix: "+" },
      { label: "Quiz submissions", value: 900000, suffix: "+" },
      { label: "Parent updates", value: 350000, suffix: "+" },
    ],
  },
  school: {
    label: "School",
    headline: "Unified Infrastructure for Modern Schools",
    subline:
      "Digitize classroom operations, parent communication, timetable control, and institutional trust in one interface.",
    capabilities: [
      "Class-section academic control",
      "Parent and student communication hub",
      "Attendance and calendar continuity",
    ],
    counters: [
      { label: "Daily attendance scans", value: 250000, suffix: "+" },
      { label: "Assignments processed", value: 500000, suffix: "+" },
      { label: "Institution updates", value: 200000, suffix: "+" },
    ],
  },
};
