"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "landing" | "pick" | "result";

const CARDS = [
  {
    emoji: "🌅",
    title: "Morning Reset",
    challenge: "Can you sit upright — no support — for 60 seconds right now?",
    yes: { label: "Yes, easy!", insight: "Your core is doing its job. Keep it strong with 5 mins of yoga every morning.", color: "#E8EFE6", accent: "#5B8F8F" },
    no: { label: "Not quite", insight: "A weak core makes everything harder — your back, posture, energy. Start with 3 minutes of Plank today.", color: "#F0E4D4", accent: "#B8705A" },
  },
  {
    emoji: "🌬️",
    title: "Breath Check",
    challenge: "Take a deep breath right now. Did your shoulders rise?",
    yes: { label: "Yes they did", insight: "Shoulder breathing = shallow breathing. Your body is in low-key stress mode. Try belly breathing for 2 minutes.", color: "#F2E8DC", accent: "#C4A24E" },
    no: { label: "Nope, belly moved", insight: "You breathe correctly — that's rarer than you think. Your nervous system thanks you.", color: "#E8EFE6", accent: "#5B8F8F" },
  },
  {
    emoji: "🪑",
    title: "Desk Test",
    challenge: "Right now — are you sitting with your back straight?",
    yes: { label: "Yes I am!", insight: "Great posture is a habit, not a one-time thing. You're already ahead of 80% of people.", color: "#E8F0E8", accent: "#5B8A5B" },
    no: { label: "I just fixed it 😅", insight: "Your spine was waiting for this. Set a timer — every 30 mins, check in with your posture.", color: "#EDE3D6", accent: "#8B6B5E" },
  },
  {
    emoji: "🦵",
    title: "Hip Truth",
    challenge: "Try sitting cross-legged on the floor right now.",
    yes: { label: "Comfortable!", insight: "Open hips are a superpower. They protect your knees and lower back. Keep doing what you're doing.", color: "#F5E6DA", accent: "#C4622D" },
    no: { label: "Hips said no", insight: "Tight hips are the #1 hidden cause of back pain. Just 5 mins of hip-opening yoga a day changes everything.", color: "#F0E4D4", accent: "#B8705A" },
  },
  {
    emoji: "😴",
    title: "Rest Reveal",
    challenge: "Do you wake up more tired than when you went to bed?",
    yes: { label: "Every. Single. Day.", insight: "That groggy feeling isn't just sleep — it's your body asking for movement. 10 mins of gentle yoga before bed changes your sleep quality.", color: "#EAE2D8", accent: "#7D9B76" },
    no: { label: "I wake up fresh", insight: "Good sleep recovery means your body is in balance. Protect it — don't let stress creep in.", color: "#E8EFE6", accent: "#5B8F8F" },
  },
  {
    emoji: "🔄",
    title: "Spine Check",
    challenge: "Turn your head slowly left, then right. Equal range both sides?",
    yes: { label: "Smooth both ways", insight: "Balanced neck mobility means low tension. Most people have one stiff side. You're doing great.", color: "#E8EFE6", accent: "#5B8F8F" },
    no: { label: "One side is tighter", insight: "Neck imbalance usually comes from how you sleep or hold your phone. A simple neck stretch every day fixes this in 2 weeks.", color: "#F2E8DC", accent: "#C4A24E" },
  },
];

export default function FlipCardPage() {
  const [step, setStep] = useState<Step>("landing");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [flipped, setFlipped] = useState<number | null>(null);
  const [answered, setAnswered] = useState<"yes" | "no" | null>(null);

  // Pick 3 random cards each session
  const [cards] = useState(() => {
    const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  const activeCard = flipped !== null ? cards[flipped] : null;
  const result = activeCard && answered ? activeCard[answered] : null;

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Enter your name";
    if (!/^\d{10}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), phone: phone.replace(/\s/g, ""), age: 0, yogaAge: 0, score: 0, resultType: "flipcard" }),
    }).catch(() => {});
    setStep("pick");
  }

  function handleFlip(idx: number) {
    if (flipped !== null) return;
    setFlipped(idx);
  }

  function handleAnswer(ans: "yes" | "no") {
    setAnswered(ans);
    setStep("result");
  }

  function handleReset() {
    setFlipped(null);
    setAnswered(null);
    setStep("pick");
  }

  const bg =
    step === "result" && result
      ? result.color
      : "#F5E6DA";

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-16 bg-transition"
      style={{ backgroundColor: bg }}
    >
      <AnimatePresence mode="wait">
        {/* ── LANDING ── */}
        {step === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">🃏</div>
              <h1 className="font-display text-4xl text-dark leading-tight mb-3">
                Flip a Card
              </h1>
              <p className="text-muted text-base">
                Pick a card. Answer honestly. Find out what your body is telling you.
              </p>
            </div>

            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-5 py-4 rounded-2xl border border-option-border bg-card text-dark text-[15px] placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/40 transition"
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-600 pl-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone number"
                  className="w-full px-5 py-4 rounded-2xl border border-option-border bg-card text-dark text-[15px] placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/40 transition"
                />
                {errors.phone && <p className="mt-1.5 text-xs text-red-600 pl-1">{errors.phone}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-dark text-white font-medium text-[15px] hover:bg-stone-800 active:scale-[0.98] transition-all cursor-pointer mt-2"
              >
                Pick a Card →
              </button>
            </form>
            <p className="text-center text-xs text-muted/60 mt-6">Your data stays private. Always.</p>
          </motion.div>
        )}

        {/* ── PICK ── */}
        {step === "pick" && (
          <motion.div
            key="pick"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-10">
              <p className="text-muted text-sm mb-1">Hey {name} 👋</p>
              <h2 className="font-display text-3xl text-dark">
                Pick one card
              </h2>
              <p className="text-muted text-sm mt-2">Tap to flip it over</p>
            </div>

            <div className="flex gap-4 justify-center">
              {cards.map((card, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => handleFlip(idx)}
                  className="relative cursor-pointer"
                  style={{ perspective: 1000 }}
                  whileHover={{ y: flipped === null ? -6 : 0 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    className="w-24 sm:w-28 h-36 sm:h-40 rounded-2xl"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.6s ease",
                      transform: flipped === idx ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Card Back */}
                    <div
                      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center"
                      style={{
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(135deg, #2C2321, #4A3A30)",
                      }}
                    >
                      <div className="text-2xl mb-1">🧘</div>
                      <div className="text-white/30 text-xs font-medium tracking-widest">YOGA</div>
                    </div>
                    {/* Card Front */}
                    <div
                      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-3"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        backgroundColor: "#F5E6DA",
                      }}
                    >
                      <div className="text-3xl mb-1">{card.emoji}</div>
                      <p className="text-xs font-medium text-dark text-center leading-tight">{card.title}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Challenge question after flip */}
            <AnimatePresence>
              {flipped !== null && activeCard && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 text-center"
                >
                  <div className="bg-card rounded-2xl border border-option-border p-6 mb-6">
                    <p className="font-display text-xl text-dark leading-snug mb-1">
                      {activeCard.challenge}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAnswer("yes")}
                      className="flex-1 py-4 rounded-2xl bg-dark text-white font-medium text-[15px] hover:bg-stone-800 active:scale-[0.98] transition-all"
                    >
                      {activeCard.yes.label}
                    </button>
                    <button
                      onClick={() => handleAnswer("no")}
                      className="flex-1 py-4 rounded-2xl border border-option-border bg-card text-dark font-medium text-[15px] hover:bg-[#F0EBE3] active:scale-[0.98] transition-all"
                    >
                      {activeCard.no.label}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && result && activeCard && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
            className="w-full max-w-sm text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="text-6xl mb-4"
            >
              {activeCard.emoji}
            </motion.div>

            <p className="text-xs uppercase tracking-[0.25em] text-muted mb-2">
              Your body is saying...
            </p>
            <h2 className="font-display text-3xl text-dark mb-8 leading-snug">
              {activeCard.title}
            </h2>

            <div
              className="rounded-2xl p-6 mb-6 text-left"
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                border: `1px solid ${result.accent}30`,
              }}
            >
              <p
                className="text-[15px] font-medium leading-relaxed"
                style={{ color: result.accent }}
              >
                {result.insight}
              </p>
            </div>

            <a
              href="/"
              className="block w-full py-4 rounded-2xl text-white font-medium text-[15px] hover:opacity-90 active:scale-[0.98] transition-all text-center mb-4"
              style={{ backgroundColor: result.accent }}
            >
              Try more tools →
            </a>

            <button
              onClick={handleReset}
              className="text-sm text-muted hover:text-dark transition"
            >
              Pick another card
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
