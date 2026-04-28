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
    title: "Pose Puzzle",
    description:
      "Complete the yoga pose by picking the right final step. Test your pose knowledge!",
    href: "/puzzle",
    icon: "🧩",
    color: "bg-[#F0E8DF] border-[#E0D5C8] hover:border-[#C4B5A6]",
    ready: true,
  },
  {
    title: "Desi Ghar Bingo",
    description:
      "9 cheezein. Ek ghar. Kitna desi hai tera ghar? Tap the things you have at home.",
    href: "/tool3",
    icon: "🏠",
    color: "bg-[#FEF3D9] border-[#F5A623] hover:border-[#C47D10]",
    ready: true,
  },
  {
    title: "Coming Soon",
    description: "One more surprise in store. Check back soon!",
    href: "/tool4",
    icon: "🎵",
    color: "bg-[#F0EAE2] border-[#E0D8CE] hover:border-[#C4B5A6]",
    ready: false,
  },
];

export default function Home() {
  return (
    <div className="bg-peach min-h-screen">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-28 pb-16 sm:pt-36 sm:pb-20 text-center">
        <h1 className="font-display text-[2.75rem] sm:text-6xl lg:text-7xl leading-[1.05] text-dark">
          Your Body Has
          <span className="block text-terracotta mt-1">a Story to Tell</span>
        </h1>
        <p className="mt-6 text-lg text-muted max-w-lg mx-auto leading-relaxed">
          Interactive tools to understand your body better. Start with the
          Yoga Age Quiz &mdash; 15 honest questions, one revealing number.
        </p>
        <Link
          href="/quiz"
          className="inline-block mt-8 px-10 py-4 rounded-2xl bg-dark text-white font-medium text-[15px] hover:bg-stone-800 active:scale-[0.98] transition-all"
        >
          Take the Quiz &rarr;
        </Link>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="border-t border-option-border" />
      </div>

      {/* Tools Grid */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <h2 className="font-display text-2xl text-dark mb-8">
          Explore
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
                  Try it &rarr;
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-option-border py-8">
        <p className="text-center text-xs text-muted/60">
          &copy; {new Date().getFullYear()} Yoga Tools. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
