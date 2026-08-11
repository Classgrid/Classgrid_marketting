import type { IndustrySlug, RoleSlug } from "@/lib/route-maps";

export const solutionTrustBadges = ["ISO 27001 Ready", "GDPR Aware", "Role-Based Access", "AWS Infrastructure"];

export const solutionClientLogos = [];

export const solutionImpactMetrics = [
  { label: "Platform Uptime", value: "99.9%" },
  { label: "Native Modules", value: "40+" },
  { label: "Operational Visibility", value: "360°" },
];

export const industryProblemSolution: Record<IndustrySlug, Array<{ problem: string; solution: string }>> = {
  school: [
    { problem: "Disconnected attendance, communication, and fee tools", solution: "Unified ERP with daily school workflows in one system" },
    { problem: "Manual parent follow-ups and weak visibility", solution: "Automated updates, reminders, and real-time reporting" },
    { problem: "Operational bottlenecks across academic teams", solution: "Shared dashboards for admin, faculty, and leadership" },
  ],
  college: [
    { problem: "Data spread across departments and spreadsheets", solution: "Centralized operations across academics, finance, and admissions" },
    { problem: "Slow result and exam workflows", solution: "Structured academic execution with automated downstream reporting" },
    { problem: "Leadership lacks institution-wide insight", solution: "Role-based dashboards and measurable operational visibility" },
  ],
  "junior-college": [
    { problem: "Board-year workflows are hard to coordinate", solution: "Single system for timetable, attendance, parent communication, and follow-up" },
    { problem: "Staff rely on repetitive manual updates", solution: "Automated notifications and centralized academic controls" },
    { problem: "Student readiness signals arrive too late", solution: "Real-time data on engagement, performance, and operations" },
  ],
  coaching: [
    { problem: "Leads, batches, tests, and fees run in separate tools", solution: "Integrated coaching workflows from enquiry to result analytics" },
    { problem: "Communication is noisy and inconsistent", solution: "Controlled student and parent communication inside one platform" },
    { problem: "Performance analysis takes too long", solution: "Fast reporting and batch-level visibility with less manual work" },
  ],
  engineering: [
    { problem: "Disconnected data across departments and cycles", solution: "Unified ERP for academic, finance, and compliance operations" },
    { problem: "Manual attendance and exam administration", solution: "Structured workflows with automation and real-time visibility" },
    { problem: "Delayed fee collection and weak reporting", solution: "Automated reminders, payment flows, and leadership dashboards" },
  ],
};

export const roleProblemSolution: Record<RoleSlug, Array<{ problem: string; solution: string }>> = {
  students: [
    { problem: "Assignments, alerts, and academic records feel scattered", solution: "One student flow for updates, learning, and academic tracking" },
    { problem: "Important information arrives too late", solution: "Real-time notifications and mobile-first access" },
    { problem: "Too many tools for routine academic actions", solution: "Single app experience across classroom, results, and support" },
  ],
  teachers: [
    { problem: "Attendance, planning, and grading consume too much time", solution: "Automation-first workflows that reduce repetitive faculty work" },
    { problem: "Class communication is fragmented", solution: "Structured communication and academic control in one place" },
    { problem: "Reporting and follow-up are manual", solution: "Better visibility, faster execution, and less admin overhead" },
  ],
  institutes: [
    { problem: "Leadership lacks end-to-end visibility", solution: "Operational dashboards across admissions, finance, and academics" },
    { problem: "Multiple systems create process gaps", solution: "One platform coordinating every critical institution workflow" },
    { problem: "Scaling introduces more complexity", solution: "Standardized operating system for controlled, measurable growth" },
  ],
};

export const solutionTestimonialsBySlug: Record<string, Array<{ quote: string; author: string }>> = {
  engineering: [
    { quote: "Classgrid gave our engineering college a single command center for academics, fees, and reporting.", author: "Operations Head, Engineering Campus" },
    { quote: "We cut administrative follow-up time dramatically because the workflows finally talk to each other.", author: "Dean, Private Engineering Institute" },
  ],
  school: [
    { quote: "Parent communication and attendance visibility became far more reliable once everything moved into one platform.", author: "Principal, K-12 School" },
    { quote: "Our admin team finally stopped chasing data across WhatsApp and spreadsheets.", author: "Administrator, CBSE School" },
  ],
  college: [
    { quote: "Classgrid unified the moving parts we used to manage separately across departments.", author: "Vice Principal, Degree College" },
    { quote: "Leadership reporting improved immediately once our data stopped living in different tools.", author: "Registrar, College Campus" },
  ],
  "junior-college": [
    { quote: "Junior college operations became much easier to track once attendance, updates, and schedules were coordinated centrally.", author: "Academic Coordinator, Junior College" },
    { quote: "The system reduced follow-up friction for both students and parents.", author: "Administrator, Higher Secondary Campus" },
  ],
  coaching: [
    { quote: "The batch and test workflow feels built for how coaching institutes actually operate.", author: "Founder, Coaching Network" },
    { quote: "Our team spends less time stitching reports together and more time improving outcomes.", author: "Center Director, Coaching Institute" },
  ],
  students: [
    { quote: "Everything I need for class, assignments, and updates feels easier to track now.", author: "Student User" },
    { quote: "The experience is much cleaner than hopping between multiple apps and chats.", author: "Undergraduate Student" },
  ],
  teachers: [
    { quote: "Attendance and academic follow-up are much faster with one structured workflow.", author: "Faculty Member" },
    { quote: "The platform saves time every week because routine actions are easier to manage.", author: "Teacher, Senior Secondary" },
  ],
  institutes: [
    { quote: "We finally gained the oversight we needed across teams without adding more tools.", author: "Institution Director" },
    { quote: "Classgrid brought operational clarity where we previously had fragmentation.", author: "Admin Lead, Multi-Program Institute" },
  ],
};
