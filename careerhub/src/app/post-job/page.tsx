"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("FULL_TIME");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (status === "authenticated" && session.user.role !== "RECRUITER") {
    return <p className="text-ink-600">Only recruiter accounts can post jobs.</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        location,
        type,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean)
      })
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Could not post the job");
      return;
    }
    router.push(`/jobs/${data.id}`);
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl text-ink-900">Post a job</h1>
      <p className="mt-2 text-sm text-ink-600">It goes live immediately and candidates can start applying.</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        <label className="grid gap-1 text-sm">
          Job title
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="border border-ink-200 bg-white px-4 py-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Description
          <textarea required rows={6} value={description} onChange={(e) => setDescription(e.target.value)} className="border border-ink-200 bg-white px-4 py-3" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm">
            Location
            <input required value={location} onChange={(e) => setLocation(e.target.value)} className="border border-ink-200 bg-white px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm">
            Type
            <select value={type} onChange={(e) => setType(e.target.value)} className="border border-ink-200 bg-white px-4 py-3">
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm">
            Salary min (optional)
            <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} className="border border-ink-200 bg-white px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm">
            Salary max (optional)
            <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} className="border border-ink-200 bg-white px-4 py-3" />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          Skills (comma separated)
          <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, PostgreSQL, Node.js" className="border border-ink-200 bg-white px-4 py-3" />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting} className="mt-2 bg-ink-900 px-6 py-3 text-parchment hover:bg-ink-800 disabled:opacity-60">
          {submitting ? "Publishing…" : "Publish job"}
        </button>
      </form>
    </div>
  );
}
