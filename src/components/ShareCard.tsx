"use client";

import { useRef } from "react";
import type { Result } from "@/lib/scoring";
import { ResultMascot } from "./illustrations/Character";

const RESULT_GRADIENTS: Record<string, { from: string; to: string; accent: string }> = {
  mast: { from: "#E8EFE6", to: "#D4E4D0", accent: "#5B8F8F" },
  chalti: { from: "#F2E8DC", to: "#E8DCC8", accent: "#C4A24E" },
  signals: { from: "#F0E4D4", to: "#E4CEBF", accent: "#B8705A" },
  badi: { from: "#EEDDD0", to: "#DEC8B4", accent: "#8B4513" },
};

const PUNCHY_DIALOGUES: Record<string, string> = {
  mast: "Mera toh Yoga Age kam nikla! Tera kitna aayega? Check kar na!",
  chalti: "Body bol rahi hai kuch... Tera bhi sun le. Apna Yoga Age check kar!",
  signals: "Meri body ne warning di hai bhai. Tu bhi check karle apna Yoga Age!",
  badi: "Yaar meri body ne RED alert de diya! Tu bhi check kar — dar mat.",
};

export default function ShareCard({ result }: { result: Result }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const grad = RESULT_GRADIENTS[result.resultKey] || RESULT_GRADIENTS.chalti;
  const dialogue = PUNCHY_DIALOGUES[result.resultKey] || PUNCHY_DIALOGUES.chalti;

  return (
    <div className="w-full max-w-xs mx-auto">
      <div
        ref={cardRef}
        className="aspect-square rounded-2xl p-5 flex flex-col overflow-hidden relative"
        style={{
          background: `linear-gradient(145deg, ${grad.from}, ${grad.to})`,
        }}
      >
        {/* Top label */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted/60 text-center">
          Yoga Age Result
        </p>

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          {/* Mascot */}
          <ResultMascot resultKey={result.resultKey} />

          {/* Big number */}
          <p
            className="font-display text-6xl leading-none mt-1"
            style={{ color: grad.accent }}
          >
            {result.yogaAge}
          </p>

          {/* Personality */}
          <p className="text-sm font-medium text-dark/80 mt-1">
            {result.emoji} {result.personality}
          </p>
        </div>

        {/* Punchy dialogue */}
        <div className="mt-auto">
          <p className="text-[11px] text-dark/70 leading-snug text-center mb-3 px-2">
            &ldquo;{dialogue}&rdquo;
          </p>

          {/* Branding */}
          <div className="flex items-center justify-center gap-1.5">
            <span
              className="font-display text-xs font-bold"
              style={{ color: grad.accent }}
            >
              Yoga Age Quiz
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
