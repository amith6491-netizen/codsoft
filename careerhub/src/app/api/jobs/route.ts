import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createJob, findJobs } from "@/lib/repository";

// GET /api/jobs?q=&location=&type=      -> public search, OPEN jobs only
// GET /api/jobs?mine=1                  -> the signed-in recruiter's own jobs, any status
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim();
    const location = searchParams.get("location")?.trim();
    const type = searchParams.get("type")?.trim();
    const mine = searchParams.get("mine") === "1";

    if (mine) {
      const session = await getServerSession(authOptions);

      if (!session || session.user.role !== "RECRUITER") {
        return NextResponse.json(
          { error: "Not authorized" },
          { status: 403 }
        );
      }

      const jobs = await findJobs({ recruiterId: session.user.id });

      return NextResponse.json(jobs);
    }

    const jobs = await findJobs({ q, location, type });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("GET /api/jobs error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch jobs",
        details:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "RECRUITER") return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  const body = await req.json();
  const job = await createJob({
    recruiterId: session.user.id,
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    location: String(body.location || "").trim(),
    type: String(body.type || "FULL_TIME"),
    salaryMin: body.salaryMin == null ? null : Number(body.salaryMin),
    salaryMax: body.salaryMax == null ? null : Number(body.salaryMax),
    skills: Array.isArray(body.skills) ? body.skills.map(String) : [],
    status: "OPEN"
  });
  if (!job.title || !job.description || !job.location) return NextResponse.json({ error: "Title, description, and location are required" }, { status: 400 });
  return NextResponse.json(job, { status: 201 });
}