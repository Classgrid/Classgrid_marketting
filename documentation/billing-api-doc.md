# Billing API Reference

Classgrid's billing system spans 4 route files for the checkout flow + 1 webhook + 8 super-admin route files for billing management.

---

## Part 1: Billing Handoff (Secure Checkout Initiation)

Base path: `/api/billing/handoff`  
Source: `billing-handoff.routes.js` (254 lines)  
Rate Limit: `generalLimiter` on all endpoints

### POST `/initiate`

Creates a secure checkout session. Resolves the payable from server-side data (amount, recipient, merchant are NOT accepted from client).

**Auth:** `isAuthenticated`

**Request Body:**
```json
{
  "organization_id": "<ObjectId>",
  "payment_type": "saas_invoice",
  "reference_id": "<invoice ObjectId>",
  "return_url": "https://ganesha.classgrid.in/billing"
}
```

**Payment types:** `saas_invoice`, `fee_payment`, `admission_fee`, `canteen_order`

**Workflow:**
1. Looks up organization (name, subdomain, Razorpay keys)
2. Resolves payable via `resolvePayable()` — fetches real amount from DB (Invoice, FeeRecord, etc.)
3. Validates `return_url` against org's domains
4. Checks for existing active `PaymentOrder` → `409 PAYMENT_ALREADY_IN_PROGRESS`
5. Creates Razorpay order (platform keys for SaaS, org keys for fees/canteen)
6. Creates `PaymentOrder` (status: `CREATED`)
7. Creates `PaymentAttempt` (stage: `OTP_PENDING`)
8. Generates 6-digit OTP, hashes with bcrypt (12 rounds)
9. Creates `BillingHandoff` with hashed token + hashed OTP
10. Sends OTP email via `PAYMENT_OTP_SENT` template
11. Returns checkout URL

**Response:**
```json
{
  "success": true,
  "data": {
    "checkout_url": "https://billing.classgrid.in/checkout?token=<base64url>",
    "expiresAt": "2026-08-02T23:55:00Z"
  }
}
```

**Handoff TTL:** Configured via `HANDOFF_TTL_MS` constant.

**Rollback:** If any step fails after order creation, the system auto-cancels the `PaymentOrder`, fails the `PaymentAttempt`, and expires the `BillingHandoff`.

---

### POST `/resend-otp`

Resends OTP for an active checkout session.

**Request Body:**
```json
{
  "token": "<base64url token from checkout URL>"
}
```

**Limits:**
- Max resends: `MAX_OTP_RESENDS`
- Cooldown: `OTP_RESEND_COOLDOWN_MS` between resends

**Response:**
```json
{
  "success": true,
  "message": "OTP resent successfully"
}
```

---

## Part 2: Billing Checkout (Payment Completion)

Base path: `/api/billing/checkout`  
Source: `billing-checkout.routes.js` (259 lines)  
Rate Limit: `generalLimiter` on all endpoints

### GET `/session`

Returns checkout session details for the payment page UI.

**Query Params:** `token` — the base64url token from the checkout URL

**Response:**
```json
{
  "success": true,
  "data": {
    "organizationName": "Ganesha Engineering College",
    "maskedEmail": "r***@college.edu",
    "amountPaise": 150000,
    "currency": "INR",
    "paymentType": "saas_invoice",
    "label": "Classgrid Platform — August 2026",
    "expiresAt": "2026-08-02T23:55:00Z",
    "otpVerified": false
  }
}
```

---

### POST `/verify-otp`

Verifies the 6-digit OTP and unlocks the Razorpay payment widget.

**Request Body:**
```json
{
  "token": "<base64url>",
  "otp": "482916",
  "payerName": "Rahul Sharma",
  "payerEmail": "rahul@college.edu"
}
```

**Security:**
- OTP compared via `bcrypt.compare()` (constant-time)
- Max 3 failed attempts → 15-minute lockout
- Single-use: blocked if `otpVerifiedAt` already set

**Response (success):**
```json
{
  "success": true,
  "data": {
    "razorpay_order_id": "order_xxx",
    "razorpay_key_id": "rzp_live_xxx",
    "amountPaise": 150000,
    "currency": "INR",
    "email": "rahul@college.edu",
    "return_url": "https://ganesha.classgrid.in/billing"
  }
}
```

---

### POST `/confirm`

Confirms payment after Razorpay checkout completes. Verifies signature, finalizes payment, sends receipt email with PDF attachment.

**Request Body:**
```json
{
  "token": "<base64url>",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "<HMAC SHA256 signature>"
}
```

**Workflow:**
1. Validates handoff: must be active, OTP verified, not consumed
2. Verifies `order_id` matches handoff's `razorpay_order_id`
3. **Signature verification:**
   - SaaS invoice → `razorpayService.verifyPlatformSignature()`
   - Fee/canteen → `razorpayService.verifySignature(orgId, ...)`
4. Fetches payment from Razorpay API to confirm
5. Calls `finalizeCapturedPayment()` — creates transaction, updates records
6. Generates PDF invoice via `generateInvoicePdfBuffer()`
7. Sends confirmation email with PDF attachment from `billing@classgrid.in`

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "<ObjectId>",
    "providerPaymentId": "pay_xxx",
    "return_url": "https://ganesha.classgrid.in/billing"
  }
}
```

---

## Part 3: Billing Demo (Razorpay Review)

Base path: `/api/billing/demo`  
Source: `billing-demo.routes.js` (220 lines)  
Guard: `BILLING_DEMO_ENABLED` env var

### POST `/session`

Creates a 48-hour demo checkout session with OTP `123456` and ₹2 amount.

**Response:**
```json
{
  "success": true,
  "data": {
    "checkout_url": "https://billing.classgrid.in/checkout?token=...",
    "demo_otp": "123456",
    "amount": "₹2",
    "expires_at": "2026-08-04T23:25:00Z",
    "test_card": {
      "number": "4111 1111 1111 1111",
      "expiry": "12/27",
      "cvv": "123",
      "otp": "123456"
    },
    "test_upi": "success@razorpay"
  }
}
```

---

### GET `/status`

Returns whether demo mode is active and if a live session exists.

**Response:**
```json
{
  "enabled": true,
  "has_active_session": true,
  "expires_at": "2026-08-04T23:25:00Z"
}
```

---

## Part 4: Razorpay Universal Webhook

Base path: `/api/webhooks`  
Source: `razorpay-webhook.routes.js` (504 lines)

### POST `/razorpay`

Single centralized webhook handling ALL Razorpay events across the platform. Uses `express.raw()` for raw body signature verification.

**Auth:** Razorpay `x-razorpay-signature` header (HMAC SHA256)

**Signature verification cascade:**
1. Try platform secret (`RAZORPAY_WEBHOOK_SECRET` / `RAZORPAY_KEY_SECRET`)
2. Try org's `fees_razorpay_webhook_secret`
3. Try org's `canteen_config.canteen_razorpay_webhook_secret` (decrypted)

**Idempotency:** Creates `WebhookEvent` with unique `providerEventId` from `x-razorpay-event-id`. Duplicate events return `200 { received: true, duplicate: true }`.

**Handled Events:**

#### `payment.captured` / `payment.authorized`

Routes based on `notes.type` in the payment:

| Payment Type | Action |
|---|---|
| `saas_invoice` / `platform` | Creates `PlatformTransaction`, updates `SaasInvoice` to `paid`, extends `OrgSubscription` by 31 days |
| `fee_payment` / `student_fee` | Creates `FeeTransaction`, updates `FeeRecord.paid_amount` and status |
| `admission_fee` | Delegates to `admission.controller.handlePaymentWebhook()` |
| `canteen_order` | Updates `CanteenOrder` status to `NEW`, emits Socket.IO `canteen_new_order` event |
| `marketplace_order` | No-op (logged) |
| Unknown | Creates generic `PlatformTransaction` for audit trail |

#### `payment.failed`

Creates a `PlatformTransaction` with `status: "failed"`, logs error code and description.

#### `order.paid`

Confirmation event — no action (payment already handled in `payment.captured`).

#### `refund.created` / `refund.processed`

Creates refund `PlatformTransaction`, updates original transaction to `status: "refunded"`.

**Always returns `200`** to Razorpay to prevent retries.

---

## Part 5: Super Admin Billing APIs

All super-admin billing routes require `super_admin` role (enforced at router mount level in `super-admin.routes.js`).

### Subscription Management

Base path: `/api/superadmin/billing/subscriptions`  
Source: `super-admin/billing-subscription.routes.js`

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | List all org subscriptions |
| `GET` | `/overview` | Subscription overview stats |
| `GET` | `/:organizationId` | Get specific org's subscription |
| `POST` | `/:organizationId/preview` | Preview subscription change |
| `POST` | `/:organizationId/assign-plan` | Assign a plan to org |
| `POST` | `/:organizationId/change-plan` | Change org's plan |
| `POST` | `/:organizationId/add-module` | Add a module to subscription |
| `POST` | `/:organizationId/remove-module` | Remove a module |
| `POST` | `/:organizationId/change-cycle` | Change billing cycle |
| `POST` | `/:organizationId/pause` | Pause subscription |
| `POST` | `/:organizationId/resume` | Resume subscription |
| `POST` | `/:organizationId/cancel` | Cancel subscription |
| `GET` | `/:organizationId/history` | Subscription change history |
| `GET` | `/:organizationId/upcoming-invoice` | Preview next invoice |

---

### Plan & Module Catalog

Base path: `/api/superadmin/billing/catalog`  
Source: `super-admin/billing-catalog.routes.js`

| Method | Path | Description |
|---|---|---|
| `GET` | `/plans` | List all plans |
| `POST` | `/plans` | Create a new plan |
| `GET` | `/plans/:planId` | Get plan details |
| `PATCH` | `/plans/:planId/eligibility` | Update plan eligibility rules |
| `POST` | `/plans/:planId/versions` | Create new plan version |
| `GET` | `/plans/:planId/versions` | List plan versions |
| `POST` | `/plans/:planId/archive` | Archive a plan |
| `GET` | `/modules` | List all add-on modules |
| `POST` | `/modules` | Create a module |
| `GET` | `/modules/:moduleId` | Get module details |
| `PATCH` | `/modules/:moduleId/eligibility` | Update module eligibility |
| `POST` | `/modules/:moduleId/versions` | Create module version |
| `GET` | `/modules/:moduleId/versions` | List module versions |
| `POST` | `/modules/:moduleId/archive` | Archive a module |

---

### Invoice Management

Base path: `/api/superadmin/billing/invoices`  
Source: `super-admin/billing-invoice.routes.js`

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | List all invoices |
| `GET` | `/:invoiceId` | Get invoice details |
| `POST` | `/preview` | Preview invoice before generating |
| `POST` | `/generate` | Generate invoice for an org |
| `POST` | `/:invoiceId/issue` | Issue (finalize) an invoice |
| `POST` | `/:invoiceId/send` | Send invoice to org via email |
| `POST` | `/:invoiceId/void` | Void an invoice |
| `POST` | `/:invoiceId/credit-notes` | Create a credit note |
| `GET` | `/:invoiceId/pdf` | Download invoice PDF |
| `GET` | `/:invoiceId/delivery-history` | Email delivery history |

---

### Transaction Management

Base path: `/api/superadmin/billing/transactions`  
Source: `super-admin/billing-transactions.routes.js`

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | List all transactions |
| `GET` | `/:transactionId` | Get transaction details |
| `POST` | `/:transactionId/recheck` | Re-verify with Razorpay |
| `POST` | `/:transactionId/refund` | Create refund |
| `POST` | `/:transactionId/reconcile` | Manual reconciliation |
| `GET` | `/:transactionId/webhooks` | View related webhook events |
| `GET` | `/:transactionId/timeline` | Transaction timeline/audit |

---

### Revenue Analytics

Base path: `/api/superadmin/billing/revenue`  
Source: `super-admin/billing-revenue.routes.js`

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Revenue overview dashboard |
| `GET` | `/by-organization` | Revenue breakdown by org |
| `GET` | `/by-module` | Revenue breakdown by module |
| `GET` | `/by-invoice` | Revenue breakdown by invoice |
| `GET` | `/export` | Export revenue data |
| `POST` | `/export` | Export revenue data (POST) |
| `POST` | `/reconcile` | Reconcile revenue records |

---

### Failed Payments

Base path: `/api/superadmin/billing/failures`  
Source: `super-admin/billing-failures.routes.js`

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | List failed payments |
| `GET` | `/overview` | Failure stats overview |
| `GET` | `/:failureId` | Get failure details |
| `POST` | `/:failureId/generate-payment-link` | Generate retry payment link |
| `POST` | `/:failureId/retry-webhook` | Retry webhook processing |
| `POST` | `/:failureId/recheck-provider` | Re-verify with Razorpay |
| `POST` | `/:failureId/notify-organization` | Send notification to org |
| `POST` | `/:failureId/diagnostic-export` | Export diagnostic data |
| `POST` | `/:failureId/assign` | Assign to support agent |
| `POST` | `/:failureId/add-note` | Add internal note |
| `POST` | `/:failureId/resolve` | Mark as resolved |

---

### Discounts, Credits & Taxes

Base path: `/api/superadmin/billing/discounts-taxes`  
Source: `super-admin/billing-discounts-taxes.routes.js`

| Method | Path | Description |
|---|---|---|
| `GET` | `/discounts` | List all discounts |
| `POST` | `/discounts` | Create a discount |
| `PATCH` | `/discounts/:discountId` | Update a discount |
| `POST` | `/discounts/:discountId/archive` | Archive a discount |
| `GET` | `/organizations/:orgId/credits` | Get org credit account |
| `POST` | `/organizations/:orgId/credits/grant` | Grant credits to org |
| `POST` | `/organizations/:orgId/credits/reverse` | Reverse credits |
| `GET` | `/tax-rules` | List tax rules |
| `POST` | `/tax-rules` | Create tax rule |
| `GET` | `/tax-rules/:taxRuleId/versions` | List tax rule versions |
| `POST` | `/tax-rules/:taxRuleId/versions` | Create tax rule version |

---

### Eligibility, Pricing & Usage

Base path: `/api/superadmin/billing/eligibility-pricing`  
Source: `super-admin/billing-eligibility-pricing.routes.js`

| Method | Path | Description |
|---|---|---|
| `GET` | `/eligibility-rules` | List eligibility rules |
| `POST` | `/eligibility-rules` | Create eligibility rule |
| `PATCH` | `/eligibility-rules/:ruleId` | Update eligibility rule |
| `GET` | `/metrics` | List billing metrics |
| `GET` | `/organizations/:orgId/usage` | Get org usage data |
| `POST` | `/organizations/:orgId/recalculate-usage` | Recalculate usage |
| `GET` | `/organizations/:orgId/price-overrides` | List price overrides |
| `POST` | `/organizations/:orgId/price-overrides` | Create price override |
| `PATCH` | `/price-overrides/:overrideId` | Update price override |
| `DELETE` | `/price-overrides/:overrideId` | Delete price override |

---

### Export Jobs

Base path: `/api/superadmin/billing/exports`  
Source: `super-admin/billing-exports.routes.js`

| Method | Path | Description |
|---|---|---|
| `GET` | `/:jobId` | Get export job status |
| `GET` | `/:jobId/download` | Download export file |

---

## Key Models

| Model | Storage | Purpose |
|---|---|---|
| `BillingHandoff` | MongoDB | Checkout session (token, OTP, amount, Razorpay order) |
| `PaymentOrder` | MongoDB | Razorpay order tracking (status: CREATED → ATTEMPTED → PAID) |
| `PaymentAttempt` | MongoDB | Per-attempt tracking (OTP_PENDING → OTP_VERIFIED → CAPTURED/FAILED) |
| `PlatformTransaction` | MongoDB | Platform SaaS payment records |
| `FeeTransaction` | MongoDB | Student fee payment records |
| `SaasInvoice` | MongoDB | Monthly SaaS invoices for orgs |
| `OrgSubscription` | MongoDB | Org subscription (plan, status, expiresAt) |
| `WebhookEvent` | MongoDB | Idempotent webhook event log |
