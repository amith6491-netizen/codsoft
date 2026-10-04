# CareerHub — Modern Job Recruitment & Hiring Platform

CareerHub is a full-stack, production-ready recruitment web platform that connects job seekers and hiring teams. Built with **Next.js 14 (App Router)**, **MongoDB**, and **NextAuth.js**, it provides seamless job discovery, resume-backed applications, candidate status tracking, and end-to-end recruitment pipeline management.

All salary figures and compensation packages across the platform are natively formatted in **Indian Rupees (INR / ₹)** and **Lakhs Per Annum (LPA)**.

---

## Table of Contents

1. [Features](#features)
   - [Candidate Features](#candidate-features)
   - [Recruiter Features](#recruiter-features)
   - [Platform & Security Features](#platform--security-features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
   - [Step 1: Clone the Repository](#step-1-clone-the-repository)
   - [Step 2: Install Dependencies](#step-2-install-dependencies)
   - [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
   - [Step 4: Start MongoDB](#step-4-start-mongodb)
   - [Step 5: Seed the Database](#step-5-seed-the-database)
   - [Step 6: Run the Development Server](#step-6-run-the-development-server)
   - [Step 7: Build for Production](#step-7-build-for-production)
5. [Demo Login Credentials](#demo-login-credentials)
6. [Step-by-Step User Walkthrough](#step-by-step-user-walkthrough)
   - [Candidate Walkthrough](#candidate-walkthrough)
   - [Recruiter Walkthrough](#recruiter-walkthrough)
7. [Indian Rupee (INR / ₹) Currency System](#indian-rupee-inr---currency-system)
8. [File Storage (Local Disk vs AWS S3)](#file-storage-local-disk-vs-aws-s3)
9. [Project Structure](#project-structure)
10. [API Reference](#api-reference)
11. [Database Schema & Collections](#database-schema--collections)
12. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## Features

### Candidate Features
- **Job Search & Filtering:** Live multi-parameter filtering by keywords (role, skills), location (e.g. Bengaluru, Remote, Mumbai), and job type (Full-time, Remote, Contract, Internship, Part-time).
- **Indian Rupee (INR) Salary Insights:** Transparent salary ranges formatted in Indian notation (e.g. `₹8,00,000 – ₹14,00,000 (8–14 LPA)`).
- **One-Click Application:** Apply with an uploaded PDF resume and custom cover letter, or automatically reuse the default resume saved to your profile.
- **Application Tracking Dashboard:** Live tracker for all submitted applications with real-time status badges:
  - `APPLIED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `HIRED` or `REJECTED`.
- **Default Profile Resume:** Upload once in the Candidate Dashboard to apply seamlessly without re-uploading every time.

### Recruiter Features
- **Role Posting:** Create and publish live job listings with role title, company profile, location, employment type, Indian Rupee salary ranges (`₹` / LPA), and required skill tags.
- **Recruiter Analytics Dashboard:** Real-time metrics overview:
  - Total open roles
  - Total applicants across all postings
  - Active live jobs
- **Applicant Review Pipeline:** View all candidates per job posting with applicant details, email, headline, cover letter, and direct link to their submitted PDF resume.
- **Hiring Stage Management:** Move applicants through stages with an instant status dropdown:
  - `APPLIED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `HIRED` $\rightarrow$ `REJECTED`.

### Platform & Security Features
- **Role-Based Authentication:** NextAuth.js JWT credential provider supporting `CANDIDATE` and `RECRUITER` roles.
- **Route Protection Middleware:** Route-gated pages preventing unauthorized access:
  - `/post-job` $\rightarrow$ Restricted to recruiters.
  - `/dashboard/recruiter` and `/jobs/[id]/applicants` $\rightarrow$ Restricted to recruiters.
  - `/dashboard/candidate` $\rightarrow$ Restricted to candidates.
- **Pluggable Storage Engine:** Local filesystem storage by default with seamless single-switch configuration to AWS S3.
- **Password Security:** Salted BCrypt password hashing.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [MongoDB](https://www.mongodb.com/) (Official Node.js Native Driver) |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) (Credentials Provider + JWT sessions) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with custom typography & glassmorphism |
| **Password Hashing** | [bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| **Validation** | [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/) |
| **File Storage** | Local Disk (`/public/uploads/resumes`) or AWS S3 |
| **Seeding & Scripts** | [tsx](https://github.com/privatenumber/tsx) |

---

## Prerequisites

Before running this project, ensure you have the following installed on your machine:
- **Node.js**: `v18.17.0` or higher (`v20+` recommended). Check with `node -v`.
- **npm**: `v9+` or higher (comes bundled with Node.js).
- **MongoDB**: Either:
  - A local MongoDB instance running on `mongodb://127.0.0.1:27017`, OR
  - A free cloud MongoDB Atlas cluster URI (`mongodb+srv://...`).

---

## Step-by-Step Setup Guide

Follow these steps sequentially to set up and run CareerHub locally:

### Step 1: Clone the Repository
```bash
git clone https://github.com/amith6491-netizen/codsoft.git
cd codsoft/careerhub
```

### Step 2: Install Dependencies
Install all required production and development dependencies:
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy the example environment configuration into `.env` (or `.env.local`):

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.local
```

**On Linux / macOS:**
```bash
cp .env.example .env.local
```

Open `.env.local` and review the configuration:
```env
# MongoDB Connection
MONGODB_URI="mongodb://127.0.0.1:27017"
MONGODB_DB="careerhub"

# NextAuth Configuration
# You can generate a random secret via: openssl rand -base64 32
NEXTAUTH_SECRET="W04vKA/K1YsIfKijr7Pqu9znAhtIGq7OQ1GcRi+o3j8="
NEXTAUTH_URL="http://localhost:3000"

# Resume Storage Driver: "local" or "s3"
STORAGE_DRIVER="local"

# (Optional) AWS S3 configuration if STORAGE_DRIVER="s3"
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""
```

### Step 4: Start MongoDB
Ensure your MongoDB service is running:
- **Local MongoDB (Windows Service):** Ensure MongoDB service is started via Windows Services or run `mongod`.
- **Local MongoDB (Docker):**
  ```bash
  docker run -d -p 27017:27017 --name mongodb mongo:latest
  ```
- **MongoDB Atlas:** Paste your connection string into `MONGODB_URI` in `.env.local`.

### Step 5: Seed the Database
Populate the database with demo accounts (Recruiter & Candidate) and **20 featured Indian tech jobs** across Bengaluru, Pune, Mumbai, Hyderabad, and Remote:
```bash
npm run seed
```

**Expected output:**
```
Connected to MongoDB at mongodb://127.0.0.1:27017, database: careerhub
Successfully seeded database!
Recruiter: recruiter@example.com / password123
Candidate: candidate@example.com / password123
Seeded 20 featured jobs.
```

### Step 6: Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```

Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

### Step 7: Build for Production
To test the optimized production build:
```bash
npm run build
npm run start
```

---

## Demo Login Credentials

CareerHub comes pre-seeded with two accounts for immediate testing:

| Role | Email | Password | Name | Organization / Info |
|---|---|---|---|---|
| **Recruiter** | `recruiter@example.com` | `password123` | Priya Nair | Northwind Labs |
| **Candidate** | `candidate@example.com` | `password123` | Alex Chen | Frontend Engineer (3 yrs exp) |

> [!TIP]
> You can also register new accounts anytime using the [Register Page](http://localhost:3000/register), selecting either the **Candidate** or **Recruiter** role.

---

## Step-by-Step User Walkthrough

### Candidate Walkthrough

1. **Browse Roles:**
   - Go to [http://localhost:3000](http://localhost:3000).
   - Use the search bar to filter by title/skills (e.g. `React`, `Python`), location (e.g. `Bengaluru`, `Remote`), or employment type.
   - Job cards display compensation in Indian Rupees (e.g. `₹8,00,000 – ₹14,00,000 (8–14 LPA)`).
2. **Sign In as Candidate:**
   - Click **Sign in** in the top navigation bar.
   - Enter `candidate@example.com` and `password123`.
3. **Upload Default Resume:**
   - Navigate to the **Candidate Dashboard** (`/dashboard/candidate`).
   - Under **Default resume**, upload your PDF resume so future applications can reuse it without manual uploads.
4. **Apply to a Job:**
   - Click on any job card (e.g. *Frontend Engineer*).
   - In the sidebar application form, optionally attach a specific PDF resume or leave blank to use your profile resume.
   - Enter an optional cover letter and click **Submit application**.
5. **Track Status:**
   - Return to `/dashboard/candidate` to see your application card update in real-time as recruiters review it.

---

### Recruiter Walkthrough

1. **Sign In as Recruiter:**
   - Click **Sign in** in the top navigation bar.
   - Enter `recruiter@example.com` and `password123`.
2. **Post a New Job:**
   - Click **Post a job** in the navigation bar or recruiter dashboard (`/post-job`).
   - Fill in:
     - **Title:** e.g. `Senior Full Stack Developer`
     - **Description:** Outline role responsibilities and requirements.
     - **Location:** e.g. `Bengaluru, India` or `Remote`
     - **Type:** Full-time, Part-time, Contract, Internship, or Remote.
     - **Salary Min / Max (₹ / INR):** Enter numbers in Rupees (e.g. `1200000` to `2000000` for 12–20 LPA).
     - **Skills:** Comma-separated list (e.g. `Next.js, Node.js, MongoDB`).
   - Click **Publish job**. The role goes live instantly.
3. **View Applicants:**
   - Go to the **Recruiter Dashboard** (`/dashboard/recruiter`).
   - Under **Live jobs**, click on the applicant count badge next to any job (or navigate to `/jobs/[id]/applicants`).
4. **Manage Candidate Pipeline:**
   - View each candidate's name, email, profile headline, and cover letter.
   - Click **View resume** to open their submitted PDF in a new tab.
   - Use the status dropdown to progress the candidate:
     - `APPLIED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `HIRED` (or `REJECTED`).

---

## Indian Rupee (INR / ₹) Currency System

All monetary figures in CareerHub use the Indian numbering format (Lakhs and Crores) and the Rupee symbol (`₹`), handled via [`src/lib/format.ts`](file:///c:/chitte/codsoft/careerhub/src/lib/format.ts):

- **Formatted with Indian Numbering (`en-IN`):** Numbers are grouped in lakhs rather than millions (e.g. `8,00,000` instead of `800,000`).
- **Lakhs Per Annum (LPA) Shorthand:** Annual salaries $\ge$ ₹1,00,000 automatically calculate LPA:
  - `800000` to `1400000` $\rightarrow$ **`₹8,00,000 – ₹14,00,000 (8–14 LPA)`**
  - `180000` to `300000` $\rightarrow$ **`₹1,80,000 – ₹3,00,000 (1.8–3 LPA)`**
  - Single boundary: `800000` $\rightarrow$ **`From ₹8,00,000 (8 LPA)`**
- **Form Inputs:** The job creation form explicitly guides recruiters with `Salary min (₹ / INR, optional)` and `Salary max (₹ / INR, optional)` placeholders.

---

## File Storage (Local Disk vs AWS S3)

CareerHub includes an abstracted storage adapter in [`src/lib/storage.ts`](file:///c:/chitte/codsoft/careerhub/src/lib/storage.ts):

### 1. Local Storage (Default)
- Saves uploaded resume PDFs directly to the local directory:
  `public/uploads/resumes/<uuid>.pdf`
- Served statically at URL:
  `/uploads/resumes/<uuid>.pdf`
- Ideal for development, testing, and single-instance deployments without cloud costs.

### 2. Switching to AWS S3
To switch to AWS S3 for production cloud storage:
1. Install the AWS S3 client:
   ```bash
   npm install @aws-sdk/client-s3
   ```
2. In `.env.local`, set:
   ```env
   STORAGE_DRIVER="s3"
   AWS_REGION="ap-south-1"
   AWS_ACCESS_KEY_ID="your-access-key-id"
   AWS_SECRET_ACCESS_KEY="your-secret-access-key"
   AWS_S3_BUCKET="your-bucket-name"
   ```
3. In [`src/lib/storage.ts`](file:///c:/chitte/codsoft/careerhub/src/lib/storage.ts), uncomment the AWS S3 client integration.

---

## Project Structure

```
careerhub/
├── .env.example                # Example environment configuration
├── .env.local                  # Local environment file (git-ignored)
├── next.config.mjs             # Next.js configuration (upload body limits)
├── package.json                # Project dependencies & npm scripts
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.ts          # Tailwind styling configuration
├── tsconfig.json               # TypeScript configuration
├── public/                     # Static assets & public uploads
│   └── uploads/resumes/        # Local disk resume storage
├── scripts/
│   └── seed.ts                 # Database seeder (20 jobs, recruiter, candidate)
└── src/
    ├── middleware.ts           # Route protection for recruiter & candidate pages
    ├── components/
    │   ├── JobCard.tsx         # Job card component with INR salary display
    │   ├── Navbar.tsx          # Responsive navigation bar with role detection
    │   └── SessionProvider.tsx # NextAuth client session wrapper
    ├── lib/
    │   ├── auth.ts             # NextAuth credentials & JWT configuration
    │   ├── format.ts           # Indian Rupee (INR / ₹ / LPA) formatters
    │   ├── mongodb.ts          # Cached MongoDB client connection & indexing
    │   ├── repository.ts       # Database access layer & data aggregations
    │   └── storage.ts          # Resume upload adapter (Local & S3)
    └── app/
        ├── layout.tsx          # Root HTML layout with fonts & styles
        ├── page.tsx            # Home page: hero section & live job search
        ├── globals.css         # Global styles, glassmorphism & gradients
        ├── login/              # Sign-in page
        ├── register/           # Registration page (Candidate / Recruiter)
        ├── post-job/           # Recruiter job posting form
        ├── jobs/
        │   └── [id]/
        │       ├── page.tsx    # Job details & candidate application form
        │       └── applicants/ # Recruiter candidate review pipeline
        ├── dashboard/
        │   ├── candidate/      # Candidate applications & default resume
        │   └── recruiter/      # Recruiter metrics & job management
        └── api/
            ├── auth/           # NextAuth & registration endpoints
            ├── jobs/           # Job search, posting, and retrieval
            ├── applications/   # Candidate applications & status updates
            └── upload/         # Resume file upload handlers
```

---

## API Reference

### Authentication
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `role`: `CANDIDATE` | `RECRUITER`, `company`).
- `POST /api/auth/[...nextauth]` — NextAuth credential sign-in and session handlers.
- `GET /api/auth/session` — Get current authenticated user session and role.

### Jobs
- `GET /api/jobs` — Public search for open jobs.
  - Query parameters:
    - `q`: Search keyword across job titles and skills.
    - `location`: Filter by location.
    - `type`: Filter by job type (`FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `REMOTE`).
    - `mine=1`: (Recruiter only) Returns all jobs posted by the signed-in recruiter.
- `POST /api/jobs` — (Recruiter only) Create a new job posting.
- `GET /api/jobs/[id]` — Retrieve full details of a specific job with recruiter info and application count.

### Applications
- `GET /api/applications` — Fetch applications.
  - For candidates: Returns all applications submitted by the signed-in candidate.
  - For recruiters: Query `?jobId=<id>` returns all applicants for a specific job posted by the recruiter.
- `POST /api/jobs/[id]/apply` — (Candidate only) Apply to a job with `coverLetter` and optional multipart `resume` PDF.
- `PATCH /api/applications/[id]` — (Recruiter only) Update applicant status (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `REJECTED`, `HIRED`).

### Upload
- `POST /api/upload/resume` — (Candidate only) Upload and store a default profile PDF resume.

---

## Database Schema & Collections

CareerHub uses MongoDB with 5 primary collections:

1. **`users`**
   - `id` (UUID string), `name`, `email` (unique index), `passwordHash`, `role` (`CANDIDATE` | `RECRUITER`), `createdAt`, `updatedAt`.
2. **`candidateProfiles`**
   - `id`, `userId` (unique index), `headline`, `location`, `skills` (array), `resumeUrl`, `resumeName`, `updatedAt`.
3. **`recruiterProfiles`**
   - `id`, `userId` (unique index), `company`, `companyWebsite`, `companyLogoUrl`.
4. **`jobs`**
   - `id`, `recruiterId`, `title`, `description`, `location`, `type`, `salaryMin`, `salaryMax`, `skills` (array), `status` (`OPEN` | `CLOSED`), `createdAt`, `updatedAt`.
5. **`applications`**
   - `id`, `jobId`, `candidateId`, `resumeUrl`, `resumeName`, `coverLetter`, `status` (`APPLIED` | `UNDER_REVIEW` | `SHORTLISTED` | `REJECTED` | `HIRED`), `appliedAt`, `updatedAt`.

---

## Troubleshooting & FAQs

### 1. MongoDB connection failed: `ECONNREFUSED 127.0.0.1:27017`
- Make sure MongoDB is running on your machine.
- On Windows, open PowerShell as Administrator and run:
  ```powershell
  Start-Service MongoDB
  ```
- Or verify your MongoDB service in Windows Services (`services.msc`).
- If using MongoDB Atlas, check that your IP address is whitelisted in Network Access.

### 2. Can't sign in after fresh setup
- Ensure you have executed the seed script:
  ```bash
  npm run seed
  ```
- Verify credentials:
  - Recruiter: `recruiter@example.com` / `password123`
  - Candidate: `candidate@example.com` / `password123`

### 3. File upload errors or resume not saving
- Verify that the directory `public/uploads/resumes` exists and has write permissions. The upload handler creates this directory automatically if missing.
- Only PDF files (`application/pdf`) are accepted.

### 4. Route redirection loop or 403 Forbidden
- Candidate pages (`/dashboard/candidate`) require logging in with a `CANDIDATE` account.
- Recruiter pages (`/post-job`, `/dashboard/recruiter`, `/jobs/[id]/applicants`) require logging in with a `RECRUITER` account.
- If you switch roles, log out first using the **Sign out** button in the navbar.

---

## License

This project is licensed under the MIT License.
