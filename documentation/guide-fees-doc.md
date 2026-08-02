Classgrid provides a full-cycle fee management system covering fee structure creation, student fee record generation, online payment collection via Razorpay, receipt generation, discounts, and overdue tracking. All fee data uses a dual-database architecture: **MongoDB (Mongoose)** for fee structures and configurations, and **Supabase/Postgres** for transactional records.

---

## Fee Structure Setup

### Creating a Fee Structure

Org admins create fee structures that define what students must pay.

**API:** `POST /api/fees/structures`  
**Roles:** `org_admin`

Required fields:
- `name` — e.g., "FY BSc Tuition Fee 2026-27"
- `academicYear` — e.g., "2026-27"
- `categories` — array of fee categories

Each category contains:
- `categoryName` — e.g., "Tuition Fee", "Lab Fee", "Library Fee"
- `components` — array of individual line items

Each component contains:
- `componentName` — e.g., "Semester 1 Tuition"
- `amount` — the amount in INR (stored as Number)
- `dueDate` — when payment is due
- `isOptional` — boolean (default `false`)

**Models:**
- `FeeStructure` — top-level structure document
- `FeeCategory` — embedded category groupings
- `FeeComponent` — individual payable line items

### Listing Fee Structures

**API:** `GET /api/fees/structures`  
**Roles:** `org_admin`

Returns all structures for the organization, sorted by `createdAt` descending.

---

## Student Fee Records

### Generating Fee Records

Once a fee structure is created, the admin generates individual fee records for students.

**API:** `POST /api/fees/generate-records`  
**Roles:** `org_admin`

Body:
```json
{
  "structureId": "<FeeStructure ObjectId>",
  "studentIds": ["<mongo_id_1>", "<mongo_id_2>", "..."],
  "dueDate": "2026-09-01"
}
```

The system creates one `FeeRecord` per student per structure, containing:
- `student` — MongoDB ObjectId reference
- `feeStructure` — reference to the structure
- `totalAmount` — sum of all component amounts
- `paidAmount` — starts at `0`
- `balanceAmount` — `totalAmount - paidAmount`
- `status` — `unpaid` | `partial` | `paid` | `overdue`
- `dueDate` — inherited from structure or override

### Student Views Their Fees

**API:** `GET /api/fees/student/me`  
**Roles:** Any authenticated student

Returns all fee records for the logged-in student with:
- Structure name, academic year
- Component-level breakdown
- Amount paid, balance remaining
- Due date and overdue status
- Payment history (linked transactions)

### Admin Views All Fee Records

**API:** `GET /api/fees/records`  
**Roles:** `org_admin`

Query params: `structureId`, `status`, `search` (by student name/PRN)

Returns paginated list of all student fee records with payment summary.

---

## Payment Collection (Razorpay Integration)

### Step 1: Student Initiates Payment

**API:** `POST /api/fees/pay/initiate`  
**Roles:** Authenticated student

Body:
```json
{
  "feeRecordId": "<FeeRecord ObjectId>",
  "amount": 15000
}
```

The system:
1. Validates the fee record belongs to the student
2. Checks `amount` ≤ `balanceAmount`
3. Creates a **Razorpay Order** via `razorpay.orders.create()`
4. Stores a `PaymentOrder` document with:
   - `razorpayOrderId` — from Razorpay response
   - `amount`, `currency` (INR)
   - `status` — `created`
   - `feeRecord` — reference
   - `student` — reference
5. Returns `{ orderId, amount, currency, key: RAZORPAY_KEY_ID }` to frontend

### Step 2: Frontend Completes Payment

The frontend opens the Razorpay checkout widget using the `orderId` and `key`. Upon success, Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.

### Step 3: Verify Payment

**API:** `POST /api/fees/pay/verify`  
**Roles:** Authenticated student

Body:
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "sha256_hmac_signature"
}
```

The system:
1. Verifies the signature using `crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)`
2. Compares `generated_signature === razorpay_signature`
3. If valid:
   - Creates a `PaymentTransaction` with status `captured`
   - Updates the `FeeRecord`: increments `paidAmount`, decrements `balanceAmount`
   - Updates `FeeRecord.status` to `paid` (if balance = 0) or `partial`
   - Creates a `PaymentAttempt` log
4. If invalid: creates a `PaymentAttempt` with status `failed`

### Webhook Handler

**API:** `POST /api/fees/webhook/razorpay`  
**Auth:** Verified via `x-razorpay-signature` header

Handles events:
- `payment.captured` — confirms successful payment
- `payment.failed` — logs failure
- `order.paid` — marks order as complete

**Models involved:**
- `PaymentOrder` — `razorpayOrderId`, `amount`, `currency`, `status`, `feeRecord`, `student`
- `PaymentTransaction` — `razorpayPaymentId`, `razorpayOrderId`, `amount`, `method`, `status`, `feeRecord`
- `PaymentAttempt` — `orderId`, `paymentId`, `signature`, `status`, `errorCode`, `errorDescription`

---

## Invoices & Receipts

### Generate Invoice

**API:** `GET /api/fees/invoice/:feeRecordId`  
**Roles:** `org_admin`, student (own record only)

Returns a structured invoice with:
- `Invoice` document: `invoiceNumber` (auto-generated), `issueDate`, `dueDate`
- `InvoiceLineItem` entries: one per fee component
- Organization details (name, address, logo)
- Student details (name, PRN, course)
- Payment status and transaction history

---

## Discounts & Concessions

### Apply Discount

**API:** `POST /api/fees/discount`  
**Roles:** `org_admin`

Body:
```json
{
  "feeRecordId": "<ObjectId>",
  "discountType": "percentage",
  "value": 10,
  "reason": "Merit scholarship"
}
```

The system:
1. Creates a `Discount` document
2. Recalculates the fee record's `totalAmount` and `balanceAmount`
3. Logs the discount in `CreditNote`

**Discount types:** `percentage`, `fixed_amount`, `full_waiver`

---

## Student Fee Ledger

**API:** `GET /api/fees/ledger/:studentId`  
**Roles:** `org_admin`

Returns the complete `StudentFeeLedger` — a chronological record of:
- All fee charges
- All payments received
- All discounts applied
- Running balance

---

## Overdue Tracking

Fee records past their `dueDate` with `balanceAmount > 0` are automatically flagged as `overdue`. The system:
- Updates `FeeRecord.status` to `overdue`
- Includes overdue records in admin dashboard reports
- Supports filtering by `status=overdue` in the records list

---

## Role Permissions

| Role | Create Structure | Generate Records | View All Records | Make Payment | View Own Fees |
|---|---|---|---|---|---|
| Org Admin | ✅ | ✅ | ✅ | ❌ | ❌ |
| Faculty | ❌ | ❌ | ❌ | ❌ | ❌ |
| Student | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## Key Database Tables & Models

| Model | Storage | Purpose |
|---|---|---|
| `FeeStructure` | MongoDB | Fee template with categories and components |
| `FeeCategory` | MongoDB (embedded) | Grouping of fee components |
| `FeeComponent` | MongoDB (embedded) | Individual payable item |
| `FeeRecord` | MongoDB | Per-student fee instance |
| `FeeTransaction` | MongoDB | Legacy payment log |
| `PaymentOrder` | MongoDB | Razorpay order tracking |
| `PaymentTransaction` | MongoDB | Captured payment details |
| `PaymentAttempt` | MongoDB | Every payment attempt (success/fail) |
| `Invoice` | MongoDB | Generated invoice document |
| `InvoiceLineItem` | MongoDB (embedded) | Line items within an invoice |
| `Discount` | MongoDB | Applied discount records |
| `CreditNote` | MongoDB | Credit adjustments |
| `StudentFeeLedger` | MongoDB | Full financial ledger per student |
