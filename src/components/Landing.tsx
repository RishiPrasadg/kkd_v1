"use client";

import { motion } from "framer-motion";

export default function Landing({ onStart }: { onStart: () => void }) {
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

        <motion.button
          onClick={onStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full py-4 rounded-2xl bg-stone-900 text-white font-medium text-[15px] hover:bg-stone-800 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
        >
          Shuru Karo &rarr;
        </motion.button>

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
