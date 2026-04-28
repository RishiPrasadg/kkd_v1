// ─── Shared lead helpers ──────────────────────────────────────────────────
// Stores phone in localStorage after first submission to prevent duplicates.
// All lead capture forms should check isLeadCaptured() before showing the form
// and call saveLead() after successful submission.

const STORAGE_KEY = "kkd_lead";

export type LeadData = { name: string; phone: string };

/** Check if user already submitted their details */
export function isLeadCaptured(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(STORAGE_KEY);
}

/** Get the saved lead (name + phone) */
export function getSavedLead(): LeadData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Save lead to localStorage + POST to /api/leads */
export async function saveLead(name: string, phone: string, source: string): Promise<void> {
  const fullPhone = phone.startsWith("+") ? phone : `+91${phone.replace(/\s/g, "")}`;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, phone: fullPhone }));

  try {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone: fullPhone }),
    });
  } catch {
    // Don't block UX
  }
}
