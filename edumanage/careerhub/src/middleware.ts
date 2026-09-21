import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/post-job") && role !== "RECRUITER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (path.startsWith("/dashboard/recruiter") && role !== "RECRUITER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (path.startsWith("/dashboard/candidate") && role !== "CANDIDATE") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  { pages: { signIn: "/login" } }
);

export const config = {
  matcher: ["/post-job/:path*", "/dashboard/:path*", "/jobs/:path*/applicants"]
};
