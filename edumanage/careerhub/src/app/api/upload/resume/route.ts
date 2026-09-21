import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveResume } from "@/lib/storage";

// POST /api/upload/resume -> saves/replaces the resume on the candidate's profile
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CANDIDATE") {
    return NextResponse.json({ error: "Only candidates have resumes" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("resume");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Attach a resume file" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Resumes must be a PDF" }, { status: 400 });
  }

  const stored = await saveResume(file, session.user.id);

  const profile = await prisma.candidateProfile.upsert({
    where: { userId: session.user.id },
    update: { resumeUrl: stored.url, resumeName: file.name },
    create: { userId: session.user.id, resumeUrl: stored.url, resumeName: file.name }
  });

  return NextResponse.json(profile);
}
