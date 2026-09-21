import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CareerHub — Job listings, applications, and hiring in one place",
  description:
    "CareerHub connects candidates and recruiters: search jobs, apply with a resume, and track every application from one dashboard."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
