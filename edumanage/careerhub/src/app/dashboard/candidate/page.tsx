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
    <div>
      <h1 className="text-3xl text-ink-900">My applications</h1>

      <section className="mt-8 border border-ink-100 bg-white p-6">
        <h2 className="text-lg text-ink-900">Default resume</h2>
        <p className="mt-1 text-sm text-ink-600">
          Upload once and reuse it on any application where you don&apos;t attach a fresh copy.
        </p>
        <form onSubmit={handleResumeUpload} className="mt-4 flex flex-wrap items-center gap-3">
          <input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} className="text-sm" />
          <button type="submit" className="bg-ink-900 px-4 py-2 text-sm text-parchment hover:bg-ink-800">
            Save resume
          </button>
          {uploadMessage && <span className="text-sm text-ink-600">{uploadMessage}</span>}
        </form>
      </section>

      <section className="mt-8 grid gap-3">
        {applications.length === 0 && (
          <p className="text-ink-600">
            No applications yet. <Link href="/" className="text-signal-600 underline">Browse open roles</Link>.
          </p>
        )}
        {applications.map((app) => (
          <div key={app.id} className="flex items-center justify-between border border-ink-100 bg-white p-5">
            <div>
              <Link href={`/jobs/${app.job.id}`} className="text-ink-900 hover:text-signal-600">
                {app.job.title}
              </Link>
              <p className="text-sm text-ink-600">{app.job.location}</p>
            </div>
            <span className={`text-sm ${statusColors[app.status] ?? "text-ink-600"}`}>
              {app.status.replace("_", " ")}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
