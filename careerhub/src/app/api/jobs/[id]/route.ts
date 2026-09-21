import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteJob, findJobById, findRawJob, updateJob } from "@/lib/repository";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const job = await findJobById(params.id, false);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const job = await findRawJob(params.id);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (!session || session.user.id !== job.recruiterId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const updated = await updateJob(params.id, body);
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const job = await findRawJob(params.id);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (!session || session.user.id !== job.recruiterId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await deleteJob(params.id);
  return NextResponse.json({ success: true });
}
