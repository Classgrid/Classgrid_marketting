const fs = require('fs');

let file = fs.readFileSync('components/scroll-morph-hero.tsx', 'utf8');

const replacement = `// My Classgrid Dashboards
const IMAGES = [
    "/dashboards/attendance-dashboard.png",
    "/dashboards/fee-ledger.png",
    "/dashboards/timetable-view.png",
    "/dashboards/results-analytics.png",
    "/dashboards/parent-portal.png",
    "/dashboards/admin-overview.png",
    "/dashboards/bus-tracking.png",
    "/dashboards/leave-approval.png",
    "/dashboards/ai-proctoring.png",
    "/dashboards/hostel-management.png",
    "/dashboards/library-system.png",
    "/dashboards/hrms-payroll.png",
    "/dashboards/faculty-portal.png",
    "/dashboards/student-homework.png",
    "/dashboards/lead-crm.png",
    "/dashboards/exam-auto-grade.png",
    "/dashboards/id-card-gen.png",
    "/dashboards/certificate-printing.png",
    "/dashboards/naac-nba.png",
    "/dashboards/alumni-network.png",
];`;

file = file.replace(/\/\/ Dashboard \/ UI Placeholders[\s\S]*?\];/, replacement);

fs.writeFileSync('components/scroll-morph-hero.tsx', file);
console.log('Fixed morph images');
