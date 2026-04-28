"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/lib/questions";

export default function QuestionCard({
  question,
  questionNumber,
  total,
  onAnswer,
}: {
  question: Question;
  questionNumber: number;
  total: number;
  onAnswer: (score: number) => void;
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  function handleSelect(idx: number, score: number) {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    setTimeout(() => onAnswer(score), 400);
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="w-full"
    >
      {/* Counter */}
      <p className="text-center text-sm text-muted mb-8 tracking-wide">
        {questionNumber} of {total}
      </p>

      {/* Question */}
      <h2 className="font-display text-2xl sm:text-[32px] leading-snug text-dark mb-8 sm:mb-10">
        {question.text}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(idx, opt.score)}
              disabled={selectedIdx !== null}
              className={`w-full text-left px-5 py-4 rounded-full border transition-all text-[15px] sm:text-base min-h-[56px] cursor-pointer disabled:cursor-default
                ${
                  isSelected
                    ? "bg-sage-light border-sage text-dark font-medium"
                    : "bg-option-bg border-option-border text-body-text hover:bg-[#F0EBE3] hover:border-[#D4CEC4]"
                }
                active:scale-[0.98]
              `}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
