import Link from "next/link";

const tools = [
  {
    title: "Yoga Age Quiz",
    description:
      "15 body-awareness questions to reveal your true Yoga Age. Takes under 90 seconds.",
    href: "/quiz",
    icon: "🧘",
    color: "bg-[#F5E6DA] border-[#E8D5C4] hover:border-terracotta",
    ready: true,
  },
  {
    title: "Spin & Hit",
    description:
      "The wheel is spinning with healthy & junk food — tap at the right moment to score big!",
    href: "/puzzle",
    icon: "🎯",
    color: "bg-[#F0E8DF] border-[#E0D5C8] hover:border-[#C4B5A6]",
    ready: true,
  },
  {
    title: "How Desi Is Your Household?",
    description:
      "9 things. One house. Tap everything that's in your home and find out your Desi score.",
    href: "/tool3",
    icon: "🏠",
    color: "bg-[#FFFFE0] border-[#E8C84A] hover:border-[#C47D10]",
    ready: true,
  },
  {
    title: "Mother's Day Card",
    description:
      "Create a beautiful, personal card for her — watercolour art, handwritten poem, ready to share on WhatsApp.",
    href: "/tool4",
    icon: "🌸",
    color: "bg-[#FFF0F3] border-[#F5C6D0] hover:border-[#E8A0A0]",
    ready: true,
  },
];

export default function Home() {
  return (
    <div className="bg-peach min-h-screen">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-28 pb-16 sm:pt-36 sm:pb-20 text-center">
        <h1 className="font-display text-[2.75rem] sm:text-6xl lg:text-7xl leading-[1.05] text-dark">
          You&apos;re at the
          <span className="block text-terracotta mt-1">Right Place</span>
        </h1>
        <p className="mt-6 text-lg text-muted max-w-lg mx-auto leading-relaxed">
          Quick, fun games to take a break. Play one, play all &mdash; no sign-ups, just vibes.
        </p>
        <Link
          href="/quiz"
          className="inline-block mt-8 px-10 py-4 rounded-2xl bg-dark text-white font-medium text-[15px] hover:bg-stone-800 active:scale-[0.98] transition-all"
        >
          Start Playing &rarr;
        </Link>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="border-t border-option-border" />
      </div>

      {/* Games Grid */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <h2 className="font-display text-2xl text-dark mb-8">
          Pick a Game
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group block rounded-2xl border p-6 transition-all duration-200 ${tool.color} ${
                !tool.ready ? "opacity-50" : ""
              }`}
            >
              <div className="text-2xl mb-3">{tool.icon}</div>
              <h3 className="text-base font-medium text-dark group-hover:text-terracotta transition">
                {tool.title}
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {tool.description}
              </p>
              {tool.ready && (
                <span className="inline-block mt-3 text-sm font-medium text-terracotta">
                  Play now &rarr;
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-option-border py-8">
        <p className="text-center text-xs text-muted/60">
          &copy; {new Date().getFullYear()} PlayBreak. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
