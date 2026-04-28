"use client";

import { useState } from "react";
import { Boogaloo, DM_Sans } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const boogaloo = Boogaloo({ subsets: ["latin"], weight: "400", variable: "--font-boogaloo" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-dm" });

const BG = "#F5A623";
const DARK = "#1a1a1a";
const CREAM = "#FDF6E3";

const ITEMS = [
  { id: 0, text: "Switchboard with a switch taped over — 'it gives shock'", icon: "⚡", bg: "#C0392B" },
  { id: 1, text: "That one drawer: rubber bands, old pens, a key nobody knows the lock of", icon: "🗝️", bg: "#1A7A6E" },
  { id: 2, text: "The one good glass — only for guests", icon: "🥛", bg: "#E91E8C" },
  { id: 3, text: "Aamras on the table when mangoes were in season", icon: "🥭", bg: "#C47D10" },
  { id: 4, text: "Old Bata chappal at the door — everyone's and no one's", icon: "🥿", bg: "#2D6A4F" },
  { id: 5, text: "Wall clock 10 minutes fast — everyone knows and adjusts", icon: "🕐", bg: "#7B1FA2" },
  { id: 6, text: "Old Nokia charger in the drawer nobody throws", icon: "🔌", bg: "#1565C0" },
  { id: 7, text: "Plastic cover still on the remote control", icon: "📺", bg: "#B71C1C" },
  { id: 8, text: "Godrej almirah that hasn't opened properly since 2009", icon: "🚪", bg: "#1B5E20" },
];

function getResult(score: number) {
  if (score === 9) return { name: "FULL DESI", emoji: "🎉", copy: "Tera ghar = every Indian ghar. Ekdum asli." };
  if (score >= 7) return { name: "MOSTLY DESI", emoji: "😄", copy: "Thoda modern, thoda ghar wala. Balance hai." };
  if (score >= 4) return { name: "DESI AT HEART", emoji: "❤️", copy: "Bahar se smart, andar se pure desi." };
  return { name: "ABCD", emoji: "😂", copy: "American Born Confused Desi. Nokia charger nahi mila? Really?" };
}

function playDhol() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.9, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);

    const bufSize = Math.floor(ctx.sampleRate * 0.08);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2500;
    noise.buffer = buf;
    noiseGain.gain.setValueAtTime(0.25, ctx.currentTime);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();
    setTimeout(() => ctx.close(), 600);
  } catch { /* ignore */ }
}

function playShehnai() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    });
    setTimeout(() => ctx.close(), 2000);
  } catch { /* ignore */ }
}

// ── Truck Art Border ──────────────────────────────────────────────
function TruckBorder() {
  const BW = 20;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
      {/* TOP */}
      <svg width="100%" height={BW} style={{ position: "absolute", top: 0, left: 0, display: "block" }}>
        <defs>
          <pattern id="tp" x="0" y="0" width="24" height={BW} patternUnits="userSpaceOnUse">
            <rect width="24" height={BW} fill="#C0392B" />
            <polygon points="12,2 22,10 12,18 2,10" fill="#F5A623" />
            <polygon points="12,5 18,10 12,15 6,10" fill="#1A7A6E" />
          </pattern>
        </defs>
        <rect width="100%" height={BW} fill="url(#tp)" />
        <rect width="100%" height="2" fill={DARK} />
        <rect y={BW - 2} width="100%" height="2" fill={DARK} />
      </svg>

      {/* BOTTOM */}
      <svg width="100%" height={BW} style={{ position: "absolute", bottom: 0, left: 0, display: "block" }}>
        <defs>
          <pattern id="bp" x="0" y="0" width="24" height={BW} patternUnits="userSpaceOnUse">
            <rect width="24" height={BW} fill="#1A7A6E" />
            <polygon points="12,2 22,10 12,18 2,10" fill="#E91E8C" />
            <polygon points="12,5 18,10 12,15 6,10" fill="#F5A623" />
          </pattern>
        </defs>
        <rect width="100%" height={BW} fill="url(#bp)" />
        <rect width="100%" height="2" fill={DARK} />
        <rect y={BW - 2} width="100%" height="2" fill={DARK} />
      </svg>

      {/* LEFT */}
      <svg width={BW} height="100%" style={{ position: "absolute", top: 0, left: 0, display: "block" }}>
        <defs>
          <pattern id="lp" x="0" y="0" width={BW} height="24" patternUnits="userSpaceOnUse">
            <rect width={BW} height="24" fill="#E91E8C" />
            <polygon points="10,12 2,2 18,12 2,22" fill="#2D6A4F" />
            <polygon points="10,12 5,5 15,12 5,19" fill="#F5A623" />
          </pattern>
        </defs>
        <rect width={BW} height="100%" fill="url(#lp)" />
        <rect width="2" height="100%" fill={DARK} />
        <rect x={BW - 2} width="2" height="100%" fill={DARK} />
      </svg>

      {/* RIGHT */}
      <svg width={BW} height="100%" style={{ position: "absolute", top: 0, right: 0, display: "block" }}>
        <defs>
          <pattern id="rp" x="0" y="0" width={BW} height="24" patternUnits="userSpaceOnUse">
            <rect width={BW} height="24" fill="#2D6A4F" />
            <polygon points="10,12 2,2 18,12 2,22" fill="#C0392B" />
            <polygon points="10,12 5,5 15,12 5,19" fill="#1A7A6E" />
          </pattern>
        </defs>
        <rect width={BW} height="100%" fill="url(#rp)" />
        <rect width="2" height="100%" fill={DARK} />
        <rect x={BW - 2} width="2" height="100%" fill={DARK} />
      </svg>
    </div>
  );
}

// ── Confetti ──────────────────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const COLORS = ["#F5A623", "#C0392B", "#1A7A6E", "#E91E8C", "#2D6A4F", CREAM];
  const particles = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    dur: `${2 + Math.random() * 2.5}s`,
    delay: `${Math.random() * 1.2}s`,
    color: COLORS[i % COLORS.length],
    size: `${6 + Math.random() * 8}px`,
    radius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0%",
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 100 }}>
      <style>{`
        @keyframes cffall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(600deg); opacity: 0; }
        }
      `}</style>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: p.left,
          top: 0,
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
          borderRadius: p.radius,
          animation: `cffall ${p.dur} ${p.delay} ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

// ── Bingo Card ────────────────────────────────────────────────────
function BingoCard({
  item,
  flipped,
  onTap,
}: {
  item: (typeof ITEMS)[0];
  flipped: boolean;
  onTap: () => void;
}) {
  return (
    <div
      onClick={onTap}
      style={{ perspective: "700px", minHeight: "120px", cursor: flipped ? "default" : "pointer", userSelect: "none" }}
      role="button"
      aria-pressed={flipped}
    >
      <div style={{
        position: "relative",
        width: "100%",
        minHeight: "120px",
        transformStyle: "preserve-3d",
        transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* FRONT */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          backgroundColor: item.bg,
          borderRadius: "10px",
          border: `3px solid ${DARK}`,
          padding: "10px 8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          boxShadow: `3px 3px 0 ${DARK}`,
          minHeight: "120px",
        }}>
          {/* Stamp dashed inner border */}
          <div style={{
            position: "absolute", inset: "5px",
            border: "1.5px dashed rgba(255,255,255,0.45)",
            borderRadius: "7px",
            pointerEvents: "none",
          }} />
          <span style={{ fontSize: "22px", lineHeight: 1 }}>{item.icon}</span>
          <p style={{
            fontFamily: dmSans.style.fontFamily,
            fontSize: "10.5px",
            fontWeight: 700,
            color: CREAM,
            textAlign: "center",
            lineHeight: 1.35,
            margin: 0,
          }}>
            {item.text}
          </p>
        </div>

        {/* BACK */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          backgroundColor: CREAM,
          borderRadius: "10px",
          border: `3px solid ${DARK}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          boxShadow: `3px 3px 0 ${DARK}`,
          minHeight: "120px",
        }}>
          <div style={{
            fontFamily: boogaloo.style.fontFamily,
            fontSize: "18px",
            color: "#C0392B",
            transform: "rotate(-8deg)",
            border: "3px solid #C0392B",
            padding: "3px 10px",
            letterSpacing: "1px",
            lineHeight: 1.2,
          }}>
            FOUND IT!
          </div>
          <span style={{ fontSize: "18px", marginTop: "2px" }}>🌼</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
type Step = "entry" | "game" | "result";

export default function DesiBingoPage() {
  const [step, setStep] = useState<Step>("entry");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [flipped, setFlipped] = useState<boolean[]>(Array(9).fill(false));
  const [showConfetti, setShowConfetti] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const score = flipped.filter(Boolean).length;

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Apna naam daalo";
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) e.phone = "10-digit number daalo";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStep("game");
  }

  function handleCardTap(index: number) {
    if (flipped[index]) return;
    const next = [...flipped];
    next[index] = true;
    setFlipped(next);
    playDhol();
  }

  function handleRevealScore() {
    const res = getResult(score);
    if (!submitted) {
      fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.replace(/\s/g, ""),
          age: score,
          source: `bingo-${res.name.replace(/\s/g, "-").toLowerCase()}`,
        }),
      }).catch(() => {});
      setSubmitted(true);
    }
    playShehnai();
    setStep("result");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4500);
  }

  function handleWhatsApp() {
    const res = getResult(score);
    const text = `🏠 Desi Ghar Bingo\n\nMera score: ${score}/9\nResult: ${res.name} ${res.emoji}\n\n"${res.copy}"\n\nKitna desi hai tera ghar? Khelo: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const result = getResult(score);

  const screenStyle: React.CSSProperties = {
    minHeight: "100dvh",
    position: "relative",
    backgroundColor: BG,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "72px 20px 32px",
    fontFamily: dmSans.style.fontFamily,
    overflowX: "hidden",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "6px",
    border: `2.5px solid ${DARK}`,
    backgroundColor: "#FFF9EC",
    fontSize: "15px",
    fontFamily: dmSans.style.fontFamily,
    color: DARK,
    boxSizing: "border-box",
    boxShadow: `3px 3px 0 ${DARK}`,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#4a3010",
    marginBottom: "5px",
    fontFamily: dmSans.style.fontFamily,
  };

  const btnPrimary: React.CSSProperties = {
    width: "100%",
    padding: "16px",
    backgroundColor: DARK,
    color: CREAM,
    fontFamily: boogaloo.style.fontFamily,
    fontSize: "1.35rem",
    border: `2.5px solid ${DARK}`,
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "4px 4px 0 #C0392B",
    letterSpacing: "0.5px",
  };

  return (
    <div style={{ backgroundColor: BG, minHeight: "100dvh" }}>
      <Confetti active={showConfetti} />

      <AnimatePresence mode="wait">

        {/* ── ENTRY ── */}
        {step === "entry" && (
          <motion.div
            key="entry"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            style={screenStyle}
          >
            <TruckBorder />
            <div style={{ position: "relative", zIndex: 20, width: "100%", maxWidth: "390px" }}>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div style={{ fontSize: "48px", lineHeight: 1, marginBottom: "10px" }}>🏠</div>
                <h1 style={{
                  fontFamily: boogaloo.style.fontFamily,
                  fontSize: "clamp(2.1rem, 9vw, 3rem)",
                  color: DARK,
                  lineHeight: 1.1,
                  margin: "0 0 10px 0",
                }}>
                  Kitna Desi Hai<br />Tera Ghar?
                </h1>
                <p style={{ fontFamily: dmSans.style.fontFamily, fontSize: "14px", color: "#4a3010", margin: 0, fontWeight: 500 }}>
                  9 cheezein. Ek ghar. Ek score.
                </p>
              </div>

              <form onSubmit={handleStart} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Aapka Naam</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Naam likhiye..."
                    style={inputStyle}
                  />
                  {errors.name && (
                    <p style={{ margin: "5px 0 0 2px", fontSize: "12px", color: "#C0392B", fontWeight: 700 }}>
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    style={inputStyle}
                  />
                  {errors.phone && (
                    <p style={{ margin: "5px 0 0 2px", fontSize: "12px", color: "#C0392B", fontWeight: 700 }}>
                      {errors.phone}
                    </p>
                  )}
                </div>
                <button type="submit" style={{ ...btnPrimary, marginTop: "6px" }}>
                  Dekh Le →
                </button>
              </form>

              <p style={{ textAlign: "center", fontSize: "11px", color: "#6a5030", marginTop: "16px", fontFamily: dmSans.style.fontFamily }}>
                Aapka data safe hai. Hamesha.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── GAME ── */}
        {step === "game" && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              ...screenStyle,
              justifyContent: "flex-start",
              paddingBottom: "100px",
            }}
          >
            <TruckBorder />
            <div style={{ position: "relative", zIndex: 20, width: "100%", maxWidth: "460px" }}>
              <h2 style={{
                fontFamily: boogaloo.style.fontFamily,
                fontSize: "clamp(1.3rem, 5.5vw, 1.9rem)",
                color: DARK,
                textAlign: "center",
                margin: "0 0 12px 0",
              }}>
                Tap karo jo tere ghar mein hai 👇
              </h2>

              <div style={{ textAlign: "center", marginBottom: "14px" }}>
                <span style={{
                  fontFamily: boogaloo.style.fontFamily,
                  fontSize: "1.05rem",
                  color: DARK,
                  backgroundColor: "rgba(0,0,0,0.12)",
                  padding: "4px 14px",
                  borderRadius: "20px",
                }}>
                  {score}/9 mila
                </span>
              </div>

              {/* 3×3 Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
              }}>
                {ITEMS.map((item, i) => (
                  <BingoCard
                    key={item.id}
                    item={item}
                    flipped={flipped[i]}
                    onTap={() => handleCardTap(i)}
                  />
                ))}
              </div>

              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <button
                  onClick={handleRevealScore}
                  style={{
                    padding: "15px 32px",
                    backgroundColor: DARK,
                    color: CREAM,
                    fontFamily: boogaloo.style.fontFamily,
                    fontSize: "1.25rem",
                    border: `2.5px solid ${DARK}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow: "4px 4px 0 #C0392B",
                    letterSpacing: "0.5px",
                  }}
                >
                  Score Dekho →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, type: "spring", bounce: 0.3 }}
            style={screenStyle}
          >
            <TruckBorder />
            <div style={{ position: "relative", zIndex: 20, width: "100%", maxWidth: "420px", textAlign: "center" }}>
              {/* Big score */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", bounce: 0.5 }}
                style={{
                  fontFamily: boogaloo.style.fontFamily,
                  fontSize: "clamp(4.5rem, 22vw, 7rem)",
                  color: DARK,
                  lineHeight: 1,
                  margin: "0 0 4px 0",
                }}
              >
                {score}/9
              </motion.div>

              {/* Result name */}
              <div style={{
                fontFamily: boogaloo.style.fontFamily,
                fontSize: "clamp(1.7rem, 8vw, 2.6rem)",
                color: "#C0392B",
                letterSpacing: "1.5px",
                margin: "0 0 6px 0",
                textShadow: `2px 2px 0 ${DARK}`,
              }}>
                {result.name} {result.emoji}
              </div>

              {/* Copy */}
              <p style={{
                fontFamily: dmSans.style.fontFamily,
                fontSize: "15px",
                color: DARK,
                fontWeight: 600,
                margin: "0 0 10px 0",
                backgroundColor: "rgba(0,0,0,0.09)",
                padding: "12px 16px",
                borderRadius: "8px",
              }}>
                &ldquo;{result.copy}&rdquo;
              </p>

              <p style={{
                fontFamily: dmSans.style.fontFamily,
                fontSize: "13px",
                color: "#4a3010",
                marginBottom: "22px",
                fontWeight: 500,
              }}>
                Dekha {name}? 😄
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={handleWhatsApp}
                  style={{
                    padding: "14px 24px",
                    backgroundColor: "#25D366",
                    color: "white",
                    fontFamily: boogaloo.style.fontFamily,
                    fontSize: "1.15rem",
                    border: `2.5px solid ${DARK}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow: `3px 3px 0 ${DARK}`,
                    letterSpacing: "0.3px",
                  }}
                >
                  📱 Share Kar Apne Ghar Walon Ko →
                </button>

                <button
                  onClick={handleCopy}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: copied ? "#2D6A4F" : CREAM,
                    color: copied ? CREAM : DARK,
                    fontFamily: dmSans.style.fontFamily,
                    fontSize: "14px",
                    fontWeight: 600,
                    border: `2.5px solid ${DARK}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow: `3px 3px 0 ${DARK}`,
                    transition: "background-color 0.2s",
                  }}
                >
                  {copied ? "✓ Link Copy Ho Gaya!" : "🔗 Link Copy Karo"}
                </button>

                <button
                  onClick={() => {
                    setFlipped(Array(9).fill(false));
                    setSubmitted(false);
                    setStep("game");
                  }}
                  style={{
                    padding: "10px",
                    backgroundColor: "transparent",
                    color: "#4a3010",
                    fontFamily: dmSans.style.fontFamily,
                    fontSize: "13px",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Dobara khelna hai
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
