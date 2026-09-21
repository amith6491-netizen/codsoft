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
    <div className="space-y-8 pb-12">
      <section className="hero-panel relative overflow-hidden rounded-[32px] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(124,77,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(78,199,255,0.2),_transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="pill-tag inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-violet-700">
              CareerHub hiring platform
            </span>
            <h1 className="mt-5 max-w-xl text-4xl leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find the role that fits. Hire the person who fits it.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              CareerHub brings job listings, applications, and hiring pipelines together — one
              place for candidates to apply and recruiters to track every stage.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className="primary-btn rounded-full px-5 py-3 text-sm font-medium text-white transition hover:scale-[1.02]">
                Explore jobs
              </button>
              <button type="button" className="secondary-btn rounded-full px-5 py-3 text-sm font-medium text-violet-700 transition hover:scale-[1.02]">
                Post a role
              </button>
            </div>
          </div>

          <div className="soft-ring grid gap-4 rounded-[28px] border border-violet-100 bg-white/65 p-5 backdrop-blur-sm">
            {[
              { label: "Open roles", value: "124", accent: "from-violet-500 to-indigo-600" },
              { label: "Remote-ready", value: "68%", accent: "from-sky-500 to-cyan-500" },
              { label: "Time to hire", value: "11 days", accent: "from-emerald-500 to-teal-500" },
            ].map((stat, index) => (
              <div key={stat.label} className="metric-card rounded-2xl border border-violet-100 bg-white/80 p-4 shadow-sm">
                <div className={`mb-3 h-2 w-20 rounded-full bg-gradient-to-r ${stat.accent}`} />
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700">
                    +{index + 8}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { title: "Smart matching", text: "AI-guided filters surface opportunities with the right skill fit and faster relevance." },
          { title: "Fast hiring", text: "Streamlined applications and recruiter dashboards reduce time to shortlist and respond." },
          { title: "Built for scale", text: "From startups to global teams, CareerHub keeps recruiting operations transparent and organized." },
        ].map((feature) => (
          <article key={feature.title} className="feature-card">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-sky-500/15 text-sm font-bold text-violet-700">
              ✓
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>

      <section className="search-shell rounded-[28px] p-4 sm:p-5">
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
            className="rounded-2xl border border-violet-100 bg-white/90 px-4 py-3 text-sm shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="rounded-2xl border border-violet-100 bg-white/90 px-4 py-3 text-sm shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-2xl border border-violet-100 bg-white/90 px-4 py-3 text-sm shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          >
            <option value="">Any type</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>
          <button type="submit" className="primary-btn rounded-2xl px-6 py-3 text-sm font-medium text-white transition hover:scale-[1.01]">
            Search
          </button>
        </form>
      </section>

      <section className="pt-2">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl text-slate-900">Featured jobs</h2>
          <span className="rounded-full border border-violet-200 bg-white/60 px-3 py-1 text-xs uppercase tracking-[0.15em] text-violet-700">
            {loading ? "Loading" : `${jobs.length} roles`}
          </span>
        </div>

        <div className="grid gap-4">
          {loading && <p className="rounded-2xl border border-violet-100 bg-white/70 p-6 text-slate-600">Loading jobs…</p>}
          {!loading && jobs.length === 0 && (
            <p className="rounded-2xl border border-violet-100 bg-white/70 p-6 text-slate-600">No jobs match that search yet. Try widening it.</p>
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
        </div>
      </section>
    </div>
  );
}
