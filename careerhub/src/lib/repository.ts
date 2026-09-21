import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/mongodb";
import type { Document } from "mongodb";

type User = { id: string; name: string; email: string; passwordHash: string; role: "CANDIDATE" | "RECRUITER"; createdAt: Date; updatedAt: Date };
type Job = { id: string; recruiterId: string; title: string; description: string; location: string; type: string; salaryMin: number | null; salaryMax: number | null; skills: string[]; status: string; createdAt: Date; updatedAt: Date };
type CandidateProfile = { id: string; userId: string; headline?: string | null; location?: string | null; phone?: string | null; skills: string[]; resumeUrl?: string | null; resumeName?: string | null; updatedAt: Date };
type RecruiterProfile = { id: string; userId: string; company: string; companyWebsite?: string | null; companyLogoUrl?: string | null };
type Application = { id: string; jobId: string; candidateId: string; resumeUrl: string; resumeName?: string | null; coverLetter?: string | null; status: string; appliedAt: Date; updatedAt: Date };

const collection = async <T extends Document>(name: string) => (await getDb()).collection<T>(name);
const now = () => new Date();
const id = () => randomUUID();

async function enrichJob(job: Job, includeCount = true) {
  const users = await collection<User>("users");
  const profiles = await collection<RecruiterProfile>("recruiterProfiles");
  const recruiter = await users.findOne({ id: job.recruiterId });
  const recruiterProfile = await profiles.findOne({ userId: job.recruiterId });
  const applications = includeCount ? await collection<Application>("applications") : null;
  return { ...job, recruiter: recruiter ? { id: recruiter.id, name: recruiter.name, email: recruiter.email, recruiterProfile } : null, ...(applications ? { _count: { applications: await applications.countDocuments({ jobId: job.id }) } } : {}) };
}

export async function findUserByEmail(email: string) {
  return (await (await collection<User>("users")).findOne({ email })) as User | null;
}

export async function createUserWithProfile(input: { name: string; email: string; passwordHash: string; role: "CANDIDATE" | "RECRUITER"; company?: string }) {
  const user: User = { id: id(), name: input.name, email: input.email, passwordHash: input.passwordHash, role: input.role, createdAt: now(), updatedAt: now() };
  await (await collection<User>("users")).insertOne(user);
  if (input.role === "CANDIDATE") {
    const profile: CandidateProfile = { id: id(), userId: user.id, skills: [], updatedAt: now() };
    await (await collection<CandidateProfile>("candidateProfiles")).insertOne(profile);
  } else {
    const profile: RecruiterProfile = { id: id(), userId: user.id, company: input.company as string };
    await (await collection<RecruiterProfile>("recruiterProfiles")).insertOne(profile);
  }
  return user;
}

export async function findJobs(filters: { q?: string; location?: string; type?: string; recruiterId?: string }) {
  const where: Record<string, unknown> = filters.recruiterId ? { recruiterId: filters.recruiterId } : { status: "OPEN" };
  if (filters.type) where.type = filters.type;
  if (filters.location) where.location = { $regex: filters.location, $options: "i" };
  if (filters.q) where.$or = [{ title: { $regex: filters.q, $options: "i" } }, { skills: { $regex: filters.q, $options: "i" } }];
  const jobs = await (await collection<Job>("jobs")).find(where).sort({ createdAt: -1 }).toArray();
  return Promise.all(jobs.map((job) => enrichJob(job)));
}

export async function findJobById(jobId: string, includeCount = true) {
  const job = await (await collection<Job>("jobs")).findOne({ id: jobId });
  return job ? enrichJob(job, includeCount) : null;
}

export async function findRawJob(jobId: string) {
  return (await (await collection<Job>("jobs")).findOne({ id: jobId })) as Job | null;
}

export async function createJob(input: Omit<Job, "id" | "createdAt" | "updatedAt">) {
  const job: Job = { ...input, id: id(), createdAt: now(), updatedAt: now() };
  await (await collection<Job>("jobs")).insertOne(job);
  return job;
}

export async function updateJob(jobId: string, data: Partial<Job>) {
  const allowed = ["title", "description", "location", "type", "salaryMin", "salaryMax", "skills", "status"];
  const update = Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key)));
  await (await collection<Job>("jobs")).updateOne({ id: jobId }, { $set: { ...update, updatedAt: now() } });
  return findRawJob(jobId);
}

export async function deleteJob(jobId: string) {
  await (await collection<Application>("applications")).deleteMany({ jobId });
  await (await collection<Job>("jobs")).deleteOne({ id: jobId });
}

export async function findCandidateProfile(userId: string) {
  return (await (await collection<CandidateProfile>("candidateProfiles")).findOne({ userId })) as CandidateProfile | null;
}

export async function findApplicationByPair(jobId: string, candidateId: string) {
  return (await (await collection<Application>("applications")).findOne({ jobId, candidateId })) as Application | null;
}

export async function createApplication(input: Omit<Application, "id" | "status" | "appliedAt" | "updatedAt">) {
  const application: Application = { ...input, id: id(), status: "APPLIED", appliedAt: now(), updatedAt: now() };
  await (await collection<Application>("applications")).insertOne(application);
  return application;
}

export async function findCandidateApplications(candidateId: string) {
  const apps = await (await collection<Application>("applications")).find({ candidateId }).sort({ appliedAt: -1 }).toArray();
  const jobs = await collection<Job>("jobs");
  return Promise.all(apps.map(async (application) => ({ ...application, job: await jobs.findOne({ id: application.jobId }) })));
}

export async function findRecruiterApplications(jobId: string) {
  const apps = await (await collection<Application>("applications")).find({ jobId }).sort({ appliedAt: -1 }).toArray();
  const users = await collection<User>("users");
  const profiles = await collection<CandidateProfile>("candidateProfiles");
  return Promise.all(apps.map(async (application) => {
    const candidate = await users.findOne({ id: application.candidateId });
    const candidateProfile = await profiles.findOne({ userId: application.candidateId });
    return { ...application, candidate: candidate ? { id: candidate.id, name: candidate.name, email: candidate.email, candidateProfile } : null };
  }));
}

export async function findApplicationWithJob(applicationId: string) {
  const application = await (await collection<Application>("applications")).findOne({ id: applicationId });
  if (!application) return null;
  const job = await (await collection<Job>("jobs")).findOne({ id: application.jobId });
  return { ...application, job };
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  await (await collection<Application>("applications")).updateOne({ id: applicationId }, { $set: { status, updatedAt: now() } });
  return (await (await collection<Application>("applications")).findOne({ id: applicationId })) as Application | null;
}

export async function upsertCandidateResume(userId: string, resumeUrl: string, resumeName: string) {
  const profiles = await collection<CandidateProfile>("candidateProfiles");
  await profiles.updateOne({ userId }, { $set: { resumeUrl, resumeName, updatedAt: now() }, $setOnInsert: { id: id(), userId, skills: [] } }, { upsert: true });
  return profiles.findOne({ userId });
}