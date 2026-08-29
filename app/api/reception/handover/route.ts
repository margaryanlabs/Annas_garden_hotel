import { NextResponse } from "next/server";
import { isReceptionAuthorized, receptionConfigured } from "../../../../lib/reception-auth";
import { createShiftHandover } from "../../../../lib/reception-operations";

export async function POST(request: Request) {
  if (!receptionConfigured()) return NextResponse.json({ error: "Reception access is not configured" }, { status: 503 });
  if (!isReceptionAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 1500) : "";
  const createdBy = typeof body.createdBy === "string" ? body.createdBy.trim().slice(0, 100) : "";
  if (!message) return NextResponse.json({ error: "Handover note is required" }, { status: 400 });
  try {
    const handover = await createShiftHandover({
      id: `HO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      message,
      createdBy,
      pinned: Boolean(body.pinned),
    });
    return NextResponse.json({ handover });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create handover" }, { status: 502 });
  }
}
