import Link from "next/link";

export default function HomePage() {
  return (
    <div className="login-wrap">
      <div className="login-card" style={{ maxWidth: 460, textAlign: "center" }}>
        <h1>EduManage</h1>
        <p className="tagline">
          One record for every student, teacher, and administrator — attendance, exams, and
          fees, kept in one place.
        </p>
        <Link href="/login" className="btn" style={{ display: "inline-block" }}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
