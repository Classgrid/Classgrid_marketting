# Classgrid Forum Professional Upgrade Plan

## Goal

Make `forum.classgrid.in` feel like a professional community forum where users immediately understand where to ask questions, find product help, read updates, and connect with Classgrid.

## Access Note

The work can be done tomorrow through SSH on the Discourse server, but do not save the SSH password in this repository or in any Markdown file. Use the password only at runtime, keep it out of logs, and rotate it after server work because it was shared in chat.

## Before Changing Anything

- Verify `forum.classgrid.in` opens on desktop and mobile.
- Confirm SSL is still using the RSA Let's Encrypt certificate.
- Export or back up the active Discourse theme before editing.
- Check the active theme name and existing theme fields: `head_tag`, `scss`, `after_header`, and theme components.
- Avoid large fixed-position overlay code. Use Discourse native theme APIs, theme components, settings, and clean CSS only.

## Categories To Add

- Announcements: official Classgrid product updates and launch notes.
- Product Updates: release notes, improvements, and roadmap previews.
- Help & Questions: user questions, setup help, and usage guidance.
- Support: issue reports, account help, and troubleshooting.
- Ideas & Feedback: feature requests and product suggestions.
- Events & Webinars: demos, workshops, and live sessions.
- Showcase: schools, institutes, and teams sharing how they use Classgrid.
- General: open discussion.
- Site Feedback: forum feedback.
- Staff: private admin/team category only.

## Homepage Improvements

- Add a professional welcome headline and short community purpose.
- Add a featured posts area with 2-4 important topics.
- Show category cards on the left and latest active topics on the right, similar to Cursor.
- Keep the search bar visible and useful.
- Add a clear `New Topic` button.
- Keep mobile layout simple: search, key categories, latest topics, and profile/menu.

## Header Improvements

- Add native header links: Documentation, Help Center, Support, and Forum Guidelines.
- Keep links aligned before profile/login controls.
- Use Discourse native widget/plugin API or a theme component, not fake overlays.
- Keep the login button and profile area clean and mobile-safe.

## User Connection Features

- Pin a welcome topic that invites users to introduce themselves.
- Pin a forum guidelines topic with simple rules and support expectations.
- Add a “Start here” topic linking to docs, help center, support, and common questions.
- Create tags like `setup`, `billing`, `attendance`, `lms`, `admin`, `mobile`, `bug`, `feature-request`.
- Add staff response habits: reply fast, mark solved answers, and move topics into the right category.
- Add weekly or monthly Classgrid update posts so the forum feels alive.

## Professional Setup Checklist

- Use proper category icons/colors.
- Add descriptions for every category.
- Create 5-10 starter topics so the forum does not look empty.
- Configure pinned/global topics.
- Review permissions so public users see public areas and staff-only areas stay private.
- Test logged-out, logged-in, admin, desktop, and mobile views.
- Keep a rollback backup before each live theme change.

## Tomorrow Execution Order

1. Inspect live Discourse theme and current categories.
2. Back up the active theme and current forum structure.
3. Add categories and descriptions first.
4. Add starter topics, pinned welcome, and guidelines.
5. Improve header and homepage layout carefully.
6. Verify on desktop and mobile.
7. Clear Discourse theme/cache.
8. Save a short final report with what changed and what to check.
