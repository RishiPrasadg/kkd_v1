"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QUESTIONS, type Question } from "@/lib/questions";
import { calculateYogaAge, type Result as ResultType } from "@/lib/scoring";
import { pickRandom } from "@/lib/shuffle";
import { isLeadCaptured, getSavedLead, saveLead } from "@/lib/leads";
import { COUNTRY_CODES } from "@/lib/countryCodes";
import Landing from "@/components/Landing";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import Result from "@/components/Result";
import QuizCharacter from "@/components/illustrations/Character";

type Step = "landing" | "quiz" | "capture" | "submitting" | "result";
type UserData = { name: string; phone: string; age: number };

const QUESTIONS_PER_SESSION = 5;

const BG_COLORS = [
  "#FDE8D8",
  "#FCE0C8",
  "#FAD8B8",
  "#F9D0A8",
  "#F8E4CC",
];

export default function QuizPage() {
  const [step, setStep] = useState<Step>("landing");
  const [user, setUser] = useState<UserData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [pendingScore, setPendingScore] = useState(0);
  const [result, setResult] = useState<ResultType | null>(null);

  // Capture form state
  const [capName, setCapName] = useState("");
  const [capPhone, setCapPhone] = useState("");
  const [capCountry, setCapCountry] = useState("+91");
  const [capAge, setCapAge] = useState("");
  const [capErrors, setCapErrors] = useState<Record<string, string>>({});
  const [alreadyCaptured, setAlreadyCaptured] = useState(false);

  useEffect(() => {
    if (isLeadCaptured()) {
      setAlreadyCaptured(true);
      const saved = getSavedLead();
      if (saved) {
        setCapName(saved.name);
        setCapPhone(saved.phone.replace(/^\+\d+/, ""));
      }
    }
  }, []);

  const questions: Question[] = useMemo(
    () => pickRandom(QUESTIONS, QUESTIONS_PER_SESSION),
    []
  );

  const handleStart = useCallback(() => setStep("quiz"), []);

  const handleAnswer = useCallback(
    (score: number) => {
      const newAnswers = [...answers, score];
      setAnswers(newAnswers);

      if (currentIndex + 1 < QUESTIONS_PER_SESSION) {
        setCurrentIndex((i) => i + 1);
      } else {
        // Quiz done — store total score and gate on data capture
        setPendingScore(newAnswers.reduce((a, b) => a + b, 0));
        setStep("capture");
      }
    },
    [answers, currentIndex]
  );

  async function handleCapture(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (capName.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!alreadyCaptured && !/^\d{6,15}$/.test(capPhone.replace(/\s/g, "")))
      errs.phone = "Enter a valid phone number";
    const ageNum = parseInt(capAge, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 80)
      errs.age = "Age must be between 18 and 80";
    setCapErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const userData: UserData = {
      name: capName.trim(),
      phone: alreadyCaptured ? capPhone : `${capCountry}${capPhone.replace(/\s/g, "")}`,
      age: ageNum,
    };
    setUser(userData);
    setStep("submitting");

    if (!alreadyCaptured) saveLead(userData.name, userData.phone, "quiz");

    const res = calculateYogaAge(pendingScore, userData.age);
    setResult(res);

    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          age: userData.age,
          yogaAge: res.yogaAge,
          score: res.score,
          resultType: res.resultKey,
        }),
      });
    } catch { /* still show result */ }

    setStep("result");
  }

  return (
    <div
      className="min-h-[100dvh] bg-transition"
      style={{
        backgroundColor:
          step === "quiz"
            ? BG_COLORS[currentIndex] || BG_COLORS[4]
            : step === "landing"
            ? "#D94F2C"
            : step === "submitting"
            ? "#F9BF7A"
            : "transparent",
      }}
    >
      <AnimatePresence mode="wait">
        {step === "landing" && <Landing key="landing" onStart={handleStart} />}

        {step === "quiz" && (
          <div key="quiz" className="min-h-[100dvh]">
            <ProgressBar
              current={currentIndex}
              total={QUESTIONS_PER_SESSION}
            />

            {/* Split layout: illustration left, card right */}
            <div className="min-h-[100dvh] flex flex-col lg:flex-row items-center justify-center px-5 pt-16 pb-8 lg:pt-14 lg:px-12 gap-4 lg:gap-12">
              {/* Illustration */}
              <div className="flex-shrink-0 lg:flex-1 flex items-center justify-center lg:justify-end">
                <AnimatePresence mode="wait">
                  <QuizCharacter
                    key={questions[currentIndex].id}
                    questionId={questions[currentIndex].id}
                  />
                </AnimatePresence>
              </div>

              {/* Question card */}
              <div className="w-full lg:flex-1 lg:max-w-lg">
                <div className="bg-card rounded-3xl border border-option-border/50 p-6 sm:p-8 shadow-sm">
                  <AnimatePresence mode="wait">
                    <QuestionCard
                      key={questions[currentIndex].id}
                      question={questions[currentIndex]}
                      questionNumber={currentIndex + 1}
                      total={QUESTIONS_PER_SESSION}
                      onAnswer={handleAnswer}
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "capture" && (
          <motion.div
            key="capture"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="min-h-[100dvh] flex items-center justify-center px-5 py-16"
            style={{
              background:
                "radial-gradient(ellipse at 55% 30%, #D94F2C 0%, #E86B2B 18%, #F5923B 38%, #F9BF7A 58%, #FDE0B8 78%, #FDF3EB 100%)",
            }}
          >
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🧘</div>
                <h2 className="font-display text-3xl text-white leading-tight mb-2">
                  Your Yoga Age is ready!
                </h2>
                <p className="text-white/75 text-sm leading-relaxed">
                  Enter your details to reveal your result.
                </p>
              </div>
              <form onSubmit={handleCapture} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={capName}
                    onChange={(e) => setCapName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/70 text-dark text-[15px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition backdrop-blur-sm"
                  />
                  {capErrors.name && <p className="mt-1.5 text-xs text-red-700 pl-1">{capErrors.name}</p>}
                </div>
                {!alreadyCaptured && (
                  <div>
                    <div className="flex rounded-2xl border border-white/40 bg-white/70 backdrop-blur-sm overflow-hidden focus-within:ring-2 focus-within:ring-white/60">
                      <select
                        value={capCountry}
                        onChange={(e) => setCapCountry(e.target.value)}
                        className="px-2 py-4 text-[14px] text-stone-600 font-medium border-r border-white/30 bg-white/30 focus:outline-none cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>{c.label}</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={capPhone}
                        onChange={(e) => setCapPhone(e.target.value)}
                        placeholder="Phone number"
                        className="flex-1 px-4 py-4 bg-transparent text-dark text-[15px] placeholder:text-stone-400 focus:outline-none"
                      />
                    </div>
                    {capErrors.phone && <p className="mt-1.5 text-xs text-red-700 pl-1">{capErrors.phone}</p>}
                  </div>
                )}
                <div>
                  <input
                    type="number"
                    min={18}
                    max={80}
                    value={capAge}
                    onChange={(e) => setCapAge(e.target.value)}
                    placeholder="Your age (18–80)"
                    className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/70 text-dark text-[15px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition backdrop-blur-sm"
                  />
                  {capErrors.age && <p className="mt-1.5 text-xs text-red-600 pl-1">{capErrors.age}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-stone-900 text-white font-medium text-[15px] hover:bg-stone-800 active:scale-[0.98] transition-all cursor-pointer mt-2 shadow-lg"
                >
                  Reveal My Yoga Age &rarr;
                </button>
              </form>
              <p className="text-center text-xs text-white/50 mt-6">Your data stays private. Always.</p>
            </div>
          </motion.div>
        )}

        {step === "submitting" && (
          <div
            key="submitting"
            className="min-h-[100dvh] flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-8 h-8 border-[3px] border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted">
                Calculating your Yoga Age...
              </p>
            </div>
          </div>
        )}

        {step === "result" && result && user && (
          <Result
            key="result"
            result={result}
            userName={user.name}
            realAge={user.age}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
