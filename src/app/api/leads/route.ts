import { promises as fs } from "fs";
import path from "path";

const LEADS_FILE = path.join(process.cwd(), "leads.csv");
const CSV_HEADER = "name,phone,gender,age,source,timestamp\n";

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function POST(request: Request) {
  const body = await request.json();
  const { name, phone, gender = "", age = "", source = "" } = body;

  if (!name || !phone) {
    return Response.json({ error: "Name and phone are required" }, { status: 400 });
  }

  const row = [name, phone, gender, age, source, new Date().toISOString()]
    .map(esc)
    .join(",") + "\n";

  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.writeFile(LEADS_FILE, CSV_HEADER, "utf-8");
  }

  await fs.appendFile(LEADS_FILE, row, "utf-8");
  return Response.json({ success: true });
}

export async function GET() {
  try {
    const data = await fs.readFile(LEADS_FILE, "utf-8");
    return new Response(data, { headers: { "Content-Type": "text/csv" } });
  } catch {
    return new Response(CSV_HEADER, { headers: { "Content-Type": "text/csv" } });
  }
}
