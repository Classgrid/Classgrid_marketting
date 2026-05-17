# Prisma Setup & Database Migrations

This document explains how to set up and manage the database using Prisma ORM.

## Installation

```bash
# Install Prisma CLI globally (optional but recommended)
npm install -g prisma

# Or use npx in the workspace
npm install @prisma/client prisma dotenv
```

## Database Connection

Ensure your `.env.production` (or `.env.development`) has:

```env
DATABASE_URL=postgresql://user:password@host:port/database?schema=public

# Or for MongoDB:
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/database
```

## Initializing the Database

### First Time Setup (from schema.prisma)

```bash
# Push the schema to the database (for development)
npx prisma db push

# Or create a migration (for production)
npx prisma migrate dev --name init
```

### After Schema Changes

```bash
# Create a migration
npx prisma migrate dev --name describe_your_change

# Apply migrations to production
npx prisma migrate deploy
```

## Prisma Studio (Visual Database Inspector)

```bash
# Open Prisma Studio in browser to view/edit data
npx prisma studio
```

Visits: `http://localhost:5555`

## Key Concepts

### Multi-Tenancy with orgId

Every table has an `orgId` field. This is the foundation of isolation:

```prisma
model Organization {
  id String @id @default(cuid())
  ...
}

model User {
  orgId String
  org Organization @relation(fields: [orgId], references: [id])
  
  @@unique([orgId, email])  // Email unique PER organization
}
```

### Querying with Tenant Context

In your API handlers, ALWAYS filter by `orgId`:

```typescript
// ✅ CORRECT - Filters by tenant
const users = await prisma.user.findMany({
  where: {
    orgId: req.tenantId,  // From JWT middleware
  },
});

// ❌ WRONG - Would expose all users across all orgs
const users = await prisma.user.findMany();
```

### Cascade Deletion

When an Organization is deleted, all related data cascades:

```
Organization (deleted)
  ├─ User (cascade delete)
  ├─ Class (cascade delete)
  └─ Fee (cascade delete)
```

In `schema.prisma`:
```prisma
model User {
  org Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
}
```

## Data Models Overview

### Person Hierarchy
```
Organization (e.g., "Harvard University")
  ├─ AcademicYear (e.g., "2024-2025")
  │   ├─ Division (Grade 10, Grade 11 - school only)
  │   ├─ Semester (Sem 1, Sem 2 - college only)
  │   └─ Class (English 101, Math 201)
  │       ├─ TeacherClass (assign teachers)
  │       └─ StudentEnrollment (enroll students)
  │
  ├─ User (STUDENT, TEACHER, ADMIN)
  └─ TimetableSlot (when/where class happens)
```

### Academic Flow
```
Class → Timetable → Attendance → Exam → Result → Report Card
```

### Financial Flow
```
FeeStructure → Fee → Payment (via Razorpay)
```

## Migrations Folder

Migrations are stored in `prisma/migrations/`:

```
prisma/
  ├─ schema.prisma          (Current schema definition)
  ├─ seed.ts                (Seeding script)
  └─ migrations/
      ├─ migration_001_init
      ├─ migration_002_add_chat
      └─ migration_003_add_biometric_api
```

Each migration is timestamped and immutable (for reproducibility).

## Seeding Test Data

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: 'Sample School',
      slug: 'sample-school',
      email: 'admin@sample-school.com',
      structureType: 'school',
      plan: 'premium',
      isPaid: true,
    },
  });

  // Create academic year
  const year = await prisma.academicYear.create({
    data: {
      orgId: org.id,
      name: '2024-2025',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2025-03-31'),
      isActive: true,
    },
  });

  console.log('Seed data created:', { org, year });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seeding:

```bash
npx prisma db seed
```

## Raw SQL Queries (if needed)

For complex queries, use raw SQL:

```typescript
const result = await prisma.$queryRaw`
  SELECT u.*, COUNT(a.id) as attendance_count
  FROM users u
  LEFT JOIN attendance a ON a.student_id = u.id
  WHERE u.org_id = ${orgId}
  GROUP BY u.id
`;
```

## Troubleshooting

### Error: "column org_id does not exist"

The migration hasn't been applied. Run:
```bash
npx prisma db push
npx prisma migrate dev
```

### Error: "Unique constraint failed"

You're trying to create duplicate data. Check your unique constraints in `schema.prisma`.

### Need to reset database (⚠️ Development only)

```bash
# WARNING: Deletes all data
npx prisma migrate reset

# This will:
# 1. Drop all tables
# 2. Replay all migrations
# 3. Run seed.ts
```

## Synchronizing with Production

1. **Test locally:** Create & test migration locally
2. **Commit:** Add migration to git
3. **Deploy:** On production EC2, run `npx prisma migrate deploy`

Never skip migrations or modify them after deployment.

## Next: Generate Prisma Client

```bash
npx prisma generate
```

This creates the TypeScript types for full IDE autocomplete.

---

For more info, see: https://www.prisma.io/docs/
