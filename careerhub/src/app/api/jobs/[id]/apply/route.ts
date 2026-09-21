import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createApplication, findApplicationByPair, findCandidateProfile, findRawJob } from "@/lib/repository";
import { saveResume } from "@/lib/storage";

// POST /api/jobs/:id/apply  (multipart/form-data: resume file + optional coverLetter)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CANDIDATE") {
    return NextResponse.json({ error: "Only candidates can apply to jobs" }, { status: 403 });
  }

  const job = await findRawJob(params.id);
  if (!job || job.status !== "OPEN") {
    return NextResponse.json({ error: "This job is not accepting applications" }, { status: 400 });
  }

  const alreadyApplied = await findApplicationByPair(params.id, session.user.id);
  if (alreadyApplied) {
    return NextResponse.json({ error: "You already applied to this job" }, { status: 409 });
  }

  const formData = await req.formData();
  const coverLetter = formData.get("coverLetter")?.toString() ?? "";
  const resumeFile = formData.get("resume");

  let resumeUrl: string;
  let resumeName: string | undefined;

  if (resumeFile instanceof File && resumeFile.size > 0) {
    const stored = await saveResume(resumeFile, session.user.id);
    resumeUrl = stored.url;
    resumeName = stored.fileName;
  } else {
    // Fall back to the resume already on the candidate's profile, if any.
    const profile = await findCandidateProfile(session.user.id);
    if (!profile?.resumeUrl) {
      return NextResponse.json({ error: "Attach a resume or upload one to your profile first" }, { status: 400 });
    }
    resumeUrl = profile.resumeUrl;
    resumeName = profile.resumeName ?? undefined;
  }

  const application = await createApplication({ jobId: params.id, candidateId: session.user.id, resumeUrl, resumeName, coverLetter });

  return NextResponse.json(application, { status: 201 });
}
