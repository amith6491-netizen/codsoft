"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">("CANDIDATE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, company })
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push(role === "RECRUITER" ? "/dashboard/recruiter" : "/dashboard/candidate");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center px-4 py-12">
      <div className="grid w-full overflow-hidden rounded-[32px] border border-violet-100 bg-white/70 shadow-[0_30px_80px_rgba(79,55,160,0.12)] backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">
              Join now
            </div>
            <h1 className="text-4xl font-semibold leading-tight">Build your next chapter with CareerHub.</h1>
          </div>
          <div className="space-y-4 text-sm text-violet-100">
            <p>Whether you are looking for the next role or hiring the right talent, CareerHub keeps it fast and focused.</p>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-2xl font-bold text-white">12k+</div>
                <div>Profiles</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-2xl font-bold text-white">4.9/5</div>
                <div>Reviews</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-7 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Create account</p>
            <h2 className="mt-2 text-3xl text-slate-900">Get started</h2>
          </div>

          <p className="mb-6 text-sm text-slate-600">
            Already have an account? <Link href="/login" className="font-medium text-violet-700 underline decoration-violet-300 underline-offset-4">Sign in</Link>
          </p>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-violet-100 bg-violet-50 p-1.5">
            {(["CANDIDATE", "RECRUITER"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                  role === r ? "bg-white text-violet-700 shadow-sm" : "text-slate-600"
                }`}
              >
                {r === "CANDIDATE" ? "I’m job hunting" : "I’m hiring"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Full name
              <input required value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Password
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
            </label>

            {role === "RECRUITER" && (
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Company name
                <input required value={company} onChange={(e) => setCompany(e.target.value)} className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
              </label>
            )}

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="primary-btn mt-2 rounded-2xl px-6 py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
