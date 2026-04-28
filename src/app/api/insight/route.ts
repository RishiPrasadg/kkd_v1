import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { age, yogaAge, resultName } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fallback static insights when API key isn't configured
    return NextResponse.json({
      insight: getStaticInsight(age, yogaAge, resultName),
    });
  }

  try {
    const prompt = `The user is ${age} years old. Their Yoga Age came out to ${yogaAge}. Their result type is ${resultName}. Write exactly 2 lines — warm, simple, conversational, no jargon. First line: what this means for their body right now. Second line: one small thing they can do today. Do not use words like core, flexibility, metabolism, posture. Write like a caring friend, not a doctor.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || getStaticInsight(age, yogaAge, resultName);

    return NextResponse.json({ insight: text });
  } catch {
    return NextResponse.json({
      insight: getStaticInsight(age, yogaAge, resultName),
    });
  }
}

function getStaticInsight(age: number, yogaAge: number, resultName: string): string {
  if (yogaAge < age) {
    return `Your body's holding up well for ${age} — that's something to feel good about.\nTry sitting on the floor for 10 minutes tonight instead of the couch.`;
  }
  if (yogaAge === age || Math.abs(yogaAge - age) <= 2) {
    return `Your body's doing okay, but it's quietly asking for a little more attention.\nTake a slow 15-minute walk after dinner today — no phone, just you.`;
  }
  if (resultName === "Body Boli Bas Karo") {
    return `Your body has been carrying more than it should for a while now. It's ready for you to start.\nLie on the floor tonight for 10 minutes and just breathe. That's the whole task.`;
  }
  return `At ${age}, your body shouldn't feel like it's ${yogaAge}. But that's fixable.\nStretch for just 5 minutes before bed tonight — start there.`;
}
