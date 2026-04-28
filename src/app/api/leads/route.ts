const SHEET_URL =
  "https://script.google.com/macros/s/AKfycby0Of9rjsfLVIjNJLbKpXJYQCyMgvgv_q8GGzabKW7t1FUaDXefRtxqxpsQGgooEv4H/exec";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, phone } = body;

  if (!name || !phone) {
    return Response.json({ error: "Name and phone are required" }, { status: 400 });
  }

  try {
    await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
  } catch {
    // Silently fail — don't block the user experience
  }

  return Response.json({ success: true });
}
