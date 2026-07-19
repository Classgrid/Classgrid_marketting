/**
 * Maps platform roles to their correct dashboard paths.
 * Source of truth: classgrid_platform/server/src/controllers/auth.controller.js (DASHBOARD_TARGETS)
 */

const DASHBOARD_TARGETS: Record<string, string> = {
  student: "/classrooms",
  teacher: "/classrooms",
  faculty: "/classrooms",
  org_admin: "/org/dashboard",
  library_manager: "/dept/library/dashboard",
  hod: "/org/dashboard",
  principal: "/org/dashboard",
  vice_principal: "/org/dashboard",
  exam_controller: "/dept/exams/dashboard",
  fee_manager: "/dept/fees/dashboard",
  admission_head: "/dept/admissions/dashboard",
  admission_verifier: "/dept/admissions/dashboard",
  admission_counselor: "/dept/admissions/dashboard",
  admission_clerk: "/dept/admissions/dashboard",
  tpo_officer: "/org/dashboard",
  transport_manager: "/dept/transport/dashboard",
  counselor: "/org/dashboard",
  coordinator: "/org/dashboard",
  super_admin: "/superadmin/dashboard",
  hr_dept: "/dept/hr/dashboard",
  hostel_dept: "/dept/hostel/dashboard",
};

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  teacher: "Faculty",
  faculty: "Faculty",
  org_admin: "Organization Admin",
  library_manager: "Library Manager",
  hod: "Head of Department",
  principal: "Principal",
  vice_principal: "Vice Principal",
  exam_controller: "Exam Controller",
  fee_manager: "Fees Manager",
  admission_head: "Admissions Head",
  admission_verifier: "Admissions Verifier",
  admission_counselor: "Admissions Counselor",
  admission_clerk: "Admissions Clerk",
  tpo_officer: "Placement Officer",
  transport_manager: "Transport Manager",
  counselor: "Counselor",
  coordinator: "Coordinator",
  super_admin: "Super Admin",
  hr_dept: "HR Department",
  hostel_dept: "Hostel Department",
};

interface DashboardUrlParams {
  role?: string | null;
  orgSubdomain?: string | null;
  orgCustomDomain?: string | null;
  isCustomDomainEnabled?: boolean;
}

/**
 * Builds the full dashboard URL for a platform user based on their role and org.
 * 
 * Rules:
 * - Super admin → https://classgrid.in/superadmin/dashboard (no org needed)
 * - Custom domain enabled → https://custom.domain/login (no SSO, must login again)
 * - Classgrid subdomain → https://abc.classgrid.in/classrooms (SSO works!)
 */
export function getDashboardUrl({
  role,
  orgSubdomain,
  orgCustomDomain,
  isCustomDomainEnabled,
}: DashboardUrlParams): string {
  if (!role) return "https://classgrid.in/login";

  const dashboardPath = DASHBOARD_TARGETS[role] || "/classrooms";

  // Super admin → dedicated superadmin subdomain
  if (role === "super_admin" || role === "co_super_admin") {
    return `https://superadmin.classgrid.in/`;
  }

  // Custom domain org → redirect to custom domain login (no SSO possible)
  if (orgCustomDomain && isCustomDomainEnabled) {
    // For student/teacher, go to /login; for admin roles, go to /admin/login
    const isAdmin = !["student", "teacher", "faculty"].includes(role);
    const loginPath = isAdmin ? "/admin/login" : "/login";
    return `https://${orgCustomDomain}${loginPath}`;
  }

  // Classgrid subdomain → SSO works, go directly to dashboard
  if (orgSubdomain) {
    return `https://${orgSubdomain}.classgrid.in${dashboardPath}`;
  }

  // Fallback if user has no organization assigned
  return `https://classgrid.in/login`;
}

/**
 * Returns a human-readable label for a platform role.
 */
export function getRoleLabel(role?: string | null): string {
  if (!role) return "User";
  return ROLE_LABELS[role] || role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
