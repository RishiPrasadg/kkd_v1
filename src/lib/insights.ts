import type { ResultKey } from "./scoring";

type Insight = { line1: string; line2: string };
type AgeBucket = "young" | "mid" | "older";

const INSIGHTS: Record<ResultKey, Record<AgeBucket, Insight[]>> = {
  mast: {
    young: [
      { line1: "Your body\u2019s still got that easy, springy feel \u2014 don\u2019t take it for granted.", line2: "Try 10 minutes of stretching today, just to keep this going." },
      { line1: "You\u2019re moving like someone who actually likes their body.", line2: "Hold a deep breath for 30 seconds today \u2014 feel how good that is." },
    ],
    mid: [
      { line1: "Most people your age are stiffer than this \u2014 you\u2019ve clearly been kind to your body.", line2: "Add 5 minutes of morning stretching today and you\u2019ll feel it tomorrow." },
      { line1: "Your body\u2019s holding up beautifully. This is what consistency looks like.", line2: "Take a 15-minute walk after lunch today, no phone." },
    ],
    older: [
      { line1: "Honestly, your body\u2019s behaving younger than your years. That\u2019s rare.", line2: "Sit on the floor for 10 minutes today while watching TV \u2014 your hips will thank you." },
    ],
  },
  chalti: {
    young: [
      { line1: "You\u2019re doing okay, but \u2018okay\u2019 at your age means you\u2019re already drifting.", line2: "Try touching your toes once every morning this week. That\u2019s it." },
      { line1: "Your body isn\u2019t complaining yet, but it\u2019s starting to mumble.", line2: "Stand up and stretch your arms overhead right now. Make it a habit." },
    ],
    mid: [
      { line1: "You\u2019re managing \u2014 but your body\u2019s quietly asking for a little more attention.", line2: "Just 10 deep breaths before bed tonight. Start there." },
      { line1: "Nothing\u2019s broken, but nothing\u2019s thriving either. Familiar feeling?", line2: "Walk for 20 minutes today without your phone. See what shifts." },
    ],
    older: [
      { line1: "You\u2019ve been getting by, but your body\u2019s ready for you to show up properly.", line2: "Sit cross-legged on the floor for 5 minutes this evening. That\u2019s the start." },
    ],
  },
  signals: {
    young: [
      { line1: "Your body\u2019s been throwing small signals for a while \u2014 at your age, that\u2019s a wake-up call.", line2: "Skip one chair today. Sit on the floor for a meal instead." },
      { line1: "Stiffness this young usually means a desk job is winning. Time to push back.", line2: "Set a timer to stand and stretch every hour today." },
    ],
    mid: [
      { line1: "Your body\u2019s been whispering for a while now. The aches, the stiffness \u2014 none of it is random.", line2: "Try 10 minutes of gentle stretching tonight before bed. Just start." },
      { line1: "What you\u2019re feeling isn\u2019t aging \u2014 it\u2019s neglect dressed up as aging.", line2: "Walk barefoot in your house today. Feel your feet again." },
    ],
    older: [
      { line1: "Your body\u2019s been patient with you. It\u2019s earned a little care back.", line2: "Sit and breathe deeply for 5 minutes today. Nothing more." },
    ],
  },
  badi: {
    young: [
      { line1: "Honestly, your body shouldn\u2019t feel this tired this young. This is fixable, but only if you start.", line2: "Pick one thing today \u2014 drink water, stretch for 5 minutes, walk after dinner. Just one." },
    ],
    mid: [
      { line1: "Your body\u2019s been carrying a lot quietly. It\u2019s not too late, but today matters more than tomorrow.", line2: "Lie down on the floor tonight and just breathe for 10 minutes. That\u2019s the whole task." },
      { line1: "This is your body asking \u2014 not telling \u2014 for change. The next move is yours.", line2: "Take a 10-minute slow walk today. No goals, just movement." },
    ],
    older: [
      { line1: "Your body has been loyal to you for decades. Now it needs you to be loyal back.", line2: "Sit by a window today and take 20 slow breaths. That\u2019s enough to begin." },
    ],
  },
};

const getAgeBucket = (age: number): AgeBucket => {
  if (age < 35) return "young";
  if (age < 55) return "mid";
  return "older";
};

export function getInsight(resultKey: ResultKey, age: number): Insight {
  const bucket = getAgeBucket(age);
  const pool = INSIGHTS[resultKey][bucket];
  return pool[Math.floor(Math.random() * pool.length)];
}
