"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type UserData = { name: string; phone: string; age: number };

export default function Landing({
  onStart,
}: {
  onStart: (user: UserData) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^\d{10}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit phone number";
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 80)
      e.age = "Age must be between 18 and 80";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onStart({
      name: name.trim(),
      phone: phone.replace(/\s/g, ""),
      age: parseInt(age, 10),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-16 bg-peach"
    >
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-[2.5rem] sm:text-5xl leading-[1.1] text-dark">
            Aapki Body Ka
            <span className="block text-terracotta mt-1">Yoga Age Kya Hai?</span>
          </h1>
          <p className="mt-5 text-base text-muted leading-relaxed">
            5 simple questions. Find out in 2 minutes.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-5 py-4 rounded-2xl border border-option-border bg-card text-dark text-[15px] placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/40 transition"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600 pl-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit phone number"
              className="w-full px-5 py-4 rounded-2xl border border-option-border bg-card text-dark text-[15px] placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/40 transition"
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-600 pl-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              min={18}
              max={80}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age (18-80)"
              className="w-full px-5 py-4 rounded-2xl border border-option-border bg-card text-dark text-[15px] placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/40 transition"
            />
            {errors.age && (
              <p className="mt-1.5 text-xs text-red-600 pl-1">{errors.age}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-dark text-white font-medium text-[15px] hover:bg-stone-800 active:scale-[0.98] transition-all cursor-pointer mt-2"
          >
            Shuru Karo &rarr;
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted/60 mt-8"
        >
          Your data stays private. Always.
        </motion.p>
      </div>
    </motion.div>
  );
}
