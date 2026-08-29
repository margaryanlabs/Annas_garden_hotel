import { NextResponse } from "next/server";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "995599521751";
const WEBHOOK = process.env.GUEST_REQUEST_WEBHOOK_URL || "";
const WEBHOOK_TOKEN = process.env.GUEST_REQUEST_WEBHOOK_TOKEN || "";

type GuestPayload = {
  id?: string;
  type?: string;
  label?: string;
  message?: string;
  note?: string;
  profile?: { name?: string; room?: string; lang?: string; checkOut?: string };
};

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as GuestPayload;
  const id = clean(body.id, 40) || `AG-${Date.now().toString(36).toUpperCase()}`;
  const type = clean(body.type, 60);
  const label = clean(body.label, 100);
  const message = clean(body.message, 800);
  const note = clean(body.note, 800);
  const guest = clean(body.profile?.name, 100);
  const room = clean(body.profile?.room, 30);
  const lang = clean(body.profile?.lang, 10);
  const checkOut = clean(body.profile?.checkOut, 20);

  if (!type || !label || !guest || !room) {
    return NextResponse.json({ error: "Missing request details" }, { status: 400 });
  }

  const normalized = {
    event: "hotel.guest_request",
    hotel: "Anna's Garden Hotel",
    id,
    type,
    label,
    message,
    note,
    guest: { name: guest, room, lang, checkOut },
    createdAt: new Date().toISOString(),
  };

  const whatsappText = [
    "Anna's Garden Hotel guest request",
    `Ticket: ${id}`,
    `Guest: ${guest}`,
    `Room: ${room}`,
    `Request: ${label}`,
    message,
    note ? `Note: ${note}` : "",
  ].filter(Boolean).join("\n");
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappText)}`;

  if (!WEBHOOK) {
    return NextResponse.json({ delivered: false, mode: "whatsapp", whatsappUrl, id });
  }

  try {
    const response = await fetch(WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(WEBHOOK_TOKEN ? { Authorization: `Bearer ${WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(normalized),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json({ delivered: false, mode: "whatsapp", whatsappUrl, id, webhookStatus: response.status });
    }

    return NextResponse.json({ delivered: true, mode: "webhook", id });
  } catch {
    return NextResponse.json({ delivered: false, mode: "whatsapp", whatsappUrl, id });
  }
}
