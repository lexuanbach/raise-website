import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAISE Research Group",
  description: "Reasoning in Artificial Intelligence and Software Engineering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`} suppressHydrationWarning>
        <header className="site-header">
          <div className="container nav-shell">
            <Link href="/" className="brand">
              <span className="brand-mark">RAISE</span>
              <span className="brand-subtitle">
                Research Group
              </span>
            </Link>

            <nav className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/members">Members</Link>
              <Link href="/research">Research</Link>
              <Link href="/publications">Publications</Link>
              <Link href="/news">News</Link>
              <Link href="/events">Events</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="container footer-shell">
            <div>
              <strong>RAISE Research Group</strong>
              <p>Reasoning in Artificial Intelligence and Software Engineering</p>
            </div>
            <div className="footer-links">
              <Link href="/members">Members</Link>
              <Link href="/publications">Publications</Link>
              <Link href="/news">News</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}