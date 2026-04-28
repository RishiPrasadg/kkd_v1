export async function POST(request: Request) {
  const { phone, name, yogaAge, message } = await request.json();

  if (!phone || !yogaAge) {
    return Response.json({ error: "Phone and result are required" }, { status: 400 });
  }

  // ─── Option 1: WhatsApp Business Cloud API (Meta) ───
  // Set these in your .env.local file:
  //   WHATSAPP_TOKEN=your_permanent_token
  //   WHATSAPP_PHONE_ID=your_phone_number_id
  //
  // This sends a template-free text message to the user.
  // You need a verified WhatsApp Business account for this.

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  if (!token || !phoneId) {
    // Fallback: log it and return success (for dev/testing)
    console.log(`[WhatsApp] Would send to ${phone}:`);
    console.log(`Hi ${name}! Your Yoga Age is: ${yogaAge}. ${message}`);
    return Response.json({
      success: true,
      note: "WhatsApp credentials not configured. Message logged to console.",
    });
  }

  // Clean phone number: remove spaces, dashes, and leading +
  const cleanPhone = phone.replace(/[\s\-\+]/g, "");

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: cleanPhone,
          type: "text",
          text: {
            body: `🧘 *Your Yoga Age Result*\n\nHi ${name}!\n\n*${yogaAge}*\n${message}\n\n— YogaTools`,
          },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("[WhatsApp API Error]", data);
      return Response.json({ error: "Failed to send WhatsApp message" }, { status: 500 });
    }

    return Response.json({ success: true, messageId: data.messages?.[0]?.id });
  } catch (err) {
    console.error("[WhatsApp Error]", err);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
