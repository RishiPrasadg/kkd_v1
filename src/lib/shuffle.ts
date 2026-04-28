export function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick `count` random items from `array` using Fisher-Yates */
export function pickRandom<T>(array: T[], count: number): T[] {
  return shuffle(array).slice(0, count);
}
