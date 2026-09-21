"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Application = {
  id: string;
  status: string;
  appliedAt: string;
  job: { id: string; title: string; location: string };
};

const statusColors: Record<string, string> = {
  APPLIED: "text-ink-600",
  UNDER_REVIEW: "text-amber-700",
  SHORTLISTED: "text-moss",
  REJECTED: "text-red-600",
  HIRED: "text-moss font-medium"
};

export default function CandidateDashboard() {
  const { status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/applications")
        .then((r) => r.json())
        .then(setApplications);
    }
  }, [status]);

  async function handleResumeUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!resumeFile) return;
    const formData = new FormData();
    formData.set("resume", resumeFile);
    const res = await fetch("/api/upload/resume", { method: "POST", body: formData });
    setUploadMessage(res.ok ? "Resume saved to your profile." : "Could not upload that file.");
  }

  if (status === "loading") return null;
  if (status !== "authenticated") return <p className="text-ink-600">Sign in to see your applications.</p>;

  return (
    <div className="space-y-7 pb-10">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Candidate dashboard</p>
          <h1 className="mt-2 text-4xl text-slate-900">My applications</h1>
        </div>
        <Link href="/" className="primary-btn rounded-full px-5 py-3 text-sm text-white">
          Browse roles
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="metric-card rounded-[1.6rem] p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Submitted</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{applications.length}</p>
        </div>
        <div className="metric-card rounded-[1.6rem] p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">In review</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {applications.filter((a) => a.status === "UNDER_REVIEW" || a.status === "APPLIED").length}
          </p>
        </div>
        <div className="metric-card rounded-[1.6rem] p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Shortlisted</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {applications.filter((a) => a.status === "SHORTLISTED" || a.status === "HIRED").length}
          </p>
        </div>
      </section>

      <section className="search-shell rounded-[1.7rem] p-5">
        <h2 className="text-xl text-slate-900">Default resume</h2>
        <p className="mt-1 text-sm text-slate-600">
          Upload once and reuse it on any application where you don&apos;t attach a fresh copy.
        </p>
        <form onSubmit={handleResumeUpload} className="mt-4 flex flex-wrap items-center gap-3">
          <input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} className="max-w-xs text-sm" />
          <button type="submit" className="primary-btn rounded-full px-5 py-2.5 text-sm text-white">
            Save resume
          </button>
          {uploadMessage && <span className="text-sm text-slate-600">{uploadMessage}</span>}
        </form>
      </section>

      <section className="space-y-3">
        {applications.length === 0 && (
          <p className="rounded-[1.5rem] border border-violet-100 bg-white/80 p-6 text-slate-600">
            No applications yet. <Link href="/" className="font-medium text-violet-700 underline">Browse open roles</Link>.
          </p>
        )}
        {applications.map((app) => (
          <div key={app.id} className="job-card flex items-center justify-between gap-4">
            <div>
              <Link href={`/jobs/${app.job.id}`} className="text-xl font-semibold text-slate-900 hover:text-violet-700">
                {app.job.title}
              </Link>
              <p className="mt-1 text-sm text-slate-600">{app.job.location}</p>
            </div>
            <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${statusColors[app.status] ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>
              {app.status.replace("_", " ")}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
