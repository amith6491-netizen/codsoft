import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createUserWithProfile, findUserByEmail } from "@/lib/repository";

const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password needs at least 8 characters"),
  role: z.enum(["CANDIDATE", "RECRUITER"]),
  company: z.string().optional()
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, password, role, company } = parsed.data;

  if (role === "RECRUITER" && !company) {
    return NextResponse.json({ error: "Company name is required for recruiters" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await createUserWithProfile({ name, email: normalizedEmail, passwordHash, role, company });

  return NextResponse.json({ id: user.id, email: user.email, role: user.role }, { status: 201 });
}
