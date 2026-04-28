import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const heading = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "700",
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Yoga Age Quiz",
  description:
    "Discover your Yoga Age with 5 body-awareness questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
          <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-display text-lg font-bold text-stone-800 tracking-tight"
            >
              Yoga Tools
            </Link>
            <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-stone-500">
              <Link href="/quiz" className="hover:text-stone-800 transition">
                Yoga Age Quiz
              </Link>
              <Link href="/puzzle" className="hover:text-stone-800 transition">
                Pose Puzzle
              </Link>
              <Link href="/tool3" className="hover:text-stone-800 transition">
                Desi Ghar Bingo
              </Link>
              <Link href="/tool4" className="hover:text-stone-800 transition">
                Flip a Card
              </Link>
            </div>
            <MobileMenu />
          </nav>
        </header>

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

function MobileMenu() {
  return (
    <div className="sm:hidden">
      <details className="relative">
        <summary className="list-none cursor-pointer p-2">
          <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </summary>
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50">
          <Link href="/quiz" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">Yoga Age Quiz</Link>
          <Link href="/puzzle" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">Pose Puzzle</Link>
          <Link href="/tool3" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">Desi Ghar Bingo</Link>
          <Link href="/tool4" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">Flip a Card</Link>
        </div>
      </details>
    </div>
  );
}
