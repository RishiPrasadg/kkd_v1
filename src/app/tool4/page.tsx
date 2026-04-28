"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pinyon_Script } from "next/font/google";
import { isLeadCaptured, getSavedLead, saveLead } from "@/lib/leads";
import { COUNTRY_CODES } from "@/lib/countryCodes";

const pinyonScript = Pinyon_Script({ subsets: ["latin"], weight: "400" });

type Step = "landing" | "step1" | "step2" | "step3" | "loading" | "step4";
type CardStyleId = 1 | 2 | 3 | 4;
type FlowerChoice = "tulips" | "lilies" | "jasmine" | "peonies" | "sunflowers";

const MUM_NAMES = ["Maa", "Mummy", "Amma", "Mom", "Aai", "Other"] as const;

const FLOWERS: { id: FlowerChoice; emoji: string; label: string }[] = [
  { id: "tulips",     emoji: "💜", label: "Tulips"     },
  { id: "lilies",     emoji: "🌸", label: "Lilies"     },
  { id: "jasmine",    emoji: "🤍", label: "Jasmine"    },
  { id: "peonies",    emoji: "🌺", label: "Peonies"    },
  { id: "sunflowers", emoji: "🌻", label: "Sunflowers" },
];

// Maps style ID to public image path
const CARD_BG: Record<CardStyleId, string> = {
  1: "/card-bg-1.jpg",
  2: "/card-bg-2.jpg",
  3: "/card-bg-3.jpg",
  4: "/card-bg-4.jpg",
};

// Padding to stay inside each frame's border area.
// These are set generously — each frame image has a different border thickness.
const CARD_PADDING: Record<CardStyleId, { x: number; y: number }> = {
  1: { x: 46, y: 42 }, // simple leaf/flower frame  — thin border
  2: { x: 58, y: 54 }, // green stitched frame       — medium border
  3: { x: 72, y: 68 }, // rich watercolour frame     — very thick border
  4: { x: 64, y: 58 }, // pink ribbon frame          — medium-thick border
};

const STYLE_LABELS: Record<CardStyleId, string> = {
  1: "Garden Frame",
  2: "Hand-Painted",
  3: "Watercolour",
  4: "Pink Ribbon",
};
const STYLE_DESCS: Record<CardStyleId, string> = {
  1: "Soft & botanical",
  2: "Illustrated charm",
  3: "Lush & romantic",
  4: "Sweet & delicate",
};

// ─── Style Thumbnail ─────────────────────────────────────────────────────────

function StyleThumbnail({
  style,
  selected,
  onClick,
}: {
  style: CardStyleId;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 focus:outline-none">
      <div
        className="relative overflow-hidden rounded-xl transition-all duration-200"
        style={{
          width: 72,
          height: 108,
          boxShadow: selected
            ? "0 0 0 3px #E8A0A0, 0 4px 16px rgba(201,116,138,0.3)"
            : "0 2px 8px rgba(0,0,0,0.09)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CARD_BG[style]}
          alt={STYLE_LABELS[style]}
          style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }}
        />
      </div>
      <div className="text-center">
        <p className="text-[11px] font-medium text-[#2a1a1a] leading-tight">{STYLE_LABELS[style]}</p>
        <p className="text-[10px] text-[#8a8580]">{STYLE_DESCS[style]}</p>
      </div>
    </button>
  );
}

// ─── Flower Bouquet ──────────────────────────────────────────────────────────

const RIBBON_COLORS: Record<FlowerChoice, string> = {
  tulips:     "#9B59B6",
  lilies:     "#E8A0A0",
  jasmine:    "#A8D5A2",
  peonies:    "#E0607E",
  sunflowers: "#F5C060",
};

// All 5 flowers always shown in the bouquet.
// Each entry: { src, left, top, rotation, headSize, stemCx, stemCy }
// stemCx/stemCy = approximate base of stem in SVG coords
const BOUQUET_LAYOUT = [
  { src: "/f1.png", l: 8,   t: 0,  r: -18, s: 70, cx: 43,  cy: 70  }, // tulip   — back-left
  { src: "/f3.png", l: 80,  t: -4, r: 0,   s: 73, cx: 116, cy: 69  }, // jasmine — back-center
  { src: "/f4.png", l: 152, t: 0,  r: 18,  s: 70, cx: 187, cy: 70  }, // peony   — back-right
  { src: "/f2.png", l: 25,  t: 58, r: -10, s: 80, cx: 65,  cy: 138 }, // lily    — front-left
  { src: "/f5.png", l: 125, t: 58, r: 10,  s: 80, cx: 165, cy: 138 }, // sunflower — front-right
];
const CONV = { x: 115, y: 200 }; // stem convergence point

const FLOWER_EMOJI: Record<FlowerChoice, string> = {
  tulips: "🌷",
  lilies: "🌸",
  jasmine: "🤍",
  peonies: "🌺",
  sunflowers: "🌻",
};

function FlowerBouquet({ flower, compact }: { flower: FlowerChoice; compact?: boolean }) {
  const ribbon = RIBBON_COLORS[flower];
  const maxW = compact ? "55%" : "100%";

  return (
    <div style={{ position: "relative", width: maxW, margin: "0 auto" }}>
      {/* Watercolor bouquet — mix-blend-mode:multiply removes the white background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bouquet.png"
        alt="flower bouquet"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          mixBlendMode: "multiply",
          display: "block",
        }}
      />
      {/* Flower emoji overlay to show selection */}
      <div style={{
        position: "absolute",
        top: "8%",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: compact ? 28 : 36,
        textShadow: `0 2px 8px ${ribbon}66`,
      }}>
        {FLOWER_EMOJI[flower]}
      </div>
      {/* Ribbon accent at the stem tie, colour matches selection */}
      <svg
        viewBox="0 0 220 30"
        style={{ position: "absolute", bottom: "8%", left: 0, width: "100%", height: "12%", overflow: "visible" }}
      >
        <path d={`M88,8 Q110,2 132,8 L130,22 Q110,28 90,22 Z`} fill={ribbon} opacity="0.55" />
        <path d={`M88,8 Q110,14 132,8`} fill="none" stroke={ribbon} strokeWidth="1.2" opacity="0.6" />
        <path d={`M92,21 Q80,32 75,28 Q81,19 93,22`} fill={ribbon} opacity="0.65" />
        <path d={`M128,21 Q140,32 145,28 Q139,19 127,22`} fill={ribbon} opacity="0.65" />
        <circle cx="110" cy="22" r="4" fill={ribbon} opacity="0.85" />
      </svg>
    </div>
  );
}

// ─── Step Dots ───────────────────────────────────────────────────────────────

function StepDots({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-2 justify-center mb-8">
      {([1, 2, 3] as const).map((n) => (
        <div
          key={n}
          className="rounded-full transition-all duration-300"
          style={{
            width: n === current ? 20 : 8,
            height: 8,
            backgroundColor: n <= current ? "#E8A0A0" : "#E8E2DA",
          }}
        />
      ))}
    </div>
  );
}

// ─── Quill Loading ───────────────────────────────────────────────────────────

function QuillAnimation() {
  return (
    <div className="flex flex-col items-center gap-6 py-20">
      <motion.div
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="text-6xl select-none"
      >
        🪶
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 180 }}
        transition={{ duration: 3.5, ease: "linear" }}
        className="h-0.5 rounded-full"
        style={{ backgroundColor: "#E8A0A0" }}
      />
      <p style={{ color: "#8a8580", fontSize: 15 }}>Writing something just for her...</p>
    </div>
  );
}

// ─── Final Card ──────────────────────────────────────────────────────────────

function FinalCard({
  cardStyle,
  imageDataUrl,
  flowerChoice,
  mumName,
  poem,
  userName,
}: {
  cardStyle: CardStyleId;
  imageDataUrl: string | null;
  flowerChoice: FlowerChoice | null;
  mumName: string;
  poem: string;
  userName: string;
}) {
  const { x: padX, y: padY } = CARD_PADDING[cardStyle];

  return (
    <div
      id="mothers-card"
      className="relative overflow-hidden rounded-2xl"
      style={{
        width: "min(320px, calc(100vw - 40px))",
        aspectRatio: "2/3",
        boxShadow: "0 8px 48px rgba(0,0,0,0.14)",
      }}
    >
      {/* Card background image (frame) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CARD_BG[cardStyle]}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          display: "block",
        }}
      />

      {/* Content sits on top of the image, padded to stay inside frame */}
      <div
        className="relative z-10 flex flex-col items-center h-full overflow-hidden"
        style={{ padding: `${padY}px ${padX}px` }}
      >
        {/* Title */}
        <p
          className="text-center flex-shrink-0"
          style={{
            fontFamily: pinyonScript.style.fontFamily,
            fontSize: 20,
            color: "#C9748A",
            letterSpacing: "0.02em",
            marginBottom: 8,
          }}
        >
          Happy Mother&apos;s Day
        </p>

        {/* Image or Bouquet — capped so it never pushes poem out */}
        <div
          className="flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ width: "100%", maxHeight: "28%", marginBottom: 6 }}
        >
          {imageDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageDataUrl}
              alt="Her photo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 10,
                filter: "saturate(0.8) contrast(0.9) brightness(1.1) sepia(0.15)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            />
          ) : flowerChoice ? (
            <FlowerBouquet flower={flowerChoice} compact />
          ) : null}
        </div>

        {/* Poem */}
        <div className="flex-1 flex items-center justify-center px-1 overflow-hidden">
          <p
            className="text-center"
            style={{
              fontFamily: pinyonScript.style.fontFamily,
              fontSize: 15,
              color: "#2a1a1a",
              whiteSpace: "pre-line",
              lineHeight: 1.45,
            }}
          >
            {poem}
          </p>
        </div>

        {/* Signature */}
        <div className="flex-shrink-0 mt-1 w-full flex justify-end">
          <p
            style={{
              fontFamily: pinyonScript.style.fontFamily,
              fontSize: 13,
              color: "#C9748A",
            }}
          >
            With love, {userName}
          </p>
        </div>

        {/* Watermark */}
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1">
          <span style={{ fontSize: 9 }}>🦸‍♀️</span>
          <span style={{ fontSize: 7, color: "#C9748A", fontWeight: 500, letterSpacing: "0.05em" }}>
            SUPERMUM
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.28 },
};

export default function MothersDayCardPage() {
  const [step, setStep] = useState<Step>("landing");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alreadyCaptured, setAlreadyCaptured] = useState(false);

  useEffect(() => {
    if (isLeadCaptured()) {
      setAlreadyCaptured(true);
      const saved = getSavedLead();
      if (saved) {
        setName(saved.name);
        setPhone(saved.phone.replace("+91", ""));
      }
    }
  }, []);
  const [cardStyle, setCardStyle] = useState<CardStyleId>(1);
  const [imageMode, setImageMode] = useState<"photo" | "flowers" | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [flowerChoice, setFlowerChoice] = useState<FlowerChoice | null>(null);
  const [selectedMumTag, setSelectedMumTag] = useState<string>("Maa");
  const [customMumName, setCustomMumName] = useState("");
  const [trait, setTrait] = useState("");
  const [poem, setPoem] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const mumName = selectedMumTag === "Other" ? customMumName.trim() : selectedMumTag;

  function validateLanding() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Enter your name";
    if (!alreadyCaptured && !/^\d{10}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    if (!validateLanding()) return;
    if (!alreadyCaptured) {
      saveLead(name.trim(), `${countryCode}${phone.replace(/\s/g, "")}`, "mothers-card");
    }
    setStep("step1");
  }

  function handleStyleSelect(style: CardStyleId) {
    setCardStyle(style);
    setTimeout(() => setStep("step2"), 180);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageDataUrl(ev.target?.result as string);
      setImageMode("photo");
    };
    reader.readAsDataURL(file);
  }

  function handleFlowerSelect(flower: FlowerChoice) {
    setFlowerChoice(flower);
    setImageMode("flowers");
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!mumName || !trait.trim()) return;
    setStep("loading");

    // Lead already saved in handleStart

    try {
      const res = await fetch("/api/mothers-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mumName, trait: trait.trim() }),
      });
      const data = await res.json();
      setPoem(
        data.poem ||
          `${mumName}, in your ${trait} I found my whole world,\nEvery morning I wake up carrying something of yours with me,\nThank you for making love feel like a place I can always come home to.`
      );
    } catch {
      setPoem(
        `${mumName}, in your ${trait} I found my whole world,\nEvery morning I wake up carrying something of yours with me,\nThank you for making love feel like a place I can always come home to.`
      );
    }
    setStep("step4");
  }

  function handleWhatsApp() {
    const msg = encodeURIComponent(`Made this for you with love ❤️\n\n${poem}\n\n— ${name}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  function handleDownload() {
    window.print();
  }

  function handleReset() {
    setStep("landing");
    setCardStyle(1);
    setImageMode(null);
    setImageDataUrl(null);
    setFlowerChoice(null);
    setSelectedMumTag("Maa");
    setCustomMumName("");
    setTrait("");
    setPoem("");
    setErrors({});
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-16"
      style={{ backgroundColor: "#FDF6E3" }}
    >
      <AnimatePresence mode="wait">
        {/* ── LANDING ── */}
        {step === "landing" && (
          <motion.div key="landing" {...slide} className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🌸</div>
              <h1 className="font-display text-4xl text-[#2a1a1a] leading-tight mb-3">
                Make something beautiful for your Mum.
              </h1>
              <p className="text-[#8a8580] text-base leading-relaxed">
                Let&apos;s celebrate our superwoman every day.
              </p>
            </div>
            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-5 py-4 rounded-2xl border border-[#E8E2DA] bg-white text-[#2a1a1a] text-[15px] placeholder:text-[#8a8580]/60 focus:outline-none focus:ring-2 focus:ring-[#E8A0A0]/40 transition"
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-500 pl-1">{errors.name}</p>}
              </div>
              {!alreadyCaptured && (
                <div>
                  <div className="flex rounded-2xl border border-[#E8E2DA] bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#E8A0A0]/40">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-2 py-4 text-[14px] text-[#8a8580] font-medium bg-[#F5F0EA] border-r border-[#E8E2DA] focus:outline-none cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="flex-1 px-4 py-4 bg-transparent text-[#2a1a1a] text-[15px] placeholder:text-[#8a8580]/60 focus:outline-none"
                    />
                  </div>
                  {errors.phone && <p className="mt-1.5 text-xs text-red-500 pl-1">{errors.phone}</p>}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-medium text-[15px] active:scale-[0.98] transition-all mt-2 cursor-pointer"
                style={{ backgroundColor: "#E8A0A0", color: "#FDF6E3" }}
              >
                Let&apos;s Begin →
              </button>
            </form>
            <p className="text-center text-xs text-[#8a8580]/60 mt-6">Your data stays private. Always.</p>
          </motion.div>
        )}

        {/* ── STEP 1: Card Style ── */}
        {step === "step1" && (
          <motion.div key="step1" {...slide} className="w-full max-w-sm">
            <StepDots current={1} />
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl text-[#2a1a1a] leading-tight mb-2">Pick your card</h2>
              <p className="text-[#8a8580] text-sm">Each one is beautifully illustrated, just for her.</p>
            </div>
            <div className="grid grid-cols-2 gap-6 justify-items-center">
              {([1, 2, 3, 4] as CardStyleId[]).map((id) => (
                <StyleThumbnail
                  key={id}
                  style={id}
                  selected={cardStyle === id}
                  onClick={() => handleStyleSelect(id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Image or Flowers ── */}
        {step === "step2" && (
          <motion.div key="step2" {...slide} className="w-full max-w-sm">
            <StepDots current={2} />
            <div className="text-center mb-6">
              <h2 className="font-display text-3xl text-[#2a1a1a] leading-tight mb-2">
                Add something beautiful
              </h2>
              <p className="text-[#8a8580] text-sm">A photo of her, or pick her favourite flowers.</p>
            </div>
            <div className="space-y-4">
              {/* Photo upload */}
              <div
                className="rounded-2xl p-5 border-2 cursor-pointer transition-all"
                style={{
                  borderColor: imageMode === "photo" ? "#E8A0A0" : "#E8E2DA",
                  backgroundColor: imageMode === "photo" ? "#FFF5F5" : "white",
                }}
                onClick={() => fileRef.current?.click()}
              >
                <p className="font-medium text-[#2a1a1a] mb-1">Upload her photo</p>
                <p className="text-sm text-[#8a8580] mb-3">We&apos;ll give it a warm, painted feel</p>
                {imageDataUrl ? (
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageDataUrl}
                      alt="Preview"
                      className="w-full h-28 object-cover rounded-xl"
                      style={{ filter: "saturate(0.8) contrast(0.9) brightness(1.1) sepia(0.15)" }}
                    />
                    <p className="text-xs text-[#E8A0A0] mt-2 text-center">Looking beautiful ✓</p>
                  </div>
                ) : (
                  <div
                    className="rounded-xl border-2 border-dashed h-14 flex items-center justify-center"
                    style={{ borderColor: "#E8E2DA" }}
                  >
                    <span className="text-sm text-[#8a8580]">Tap to upload JPG / PNG</span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              {/* Flower picker */}
              <div
                className="rounded-2xl p-5 border-2 transition-all"
                style={{
                  borderColor: imageMode === "flowers" ? "#E8A0A0" : "#E8E2DA",
                  backgroundColor: imageMode === "flowers" ? "#FFF5F5" : "white",
                }}
              >
                <p className="font-medium text-[#2a1a1a] mb-1">Choose her flowers</p>
                <p className="text-sm text-[#8a8580] mb-3">Pick her favourite bouquet</p>

                {/* Preview selected bouquet */}
                {flowerChoice && imageMode === "flowers" && (
                  <div className="flex justify-center mb-3">
                    <FlowerBouquet flower={flowerChoice} />
                  </div>
                )}

                <div className="grid grid-cols-5 gap-2">
                  {FLOWERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleFlowerSelect(f.id)}
                      className="flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all cursor-pointer"
                      style={{
                        borderColor: flowerChoice === f.id ? "#E8A0A0" : "#E8E2DA",
                        backgroundColor: flowerChoice === f.id ? "#FFF0F0" : "#FAFAFA",
                      }}
                    >
                      <span className="text-2xl">{f.emoji}</span>
                      <span className="text-[10px] text-[#2a1a1a] font-medium leading-tight text-center">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {imageMode && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setStep("step3")}
                  className="w-full mt-5 py-4 rounded-2xl font-medium text-[15px] active:scale-[0.98] transition-all cursor-pointer"
                  style={{ backgroundColor: "#E8A0A0", color: "#FDF6E3" }}
                >
                  Continue →
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── STEP 3: About Mum ── */}
        {step === "step3" && (
          <motion.div key="step3" {...slide} className="w-full max-w-sm">
            <StepDots current={3} />
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl text-[#2a1a1a] leading-tight mb-2">
                Tell us about her
              </h2>
            </div>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <p className="text-sm font-medium text-[#2a1a1a] mb-3">What do you call her?</p>
                <div className="flex flex-wrap gap-2">
                  {MUM_NAMES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setSelectedMumTag(n)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer"
                      style={{
                        backgroundColor: selectedMumTag === n ? "#E8A0A0" : "#F0EBE3",
                        color: selectedMumTag === n ? "#FDF6E3" : "#2a1a1a",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {selectedMumTag === "Other" && (
                  <input
                    type="text"
                    value={customMumName}
                    onChange={(e) => setCustomMumName(e.target.value)}
                    placeholder="What do you call her?"
                    className="mt-3 w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-[#2a1a1a] text-sm focus:outline-none focus:ring-2 focus:ring-[#E8A0A0]/40"
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[#2a1a1a] mb-2">
                  One thing about her you admire the most.
                </p>
                <input
                  type="text"
                  value={trait}
                  onChange={(e) => setTrait(e.target.value)}
                  placeholder="Her strength, her laugh, her patience..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-[#2a1a1a] text-sm focus:outline-none focus:ring-2 focus:ring-[#E8A0A0]/40"
                />
              </div>
              <button
                type="submit"
                disabled={!mumName || !trait.trim()}
                className="w-full py-4 rounded-2xl font-medium text-[15px] active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer"
                style={{ backgroundColor: "#E8A0A0", color: "#FDF6E3" }}
              >
                Generate her card →
              </button>
            </form>
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-sm flex flex-col items-center"
          >
            <QuillAnimation />
          </motion.div>
        )}

        {/* ── STEP 4: Final Card ── */}
        {step === "step4" && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full flex flex-col items-center gap-5"
          >
            <FinalCard
              cardStyle={cardStyle}
              imageDataUrl={imageDataUrl}
              flowerChoice={flowerChoice}
              mumName={mumName}
              poem={poem}
              userName={name}
            />
            <div className="w-full max-w-[320px] space-y-3">
              <button
                onClick={handleWhatsApp}
                className="w-full py-4 rounded-2xl font-medium text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: "#25D366", color: "white" }}
              >
                Send to her on WhatsApp 💚
              </button>
              <button
                onClick={handleDownload}
                className="w-full py-3.5 rounded-2xl font-medium text-[15px] active:scale-[0.98] transition-all border cursor-pointer"
                style={{ borderColor: "#E8E2DA", backgroundColor: "white", color: "#2a1a1a" }}
              >
                Download card 📥
              </button>
              <button
                onClick={handleReset}
                className="w-full text-sm text-[#8a8580] hover:text-[#2a1a1a] transition py-2 cursor-pointer"
              >
                Make another card
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
