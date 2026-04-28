import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { mumName, trait } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ poem: fallback(mumName, trait) });
  }

  const prompt = `Write a short, beautiful, personal poem or quote for a mother.
The child calls her: ${mumName}
The one thing they admire most: ${trait}
Write exactly 3 lines.
Warm, emotional, poetic. Not generic.
Use the word they call her (${mumName}) naturally.
Do not rhyme forcefully — let it flow naturally.
Do not use clichés like 'you are my sunshine' or 'wings to fly'.
Write like a real person expressing real love.
Language: English with one optional Hindi/Hinglish word if it feels natural.
Do not add any title or label. Just the 3 lines.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    const poem = data.content?.[0]?.text?.trim() || fallback(mumName, trait);
    return NextResponse.json({ poem });
  } catch {
    return NextResponse.json({ poem: fallback(mumName, trait) });
  }
}

function fallback(mumName: string, trait: string): string {
  return `${mumName}, in your ${trait} I found my whole world,\nEvery morning I wake up carrying something of yours with me,\nThank you for making love feel like a place I can always come home to.`;
}
