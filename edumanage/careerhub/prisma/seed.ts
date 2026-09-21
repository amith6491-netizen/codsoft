import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const recruiter = await prisma.user.create({
    data: {
      name: "Priya Nair",
      email: "recruiter@example.com",
      passwordHash,
      role: "RECRUITER",
      recruiterProfile: { create: { company: "Northwind Labs", companyWebsite: "https://northwind.example" } }
    }
  });

  const candidate = await prisma.user.create({
    data: {
      name: "Alex Chen",
      email: "candidate@example.com",
      passwordHash,
      role: "CANDIDATE",
      candidateProfile: { create: { headline: "Frontend engineer, 3 yrs", skills: ["React", "TypeScript", "CSS"] } }
    }
  });

  await prisma.job.createMany({
    data: [
      {
        recruiterId: recruiter.id,
        title: "Frontend Engineer",
        description: "Build and ship the customer-facing app in React and TypeScript.",
        location: "Bengaluru, India",
        type: "FULL_TIME",
        salaryMin: 800000,
        salaryMax: 1400000,
        skills: ["React", "TypeScript", "CSS"]
      },
      {
        recruiterId: recruiter.id,
        title: "Backend Engineer (Node.js)",
        description: "Own the API layer and PostgreSQL data model powering the platform.",
        location: "Remote",
        type: "REMOTE",
        salaryMin: 900000,
        salaryMax: 1600000,
        skills: ["Node.js", "PostgreSQL", "Prisma"]
      }
    ]
  });

  console.log("Seeded:", { recruiter: recruiter.email, candidate: candidate.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
