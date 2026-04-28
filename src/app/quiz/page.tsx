"use client";

import { useState, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { QUESTIONS, type Question } from "@/lib/questions";
import { calculateYogaAge, type Result as ResultType } from "@/lib/scoring";
import { pickRandom } from "@/lib/shuffle";
import Landing from "@/components/Landing";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import Result from "@/components/Result";
import QuizCharacter from "@/components/illustrations/Character";

type Step = "landing" | "quiz" | "submitting" | "result";
type UserData = { name: string; phone: string; age: number };

const QUESTIONS_PER_SESSION = 5;

// 5 background colors — one per question
const BG_COLORS = [
  "#FDE8D8", // warm peach
  "#FCE0C8", // light coral
  "#FAD8B8", // apricot
  "#F9D0A8", // amber peach
  "#F8E4CC", // soft cream
];

export default function QuizPage() {
  const [step, setStep] = useState<Step>("landing");
  const [user, setUser] = useState<UserData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<ResultType | null>(null);

  // Pick 5 random questions from the bank of 15
  const questions: Question[] = useMemo(
    () => pickRandom(QUESTIONS, QUESTIONS_PER_SESSION),
    []
  );

  const handleStart = useCallback((userData: UserData) => {
    setUser(userData);
    setStep("quiz");
  }, []);

  const handleAnswer = useCallback(
    async (score: number) => {
      const newAnswers = [...answers, score];
      setAnswers(newAnswers);

      if (currentIndex + 1 < QUESTIONS_PER_SESSION) {
        setCurrentIndex((i) => i + 1);
      } else {
        setStep("submitting");
        const totalScore = newAnswers.reduce((a, b) => a + b, 0);
        const res = calculateYogaAge(totalScore, user!.age);
        setResult(res);

        // Submit (non-blocking — show result even if this fails)
        try {
          await fetch("/api/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user!.name,
              phone: user!.phone,
              age: user!.age,
              yogaAge: res.yogaAge,
              score: res.score,
              resultType: res.resultKey,
            }),
          });
        } catch {
          // still show result
        }

        setStep("result");
      }
    },
    [answers, currentIndex, user]
  );

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
