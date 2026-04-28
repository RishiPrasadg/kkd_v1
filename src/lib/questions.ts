export type Question = {
  id: number;
  text: string;
  options: { label: string; score: number }[];
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Go on, try to touch your toes right now.",
    options: [
      { label: "Palms on the floor", score: 0 },
      { label: "Touched my toes", score: 10 },
      { label: "Got halfway there", score: 20 },
      { label: "Waved at them from up here", score: 30 },
    ],
  },
  {
    id: 2,
    text: "Take a deep breath. Fill your lungs completely.",
    options: [
      { label: "Felt amazing, full chest", score: 0 },
      { label: "Pretty good", score: 10 },
      { label: "Stopped halfway without realising", score: 20 },
      { label: "I don't think I've ever done that", score: 30 },
    ],
  },
  {
    id: 3,
    text: "Turn your neck slowly left. Then right.",
    options: [
      { label: "Smooth both sides", score: 0 },
      { label: "One side is easier", score: 10 },
      { label: "Stiff but gets there", score: 20 },
      { label: "My whole body turns with it", score: 30 },
    ],
  },
  {
    id: 4,
    text: "Right now, without fixing it \u2014 your posture is...",
    options: [
      { label: "Already upright", score: 0 },
      { label: "Slightly hunched", score: 10 },
      { label: "Significantly hunched", score: 20 },
      { label: "I just sat up while reading this", score: 30 },
    ],
  },
  {
    id: 5,
    text: "Walking down stairs, your knees...",
    options: [
      { label: "Feel nothing", score: 0 },
      { label: "Are slightly careful", score: 10 },
      { label: "Prefer slow steps", score: 20 },
      { label: "Always need the railing", score: 30 },
    ],
  },
  {
    id: 6,
    text: "When did your body last feel truly light?",
    options: [
      { label: "Today", score: 0 },
      { label: "This week", score: 10 },
      { label: "Can't remember", score: 20 },
      { label: "I'm not sure it ever has", score: 30 },
    ],
  },
  {
    id: 8,
    text: "After sleeping 7\u20138 hours, you wake up feeling...",
    options: [
      { label: "Rested and light", score: 0 },
      { label: "Okay, takes a minute", score: 10 },
      { label: "More tired than before", score: 20 },
      { label: "Like I never slept", score: 30 },
    ],
  },
  {
    id: 10,
    text: "After sitting for an hour, you stand up and...",
    options: [
      { label: "Feel completely normal", score: 0 },
      { label: "Take a second to straighten", score: 10 },
      { label: "First few steps are stiff", score: 20 },
      { label: "Need a full minute to get going", score: 30 },
    ],
  },
  {
    id: 11,
    text: "Press your thumb into your shoulder right now.",
    options: [
      { label: "Feels fine", score: 0 },
      { label: "Mild tightness", score: 10 },
      { label: "Genuinely sore", score: 20 },
      { label: "Please never do that again", score: 30 },
    ],
  },
];
