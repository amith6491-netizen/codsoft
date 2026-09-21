import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");

const client = new MongoClient(uri);
const db = client.db(process.env.MONGODB_DB || "careerhub");
const now = new Date();
const passwordHash = await bcrypt.hash("password123", 10);
const recruiterId = randomUUID();
const candidateId = randomUUID();
const featuredJobs = [
  { title: "Frontend Engineer", description: "Build and ship the customer-facing app in React and TypeScript.", location: "Bengaluru, India", type: "FULL_TIME", salaryMin: 800000, salaryMax: 1400000, skills: ["React", "TypeScript", "CSS"] },
  { title: "Backend Engineer (Node.js)", description: "Own the API layer and MongoDB data model powering the platform.", location: "Remote", type: "REMOTE", salaryMin: 900000, salaryMax: 1600000, skills: ["Node.js", "MongoDB", "TypeScript"] },
  { title: "Product Designer", description: "Shape intuitive product experiences from early concepts through polished releases.", location: "Mumbai, India", type: "FULL_TIME", salaryMin: 700000, salaryMax: 1200000, skills: ["Figma", "UX Research", "Design Systems"] },
  { title: "Data Analyst", description: "Turn product and customer data into clear insights for better decisions.", location: "Hyderabad, India", type: "FULL_TIME", salaryMin: 600000, salaryMax: 1000000, skills: ["SQL", "Python", "Tableau"] },
  { title: "DevOps Engineer", description: "Improve deployment automation, observability, and cloud infrastructure reliability.", location: "Remote", type: "REMOTE", salaryMin: 1000000, salaryMax: 1800000, skills: ["AWS", "Docker", "Kubernetes"] },
  { title: "Mobile App Developer", description: "Create fast, accessible mobile experiences for iOS and Android users.", location: "Pune, India", type: "FULL_TIME", salaryMin: 750000, salaryMax: 1300000, skills: ["React Native", "Flutter", "REST APIs"] },
  { title: "QA Automation Engineer", description: "Build reliable automated test coverage across web and API products.", location: "Chennai, India", type: "FULL_TIME", salaryMin: 550000, salaryMax: 950000, skills: ["Playwright", "Cypress", "JavaScript"] },
  { title: "Marketing Intern", description: "Support campaigns, content experiments, and growth reporting for a scaling team.", location: "Delhi, India", type: "INTERNSHIP", salaryMin: 180000, salaryMax: 300000, skills: ["Content", "Analytics", "SEO"] },
  { title: "Technical Writer", description: "Make complex developer tools approachable through thoughtful documentation.", location: "Remote", type: "CONTRACT", salaryMin: 500000, salaryMax: 900000, skills: ["Documentation", "APIs", "Markdown"] },
  { title: "Engineering Manager", description: "Lead a collaborative engineering team delivering high-quality platform features.", location: "Bengaluru, India", type: "FULL_TIME", salaryMin: 1800000, salaryMax: 2800000, skills: ["Leadership", "Agile", "System Design"] },
  { title: "Customer Success Specialist", description: "Help customers reach value quickly and turn feedback into product improvements.", location: "Gurugram, India", type: "FULL_TIME", salaryMin: 450000, salaryMax: 800000, skills: ["Customer Success", "SaaS", "Communication"] },
  { title: "Security Engineer", description: "Protect applications and infrastructure through practical security engineering.", location: "Remote", type: "REMOTE", salaryMin: 1200000, salaryMax: 2200000, skills: ["Cloud Security", "OWASP", "Threat Modeling"] },
  { title: "Business Analyst", description: "Translate business goals into clear requirements and measurable delivery plans.", location: "Kochi, India", type: "FULL_TIME", salaryMin: 550000, salaryMax: 950000, skills: ["Requirements", "SQL", "Stakeholder Management"] },
  { title: "Data Science Intern", description: "Explore real-world datasets and prototype models with an experienced analytics team.", location: "Remote", type: "INTERNSHIP", salaryMin: 240000, salaryMax: 400000, skills: ["Python", "Pandas", "Machine Learning"] },
  { title: "Solutions Architect", description: "Design scalable technical solutions alongside customers and internal product teams.", location: "Singapore", type: "FULL_TIME", salaryMin: 1600000, salaryMax: 2600000, skills: ["Architecture", "Cloud", "Consulting"] },
  { title: "People Operations Partner", description: "Build thoughtful people programs that help teams grow sustainably.", location: "Bengaluru, India", type: "PART_TIME", salaryMin: 400000, salaryMax: 700000, skills: ["People Ops", "HRIS", "Employee Experience"] },
  { title: "Content Strategist", description: "Define a useful, distinctive content strategy across the customer journey.", location: "Remote", type: "CONTRACT", salaryMin: 600000, salaryMax: 1100000, skills: ["Content Strategy", "Editorial", "Research"] },
  { title: "React Developer", description: "Deliver accessible interface components for a modern multi-product platform.", location: "Hyderabad, India", type: "FULL_TIME", salaryMin: 700000, salaryMax: 1250000, skills: ["React", "Next.js", "Accessibility"] },
  { title: "Finance Operations Analyst", description: "Improve financial reporting, planning workflows, and operational visibility.", location: "Mumbai, India", type: "FULL_TIME", salaryMin: 500000, salaryMax: 900000, skills: ["Excel", "Financial Analysis", "Reporting"] },
  { title: "Cloud Support Engineer", description: "Help teams troubleshoot production systems and build dependable cloud practices.", location: "Remote", type: "PART_TIME", salaryMin: 450000, salaryMax: 850000, skills: ["Linux", "AWS", "Incident Response"] },
];

await client.connect();
await Promise.all([
  db.collection("users").deleteMany({ email: { $in: ["recruiter@example.com", "candidate@example.com"] } }),
  db.collection("jobs").deleteMany({ title: { $in: featuredJobs.map((job) => job.title) } }),
]);
await db.collection("users").insertMany([
  { id: recruiterId, name: "Priya Nair", email: "recruiter@example.com", passwordHash, role: "RECRUITER", createdAt: now, updatedAt: now },
  { id: candidateId, name: "Alex Chen", email: "candidate@example.com", passwordHash, role: "CANDIDATE", createdAt: now, updatedAt: now },
]);
await db.collection("recruiterProfiles").insertOne({ id: randomUUID(), userId: recruiterId, company: "Northwind Labs", companyWebsite: "https://northwind.example" });
await db.collection("candidateProfiles").insertOne({ id: randomUUID(), userId: candidateId, headline: "Frontend engineer, 3 yrs", skills: ["React", "TypeScript", "CSS"], updatedAt: now });
await db.collection("jobs").insertMany(featuredJobs.map((job) => ({
  ...job,
  id: randomUUID(),
  recruiterId,
  status: "OPEN",
  createdAt: now,
  updatedAt: now,
})));
console.log("Seeded recruiter@example.com and candidate@example.com with password password123");
await client.close();