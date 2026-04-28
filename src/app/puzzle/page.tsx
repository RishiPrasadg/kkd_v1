"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// AnimatePresence kept for lastHit feedback animation
import { isLeadCaptured, saveLead } from "@/lib/leads";
import { COUNTRY_CODES } from "@/lib/countryCodes";

// ─── Board items ──────────────────────────────────────────────────────────
const ITEMS = [
  { emoji: "🥗", name: "Salad", points: 10, healthy: true },
  { emoji: "🍕", name: "Pizza", points: -5, healthy: false },
  { emoji: "🍎", name: "Apple", points: 10, healthy: true },
  { emoji: "🍔", name: "Burger", points: -5, healthy: false },
  { emoji: "🥑", name: "Avocado", points: 10, healthy: true },
  { emoji: "🍟", name: "Fries", points: -5, healthy: false },
  { emoji: "🥕", name: "Carrot", points: 10, healthy: true },
  { emoji: "🍩", name: "Donut", points: -5, healthy: false },
  { emoji: "🫐", name: "Berries", points: 10, healthy: true },
  { emoji: "🥤", name: "Soda", points: -5, healthy: false },
];

const TOTAL_THROWS = 8;
const SLICE = 360 / ITEMS.length;
const BOARD_R = 120;
const SPEED = 1.8;

// ─── Main page ────────────────────────────────────────────────────────────
export default function DartPage() {
  const boardRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);

  const [score, setScore] = useState(0);
  const [throwsLeft, setThrowsLeft] = useState(TOTAL_THROWS);
  const [throwing, setThrowing] = useState(false);
  const [lastHit, setLastHit] = useState<{
    item: (typeof ITEMS)[number] | null;
    miss: boolean;
  } | null>(null);
  const [phase, setPhase] = useState<"playing" | "lead_capture" | "score">("playing");
  const [hitIdx, setHitIdx] = useState<number | null>(null);

  // Lead capture
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [submitting, setSubmitting] = useState(false);

  // Spin the board
  useEffect(() => {
    if (phase !== "playing") return;
    const tick = () => {
      angleRef.current = (angleRef.current + SPEED) % 360;
      if (boardRef.current) {
        boardRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  const throwDart = useCallback(() => {
    if (throwing || throwsLeft <= 0 || phase !== "playing") return;
    setThrowing(true);
    setLastHit(null);
    setHitIdx(null);

    const R = angleRef.current;
    const hitAngle = ((360 - R) % 360 + 360) % 360;
    const nearest = Math.round(hitAngle / SLICE) % ITEMS.length;
    const nearestAngle = nearest * SLICE;
    const diff = Math.min(
      Math.abs(hitAngle - nearestAngle),
      360 - Math.abs(hitAngle - nearestAngle)
    );
    const isMiss = diff > SLICE * 0.38;

    setTimeout(() => {
      if (isMiss) {
        setLastHit({ item: null, miss: true });
      } else {
        const food = ITEMS[nearest];
        setScore((s) => s + food.points);
        setLastHit({ item: food, miss: false });
        setHitIdx(nearest);
      }

      const remaining = throwsLeft - 1;
      setThrowsLeft(remaining);
      setThrowing(false);

      if (remaining <= 0) {
        setTimeout(() => setPhase(isLeadCaptured() ? "score" : "lead_capture"), 1800);
      }

      setTimeout(() => setHitIdx(null), 600);
    }, 400);
  }, [throwing, throwsLeft, phase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    await saveLead(name.trim(), `${countryCode}${phone.replace(/\s/g, "")}`, "dart");
    setSubmitting(false);
    setPhase("score");
  }

  // ── Score reveal (shown AFTER data collection) ──
  if (phase === "score") {
    const msg =
      score >= 50
        ? { emoji: "🏆", title: "Amazing!", sub: "You really know your healthy foods!" }
        : score >= 20
        ? { emoji: "💪", title: "Well played!", sub: "You've got good instincts." }
        : score >= 0
        ? { emoji: "👍", title: "Not bad!", sub: "Keep practicing those healthy picks." }
        : { emoji: "😅", title: "Oops!", sub: "Watch out for those junk foods next time!" };

    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#111111" }}>
        <motion.div
          className="text-center px-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          <div className="text-6xl mb-4">{msg.emoji}</div>
          <h2 className="text-2xl font-bold mb-3 font-display text-white">{msg.title}</h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 250 }}
            className="inline-block rounded-2xl px-8 py-4 mb-4"
            style={{ background: "#1a1a1a", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
          >
            <p className="text-sm" style={{ color: "#666" }}>Your Score</p>
            <p
              className="text-4xl font-bold"
              style={{ color: score >= 0 ? "#7D9B76" : "#C4622D" }}
            >
              {score}
            </p>
          </motion.div>
          <p className="text-sm" style={{ color: "#aaa" }}>{msg.sub}</p>
          <p className="text-xs mt-4" style={{ color: "#777" }}>
            Thanks for playing, {name}! We&apos;ll be in touch.
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Lead capture (NO score shown — score is the reward for submitting) ──
  if (phase === "lead_capture") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#111111" }}>
        <motion.div
          className="w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🎯</div>
            <h2 className="text-2xl font-bold font-display mb-1 text-white">Game Over!</h2>
            <div
              className="inline-block rounded-xl px-5 py-2 mt-2 mb-2"
              style={{ background: "#222" }}
            >
              <p className="text-sm font-medium" style={{ color: "#aaa" }}>
                🔒 Your score is ready
              </p>
            </div>
            <p className="text-sm mt-2" style={{ color: "#aaa" }}>
              Enter your details to reveal your score!
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ border: "1.5px solid #333", background: "#1a1a1a", color: "#eee" }}
            />
            <div
              className="flex rounded-2xl overflow-hidden"
              style={{ border: "1.5px solid #333", background: "#1a1a1a" }}
            >
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-2 py-3 text-[13px] font-medium focus:outline-none cursor-pointer"
                style={{ background: "#222", color: "#ccc", borderRight: "1.5px solid #333", border: "none" }}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-white placeholder:text-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !name.trim() || !phone.trim()}
              className="w-full py-3 rounded-2xl text-white font-semibold text-sm disabled:opacity-50"
              style={{ background: "#C4622D" }}
            >
              {submitting ? "Revealing..." : "Reveal My Score →"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Playing ──
  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "#111111" }}>
      <div className="w-full max-w-sm px-5 pt-6 pb-8 flex flex-col items-center">

        {/* Header: throws remaining */}
        <div className="w-full flex justify-between items-center mb-4">
          <p className="text-sm font-medium" style={{ color: "#aaa" }}>
            Throws left: <span className="font-bold" style={{ color: "#C4622D" }}>{throwsLeft}</span>
          </p>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_THROWS }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: i < TOTAL_THROWS - throwsLeft ? "#C4622D" : "#444",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Title + instructions */}
        <h1
          className="text-center font-bold mb-1 text-white"
          style={{
            fontSize: 22,
            fontFamily: "var(--font-display, 'Fraunces', Georgia, serif)",
          }}
        >
          Spin &amp; Hit!
        </h1>
        <p className="text-sm text-center mb-2" style={{ color: "#999" }}>
          The board is spinning &mdash; tap to hit what&apos;s at the arrow
        </p>
        <div
          className="flex gap-4 text-xs font-medium mb-6 px-4 py-2 rounded-xl"
          style={{ background: "#222", color: "#bbb" }}
        >
          <span>🥗 Healthy = <b style={{ color: "#7D9B76" }}>+10</b></span>
          <span>🍔 Junk = <b style={{ color: "#C4622D" }}>−5</b></span>
          <span>Miss = <b>0</b></span>
        </div>

        {/* Board area */}
        <div className="relative" style={{ width: 290, height: 290 }}>

          {/* Pointer arrow at top center */}
          <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: -6 }}>
            <svg width="28" height="36" viewBox="0 0 28 36">
              <path
                d="M14 36 L4 12 Q0 4 6 1 L14 0 L22 1 Q28 4 24 12 Z"
                fill="#C4622D"
                stroke="#A14E22"
                strokeWidth="1"
              />
              <circle cx="14" cy="10" r="3" fill="#A14E22" />
              <path
                d="M14 36 L4 12 Q0 4 6 1 L14 0 L14 36 Z"
                fill="#B3551F"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Board background */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #1a1a1a 0deg, #252525 18deg, #1a1a1a 36deg, #252525 54deg, #1a1a1a 72deg, #252525 90deg, #1a1a1a 108deg, #252525 126deg, #1a1a1a 144deg, #252525 162deg, #1a1a1a 180deg, #252525 198deg, #1a1a1a 216deg, #252525 234deg, #1a1a1a 252deg, #252525 270deg, #1a1a1a 288deg, #252525 306deg, #1a1a1a 324deg, #252525 342deg)",
              border: "5px solid #444",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.2)",
            }}
          />

          {/* Inner rings */}
          <div
            className="absolute rounded-full"
            style={{
              top: "22%", left: "22%", width: "56%", height: "56%",
              border: "2px solid #444",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: "40%", left: "40%", width: "20%", height: "20%",
              background: "#2a2a2a",
              border: "2px solid #444",
            }}
          />
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              top: "44%", left: "44%", width: "12%", height: "12%",
              background: "#C4622D",
            }}
          >
            <div
              className="rounded-full"
              style={{ width: "50%", height: "50%", background: "#A14E22" }}
            />
          </div>

          {/* Spinning layer with food items */}
          <div
            ref={boardRef}
            className="absolute inset-0"
            style={{ willChange: "transform" }}
          >
            {ITEMS.map((item, i) => {
              const angle = i * SLICE - 90;
              const rad = (angle * Math.PI) / 180;
              const cx = 145 + Math.cos(rad) * BOARD_R;
              const cy = 145 + Math.sin(rad) * BOARD_R;
              const isHit = hitIdx === i;

              return (
                <div
                  key={i}
                  className="absolute flex items-center justify-center"
                  style={{
                    width: 50,
                    height: 50,
                    left: cx - 25,
                    top: cy - 25,
                    borderRadius: "50%",
                    background: isHit
                      ? item.healthy ? "#C8E6C9" : "#FFCDD2"
                      : item.healthy ? "#E8F5E9" : "#FFF3F0",
                    border: `3px solid ${
                      isHit
                        ? item.healthy ? "#4CAF50" : "#E53935"
                        : item.healthy ? "#A5D6A7" : "#EF9A9A"
                    }`,
                    fontSize: 24,
                    transition: "all 0.2s",
                    boxShadow: isHit
                      ? `0 0 16px ${item.healthy ? "rgba(76,175,80,0.6)" : "rgba(229,57,53,0.6)"}`
                      : "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {item.emoji}
                </div>
              );
            })}
          </div>

        </div>

        {/* Last hit feedback */}
        <div className="h-12 flex items-center justify-center mt-4">
          <AnimatePresence mode="wait">
            {lastHit && (
              <motion.div
                key={`${throwsLeft}-${lastHit.miss}`}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                {lastHit.miss ? (
                  <span
                    className="inline-block text-sm font-semibold px-4 py-2 rounded-xl"
                    style={{ background: "#333", color: "#aaa" }}
                  >
                    Missed! 0 points
                  </span>
                ) : lastHit.item ? (
                  <span
                    className="inline-block text-sm font-bold px-4 py-2 rounded-xl"
                    style={{
                      background: lastHit.item.healthy ? "#E8F5E9" : "#FFF3F0",
                      color: lastHit.item.healthy ? "#2E7D32" : "#C62828",
                    }}
                  >
                    {lastHit.item.emoji} {lastHit.item.name}!{" "}
                    {lastHit.item.points > 0 ? `+${lastHit.item.points}` : lastHit.item.points}
                  </span>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tap button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={throwDart}
          disabled={throwing || throwsLeft <= 0}
          className="mt-2 w-full max-w-[260px] py-4 rounded-2xl text-white font-bold text-base disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #C4622D 0%, #A14E22 100%)",
            boxShadow: "0 4px 16px rgba(196,98,45,0.35)",
          }}
        >
          {throwing ? "..." : `TAP TO HIT! (${throwsLeft} left)`}
        </motion.button>
      </div>
    </div>
  );
}
