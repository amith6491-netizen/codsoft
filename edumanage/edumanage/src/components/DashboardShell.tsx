"use client";

import { useRouter } from "next/navigation";

export default function DashboardShell({
  role,
  name,
  children,
}: {
  role: string;
  name: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="shell">
      <div className="topbar">
        <div>
          <span className="brand">EduManage</span>
          <span className="role-tag">{role}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{name}</span>
          <button className="secondary" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}
