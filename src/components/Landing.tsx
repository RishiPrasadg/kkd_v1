"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { isLeadCaptured, getSavedLead, saveLead } from "@/lib/leads";
import { COUNTRY_CODES } from "@/lib/countryCodes";

type UserData = { name: string; phone: string; age: number };

export default function Landing({
  onStart,
}: {
  onStart: (user: UserData) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [age, setAge] = useState("");
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

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!alreadyCaptured && !/^\d{10}$/.test(phone.replace(/\s/g, "")))
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
    const cleanPhone = phone.replace(/\s/g, "");
    if (!alreadyCaptured) {
      saveLead(name.trim(), `${countryCode}${cleanPhone}`, "quiz");
    }
    onStart({
      name: name.trim(),
      phone: `${countryCode}${cleanPhone}`,
      age: parseInt(age, 10),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      className="min-h-[100dvh] flex flex-col items-center justify-center px-5 py-16"
      style={{
        background:
          "radial-gradient(ellipse at 55% 30%, #D94F2C 0%, #E86B2B 18%, #F5923B 38%, #F9BF7A 58%, #FDE0B8 78%, #FDF3EB 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-[2.5rem] sm:text-5xl leading-[1.1] text-white drop-shadow-md">
            Aapki Body Ka
            <span className="block text-white/90 mt-1">Yoga Age Kya Hai?</span>
          </h1>
          <p className="mt-5 text-base text-white/80 leading-relaxed">
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
              className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/70 text-dark text-[15px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/70 transition backdrop-blur-sm"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-700 pl-1">{errors.name}</p>
            )}
          </div>

          {!alreadyCaptured && (
            <div>
              <div className="flex rounded-2xl border border-white/40 bg-white/70 backdrop-blur-sm overflow-hidden focus-within:ring-2 focus-within:ring-white/60">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-2 py-4 text-[14px] text-stone-600 font-medium border-r border-white/30 bg-white/30 focus:outline-none cursor-pointer"
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
                  className="flex-1 px-4 py-4 bg-transparent text-dark text-[15px] placeholder:text-stone-400 focus:outline-none"
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-700 pl-1">{errors.phone}</p>
              )}
            </div>
          )}

          <div>
            <input
              type="number"
              min={18}
              max={80}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age (18-80)"
              className="w-full px-5 py-4 rounded-2xl border border-white/40 bg-white/70 text-dark text-[15px] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/70 transition backdrop-blur-sm"
            />
            {errors.age && (
              <p className="mt-1.5 text-xs text-red-600 pl-1">{errors.age}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-stone-900 text-white font-medium text-[15px] hover:bg-stone-800 active:scale-[0.98] transition-all cursor-pointer mt-2 shadow-lg"
          >
            Shuru Karo &rarr;
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-white/50 mt-8"
        >
          Your data stays private. Always.
        </motion.p>
      </div>
    </motion.div>
  );
}
