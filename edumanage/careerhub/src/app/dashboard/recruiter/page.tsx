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
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-ink-900">Your job posts</h1>
        <Link href="/post-job" className="bg-signal-600 px-4 py-2 text-sm text-white hover:bg-signal-700">
          Post a job
        </Link>
      </div>

      <section className="mt-8 grid gap-3">
        {jobs.length === 0 && <p className="text-ink-600">You haven&apos;t posted a job yet.</p>}
        {jobs.map((job) => (
          <div key={job.id} className="flex items-center justify-between border border-ink-100 bg-white p-5">
            <div>
              <Link href={`/jobs/${job.id}`} className="text-ink-900 hover:text-signal-600">
                {job.title}
              </Link>
              <p className="text-sm text-ink-600">{job.location} — {job.status}</p>
            </div>
            <Link href={`/jobs/${job.id}/applicants`} className="text-sm text-signal-600 underline">
              {job._count.applications} applicant{job._count.applications === 1 ? "" : "s"}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
