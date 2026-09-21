"use client";

import { useEffect, useState, useCallback } from "react";
import JobCard from "@/components/JobCard";

type Job = {
  id: string;
  title: string;
  location: string;
  type: string;
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  recruiter: { recruiterProfile: { company: string } | null };
  _count: { applications: number };
};

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    if (type) params.set("type", type);

    const res = await fetch(`/api/jobs?${params.toString()}`);
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }, [q, location, type]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div>
      <section className="border-b border-ink-100 pb-10">
        <h1 className="max-w-2xl text-5xl leading-tight text-ink-900">
          Find the role that fits. Hire the person who fits it.
        </h1>
        <p className="mt-4 max-w-xl text-ink-600">
          CareerHub brings job listings, applications, and hiring pipelines together — one
          place for candidates to apply and recruiters to track every stage.
        </p>
      </section>

      <section className="mt-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchJobs();
          }}
          className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Job title or skill"
            className="border border-ink-200 bg-white px-4 py-3 text-sm"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="border border-ink-200 bg-white px-4 py-3 text-sm"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-ink-200 bg-white px-4 py-3 text-sm"
          >
            <option value="">Any type</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>
          <button type="submit" className="bg-ink-900 px-6 py-3 text-sm text-parchment hover:bg-ink-800">
            Search
          </button>
        </form>
      </section>

      <section className="mt-10 grid gap-4">
        {loading && <p className="text-ink-600">Loading jobs…</p>}
        {!loading && jobs.length === 0 && (
          <p className="text-ink-600">No jobs match that search yet. Try widening it.</p>
        )}
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            title={job.title}
            company={job.recruiter.recruiterProfile?.company ?? "Unknown company"}
            location={job.location}
            type={job.type}
            skills={job.skills}
            salaryMin={job.salaryMin}
            salaryMax={job.salaryMax}
          />
        ))}
      </section>
    </div>
  );
}
