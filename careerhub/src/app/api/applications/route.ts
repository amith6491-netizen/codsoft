import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findCandidateApplications, findJobById, findRecruiterApplications } from "@/lib/repository";

// GET /api/applications
//  - candidate: their own applications
//  - recruiter: applications to a specific job they posted (?jobId=)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (session.user.role === "CANDIDATE") {
    const applications = await findCandidateApplications(session.user.id);
    return NextResponse.json(applications);
  }

  // RECRUITER
  if (!jobId) {
    return NextResponse.json({ error: "jobId is required for recruiters" }, { status: 400 });
  }
  const job = await findJobById(jobId, false);
  if (!job || job.recruiterId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const applications = await findRecruiterApplications(jobId);
  return NextResponse.json(applications);
}
