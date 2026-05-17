# Tenant Website Template Scope (Locked)

This document defines the non-negotiable scope for the shared tenant public website template.

## Included Org Types
- `school`
- `junior-college`
- `coaching`

## Excluded Org Type
- `engineering-college`

## Why Engineering Is Excluded
- Engineering institutions usually already run large, legacy public websites.
- They require accreditation-heavy structures (NBA/NAAC/NIRF style depth) that do not fit the lightweight shared template.
- They should follow the BYOW (Bring Your Own Website) connection model with Classgrid gateway flows.

## Implementation Notes
- Frontend lock is defined in `content/collge_webiste.ts` via `tenantWebsiteTemplateScope`.
- Backend-facing lock is documented in `server/middleware/tenantMiddleware.ts` as:
  - `PUBLIC_TEMPLATE_SUPPORTED_ORG_TYPES`
  - `PUBLIC_TEMPLATE_EXCLUDED_ORG_TYPES`
