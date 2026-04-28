export type ResultKey = "mast" | "chalti" | "signals" | "badi";

export type Result = {
  yogaAge: number;
  resultKey: ResultKey;
  personality: string;
  emoji: string;
  tagline: string;
  score: number;
};

export function calculateYogaAge(score: number, realAge: number): Result {
  // Score range: 0-150 (5 questions x max 30 each)
  // Average user picks option 2 or 3 → typical score ~50-90
  // Buckets tuned so most people land in chalti/signals (shareworthy zone)
  let modifier: number;
  let resultKey: ResultKey;
  let personality: string;
  let emoji: string;
  let tagline: string;

  if (score <= 20) {
    // Only if nearly all best answers — rare
    modifier = -8;
    resultKey = "mast";
    personality = "Mast Hai Bindaas Hai";
    emoji = "\u{1F31F}";
    tagline = "Your body is younger than you. Don't let that change.";
  } else if (score <= 60) {
    modifier = -3;
    resultKey = "chalti";
    personality = "Chalti Ka Naam Gaadi";
    emoji = "\u{1F60A}";
    tagline = "You\u2019re managing. But managing isn\u2019t thriving.";
  } else if (score <= 100) {
    modifier = Math.round((score - 60) / 8); // +0 to +5 gradually
    resultKey = "signals";
    personality = "Body Boli Soch Lo";
    emoji = "\u26A0\uFE0F";
    tagline = "Your body has been sending signals. Time to listen.";
  } else {
    modifier = 8 + Math.round((score - 100) / 10); // +8 to +13
    resultKey = "badi";
    personality = "Body Boli Bas Karo";
    emoji = "\u{1F6A8}";
    tagline = "This isn\u2019t a warning. It\u2019s a conversation you owe yourself.";
  }

  const yogaAge = Math.max(18, Math.min(80, realAge + modifier));
  return { yogaAge, resultKey, personality, emoji, tagline, score };
}
