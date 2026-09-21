"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Applicant = {
  id: string;
  status: string;
  resumeUrl: string;
  resumeName: string | null;
  coverLetter: string | null;
  appliedAt: string;
  candidate: {
    name: string;
    email: string;
    candidateProfile: { headline: string | null; location: string | null; skills: string[] } | null;
  };
};

const statuses = ["APPLIED", "UNDER_REVIEW", "SHORTLISTED", "REJECTED", "HIRED"] as const;

export default function ApplicantsPage({ params }: { params: { id: string } }) {
  const { status } = useSession();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch(`/api/jobs/${params.id}`).then((r) => r.json()).then((j) => setJobTitle(j.title));
    fetch(`/api/applications?jobId=${params.id}`)
      .then((r) => r.json())
      .then(setApplicants);
  }, [status, params.id]);

  async function updateStatus(applicationId: string, newStatus: string) {
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      setApplicants((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a)));
    }
  }

  if (status === "loading") return null;
  if (status !== "authenticated") return <p className="text-ink-600">Sign in as the recruiter who posted this job.</p>;

  return (
    <div>
      <h1 className="text-3xl text-ink-900">Applicants{jobTitle ? ` — ${jobTitle}` : ""}</h1>

      <section className="mt-8 grid gap-4">
        {applicants.length === 0 && <p className="text-ink-600">No applicants yet.</p>}
        {applicants.map((a) => (
          <div key={a.id} className="border border-ink-100 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-ink-900">{a.candidate.name}</p>
                <p className="text-sm text-ink-600">{a.candidate.email}</p>
                {a.candidate.candidateProfile?.headline && (
                  <p className="mt-1 text-sm text-ink-600">{a.candidate.candidateProfile.headline}</p>
                )}
              </div>
              <select
                value={a.status}
                onChange={(e) => updateStatus(a.id, e.target.value)}
                className="border border-ink-200 bg-white px-3 py-2 text-sm"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {a.coverLetter && <p className="mt-3 whitespace-pre-wrap text-sm text-ink-700">{a.coverLetter}</p>}

            <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-signal-600 underline">
              View resume{a.resumeName ? ` (${a.resumeName})` : ""}
            </a>
          </div>
        ))}
      </section>
    </div>
  );
}
