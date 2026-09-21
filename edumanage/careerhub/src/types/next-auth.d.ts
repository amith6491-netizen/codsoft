import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CANDIDATE" | "RECRUITER";
    } & DefaultSession["user"];
  }

  interface User {
    role: "CANDIDATE" | "RECRUITER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CANDIDATE" | "RECRUITER";
  }
}
