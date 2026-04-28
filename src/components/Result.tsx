"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import type { Result as ResultType } from "@/lib/scoring";
import BodySilhouette from "./BodySilhouette";
import ShareCard from "./ShareCard";
import ShareButtons from "./ShareButtons";
// Per-result dramatic theming
const RESULT_THEMES: Record<
  string,
  { bg: string; accent: string; glow: string; numberColor: string }
> = {
  mast: {
    bg: "#E8EFE6",
    accent: "#5B8F8F",
    glow: "rgba(91,143,143,0.15)",
    numberColor: "#3D6B6B",
  },
  chalti: {
    bg: "#F2E8DC",
    accent: "#C4A24E",
    glow: "rgba(196,162,78,0.15)",
    numberColor: "#8B7230",
  },
  signals: {
    bg: "#F0E4D4",
    accent: "#B8705A",
    glow: "rgba(184,112,90,0.15)",
    numberColor: "#9E5E4B",
  },
  badi: {
    bg: "#EEDDD0",
    accent: "#8B4513",
    glow: "rgba(139,69,19,0.12)",
    numberColor: "#6B3410",
  },
};

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    }
    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value]);

  return <>{display}</>;
}

export default function Result({
  result,
  userName,
  realAge,
}: {
  result: ResultType;
  userName: string;
  realAge: number;
}) {
  const [insight, setInsight] = useState<string | null>(null);
  const theme = RESULT_THEMES[result.resultKey] || RESULT_THEMES.chalti;

  // Fetch AI insight
  useEffect(() => {
    fetch("/api/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age: realAge,
        yogaAge: result.yogaAge,
        resultName: result.personality,
      }),
    })
      .then((r) => r.json())
      .then((d) => setInsight(d.insight))
      .catch(() =>
        setInsight(
          `Your body has a story at ${realAge}. Time to listen to it.\nStart with just 5 minutes of stretching tonight.`
        )
      );
  }, [realAge, result.yogaAge, result.personality]);

  const insightLines = insight?.split("\n").filter(Boolean) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[100dvh] flex flex-col items-center px-5 py-16 sm:py-20"
      style={{ backgroundColor: theme.bg }}
    >
      <div className="w-full max-w-md">
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-base text-muted mb-6"
        >
          {userName}, your result is in
        </motion.p>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs uppercase tracking-[0.25em] text-muted mb-3"
        >
          Your Yoga Age is...
        </motion.p>

        {/* Giant Yoga Age number with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            type: "spring",
            bounce: 0.4,
          }}
          className="text-center mb-2 relative"
        >
          {/* Glow effect behind number */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-60"
            style={{ backgroundColor: theme.glow }}
          />
          <span
            className="font-display text-[7rem] sm:text-[9rem] leading-none block relative"
            style={{ color: theme.numberColor }}
          >
            <AnimatedNumber value={result.yogaAge} />
          </span>
        </motion.div>

        {/* Real vs Yoga age */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center text-sm text-muted mb-10"
        >
          Real age: {realAge} &rarr; Yoga age: {result.yogaAge}
        </motion.p>

        {/* Personality */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          className="text-center mb-8"
        >
          <p className="text-3xl mb-2">{result.emoji}</p>
          <p
            className="font-display text-2xl"
            style={{ color: theme.accent }}
          >
            {result.personality}
          </p>
          <p className="mt-3 text-sm text-muted leading-relaxed max-w-xs mx-auto">
            {result.tagline}
          </p>
        </motion.div>

        {/* AI Insight card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="rounded-2xl border p-6 mb-8"
          style={{
            backgroundColor: "rgba(255,255,255,0.7)",
            borderColor: theme.accent + "30",
          }}
        >
          {insight === null ? (
            <div className="flex items-center justify-center gap-2 py-2">
              <div
                className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: theme.accent, borderTopColor: "transparent" }}
              />
              <span className="text-sm text-muted">
                Generating your insight...
              </span>
            </div>
          ) : (
            <>
              {insightLines[0] && (
                <p className="text-[15px] text-dark leading-relaxed mb-3">
                  {insightLines[0]}
                </p>
              )}
              {insightLines[1] && (
                <p
                  className="text-[15px] font-medium leading-relaxed"
                  style={{ color: theme.accent }}
                >
                  {insightLines[1]}
                </p>
              )}
              {insightLines.length <= 1 && insight && (
                <p className="text-[15px] text-dark leading-relaxed">
                  {insight}
                </p>
              )}
            </>
          )}
        </motion.div>

        {/* Body Silhouette */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4 }}
          className="mb-8"
        >
          <BodySilhouette resultKey={result.resultKey} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6 }}
          className="space-y-6"
        >
          <a
            href="/quiz"
            className="block w-full py-4 rounded-2xl text-white font-medium text-[15px] hover:opacity-90 active:scale-[0.98] transition-all text-center min-h-[48px]"
            style={{ backgroundColor: theme.accent }}
          >
            Try another game &rarr;
          </a>

          {/* Shareable Card Preview */}
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted text-center mb-4">
              Share your result
            </p>
            <ShareCard result={result} />
          </div>

          <ShareButtons yogaAge={result.yogaAge} />
        </motion.div>
      </div>
    </motion.div>
  );
}
