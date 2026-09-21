"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  recruiter: { name: string; recruiterProfile: { company: string; companyWebsite: string | null } | null };
};

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const [job, setJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then((r) => r.json())
      .then(setJob);
  }, [params.id]);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const formData = new FormData();
    formData.set("coverLetter", coverLetter);
    if (resume) formData.set("resume", resume);

    const res = await fetch(`/api/jobs/${params.id}/apply`, { method: "POST", body: formData });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setMessage(data.error ?? "Could not submit application");
      return;
    }
    setMessage("Application submitted. Good luck!");
  }

  if (!job) return <p className="text-ink-600">Loading job…</p>;

  return (
    <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
      <article>
        <h1 className="text-4xl text-ink-900">{job.title}</h1>
        <p className="mt-2 text-ink-600">
          {job.recruiter.recruiterProfile?.company ?? job.recruiter.name} — {job.location}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span key={skill} className="bg-ink-50 px-2 py-1 text-xs text-ink-600">
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-8 whitespace-pre-wrap leading-relaxed text-ink-800">{job.description}</p>
      </article>

      <aside className="h-fit border border-ink-100 bg-white p-6">
        <h2 className="text-lg text-ink-900">Apply for this role</h2>

        {status !== "authenticated" && (
          <p className="mt-3 text-sm text-ink-600">
            <Link href="/login" className="text-signal-600 underline">Sign in</Link> as a candidate to apply.
          </p>
        )}

        {status === "authenticated" && session.user.role === "RECRUITER" && (
          <p className="mt-3 text-sm text-ink-600">Recruiter accounts can&apos;t apply to jobs.</p>
        )}

        {status === "authenticated" && session.user.role === "CANDIDATE" && (
          <form onSubmit={handleApply} className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm">
              Resume (PDF)
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                className="text-sm"
              />
              <span className="text-xs text-ink-400">
                Leave blank to use the resume already on your profile.
              </span>
            </label>
            <label className="grid gap-1 text-sm">
              Cover letter (optional)
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
                className="border border-ink-200 bg-white px-3 py-2 text-sm"
              />
            </label>
            <button type="submit" disabled={submitting} className="bg-signal-600 px-4 py-3 text-white hover:bg-signal-700 disabled:opacity-60">
              {submitting ? "Submitting…" : "Submit application"}
            </button>
            {message && <p className="text-sm text-ink-700">{message}</p>}
          </form>
        )}
      </aside>
    </div>
  );
}
