"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  location: string;
  status: string;
  createdAt: string;
  _count: { applications: number };
};

export default function RecruiterDashboard() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/jobs?mine=1")
        .then((r) => r.json())
        .then(setJobs);
    }
  }, [status]);

  if (status === "loading") return null;
  if (status !== "authenticated" || session.user.role !== "RECRUITER") {
    return <p className="text-ink-600">Sign in with a recruiter account to see your dashboard.</p>;
  }

  return (
    <div className="space-y-7 pb-10">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Recruiter dashboard</p>
          <h1 className="mt-2 text-4xl text-slate-900">Your job posts</h1>
        </div>
        <Link href="/post-job" className="primary-btn rounded-full px-5 py-3 text-sm text-white">
          Post a job
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="metric-card rounded-[1.6rem] p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Open roles</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{jobs.filter((j) => j.status === "OPEN").length}</p>
        </div>
        <div className="metric-card rounded-[1.6rem] p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Total applicants</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{jobs.reduce((sum, j) => sum + j._count.applications, 0)}</p>
        </div>
        <div className="metric-card rounded-[1.6rem] p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Live jobs</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{jobs.length}</p>
        </div>
      </section>

      <section className="space-y-3">
        {jobs.length === 0 && (
          <p className="rounded-[1.5rem] border border-violet-100 bg-white/80 p-6 text-slate-600">
            You haven&apos;t posted a job yet.
          </p>
        )}
        {jobs.map((job) => (
          <div key={job.id} className="job-card flex items-center justify-between gap-4">
            <div>
              <Link href={`/jobs/${job.id}`} className="text-xl font-semibold text-slate-900 hover:text-violet-700">
                {job.title}
              </Link>
              <p className="mt-1 text-sm text-slate-600">{job.location} — {job.status}</p>
            </div>
            <Link href={`/jobs/${job.id}/applicants`} className="rounded-full bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700">
              {job._count.applications} applicant{job._count.applications === 1 ? "" : "s"}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
