"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-ink-100 bg-parchment/90 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink-900">
          CareerHub
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-ink-600 hover:text-ink-900">
            Find jobs
          </Link>

          {status === "authenticated" && session.user.role === "RECRUITER" && (
            <>
              <Link href="/post-job" className="text-ink-600 hover:text-ink-900">
                Post a job
              </Link>
              <Link href="/dashboard/recruiter" className="text-ink-600 hover:text-ink-900">
                Dashboard
              </Link>
            </>
          )}

          {status === "authenticated" && session.user.role === "CANDIDATE" && (
            <Link href="/dashboard/candidate" className="text-ink-600 hover:text-ink-900">
              My applications
            </Link>
          )}

          {status === "authenticated" ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full bg-ink-900 px-4 py-2 text-parchment hover:bg-ink-800"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link href="/login" className="text-ink-600 hover:text-ink-900">
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-signal-600 px-4 py-2 text-white hover:bg-signal-700"
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
