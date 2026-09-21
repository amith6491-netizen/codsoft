import Link from "next/link";

type JobCardProps = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string[];
  salaryMin?: number | null;
  salaryMax?: number | null;
};

const typeLabels: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote"
};

export default function JobCard({ id, title, company, location, type, skills, salaryMin, salaryMax }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${id}`}
      className="job-card glass-card block rounded-[26px] p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-violet-600">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {company}
          </div>
          <h3 className="text-2xl text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">
            {location}
          </p>
        </div>
        <span className="pill-tag whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-violet-700">
          {typeLabels[type] ?? type}
        </span>
      </div>

      {skills.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.slice(0, 5).map((skill) => (
            <span key={skill} className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-violet-100 pt-4">
        {(salaryMin || salaryMax) && (
          <p className="text-sm font-semibold text-emerald-600">
            {salaryMin && salaryMax
              ? `$${salaryMin.toLocaleString()} – $${salaryMax.toLocaleString()}`
              : `From $${(salaryMin ?? salaryMax)!.toLocaleString()}`}
          </p>
        )}
        <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
          View role
        </span>
      </div>
    </Link>
  );
}
