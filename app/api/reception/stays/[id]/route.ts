import { NextResponse } from "next/server";
import { isReceptionAuthorized, receptionConfigured } from "../../../../../lib/reception-auth";
import { StayStatus, updateStay } from "../../../../../lib/reception-operations";

const statuses = new Set<StayStatus>(["booked", "arriving", "checked_in", "checked_out", "cancelled"]);
const clean = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!receptionConfigured()) return NextResponse.json({ error: "Reception access is not configured" }, { status: 503 });
  if (!isReceptionAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const patch: Record<string, string | null> = {};
  if (typeof body.status === "string" && statuses.has(body.status as StayStatus)) patch.status = body.status;
  if (typeof body.room === "string") patch.room = clean(body.room, 30);
  if (typeof body.checkin_date === "string") patch.checkin_date = clean(body.checkin_date, 20);
  if (typeof body.checkout_date === "string") patch.checkout_date = clean(body.checkout_date, 20);
  if (typeof body.booking_ref === "string" || body.booking_ref === null) patch.booking_ref = clean(body.booking_ref, 100) || null;
  if (typeof body.notes === "string" || body.notes === null) patch.notes = clean(body.notes, 1000) || null;
  if (!Object.keys(patch).length) return NextResponse.json({ error: "No valid changes" }, { status: 400 });
  try {
    const stay = await updateStay(id, patch);
    if (!stay) return NextResponse.json({ error: "Stay not found" }, { status: 404 });
    return NextResponse.json({ stay });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update stay" }, { status: 502 });
  }
}
