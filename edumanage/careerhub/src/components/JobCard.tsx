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
      className="block border border-ink-100 bg-white p-6 transition hover:border-signal-600"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl text-ink-900">{title}</h3>
          <p className="mt-1 text-sm text-ink-600">
            {company} — {location}
          </p>
        </div>
        <span className="whitespace-nowrap rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-600">
          {typeLabels[type] ?? type}
        </span>
      </div>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.slice(0, 5).map((skill) => (
            <span key={skill} className="bg-ink-50 px-2 py-1 text-xs text-ink-600">
              {skill}
            </span>
          ))}
        </div>
      )}

      {(salaryMin || salaryMax) && (
        <p className="mt-4 text-sm text-moss">
          {salaryMin && salaryMax
            ? `$${salaryMin.toLocaleString()} – $${salaryMax.toLocaleString()}`
            : `From $${(salaryMin ?? salaryMax)!.toLocaleString()}`}
        </p>
      )}
    </Link>
  );
}
