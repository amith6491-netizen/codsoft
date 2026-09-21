# CareerHub

A recruitment platform connecting job seekers and companies: job listings,
resume-backed applications, candidate profiles, and recruiter dashboards.

## Stack

- **Next.js 14** (App Router, TypeScript) — frontend + API routes
- **PostgreSQL** + **Prisma** — data
- **NextAuth** (credentials + JWT) — auth, with `CANDIDATE` / `RECRUITER` roles
- **Local disk storage** for resumes by default, with a one-file swap to S3
  (`src/lib/storage.ts`)

## Features

- Candidates: search/filter jobs, apply with a resume (or reuse the one on
  their profile), track application status
- Recruiters: post jobs, view applicants per job, move candidates through
  `APPLIED → UNDER_REVIEW → SHORTLISTED → REJECTED/HIRED`
- Route protection via middleware — dashboards and job posting are role-gated

## Getting started

```bash
npm install
cp .env.example .env      # set DATABASE_URL and NEXTAUTH_SECRET
npx prisma migrate dev --name init
npm run seed               # optional: demo recruiter + candidate + 2 jobs
npm run dev
```

App runs at http://localhost:3000.

Seed accounts (password `password123`):
- Recruiter: `recruiter@example.com`
- Candidate: `candidate@example.com`

## Project structure

```
prisma/schema.prisma        User, CandidateProfile, RecruiterProfile, Job, Application
src/lib/auth.ts             NextAuth config (credentials provider)
src/lib/storage.ts          Resume storage — local by default, S3-ready
src/app/api/                REST-style route handlers (jobs, applications, auth, upload)
src/app/                    Pages: home/search, job detail + apply, login/register,
                             post-job, dashboard/candidate, dashboard/recruiter,
                             jobs/[id]/applicants
src/middleware.ts           Role-based route protection
```

## Notes / next steps

- Resumes must be PDF; size limit is whatever your hosting platform allows
  (adjust `serverActions.bodySizeLimit` in `next.config.mjs`).
- To switch resume storage to S3: `npm i @aws-sdk/client-s3`, set
  `STORAGE_DRIVER=s3` and the `AWS_*` vars in `.env`, then uncomment
  `saveToS3()` in `src/lib/storage.ts`.
- No email notifications yet — a natural next step is notifying candidates
  when their application status changes.
- No pagination on job search yet — fine for a demo, add it before scaling
  the listings.
