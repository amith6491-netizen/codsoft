import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum(["APPLIED", "UNDER_REVIEW", "SHORTLISTED", "REJECTED", "HIRED"])
});

// PATCH /api/applications/:id -> recruiter updates an applicant's status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { job: true }
  });
  if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  if (application.job.recruiterId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const updated = await prisma.application.update({
    where: { id: params.id },
    data: { status: parsed.data.status }
  });
  return NextResponse.json(updated);
}
