# Superadmin Organization Resource, Billing, and Operations Dashboard — Master Requirement List

## Purpose

This document defines the backend measurements and dashboard presentation required for a trustworthy per-organization Superadmin view. Classgrid billing is resource-based, so an organization cannot be billed from student count and a guessed storage value alone. The platform must capture direct consumption, shared-infrastructure allocation, provider charges, credits, taxes, and operational statistics across storage, compute, database, messaging, AI, video, payments, and every institution module.

The current platform backend contains many organization-linked data models, but the existing organization-detail response exposes only a small subset. Cloudflare R2 storage and per-organization server cost are not presently measured accurately. This list is therefore both a dashboard specification and an instrumentation backlog.

## Non-negotiable measurement rules

- Never display a missing value as `0`. Use `Unavailable`, `Not instrumented`, or `Awaiting provider sync`.
- Every metric must include `value`, `unit`, `periodStart`, `periodEnd`, `capturedAt`, `source`, `quality`, and `isEstimated`.
- `quality` must be one of `actual`, `allocated`, `estimated`, `stale`, `partial`, or `unavailable`.
- Direct costs and shared-cost allocations must be shown separately before showing their combined total.
- Provider prices must come from versioned rate cards with currency and effective dates; never hard-code permanent prices in UI code.
- Store raw provider units as well as calculated money so old invoices can be reproduced after prices change.
- Preserve daily usage snapshots and immutable finalized billing-period snapshots.
- Use the organization ID in every resource ledger, upload, request metric, queue job, message, AI call, and provider mapping.
- Do not send private codes, API keys, signing secrets, webhook secrets, access tokens, or encrypted credentials to the browser.
- Expensive aggregation must run in workers or scheduled rollups. The page must not count dozens of collections on every request.
- Each dashboard section must support `Today`, `7 days`, `30 days`, `Current billing period`, `Previous period`, and custom dates where meaningful.
- Show current value, previous-period value, percentage change, quota, forecast, and data freshness together.
- Use institution-aware labels: student/learner, teacher/faculty, class/batch/division, and department/standard/stream according to organization structure.
- All amounts must show source currency, billing currency, conversion rate, conversion timestamp, tax, credit, and rounding adjustments.
- All manual changes must require a reason and create an immutable Superadmin audit event.

## How the page must be organized

1. **Sticky organization header:** identity, institution type, status, plan, billing state, owner, domain, region, current-period cost, outstanding balance, and last refresh.
2. **Financial summary:** actual direct cost, allocated shared cost, markup, discounts, tax, billed amount, collected amount, balance, and forecast.
3. **Resource summary:** compute, storage, database, bandwidth, email, SMS, AI, video, and third-party services with actual/estimated badges.
4. **Usage and adoption:** users, academic operations, admissions, fees, examinations, communication, content, and enabled modules.
5. **Reliability and security:** errors, latency, queues, provider incidents, failed jobs, suspicious activity, and audit history.
6. **Drill-down tabs:** Overview, Resources, Costs, Usage, Modules, Reliability, Security, Billing, Support, Configuration, and Audit.
7. **No giant raw-data dump:** use summary cards and trends first, then tables and record-level drill-downs.
8. **Warning design:** red only for actionable failures, amber for approaching quotas or partial data, blue for estimates, gray for unavailable data, and green only for confirmed healthy states.
9. **Cost explanation:** every cost row must expose its formula, provider invoice reference, allocation method, and included raw units.
10. **Exports:** CSV for tables, JSON for raw metering, and PDF for finalized statements, with export time and filters printed in the file.

---

## Requirements 1–100: Organization, People, Academic, and Module Statistics

1. Show organization ID, legal/display name, institution type, structure type, division mode, and creation timestamp.
2. Show full address, country, state, city, timezone, locale, currency, and tax jurisdiction from explicit backend fields.
3. Show owner name, verified email, phone number, designation, account status, and last successful login.
4. Show organization status, active flag, suspension reason, suspension time, suspending admin, and reactivation history.
5. Show demo start, demo expiry, days remaining, extension history, conversion date, and conversion owner.
6. Show subdomain, custom domain, DNS verification, CNAME verification, TLS status, certificate expiry, and Classgrid fallback URL state.
7. Show branding completeness: logo, favicon, campus image, theme colors, font, tagline, and last branding update.
8. Show organization-code state, honor-code state, expiry, regeneration date, and use count without exposing code values.
9. Show allowed email-domain count, verified domains, rejected domains, and latest domain-policy change.
10. Show onboarding percentage, current stage, completed steps, blocked steps, responsible owner, and last progress update.
11. Show plan name, subscription status, paid status, activation date, renewal date, expiry date, and cancellation state.
12. Show student, faculty, storage, API, email, SMS, AI, video, and custom contractual limits.
13. Show all enabled subscription features and distinguish plan features, organization overrides, and emergency kill switches.
14. Show base fee, unit rates, free allowances, minimum commitment, markup, negotiated discount, and effective dates.
15. Show active students, suspended students, blocked students, deleted/anonymized students, and pending-verification students separately.
16. Show active faculty, teachers, assistants, mentors, department heads, and other educator roles separately.
17. Show active organization admins, secondary admins, custom-role admins, and users with multiple roles.
18. Show total active users, monthly active users, weekly active users, daily active users, and paid-seat utilization.
19. Show invited but unactivated users, expired invitations, failed activations, and average activation time.
20. Show new users this period, deactivated users, restored users, and net seat growth.
21. Show last-login distribution, users inactive for 30/60/90 days, and never-logged-in users.
22. Show authentication-provider distribution: password, Google, Facebook, GitHub, LinkedIn, and other configured providers.
23. Show verified versus unverified email accounts and pending, rejected, or verified organization memberships.
24. Show locked accounts, failed-login volume, password-reset volume, forced-logouts, and trusted-device counts.
25. Show profile-completion percentage and missing mandatory fields by institution-specific profile requirements.
26. Show student distribution by branch, department, standard, stream, course, batch, year, semester, and division.
27. Show student gender distribution only when permitted, aggregated, and privacy-threshold protected.
28. Show faculty distribution by department, subject, qualification, employment type, and workload band.
29. Show student-to-faculty ratio overall and by academic unit, with contractual or recommended threshold alerts.
30. Show AcademicHierarchy node counts by level, orphan nodes, inactive nodes, duplicate names, and empty academic units.
31. Show classrooms total, active, archived, empty, over-capacity, and without assigned teachers.
32. Show classroom membership total, average, median, maximum, and capacity utilization.
33. Show classrooms by course type, academic year, term, stream, branch, semester, standard, and division.
34. Show classrooms without subjects, invalid hierarchy links, missing class teachers, and stale membership counts.
35. Show subject total, active/inactive subjects, subjects without teachers, and subjects without classrooms.
36. Show assignment count created, published, due, closed, archived, and deleted during the selected period.
37. Show assignment submissions, submission rate, on-time rate, late rate, missing rate, and grading completion.
38. Show assignment attachment count and storage bytes by organization, classroom, and file type.
39. Show attendance sessions, expected marks, recorded marks, absent rate, late rate, and attendance completion.
40. Show attendance statistics by institution hierarchy, classroom, subject, session type, and date.
41. Show missing attendance sessions, unclosed sessions, correction requests, appeals, and pending approvals.
42. Show attendance appeal attachment count and bytes in the storage breakdown.
43. Show leave requests submitted, approved, rejected, cancelled, pending, and average decision time.
44. Show exams created, scheduled, active, completed, cancelled, and archived.
45. Show exam records, registered candidates, attempted candidates, absent candidates, and completion rate.
46. Show exam results published, unpublished, corrected, withheld, and awaiting verification.
47. Show student marks count, average, pass rate, failure rate, distinction rate, and missing-mark records.
48. Show report cards generated, regenerated, downloaded, emailed, and failed generation jobs.
49. Show result audit-log volume, corrections by reason, actors, and high-risk bulk changes.
50. Show online-exam sessions, proctor incidents, evidence images, bytes stored, and review status.
51. Show admission applications started, submitted, paid, verified, approved, rejected, waitlisted, cancelled, and enrolled.
52. Show admission funnel conversion between discovery, registration, application, payment, verification, offer, and enrollment.
53. Show application processing time, document-verification time, offer acceptance time, and enrollment completion time.
54. Show admission applications by program, category, quota, round, source, and academic year.
55. Show admission OTP requests, successful verifications, failures, expirations, retries, and provider cost.
56. Show admission documents uploaded, verified, rejected, expired, and bytes stored by document type.
57. Show CET allotments by round, quota, category, status, upgrade state, and enrollment conversion.
58. Show seat-matrix capacity, allocated seats, vacant seats, supernumerary seats, and over-allocation warnings.
59. Show waitlist size, automatic promotions, expired offers, cancellations, and vacancy recovery.
60. Show admission configuration completeness, portal state, form fields, document rules, deadlines, and workflow policy.
61. Show fee structures, fee components, categories, applicable students, active versions, and effective periods.
62. Show student fee ledgers, billed value, collected value, pending value, overdue value, waivers, and write-offs.
63. Show fee transactions by payment method, success, pending, failure, refund, reconciliation, and settlement state.
64. Show payment requests created, opened, paid, expired, cancelled, and average time to payment.
65. Show invoices generated, sent, viewed, paid, overdue, voided, refunded, and tax-document status.
66. Show organization fee revenue separately from Classgrid platform subscription revenue.
67. Show Razorpay student-payment volume, platform-payment volume, gateway fees, taxes, refunds, and chargebacks separately.
68. Show unmatched payments, duplicate webhook events, signature failures, and settlement discrepancies.
69. Show canteen items active/inactive/out-of-stock, orders, gross sales, refunds, cancellations, and payment fees.
70. Show canteen storage for product images and generated receipts as separate resource categories.
71. Show course playlists, videos, duration, views, completion, active learners, and video-file storage.
72. Show notes uploaded, approved, rejected, purchased, downloaded, and reported.
73. Show note packages, package sales, creator earnings, platform commission, and refund volume.
74. Show past papers uploaded, approved, downloaded, reported, and storage bytes.
75. Show marketplace listings, purchases, payouts, commissions, disputes, and file-storage consumption.
76. Show forum posts, comments, reactions, reports, moderation actions, and attachment storage.
77. Show organization announcements created, scheduled, delivered, viewed, expired, and failed.
78. Show organization direct messages, group messages, classroom messages, threads, and active conversations.
79. Show chat attachments by module, file type, object count, bytes, downloads, and orphan state.
80. Show voice messages, audio duration, transcription calls, transcription cost, bytes, and retention expiry.
81. Show meetings created, started, completed, cancelled, total participant minutes, and recording state.
82. Show live sessions, peak participants, streaming minutes, recording minutes, and provider charges.
83. Show meeting chat count, files, moderation events, and retention-policy state.
84. Show support tickets by type, category, priority, status, SLA state, assigned agent, and age.
85. Show support first-response time, resolution time, reopen rate, satisfaction, and escalation count.
86. Show support conversation messages, attachments, email notifications, and storage consumption.
87. Show content reports, affected module, reporter count, severity, moderation decision, and resolution time.
88. Show organization website publication state, page count, content completeness, media bytes, and last publication.
89. Show website traffic, unique visitors, bandwidth, form submissions, and conversion events when instrumented.
90. Show leads, lead source, pipeline stage, follow-up state, conversion, value, and assigned sales owner.
91. Show onboarding events, failed provisioning steps, retries, manual interventions, and completion duration.
92. Show import batches, input rows, successful rows, rejected rows, duplicates, validation errors, and file bytes.
93. Show organization-level scheduled notifications, execution state, audience count, delivery state, and provider cost.
94. Show enabled HR functionality, employee records, biometric events, payroll runs, and payroll calculation jobs.
95. Show transport, library, hostel, alumni, accreditation, and other modules only when their backend instrumentation exists.
96. Show each module's enabled state, first-use date, last-use date, monthly active users, and adoption percentage.
97. Show modules paid for but unused, heavily used modules outside allowance, and disabled modules still receiving traffic.
98. Show per-module record count, new records this period, archived records, storage bytes, requests, and calculated cost.
99. Show data-quality problems: orphan references, missing organization IDs, duplicate records, and inconsistent status values.
100. Provide drill-down links from every summary count to the filtered records that produced it, subject to permissions.

---

## Requirements 101–200: Resource Metering, Provider Cost, and Billing Inputs

101. Create an immutable resource-event ledger with organization, provider, service, resource type, quantity, unit, timestamp, and source ID.
102. Create daily organization usage rollups while preserving raw events long enough for dispute investigation.
103. Create versioned provider rate cards with region, tier, currency, tax treatment, effective start, and effective end.
104. Store direct provider cost, allocated shared cost, internal markup, discount, credit, tax, and final billable amount separately.
105. Support organization-specific contracts, negotiated rates, free allowances, minimum commitments, and capped overages.
106. Support prepaid credits, promotional credits, provider credits, refunds, manual adjustments, and credit expiry.
107. Reconcile every finalized billing period against provider invoices and record unexplained variance.
108. Show current period accrued cost, forecast end-of-period cost, budget, remaining budget, and forecast confidence.
109. Show cost change versus previous period and explain the largest contributing resource changes.
110. Show unit economics per active user, student, faculty member, classroom, application, and transaction.
111. For Cloudflare R2, track bytes stored per object from upload until deletion for accurate GB-month calculation.
112. Track R2 object count, average object size, largest objects, zero-byte objects, and objects by file type.
113. Track R2 Class A/write operations such as PUT, multipart create, copy, list, and lifecycle mutations.
114. Track R2 Class B/read operations such as GET, HEAD, range requests, and metadata reads.
115. Track R2 deletes, failed deletes, delete retries, tombstones, and bytes released.
116. Track R2 inbound bytes, outbound bytes, cache-served bytes, origin-served bytes, and any chargeable egress.
117. Track R2 multipart uploads started, completed, abandoned, parts, and abandoned-part storage.
118. Track R2 presigned URLs created, used, expired unused, failed, and reused unexpectedly.
119. Track R2 upload failures, download failures, permission errors, rate limits, and provider latency.
120. Track R2 storage by module: notes, classroom, chat, attendance, exams, admissions, support, marketplace, website, and voice.
121. Require every new R2 key or object-ledger record to include organization ID and module ownership.
122. Backfill existing R2 objects by matching stored URLs to database records and mark unresolved objects as unallocated.
123. Show R2 orphan objects, missing objects referenced by records, duplicate objects, and reconciliation time.
124. Apply R2 retention rules by data type and show bytes eligible for deletion, archived bytes, and projected savings.
125. Show R2 actual cost, allocated shared cost, billable usage, free allowance, overage, and markup.
126. Track legacy Supabase Storage separately from R2; never combine them without provider labels.
127. Track Supabase database size, table size, row count, index size, WAL/backup use, and growth by organization where allocatable.
128. Track Supabase Storage bytes, object count, operations, bandwidth, and egress by organization and bucket.
129. Track Supabase Realtime messages, peak connections, connection duration, channels, and provider allowance usage.
130. Track Supabase authentication monthly active users and distinguish organization users from platform/global users.
131. Track Supabase Edge Function invocations, duration, memory, errors, and bandwidth when used.
132. Track Supabase plan base cost separately and allocate shared cost using a declared allocation policy.
133. Track MongoDB document count and estimated BSON bytes for every organization-linked collection.
134. Track MongoDB index bytes attributable to organization-linked data where technically measurable or estimated.
135. Track MongoDB reads, writes, deletes, aggregations, and transaction operations by organization.
136. Track MongoDB query duration, documents examined, documents returned, slow queries, and timeout count.
137. Track MongoDB connections, pool wait time, connection errors, and organization-associated request pressure.
138. Track MongoDB network ingress/egress, backup cost, point-in-time recovery, snapshots, and restore tests.
139. Track MongoDB Atlas base-cluster cost separately from organization allocation.
140. Show MongoDB cost allocation method, such as weighted bytes plus operations, with its version and effective date.
141. Track Redis memory used by organization-prefixed keys, key count, average TTL, expired keys, and evictions.
142. Track Redis commands, cache hits, misses, connection count, bandwidth, blocked clients, and errors.
143. Track Redis queue data, pending jobs, active jobs, completed jobs, failed jobs, retries, and dead-letter jobs by organization.
144. Track Redis/provider base price and allocate shared cost by memory-time, commands, and bandwidth.
145. Track Vercel function invocations by organization, route, runtime, region, status, and deployment.
146. Track Vercel function duration, billed duration, CPU time, memory allocation, GB-hours, and cold starts.
147. Track Vercel edge requests, middleware invocations, cache hits, cache misses, and execution time.
148. Track Vercel Fast Data Transfer and origin transfer bytes by organization and route.
149. Track Vercel image optimization transformations, source images, cache use, output bytes, and cost.
150. Track Vercel build minutes, deployment count, failed builds, preview builds, and production builds as platform overhead.
151. Track Vercel ISR/cache reads, writes, revalidations, invalidations, and stored cache volume when billed.
152. Track Vercel log ingestion, log-drain volume, analytics events, Speed Insights samples, and observability charges.
153. Track Vercel cron invocations and allocate each job to an organization or platform overhead.
154. Track Vercel firewall requests, challenged requests, blocked requests, rate-limit actions, and security add-on charges.
155. Track Vercel Blob, Edge Config, Queues, Workflow, or Sandbox consumption if those products are introduced.
156. Store Vercel project, team, deployment, and billing-invoice identifiers for reconciliation without exposing tokens.
157. Track EC2 instance-hours by instance ID, type, region, availability zone, purchase model, and environment.
158. Track EC2 vCPU seconds, memory GB-seconds, process duration, load average, and organization-attributed work.
159. Track EC2 network ingress, internet egress, inter-region transfer, inter-AZ transfer, and public IPv4 charges.
160. Track EBS provisioned GB-month, IOPS, throughput, snapshots, snapshot archive, and restore charges.
161. Track load balancer hours, LCU/NLCU usage, processed bytes, requests, active connections, and rule evaluations.
162. Track NAT Gateway hours and bytes, and identify organization routes causing avoidable NAT cost.
163. Track Elastic IP/public IPv4 allocation time, attached state, and idle-IP cost.
164. Track CloudWatch logs, metrics, alarms, dashboards, traces, and archived log bytes.
165. Track AWS backup, AMI, snapshot, data lifecycle, and disaster-recovery replication costs.
166. Track EC2 On-Demand, Reserved Instance, Savings Plan, and Spot discounts separately from raw usage.
167. Allocate shared EC2 cost using measured request CPU time, memory-time, duration, and network—not student count alone.
168. Show unallocated EC2/platform overhead as its own line rather than hiding it inside organizations.
169. Track container, Kubernetes, ECS, Lambda, or other compute units with the same organization-attribution rules if introduced.
170. Track DNS zones, DNS queries, domain registration, renewal, certificate, WAF, CDN, and bot-management cost.
171. Track Brevo email attempts, accepted messages, delivered messages, soft bounces, hard bounces, blocks, and deferrals.
172. Track Brevo opens, unique opens, clicks, unique clicks, unsubscribes, spam complaints, and webhook failures.
173. Track Brevo transactional and marketing email separately, including plan allowance, overage, dedicated IP, and add-ons.
174. Track email message bytes and attachment bytes because providers may charge for data volume.
175. Track Azure Communication Services Email accepted, delivered, failed, suppressed, and message-data usage.
176. Track Azure Email domains, sender identities, provider regions, quotas, throttles, and monetary cost.
177. Track AWS SES send attempts, sends, deliveries, bounces, complaints, rejects, and rendering failures.
178. Track SES outbound message data, attachment data, inbound mail, dedicated IP, Virtual Deliverability Manager, and add-ons.
179. Track email-provider selection per message so Brevo, Azure Email, SES, and fallback costs remain distinguishable.
180. Track email fallback attempts, duplicate-delivery protection, provider failovers, and extra cost caused by retries.
181. Track email queue wait time, processing time, attempts, retry reason, final status, and provider message ID.
182. Track email cost by type: authentication, admissions, billing, classroom, support, announcement, digest, and marketing.
183. Track suppressed recipients, invalid addresses, abuse risk, and money wasted on preventable sends.
184. Track AWS SNS or replacement SMS messages attempted, delivered, failed, expired, and provider response codes.
185. Track SMS segments, encoding, destination country/operator, transactional/promotional category, and per-segment cost.
186. Track WhatsApp templates, conversations, categories, messages, delivery, reads, failures, and conversation-window cost.
187. Track push notifications attempted, accepted, delivered where available, failed tokens, and Firebase/provider cost.
188. Track OpenAI input tokens, cached input tokens, output tokens, model, request count, latency, and cost.
189. Track Groq input/output tokens, model, request count, latency, errors, and cost.
190. Track Gemini input/output tokens, cached context, model, request count, latency, and cost.
191. Track AI image generation, embeddings, reranking, speech-to-text, text-to-speech, moderation, and tool-call costs separately.
192. Track AI usage by feature, user, organization, model, success state, and internal request ID without storing sensitive prompts unnecessarily.
193. Apply organization AI quotas, model allowlists, maximum output limits, caching, and budget cutoffs.
194. Track Agora participant minutes, audio minutes, video minutes by resolution, recording minutes, storage, and egress.
195. Track Zoom/Webex meeting minutes, cloud recording, transcription, webinar, phone, and license allocation when used.
196. Track payment-gateway order count, captured amount, gateway fee, tax on fee, refunds, disputes, and settlement cost.
197. Track third-party verification, OCR, biometric, maps, geocoding, antivirus, and document-processing calls when introduced.
198. Track monitoring, error-reporting, uptime, logging, analytics, CDN, and security-service usage as allocatable or overhead cost.
199. Track engineering/manual-support hours attributable to an organization separately from automated infrastructure cost.
200. Produce a complete resource-cost waterfall from raw provider units to direct cost, shared allocation, adjustments, tax, and final charge.

---

## Requirements 201–300: Reliability, Security, Billing Controls, and Display Instructions

201. Show API request count, success count, 4xx count, 5xx count, error rate, and average latency by organization.
202. Show p50, p75, p90, p95, and p99 API latency rather than relying only on averages.
203. Show API traffic and errors by route, method, module, deployment, region, and client type.
204. Store organization ID in the primary API metric dimension, not only inside recent failure samples.
205. Show top expensive routes by compute time, database time, response bytes, call volume, and calculated cost.
206. Show rate-limit hits, quota rejections, authentication failures, authorization failures, and malformed requests.
207. Show request and response bandwidth with sensitive payload bodies excluded from telemetry.
208. Show cold starts, process restarts, crashes, out-of-memory events, CPU saturation, and event-loop lag.
209. Show service health for MongoDB, Redis, R2, Supabase, email, SMS, AI, payments, video, and DNS.
210. Show provider incident state, first failure, latest failure, affected organizations, and recovery time.
211. Show background-job queue depth, oldest job age, throughput, failures, retries, and dead-letter count.
212. Show scheduled-job last run, next run, duration, result, affected records, and missed-run alerts.
213. Show webhook attempts, verified signatures, duplicate events, failures, retries, dead letters, and processing latency.
214. Show provider throttling, quota exhaustion, authentication errors, billing suspension, and configuration failures.
215. Show frontend error count, affected users, routes, releases, browsers, and source-map status when instrumented.
216. Show deployment version, commit, environment, release time, rollback state, and organization-specific rollout flags.
217. Show error-budget consumption and SLO compliance for availability, latency, job completion, and message delivery.
218. Show data freshness per section and a visible banner when any critical source is stale or partial.
219. Show the last successful provider synchronization and the last failed synchronization with retry status.
220. Show metric gaps, missing hours/days, late-arriving events, corrected rollups, and affected invoices.
221. Show organization audit events by actor, action, target, previous state, new state, reason, IP, and time.
222. Show impersonation sessions, initiating Superadmin, target user, reason, start, expiry, actions, and termination.
223. Show subscription changes, rate changes, quota changes, credits, adjustments, invoice changes, and payment actions.
224. Show feature-flag changes, configuration changes, domain changes, security changes, and rollback availability.
225. Show login anomalies, credential-stuffing signals, impossible travel, new devices, and suspicious IP activity when instrumented.
226. Show malware scan state, blocked uploads, disallowed file types, oversized files, and quarantined objects.
227. Show exposed-public-object warnings, invalid R2 permissions, unsigned sensitive downloads, and link-sharing risk.
228. Show secret configuration only as configured/missing/rotation-due; never return or display secret values.
229. Show key age and rotation status for R2, Razorpay, Brevo, Azure, SES, SMS, AI, database, and webhook credentials.
230. Show user-role anomalies, excess admins, dormant privileged users, and conflicting multi-role assignments.
231. Show data-retention policy by data class, oldest retained record, deletion backlog, legal hold, and compliance state.
232. Show consent, privacy-request, data-export, correction, and deletion-request statistics where applicable.
233. Show backup status, last successful backup, age, size, retention, encryption, restore test, and recovery objectives.
234. Show organization data residency, provider regions, cross-region transfers, and residency-policy violations.
235. Show SLA plan, support tier, uptime commitment, response commitment, service credits, and current compliance.
236. Show billing account identity, legal name, billing address, tax identifiers, contacts, purchase order, and payment terms.
237. Show invoice period, issue date, due date, currency, subtotal, discounts, credits, tax, total, paid, and balance.
238. Show invoice status: draft, review required, finalized, sent, viewed, partial, paid, overdue, void, disputed, or refunded.
239. Show a line item for every resource family with quantity, unit, rate, allowance, billable quantity, and amount.
240. Group invoice lines under Compute, Storage, Database, Network, Communication, AI, Video, Payments, Support, and Adjustments.
241. Show provider actual cost, customer charge, gross margin, and margin percentage only to authorized Superadmins.
242. Show committed revenue, recognized revenue, collected cash, outstanding receivables, refunds, and bad debt separately.
243. Show payment attempts, method, gateway order/payment IDs, failure reason, settlement ID, and reconciliation state.
244. Support manual bank transfer, purchase order, cheque, UPI, Razorpay, and other payment methods without falsifying gateway data.
245. Support invoice disputes with disputed lines, evidence, owner, deadline, status, resolution, and credit note.
246. Freeze finalized invoices; corrections must create adjustment lines, debit notes, credit notes, or replacement versions.
247. Show usage that arrived after invoice finalization and carry it into the correct adjustment workflow.
248. Allow billing preview and validation before finalization, including missing metrics, unusual spikes, and negative amounts.
249. Block automatic invoice finalization when critical resource sources are unavailable or reconciliation exceeds tolerance.
250. Show organization budget thresholds at 50%, 75%, 90%, 100%, and forecasted exceedance with configurable alerts.
251. Support hard quota, soft quota, notification-only quota, grace allowance, and temporary override per resource.
252. Show quota used, quota remaining, forecast exhaustion date, override reason, override expiry, and enforcement state.
253. Alert on sudden storage growth, request spikes, email/SMS floods, AI token spikes, video spikes, and payment anomalies.
254. Alert on cost without matching product activity, which can indicate leaks, retries, abuse, or attribution failure.
255. Alert on product activity without metered cost events, which indicates billing undercount.
256. Alert on unallocated shared usage and show its percentage of total platform cost.
257. Alert when organization resource IDs are missing from R2 keys, queue jobs, API metrics, provider calls, or database records.
258. Provide a cost-anomaly timeline with baseline, actual value, variance, suspected drivers, and investigation status.
259. Provide optimization recommendations with estimated savings, confidence, owner, action, and verification outcome.
260. Show likely savings from deleting orphan storage, expiring old recordings, fixing retries, caching, and moving workloads.
261. Show the dashboard summary using no more than eight primary cards; put detail in drill-down sections.
262. Primary cards must include current bill, forecast, active users, storage, compute/API, messaging, AI/video, and reliability.
263. Each primary card must show value, unit, period, trend, quota/budget, quality badge, freshness, and click target.
264. Use sparklines for trends, stacked bars for cost composition, and tables for exact reconciliation details.
265. Use stacked cost charts to separate actual direct, allocated shared, markup, discounts, credits, and tax.
266. Display `Actual`, `Allocated`, `Estimated`, `Partial`, `Stale`, and `Unavailable` as text badges, not color alone.
267. When a value is estimated, show the formula and allow comparison with the last actual provider value.
268. When a value is unavailable, show the missing instrumentation or provider sync—not a zero-length progress bar.
269. Display storage in bytes, KB, MB, GB, or TB with consistent binary/decimal policy and disclose that policy.
270. Display compute in requests, milliseconds/seconds, vCPU-seconds, memory GB-seconds, and billed provider units.
271. Display communication in messages and segments plus delivery state; never treat attempted messages as delivered.
272. Display AI usage by model and tokens plus money; token count without model-specific rate is insufficient.
273. Display video usage as participant minutes, recording minutes, resolution, storage, egress, and money.
274. Display monetary values in billing currency and make source-currency conversion inspectable.
275. Allow comparison with previous period, same period last year, plan allowance, organization budget, and platform median.
276. Protect cross-organization benchmarks with aggregation thresholds so another institution's confidential data cannot be inferred.
277. Allow filtering by provider, service, module, environment, date, organization unit, and metric quality.
278. Preserve URL query parameters for filters so investigations can be bookmarked and shared with authorized staff.
279. Provide a complete raw-event drill-down for disputed metering with pagination and immutable event IDs.
280. Provide provider invoice and reconciliation drill-downs without exposing provider credentials or unrelated organizations.
281. Provide module-level drill-downs for people, academics, admissions, fees, content, communication, support, and operations.
282. Provide a recent-activity timeline combining billing, configuration, security, support, provider, and deployment events.
283. Provide explanatory tooltips for every acronym, unit, allocation rule, quota, and cost formula.
284. Use institution-aware terminology from the organization profile instead of hard-coded school-only labels.
285. Ensure all cards, charts, tables, dialogs, and status indicators are keyboard accessible and screen-reader labelled.
286. Ensure responsive behavior keeps billing totals, alerts, and data-quality labels visible on small screens.
287. Add loading skeletons per section and preserve successfully loaded sections when another source fails.
288. Add section-level retry and provider resynchronization controls rather than refreshing the entire page.
289. Require confirmation, reason, and audit logging for suspension, quota override, rate change, credit, invoice finalization, and impersonation.
290. Separate read permission, billing-management permission, resource-control permission, security permission, and impersonation permission.
291. Redact personal information from exports unless the exporter has explicit permission and provides a reason.
292. Make dashboard APIs return safe DTOs with explicit selected fields; never spread raw database documents.
293. Version the organization-dashboard API contract and include schema version and calculation version in responses.
294. Return each section independently so slow provider data cannot block identity, subscription, or operational summaries.
295. Cache stable summaries, use background refresh, and invalidate affected sections when new usage or configuration arrives.
296. Use idempotent provider imports and unique source-event IDs to prevent duplicate billing.
297. Test metering with upload/delete, retries, provider failure, late events, currency conversion, rate changes, and invoice finalization.
298. Reconcile dashboard totals against ledger totals, invoice totals, payment totals, and provider totals in automated tests.
299. Launch new billing inputs in shadow mode first, compare them with provider invoices, and only then make them chargeable.
300. Do not call this dashboard billing-ready until R2 object metering, per-organization compute attribution, provider reconciliation, immutable snapshots, and safe DTOs are implemented and verified.

## Recommended backend records

### `ResourceUsageEvent`

Store `eventId`, `organizationId`, `provider`, `service`, `resourceType`, `module`, `quantity`, `unit`, `occurredAt`, `sourceResourceId`, `sourceRequestId`, `metadata`, `ingestedAt`, and `schemaVersion`.

### `OrganizationUsageDaily`

Store one daily rollup per organization/provider/service/resource/module with actual quantity, estimated quantity, direct cost, allocated cost, rate-card version, data quality, source freshness, and reconciliation state.

### `StorageObjectLedger`

Store `organizationId`, provider, bucket, object key, module, owning record type/ID, content type, bytes, uploader, upload time, deletion time, retention class, checksum, provider version ID, and reconciliation state.

### `ProviderRateCard`

Store provider, service, meter name, region, tier, unit, unit price, currency, included allowance, pricing expression, tax handling, source reference, effective dates, and approval metadata.

### `OrganizationBillingPeriod`

Store period boundaries, immutable usage snapshot references, direct cost, shared allocation, markup, discounts, credits, taxes, final amount, quality summary, reconciliation variance, approval, finalization, and invoice references.

### `SharedCostAllocationPolicy`

Store service, allocation dimensions and weights, minimum/maximum rules, unallocated treatment, calculation version, effective dates, approval, and change reason.

## Required API response behavior

- Return safe, explicit sections instead of spreading the raw `Organization` document.
- Return section status and freshness so one provider failure does not make the whole page lie or fail.
- Return summary and trend endpoints separately from paginated drill-down endpoints.
- Return raw quantity and calculated amount together.
- Return calculation formula, rate-card version, and allocation-policy version for every monetary result.
- Return no secret values, private joining codes, provider tokens, key material, or webhook secrets.
- Mark incomplete historical backfills and unallocated costs visibly.
- Make finalized billing snapshots immutable and reproducible.

## Delivery order

1. Safe organization DTO and corrected people/subscription counts.
2. Storage object ledger and standardized organization-prefixed R2 ownership.
3. Per-organization API/compute metrics and daily rollups.
4. Email, SMS, AI, video, database, Redis, and payment provider metering.
5. Provider rate cards, shared-cost allocation, reconciliation, and shadow billing.
6. Superadmin summary UI and drill-down tabs.
7. Billing preview, approval, immutable invoice snapshots, alerts, and exports.
8. Historical backfill, discrepancy repair, automated reconciliation, and production chargeability approval.
