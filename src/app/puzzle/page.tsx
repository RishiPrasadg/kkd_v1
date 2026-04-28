"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// PUZZLE DATA
//
// For each pose, drop these files into /public/puzzle/{pose-slug}/
//   puzzle.png  → the full pose illustration (without the missing piece)
//   a.png       → option A image (the bottom-right piece)
//   b.png       → option B
//   c.png       → option C
//   d.png       → option D
//
// Mark which option is correct with  correct: true
// ─────────────────────────────────────────────────────────────────────────────
type Option = { image: string; correct: boolean };
type PuzzleRound = { name: string; puzzle: string; options: Option[] };

const PUZZLES: PuzzleRound[] = [
  {
    name: "Warrior II",
    puzzle: "/puzzle/warrior-ii/puzzle.png",
    options: [
      { image: "/puzzle/warrior-ii/a.png", correct: true },
      { image: "/puzzle/warrior-ii/b.png", correct: false },
      { image: "/puzzle/warrior-ii/c.png", correct: false },
      { image: "/puzzle/warrior-ii/d.png", correct: false },
    ],
  },
  {
    name: "Tree Pose",
    puzzle: "/puzzle/tree-pose/puzzle.png",
    options: [
      { image: "/puzzle/tree-pose/a.png", correct: false },
      { image: "/puzzle/tree-pose/b.png", correct: true },   // ← correct
      { image: "/puzzle/tree-pose/c.png", correct: false },
      { image: "/puzzle/tree-pose/d.png", correct: false },
    ],
  },
  {
    name: "Child's Pose",
    puzzle: "/puzzle/childs-pose/puzzle.png",
    options: [
      { image: "/puzzle/childs-pose/a.png", correct: false },
      { image: "/puzzle/childs-pose/b.png", correct: false },
      { image: "/puzzle/childs-pose/c.png", correct: false },
      { image: "/puzzle/childs-pose/d.png", correct: true },
    ],
  },
  {
    name: "Downward Dog",
    puzzle: "/puzzle/downward-dog/puzzle.png",
    options: [
      { image: "/puzzle/downward-dog/a.png", correct: true },
      { image: "/puzzle/downward-dog/b.png", correct: false },
      { image: "/puzzle/downward-dog/c.png", correct: false },
      { image: "/puzzle/downward-dog/d.png", correct: false },
    ],
  },
  {
    name: "Cobra",
    puzzle: "/puzzle/cobra/puzzle.png",
    options: [
      { image: "/puzzle/cobra/a.png", correct: false },
      { image: "/puzzle/cobra/b.png", correct: true },
      { image: "/puzzle/cobra/c.png", correct: false },
      { image: "/puzzle/cobra/d.png", correct: false },
    ],
  },
];

const TOTAL_ROUNDS = 3;
const OPTION_LABELS = ["A", "B", "C", "D"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────────────────────────
// PUZZLE BOARD
// Shows the full pose image with a dashed MISSING overlay on the bottom-right.
// When solved, the correct option image flies into the slot.
// ─────────────────────────────────────────────────────────────────────────────
function PuzzleBoard({
  puzzle,
  correctImage,
  solved,
}: {
  puzzle: string;
  correctImage: string;
  solved: boolean;
}) {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "white",
        boxShadow: "0 2px 20px rgba(0,0,0,0.10)",
        aspectRatio: "1 / 1",
      }}
    >
      {/* Full pose image — already has the MISSING box drawn in */}
      <Image
        src={puzzle}
        alt="Pose puzzle"
        fill
        className="object-cover"
        priority
      />

      {/* When solved: overlay the correct piece over the MISSING area (bottom-right 50%×50%) */}
      <AnimatePresence>
        {solved && (
          <motion.div
            key="filled"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="absolute"
            style={{ right: 0, bottom: 0, width: "50%", height: "50%", position: "absolute" }}
          >
            <Image
              src={correctImage}
              alt="Correct piece"
              fill
              className="object-cover rounded-br-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION TILE
// ─────────────────────────────────────────────────────────────────────────────
function OptionTile({
  image,
  label,
  shaking,
  disabled,
  onClick,
}: {
  image: string;
  label: string;
  shaking: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      animate={shaking ? { x: [-7, 7, -5, 5, -3, 3, 0] } : {}}
      transition={{ duration: 0.45 }}
      onClick={disabled ? undefined : onClick}
      style={{ cursor: disabled ? "default" : "pointer" }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          border: shaking ? "2px solid #E05A2A" : "2px solid #F0EBE3",
          transition: "border-color 0.2s",
          aspectRatio: "1 / 1",
          position: "relative",
        }}
      >
        <Image src={image} alt={`Option ${label}`} fill className="object-cover" />
      </div>
      <p
        className="text-center font-semibold mt-2"
        style={{ fontSize: 15, color: "#8a8580", letterSpacing: "0.04em" }}
      >
        {label}
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function PuzzlePage() {
  const rounds = useMemo(
    () => shuffle(PUZZLES).slice(0, Math.min(TOTAL_ROUNDS, PUZZLES.length)),
    []
  );

  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<"puzzle" | "lead_capture" | "done">("puzzle");
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [slotFilled, setSlotFilled] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const round = rounds[currentRound];
  const correctImage = round.options.find((o) => o.correct)!.image;

  function handleOption(idx: number) {
    if (slotFilled) return;
    if (round.options[idx].correct) {
      setSlotFilled(true);
      setTimeout(() => {
        if (currentRound + 1 >= rounds.length) {
          setPhase("lead_capture");
        } else {
          setTimeout(() => {
            setSlotFilled(false);
            setCurrentRound((r) => r + 1);
          }, 500);
        }
      }, 900);
    } else {
      setShakeIdx(idx);
      setTimeout(() => setShakeIdx(null), 550);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, source: "puzzle" }),
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setPhase("done"), 1200);
  }

  // ── Done ──
  if (phase === "done") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FAF7F2" }}
      >
        <div className="text-center px-6">
          <div className="text-6xl mb-5">🎉</div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display, 'Fraunces', Georgia, serif)" }}
          >
            You&apos;re a yoga pro!
          </h2>
          <p className="text-sm" style={{ color: "#8a8580" }}>
            Thanks for playing. We&apos;ll be in touch soon!
          </p>
        </div>
      </div>
    );
  }

  // ── Lead capture ──
  if (phase === "lead_capture") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#FAF7F2" }}
      >
        <div className="w-full max-w-xs">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🧘</div>
            <h2
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "var(--font-display, 'Fraunces', Georgia, serif)" }}
            >
              Nicely done!
            </h2>
            <p className="text-sm mt-1" style={{ color: "#8a8580" }}>
              You completed all {rounds.length} puzzles. Enter your details to claim your reward.
            </p>
          </div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                style={{ border: "1.5px solid #E0D8D0", background: "white" }}
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                style={{ border: "1.5px solid #E0D8D0", background: "white" }}
              />
              <button
                type="submit"
                disabled={submitting || !name.trim() || !phone.trim()}
                className="w-full py-3 rounded-2xl text-white font-semibold text-sm disabled:opacity-50"
                style={{ background: "#C4622D" }}
              >
                {submitting ? "Submitting..." : "Claim My Reward →"}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="text-3xl mb-3" style={{ color: "#7D9B76" }}>✓</div>
              <p className="font-medium">See you soon!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Puzzle ──
  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "#FAF7F2" }}>
      <div className="w-full max-w-sm px-5 pt-8 pb-10">

        {/* Progress dots */}
        <div className="flex justify-center items-center gap-2 mb-7">
          {rounds.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === currentRound ? 28 : 8 }}
              transition={{ duration: 0.3 }}
              style={{
                height: 8,
                borderRadius: 4,
                background:
                  i < currentRound ? "#C4622D" : i === currentRound ? "#C4622D" : "#D8D2CA",
              }}
            />
          ))}
        </div>

        {/* Title */}
        <h1
          className="text-center font-bold mb-5"
          style={{
            fontSize: 20,
            fontFamily: "var(--font-display, 'Fraunces', Georgia, serif)",
            color: "#1a1a1a",
          }}
        >
          {currentRound + 1}. Complete the {round.name}
        </h1>

        {/* Puzzle board */}
        <PuzzleBoard
          puzzle={round.puzzle}
          correctImage={correctImage}
          solved={slotFilled}
        />

        {/* Question text */}
        <p
          className="text-center font-medium mt-4 mb-5"
          style={{ fontSize: 14, color: "#5A5550" }}
        >
          Which piece completes the puzzle?
        </p>

        {/* Options 2×2 */}
        <div className="grid grid-cols-2 gap-3">
          {round.options.map((opt, i) => (
            <OptionTile
              key={`${currentRound}-${i}`}
              image={opt.image}
              label={OPTION_LABELS[i]}
              shaking={shakeIdx === i}
              disabled={slotFilled}
              onClick={() => handleOption(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
