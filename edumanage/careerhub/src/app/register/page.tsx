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
    <div className="mx-auto max-w-sm">
      <h1 className="text-3xl text-ink-900">Create an account</h1>
      <p className="mt-2 text-sm text-ink-600">
        Already have one? <Link href="/login" className="text-signal-600 underline">Sign in</Link>
      </p>

      <div className="mt-6 flex gap-2">
        {(["CANDIDATE", "RECRUITER"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 border px-4 py-2 text-sm ${
              role === r ? "border-ink-900 bg-ink-900 text-parchment" : "border-ink-200 text-ink-600"
            }`}
          >
            {r === "CANDIDATE" ? "I'm job hunting" : "I'm hiring"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm">
          Full name
          <input required value={name} onChange={(e) => setName(e.target.value)} className="border border-ink-200 bg-white px-4 py-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border border-ink-200 bg-white px-4 py-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Password
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="border border-ink-200 bg-white px-4 py-3" />
        </label>

        {role === "RECRUITER" && (
          <label className="grid gap-1 text-sm">
            Company name
            <input required value={company} onChange={(e) => setCompany(e.target.value)} className="border border-ink-200 bg-white px-4 py-3" />
          </label>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="mt-2 bg-signal-600 px-6 py-3 text-white hover:bg-signal-700 disabled:opacity-60">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
