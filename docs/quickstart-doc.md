This guide explains the recommended path from a new Classgrid request to a usable institution workspace. It combines the current onboarding implementation plan with the public getting-started journey.

Use generic institution details while testing:

- Institution name: `Example Institution`
- Tenant address: `institution.classgrid.in`
- Admin email: `admin@example.edu`
- ERP URL: `https://erp.example.edu`
- Public website: `https://www.example.edu`

Do not use real institution names, student data, faculty data, or production credentials in a test workspace.

## 1. What you need before starting

Prepare the following information before the first onboarding session:

- Institution display name and short code.
- Organization type: Engineering, School, Coaching, Jr. College, or Diploma.
- Whether the organization uses divisions or sections.
- Academic year and term/semester dates.
- Departments, branches, programs, classes, courses, and batches.
- Initial Organization Admin details.
- Faculty and department-admin invite list.
- Student import data, if the student import workflow is enabled.
- Branding assets such as logo, colors, support email, and website URL.
- The institution's preferred tenant subdomain.

Use sample records first. Confirm the complete flow with test accounts before importing production data.

## 2. Quick-start path

Follow this order for the first setup:

1. Create or submit the onboarding lead.
2. Review the lead as a Super Admin.
3. Approve and provision the organization.
4. Activate the Organization Admin account.
5. Configure organization details and terminology.
6. Configure the academic hierarchy.
7. Enable the required modules.
8. Invite staff and department administrators.
9. Add students and academic records.
10. Test permissions, tenant access, and the main workflows.
11. Run a small pilot before wider rollout.

The sequence matters. Academic structure and roles should be decided before users and records are added.

## 3. Step 1: Create the onboarding lead

Use the public request/demo entry point or the internal lead workflow. Capture only the information needed to qualify and provision the organization.

Recommended lead details:

- Organization name.
- Organization type.
- Contact person and work email.
- Phone number, if required by the deployment.
- Approximate number of students and staff.
- Requested subdomain.
- Whether the organization needs divisions, sections, batches, or lab batches.
- Preferred onboarding date.

### Expected result

A lead record should be created and visible to the Super Admin. The current implementation plan identifies the `DemoRequest` persistence and the Super Admin lead view as built, but the complete deployed flow should still be tested in the target environment.

## 4. Step 2: Review and assign the lead

The Super Admin should review the lead before provisioning:

- Confirm that the organization type is correct.
- Confirm the requested subdomain is available and follows the naming rules.
- Confirm the Organization Admin email.
- Confirm whether divisions or sections are required.
- Assign the lead to an internal owner.
- Record the planned onboarding date.

Do not provision an organization from incomplete or unverified contact details.

## 5. Step 3: Approve and provision the organization

The intended provisioning flow creates the base tenant records and prepares the first administrator account.

The planned provisioning result includes:

- An `Organization` record.
- A unique organization code for faculty joining.
- A student honor/join code where the student flow requires one.
- An Organization Admin account.
- `mustResetPassword: true` for the initial administrator.
- A demo subscription with an initial 31-day active period.
- Default demo feature flags.
- An activation email or activation link.

### Provisioning verification checklist

- [ ] Organization is created once and is not duplicated on retry.
- [ ] Organization code is unique.
- [ ] Student honor/join code is unique where required.
- [ ] Organization Admin is linked to the correct tenant.
- [ ] Initial password must be changed at first login.
- [ ] Demo subscription dates are correct.
- [ ] Default feature flags are attached to the correct organization.
- [ ] Activation delivery is recorded or visible for troubleshooting.
- [ ] The provisioned tenant can be opened using the expected tenant URL.

The implementation plan states that the backend provisioning service exists, while the end-to-end approval and provisioning UI still requires verification. Treat this as a test gate, not as an assumption of production readiness.

## 6. Step 4: Activate the Organization Admin

The Organization Admin should:

1. Open the activation link or sign in with the temporary credentials.
2. Change the initial password.
3. Confirm the organization name and contact details.
4. Confirm the tenant URL.
5. Review the available modules.
6. Complete the academic setup before inviting the full staff list.

The first-login setup experience is identified as a missing or incomplete part of the current implementation plan. Before rollout, verify that the admin is redirected to the correct setup screen and cannot accidentally configure another tenant.

## 7. Step 5: Configure organization details and terminology

Start with the organization profile:

- Display name.
- Short code.
- Logo and brand colors.
- Support contact.
- Time zone and locale.
- Academic year naming.
- Public website and optional custom domain.

The interface should use the terminology returned by the hierarchy configuration instead of hardcoded labels. The planned terminology endpoint is:

```http
GET /api/hierarchy/terminology
```

The response should determine labels such as program, branch, standard, stream, class, division, section, batch, or lab batch for the selected organization type.

## 8. Step 6: Configure the academic hierarchy

Configure the academic hierarchy before importing or inviting users who depend on it. The setup must follow the selected organization type and division mode.

### Engineering

With divisions:

`Degree -> Branch -> Year -> Semester -> Division -> Sub Batch`

Without divisions:

`Degree -> Branch -> Year -> Semester`

### School

With divisions:

`Standard -> Class -> Term -> Section`

Without divisions:

`Standard -> Class -> Term`

### Coaching

With divisions:

`Course -> Phase -> Batch`

Without divisions:

`Course -> Phase`

### Jr. College

With divisions:

`Stream -> Standard -> Term -> Division`

Without divisions:

`Stream -> Standard -> Term`

### Diploma

With divisions:

`Department -> Branch -> Year -> Semester -> Division -> Lab Batch`

Without divisions:

`Department -> Branch -> Year -> Semester`

### Recommended nine-step setup

1. Academic year.
2. Top-level academic unit.
3. Second-level academic unit.
4. Year, class, or equivalent level.
5. Period, semester, term, phase, or equivalent.
6. Division, section, or equivalent when enabled.
7. Sub-batch or lab batch when required.
8. Subjects and curriculum.
9. Academic calendar.

Do not show division, section, sub-batch, or lab-batch steps when the selected organization configuration does not use them.

### Academic setup acceptance checks

- [ ] The correct labels are shown for the organization type.
- [ ] Division-specific steps appear only when enabled.
- [ ] Parent-child relationships are valid.
- [ ] Duplicate hierarchy records are rejected or merged safely.
- [ ] Academic year dates are valid and do not overlap unintentionally.
- [ ] Subjects can be assigned to the correct level.
- [ ] Calendar events use the correct academic year.
- [ ] Refreshing the page does not lose saved configuration.
- [ ] A user from another organization cannot see this hierarchy.

## 9. Step 7: Enable the required modules

Begin with only the modules needed for the pilot. Review access after the academic hierarchy is complete.

### Suggested initial modules

- Overview.
- Announcements.
- Students.
- Faculty.
- Classrooms.
- Timetable.
- Academic Calendar.
- Curriculum.
- Attendance.
- Chat.
- Requests.
- Analytics.

### Modules that may require separate readiness checks

- Admissions.
- Fees and Payments.
- Examinations.
- Marks and Results.
- Certificates.
- Feedback.
- Leave.
- Library.
- Hostel.
- Canteen.
- Transport.
- Accreditation or compliance workflows.
- Events and seminars.
- Alumni and placements.
- AI-assisted features.
- College website features.

The implementation plan describes default demo-tier feature flags, but also marks feature-gating UI work as incomplete. Verify both sides of the control: a disabled module must be hidden or locked in navigation, and its API must reject unauthorized access.

## 10. Step 8: Invite staff and administrators

Invite users only after the hierarchy and role map are agreed.

Typical roles include:

- Organization Admin.
- Department Admin.
- Faculty.
- Student.
- Parent or guardian, when enabled.

Use the role list returned by the backend rather than inventing role names in the client:

```http
GET /api/hierarchy/roles?invitable=true
```

The organization admin invite workflow may use:

```http
POST /api/org/invite-staff
```

### Membership checks

The following endpoints are listed in the implementation plan for membership management:

```http
GET    /api/org/members
GET    /api/org/members/pending
DELETE /api/org/members/:userId
POST   /api/org/members/:userId/resend
```

Before rollout, verify that each endpoint enforces tenant isolation, role permissions, and safe resend behavior. The plan specifically identifies the Members page and these backend routes as requiring verification.

### Staff invitation checklist

- [ ] Each email belongs to the correct person.
- [ ] Each user receives the correct role.
- [ ] Department and academic assignments are correct.
- [ ] Pending invitations have an expiry or resend policy.
- [ ] Revoked users lose access immediately or within the documented session window.
- [ ] A user cannot accept an invitation for another organization.
- [ ] The invitation does not expose another user's personal data.

## 11. Step 9: Add students and academic records

Use the smallest realistic dataset for the first pilot:

- One academic year.
- One or two academic units.
- A small faculty group.
- A small student group.
- One timetable.
- One attendance workflow.
- One announcement.
- One assessment or result workflow, if enabled.

Validate the import template before uploading a larger file. Keep test data clearly separated from production data, and remove test accounts before go-live.

The implementation plan lists student import, fee setup, and exam timetable workflows as later department work. If those workflows are not available in the deployed build, record them as manual or pending tasks instead of presenting them as completed.

## 12. Step 10: Test the first user journeys

Run these tests using separate test accounts:

### Organization Admin

- Sign in and change the initial password.
- View only the assigned organization.
- Complete or resume academic setup.
- Invite a staff member.
- Disable a feature and confirm the navigation/API behavior.

### Department Admin

- View only the assigned department or academic scope.
- Manage the permitted students, faculty, and academic records.
- Confirm that organization-wide settings are unavailable unless explicitly granted.

### Faculty

- View assigned classes and subjects.
- Record attendance or academic data only for permitted groups.
- Confirm that private administrative settings are unavailable.

### Student or parent

- Sign in to the correct tenant.
- View only the permitted personal or linked-student data.
- Confirm that administrative pages are unavailable.

### Tenant and domain

- Open the tenant URL in a private browser window.
- Confirm that the correct organization branding appears.
- Confirm that an unknown tenant does not resolve to this organization.
- Confirm that custom-domain behavior matches the deployment configuration.

## 13. Pilot-to-go-live checklist

### Data and configuration

- [ ] Organization profile is approved.
- [ ] Academic year and hierarchy are approved.
- [ ] Subjects and curriculum are reviewed.
- [ ] Calendar dates are approved.
- [ ] Branding and tenant URL are correct.
- [ ] Production data import has been reviewed.

### Accounts and security

- [ ] Organization Admin has changed the initial password.
- [ ] Staff roles are approved.
- [ ] Pending invitations are reviewed.
- [ ] Test users are removed or disabled.
- [ ] Access is verified with least-privilege accounts.
- [ ] Tenant isolation has been tested.

### Product readiness

- [ ] Required modules are enabled.
- [ ] Disabled modules cannot be accessed through direct API calls.
- [ ] Members and invitation flows work end to end.
- [ ] Password reset and activation flows work.
- [ ] Error messages do not expose secrets or another organization's data.
- [ ] Support ownership and escalation contacts are documented.

### Operational readiness

- [ ] Import and rollback procedures are documented.
- [ ] A first-week support schedule is assigned.
- [ ] The pilot group knows where to report issues.
- [ ] A backup/export policy is confirmed.
- [ ] The go-live decision owner is identified.

## 14. Current implementation status

This section reflects the supplied implementation plan. It is a readiness guide, not a claim that every item is enabled in every deployed environment.

### Identified as built or present in the plan

- Marketing lead submission persistence using `DemoRequest`.
- Super Admin lead visibility.
- A backend approval/provisioning service.
- Default demo subscription and feature-flag definitions.
- Hierarchy terminology and CRUD route planning.

### Identified as needing verification

- Lead assignment and schedule-demo behavior.
- Approve and provision UI end to end.
- Members page behavior.
- Organization member and invitation APIs.
- Activation email and first-login behavior.
- Tenant URL resolution after provisioning.

### Identified as planned or not yet built

- Academic Setup wizard.
- Organization Admin first-login onboarding.
- Complete demo-tier feature-gating UI.
- Department Admin workflows.
- Student CSV import workflow.
- Fee structure creation workflow.
- Exam timetable workflow.

Before announcing a feature, run the corresponding acceptance test in the actual deployed environment and record the result.

## 15. Troubleshooting

### The admin sees the wrong setup labels

Check the organization type, division mode, and the response from:

```http
GET /api/hierarchy/terminology
```

The client should use the returned terminology and should not fall back to a label from another organization type.

### The admin cannot see the academic setup

Confirm that the provisioning flow assigned the correct organization role and that the deployed build includes the setup route. The current implementation plan marks the wizard as incomplete, so this may be an implementation gap rather than a user error.

### An invited user cannot join

Check the invitation email, expiry, organization ID, role, and pending-members endpoint. Resend only after confirming that the original invitation is still valid or has expired according to policy.

### A disabled module still opens

Check both the frontend navigation state and backend feature-flag middleware. Hiding a menu item alone is not sufficient protection.

### The tenant URL does not resolve

Check the organization slug/subdomain, DNS or host configuration, tenant resolution route, and whether the provisioned organization is active. Use a generic test tenant such as `institution.classgrid.in` while debugging.

## 16. Related documentation

- [Getting started help article](https://classgrid.in/help-center/article/getting-started)
- [Introduction documentation](introduction-doc.md)
- [Login and RBAC documentation](rbac-login-doc.md)
- [Custom domains documentation](../docs/custom-domains-doc.md)
- [Implementation plan](../../implementation_plan.md)

## Definition of quick-start completion

The quick start is complete when a test Organization Admin can activate the account, configure the correct academic hierarchy, invite a test staff member, sign in as each required role, open the correct tenant, and complete one representative workflow without seeing another organization's data.
