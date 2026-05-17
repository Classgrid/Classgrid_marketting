export type GalleryItem = {
  id: string;
  title: string;
  kind: "photo" | "video";
  category: "Campus" | "Labs" | "Classrooms" | "Celebrations";
  image: string;
  heightClass: string;
  href?: string;
};

export type EventItem = {
  slug: string;
  title: string;
  summary: string;
  longDescription: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  status: "Upcoming" | "Past";
  coverImage: string;
  highlights: string[];
  schedule: Array<{ time: string; session: string }>;
  gallery: string[];
};

export type AlumniStory = {
  name: string;
  batch: string;
  currentRole: string;
  currentOrg: string;
  quote: string;
  achievement: string;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "central-library",
    title: "Central Library Upgrade",
    kind: "photo",
    category: "Campus",
    image: "/dashboards/library-system.png",
    heightClass: "h-52",
  },
  {
    id: "automation-lab",
    title: "Automation & AI Lab",
    kind: "photo",
    category: "Labs",
    image: "/dashboards/ai-proctoring.png",
    heightClass: "h-72",
  },
  {
    id: "smart-classroom",
    title: "Smart Classroom",
    kind: "photo",
    category: "Classrooms",
    image: "/dashboards/faculty-portal.png",
    heightClass: "h-60",
  },
  {
    id: "sports-day",
    title: "Annual Sports Day Moments",
    kind: "video",
    category: "Celebrations",
    image: "/dashboards/admin-overview.png",
    heightClass: "h-64",
    href: "#",
  },
  {
    id: "student-project-showcase",
    title: "Project Showcase Arena",
    kind: "photo",
    category: "Celebrations",
    image: "/dashboards/results-analytics.png",
    heightClass: "h-56",
  },
  {
    id: "seminar-hall",
    title: "Seminar Hall",
    kind: "photo",
    category: "Campus",
    image: "/dashboards/lead-crm.png",
    heightClass: "h-72",
  },
  {
    id: "placement-cell",
    title: "Placement Cell",
    kind: "photo",
    category: "Campus",
    image: "/dashboards/attendance-dashboard.png",
    heightClass: "h-56",
  },
  {
    id: "iot-lab",
    title: "IoT and Robotics Lab",
    kind: "photo",
    category: "Labs",
    image: "/dashboards/exam-auto-grade.png",
    heightClass: "h-64",
  },
  {
    id: "cultural-fest",
    title: "Cultural Fest Highlights",
    kind: "video",
    category: "Celebrations",
    image: "/dashboards/alumni-network.png",
    heightClass: "h-56",
    href: "#",
  },
];

export const events: EventItem[] = [
  {
    slug: "annual-tech-fest-2026",
    title: "Annual Tech Fest 2026",
    summary:
      "A full-day innovation fest with coding challenges, startup demos, and keynote sessions by industry leaders.",
    longDescription:
      "Annual Tech Fest 2026 brings students, faculty, startups, and technology leaders together for a high-impact day of hands-on innovation. The event includes hackathons, prototype showcases, product pitches, and expert sessions on AI, cybersecurity, and digital transformation.",
    dateLabel: "August 14, 2026",
    timeLabel: "9:00 AM - 6:30 PM",
    venue: "Main Auditorium & Innovation Wing",
    status: "Upcoming",
    coverImage: "/dashboards/ai-proctoring.png",
    highlights: [
      "48-hour coding sprint across AI, cloud, and cybersecurity tracks",
      "Live startup pitch arena with jury feedback",
      "Guest sessions by engineering leaders and founders",
      "Campus-wide project expo and internship networking",
    ],
    schedule: [
      { time: "09:00 AM", session: "Opening Ceremony & Vision Talk" },
      { time: "10:30 AM", session: "Hackathon Sprint Kickoff" },
      { time: "01:00 PM", session: "Founder Panel: Building from Campus" },
      { time: "04:00 PM", session: "Prototype Demo & Jury Rounds" },
      { time: "06:00 PM", session: "Awards, Certificates & Closing" },
    ],
    gallery: [
      "/dashboards/ai-proctoring.png",
      "/dashboards/results-analytics.png",
      "/dashboards/lead-crm.png",
      "/dashboards/admin-overview.png",
    ],
  },
  {
    slug: "annual-sports-day-2026",
    title: "Annual Sports Day 2026",
    summary:
      "Track events, team competitions, and fitness challenges that celebrate campus spirit and discipline.",
    longDescription:
      "Annual Sports Day showcases the institute’s focus on holistic development through athletics, teamwork, and discipline. Students from all programs participate in individual and team events, promoting leadership and resilience.",
    dateLabel: "January 22, 2026",
    timeLabel: "8:00 AM - 5:00 PM",
    venue: "College Sports Ground",
    status: "Past",
    coverImage: "/dashboards/attendance-dashboard.png",
    highlights: [
      "Inter-department relay and football finals",
      "Best athlete awards for men and women",
      "Parent and alumni participation segments",
      "Closing march and sports excellence honors",
    ],
    schedule: [
      { time: "08:00 AM", session: "March Past & Oath Ceremony" },
      { time: "09:30 AM", session: "Track and Field Competitions" },
      { time: "01:30 PM", session: "Team Finals (Football & Volleyball)" },
      { time: "04:00 PM", session: "Prize Distribution" },
    ],
    gallery: [
      "/dashboards/attendance-dashboard.png",
      "/dashboards/alumni-network.png",
      "/dashboards/student-homework.png",
      "/dashboards/admin-overview.png",
    ],
  },
  {
    slug: "guest-lecture-future-of-ai",
    title: "Guest Lecture: Future of AI in Education",
    summary:
      "A keynote lecture on AI-driven learning, ethics, and career pathways for students in modern campuses.",
    longDescription:
      "This keynote session explores how AI is shaping learning outcomes, classroom operations, and institutional growth. Participants gain practical guidance on AI tools, ethical use, and emerging career opportunities.",
    dateLabel: "July 2, 2026",
    timeLabel: "11:00 AM - 1:00 PM",
    venue: "Seminar Hall A",
    status: "Upcoming",
    coverImage: "/dashboards/faculty-portal.png",
    highlights: [
      "Future trends in AI-enabled learning systems",
      "Practical roadmap for student upskilling",
      "Faculty Q&A on implementation and ethics",
      "Certificate of participation for attendees",
    ],
    schedule: [
      { time: "11:00 AM", session: "Keynote Address" },
      { time: "11:45 AM", session: "Use Cases in Education" },
      { time: "12:20 PM", session: "Open Q&A and Expert Feedback" },
    ],
    gallery: [
      "/dashboards/faculty-portal.png",
      "/dashboards/ai-proctoring.png",
      "/dashboards/library-system.png",
    ],
  },
];

export const alumniStories: AlumniStory[] = [
  {
    name: "Aarav Deshmukh",
    batch: "Computer Engineering 2019",
    currentRole: "Software Engineer",
    currentOrg: "Google",
    quote:
      "Classgrid helped me build confidence through project-based learning and mentorship. That foundation helped me crack global interviews.",
    achievement: "Led distributed systems optimization initiatives for global products.",
  },
  {
    name: "Sakshi Kulkarni",
    batch: "Electronics 2018",
    currentRole: "Research Scholar",
    currentOrg: "TU Munich",
    quote:
      "The institute’s research guidance and faculty support shaped my academic journey and opened doors to international programs.",
    achievement: "Published research on intelligent sensor networks for smart cities.",
  },
  {
    name: "Rohan Patil",
    batch: "MBA 2020",
    currentRole: "Product Manager",
    currentOrg: "Razorpay",
    quote:
      "Real-world case studies and leadership opportunities prepared me to drive product strategy at scale.",
    achievement: "Scaled fintech onboarding journeys for thousands of business users.",
  },
  {
    name: "Neha Joshi",
    batch: "BBA 2021",
    currentRole: "Founder",
    currentOrg: "EdTech Startup",
    quote:
      "Our entrepreneurship cell and alumni network gave me the confidence to build my company right after graduation.",
    achievement: "Built a learning startup serving 35+ partner institutions.",
  },
];

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug) ?? null;
}
