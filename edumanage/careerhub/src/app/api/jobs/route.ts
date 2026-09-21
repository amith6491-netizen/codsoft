import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/jobs?q=&location=&type=      -> public search, OPEN jobs only
// GET /api/jobs?mine=1                  -> the signed-in recruiter's own jobs, any status
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const location = searchParams.get("location")?.trim();
  const type = searchParams.get("type")?.trim();
  const mine = searchParams.get("mine") === "1";

  if (mine) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    const jobs = await prisma.job.findMany({
      where: { recruiterId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } }
    });
    return NextResponse.json(jobs);
  }

  const jobs = await prisma.job.findMany({
    where: {
      status: "OPEN",
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { skills: { hasSome: [q] } }
            ]
          }
        : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      ...(type ? { type: type as never } : {})
    },
    orderBy: { createdAt: "desc" },
    include: {
      recruiter: { include: { recruiterProfile: true } },
      _count: { select: { applications: true } }
    }
  });

  return NextResponse.json(jobs);
}

const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  location: z.string().min(2),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"]),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  skills: z.array(z.string()).default([])
});

// POST /api/jobs -> recruiters only
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Only recruiters can post jobs" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = jobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: { ...parsed.data, recruiterId: session.user.id }
  });

  return NextResponse.json(job, { status: 201 });
}
