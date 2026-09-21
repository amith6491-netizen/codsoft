"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-20 border-b border-violet-100/80 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-display text-2xl tracking-tight text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 text-sm font-bold text-white shadow-lg shadow-violet-200">
            C
          </span>
          CareerHub
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="text-slate-600 transition hover:text-violet-700">
            Find jobs
          </Link>

          {status === "authenticated" && session.user.role === "RECRUITER" && (
            <>
              <Link href="/post-job" className="text-slate-600 transition hover:text-violet-700">
                Post a job
              </Link>
              <Link href="/dashboard/recruiter" className="text-slate-600 transition hover:text-violet-700">
                Dashboard
              </Link>
            </>
          )}

          {status === "authenticated" && session.user.role === "CANDIDATE" && (
            <Link href="/dashboard/candidate" className="text-slate-600 transition hover:text-violet-700">
              My applications
            </Link>
          )}

          {status === "authenticated" ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 transition hover:text-violet-700">
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02]"
              >
                Join CareerHub
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
