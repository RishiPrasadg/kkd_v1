"use client";

import { motion } from "framer-motion";
import type { ResultKey } from "@/lib/scoring";

// Areas that glow based on result severity
const PROBLEM_AREAS: Record<ResultKey, string[]> = {
  mast: [],
  chalti: ["shoulders"],
  signals: ["shoulders", "back", "knees"],
  badi: ["shoulders", "back", "knees", "neck", "chest"],
};

export default function BodySilhouette({ resultKey }: { resultKey: ResultKey }) {
  const problems = PROBLEM_AREAS[resultKey];

  const glowColor = "#C4622D";
  const neutralColor = "#D4CEC4";

  function areaColor(area: string) {
    return problems.includes(area) ? glowColor : neutralColor;
  }

  function areaGlow(area: string) {
    if (!problems.includes(area)) return null;
    return (
      <motion.circle
        r="18"
        fill={glowColor}
        opacity={0.15}
        animate={{ r: [18, 25, 18], opacity: [0.15, 0.05, 0.15] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  return (
    <div className="w-36 h-56 sm:w-44 sm:h-64 mx-auto">
      <svg viewBox="0 0 120 200" fill="none" className="w-full h-full">
        {/* Head */}
        <circle cx="60" cy="22" r="16" fill={neutralColor} />

        {/* Neck */}
        <g transform="translate(60, 42)">
          {areaGlow("neck")}
          <rect x="-5" y="-4" width="10" height="12" rx="3" fill={areaColor("neck")} />
        </g>

        {/* Shoulders */}
        <g transform="translate(35, 55)">
          {areaGlow("shoulders")}
        </g>
        <g transform="translate(85, 55)">
          {areaGlow("shoulders")}
        </g>

        {/* Torso */}
        <path
          d="M38 50 L82 50 L78 120 L42 120 Z"
          fill={neutralColor}
          rx="4"
        />

        {/* Back overlay */}
        <g transform="translate(60, 85)">
          {areaGlow("back")}
          {problems.includes("back") && (
            <rect x="-12" y="-25" width="24" height="50" rx="6" fill={glowColor} opacity={0.2} />
          )}
        </g>

        {/* Chest/breath */}
        <g transform="translate(60, 70)">
          {areaGlow("chest")}
          {problems.includes("chest") && (
            <motion.ellipse
              cx="0" cy="0" rx="14" ry="10"
              fill={glowColor} opacity={0.15}
              animate={{ ry: [10, 14, 10], opacity: [0.15, 0.08, 0.15] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          )}
        </g>

        {/* Arms */}
        <path d="M38 52 L20 110" stroke={neutralColor} strokeWidth="10" strokeLinecap="round" />
        <path d="M82 52 L100 110" stroke={neutralColor} strokeWidth="10" strokeLinecap="round" />

        {/* Shoulder highlights */}
        {problems.includes("shoulders") && (
          <>
            <circle cx="38" cy="52" r="6" fill={glowColor} opacity={0.3} />
            <circle cx="82" cy="52" r="6" fill={glowColor} opacity={0.3} />
          </>
        )}

        {/* Legs */}
        <path d="M48 120 L44 175" stroke={neutralColor} strokeWidth="12" strokeLinecap="round" />
        <path d="M72 120 L76 175" stroke={neutralColor} strokeWidth="12" strokeLinecap="round" />

        {/* Knees */}
        <g transform="translate(45, 155)">
          {areaGlow("knees")}
          {problems.includes("knees") && (
            <circle cx="0" cy="0" r="5" fill={glowColor} opacity={0.35} />
          )}
        </g>
        <g transform="translate(75, 155)">
          {areaGlow("knees")}
          {problems.includes("knees") && (
            <circle cx="0" cy="0" r="5" fill={glowColor} opacity={0.35} />
          )}
        </g>

        {/* Feet */}
        <ellipse cx="44" cy="180" rx="8" ry="4" fill={neutralColor} />
        <ellipse cx="76" cy="180" rx="8" ry="4" fill={neutralColor} />
      </svg>
    </div>
  );
}
