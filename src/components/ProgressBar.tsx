"use client";

import { motion } from "framer-motion";

export default function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-black/5">
      <motion.div
        className="h-full bg-terracotta"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}
