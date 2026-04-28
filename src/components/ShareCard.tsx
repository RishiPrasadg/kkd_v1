"use client";

import { useRef } from "react";
import type { Result } from "@/lib/scoring";

const RESULT_GRADIENTS: Record<string, { accent: string; label: string }> = {
  mast: { accent: "#3D7A6B", label: "#2A5C50" },
  chalti: { accent: "#8B6B2A", label: "#6B5020" },
  signals: { accent: "#9E5E4B", label: "#7A4535" },
  badi: { accent: "#7A3010", label: "#5C2008" },
};

const PUNCHY_DIALOGUES: Record<string, string> = {
  mast: "My body is younger than my age. What's yours?",
  chalti: "My body is sending signals. Is yours too?",
  signals: "My body gave me a warning. Time to find out yours.",
  badi: "My body sent a RED alert. Don't ignore yours — find out now.",
};

export default function ShareCard({ result }: { result: Result }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const grad = RESULT_GRADIENTS[result.resultKey] || RESULT_GRADIENTS.chalti;
  const dialogue = PUNCHY_DIALOGUES[result.resultKey] || PUNCHY_DIALOGUES.chalti;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        ref={cardRef}
        className="aspect-square rounded-3xl p-7 flex flex-col overflow-hidden relative shadow-xl"
        style={{
          background:
            "radial-gradient(ellipse at 55% 25%, #D94F2C 0%, #E86B2B 22%, #F5923B 44%, #F9BF7A 65%, #FDE0B8 82%, #FDF3EB 100%)",
        }}
      >
        {/* Top label */}
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 text-center font-medium">
          Yoga Age Result
        </p>

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          {/* Big number */}
          <p className="font-display text-[5.5rem] leading-none text-white drop-shadow-lg">
            {result.yogaAge}
          </p>

          {/* Personality */}
          <p className="text-base font-medium text-white/90 mt-1 tracking-wide">
            {result.emoji} {result.personality}
          </p>

          {/* Tagline */}
          <p className="text-[12px] text-white/70 text-center leading-snug mt-1 max-w-[200px]">
            {result.tagline}
          </p>
        </div>

        {/* Punchy dialogue */}
        <div className="mt-auto">
          <p className="text-[11px] text-stone-700/80 leading-snug text-center mb-3 px-2 italic">
            &ldquo;{dialogue}&rdquo;
          </p>

          {/* CTA */}
          <div className="flex items-center justify-center">
            <span className="font-display text-xs font-bold text-stone-700/80 tracking-wide">
              Find out your Yoga Age →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
