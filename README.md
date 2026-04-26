# M-CRED — Digital Credential Platform

Full-stack microcredential infrastructure for Swiss institutions.
Built with Next.js 15, NextAuth v5, Vercel Blob, and TypeScript.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth | NextAuth.js v5 (Credentials) |
| Database | Vercel Blob (JSON collections) |
| Language | TypeScript |
| Styling | Custom CSS design system |
| Deploy | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo>
cd m-cred
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Fill in:

```
AUTH_SECRET=<run: openssl rand -base64 32>
BLOB_READ_WRITE_TOKEN=<from Vercel dashboard → Storage → Blob>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run locally

```bash
npm run dev
```

### 4. Seed initial data

```bash
curl -X POST http://localhost:3000/api/seed
```

This creates the institution, all users, courses, classes, students, credentials, scores, and audit log entries.

### 5. Log in

| Role | Email | Password |
|---|---|---|
| Admin | admin@bfh.ch | password123 |
| Secretariat | secretariat@bfh.ch | password123 |
| Lecturer | a.steiner@bfh.ch | password123 |
| Developer | dev@m-cred.ch | password123 |
| Student | sarah.keller@student.bfh.ch | student123 |

---

## Deploy to Vercel

1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Add environment variables in Vercel → Settings → Environment Variables:
   - `AUTH_SECRET`
   - `BLOB_READ_WRITE_TOKEN`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
4. Deploy
5. Run `POST /api/seed` once to seed data

### Vercel Blob Setup

1. Go to Vercel dashboard → Storage → Create Database → Blob
2. Copy the `BLOB_READ_WRITE_TOKEN`
3. Add to environment variables

---

## Architecture

### Data storage

All data is stored as JSON in Vercel Blob:

```
mcred/institutions.json     → Institution config
mcred/users.json            → CMS staff users
mcred/courses.json          → Courses
mcred/classes.json          → Class cohorts
mcred/students.json         → Students
mcred/credentials.json      → All credentials
mcred/scores.json           → Student scores & completion
mcred/log.json              → Immutable audit log
mcred/verifications.json    → Verification events
mcred/credentials/<ID>.json → Individual credential (for public verify)
```

### Route structure

```
/                    → Landing (redirects to /dashboard if signed in)
/login               → Auth page (staff + student toggle)
/dashboard           → Role-aware CMS dashboard
/courses             → Courses list + detail + new
/classes             → Classes list + detail + new
/students            → Students list + detail + new
/credentials         → Credentials list + detail
/issue               → 5-step issue credential wizard
/scores              → Scores & completion (Lecturer)
/users               → Users & Roles (Admin/Dev)
/log                 → Immutable audit log + detail
/import-students     → CSV import (Secretariat)
/proposals           → Course proposals (Lecturer)
/approvals           → Course approvals (Admin)
/profile             → Institution profile
/design              → Branding & design
/layout-settings     → Certificate template
/settings            → Platform settings
/integrations        → External integrations (Dev)
/system-logs         → System logs (Dev)
/schema              → Schema import/export (Dev)
/faq                 → FAQ
/verify/[id]         → Public credential verification (no auth)
/wallet              → Learner credential wallet
```

### Role permissions

| Feature | Lecturer | Secretariat | Admin | Developer |
|---|---|---|---|---|
| View courses | Own only | All | All | All |
| Create courses | Propose only | ✅ | ✅ | ✅ |
| Approve courses | ❌ | ❌ | ✅ | ✅ |
| View classes | Own only | All | All | All |
| View students | Own class | All | All | All |
| Import students CSV | ❌ | ✅ | ✅ | ✅ |
| Enter scores | ✅ | ❌ | ❌ | ✅ |
| Issue credentials | ❌ | ✅ | ✅ | ✅ |
| Revoke credentials | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ | ✅ |
| View log | Own only | Operational | All | All + tech |
| Export log | ❌ | ❌ | ✅ | ✅ |
| Settings / Design | ❌ | ❌ | ✅ | ✅ |
| Integrations / Schema | ❌ | ❌ | ❌ | ✅ |

---

## Credential Workflow

```
Lecturer enters scores
  → Marks students as Completed + Ready for Credential
    → Secretariat opens Issue Credential wizard
      → Selects course → class → completed students
        → Previews credential → Confirms & issues
          → Students see credential in Wallet
            → Employers verify at /verify/<ID>
```

---

## Audit Log

Every CMS action is written to `mcred/log.json` immutably:
- Cannot be edited, deleted, or cleared
- Role-scoped visibility (Lecturer sees own, Secretariat sees operational, Admin sees all)
- Developer sees full entries including session ID and IP address
- Export available to Admin and Developer roles

