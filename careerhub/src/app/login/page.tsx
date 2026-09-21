"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("Email or password is incorrect");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center px-4 py-12">
      <div className="grid w-full overflow-hidden rounded-[32px] border border-violet-100 bg-white/70 shadow-[0_30px_80px_rgba(79,55,160,0.12)] backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">
              Welcome back
            </div>
            <h1 className="text-4xl font-semibold leading-tight">Start hiring smarter.</h1>
          </div>
          <div className="space-y-4 text-sm text-violet-100">
            <p>Over 1.2k active companies are already in the CareerHub network.</p>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-2xl font-bold text-white">48h</div>
                <div>Avg. shortlist</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-2xl font-bold text-white">92%</div>
                <div>Good fit rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-7 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Sign in</p>
            <h2 className="mt-2 text-3xl text-slate-900">Welcome back</h2>
          </div>

          <p className="mb-6 text-sm text-slate-600">
            New here? <Link href="/register" className="font-medium text-violet-700 underline decoration-violet-300 underline-offset-4">Create an account</Link>
          </p>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="primary-btn mt-2 rounded-2xl px-6 py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
