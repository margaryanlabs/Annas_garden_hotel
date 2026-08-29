import { NextResponse } from "next/server";
import { isReceptionAuthorized, receptionConfigured } from "../../../../lib/reception-auth";
import { createStay, receptionOperationsConfigured, StayStatus } from "../../../../lib/reception-operations";

const statuses = new Set<StayStatus>(["booked", "arriving", "checked_in", "checked_out", "cancelled"]);
const clean = (value: unknown, max = 200) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  if (!receptionConfigured()) return NextResponse.json({ error: "Reception access is not configured" }, { status: 503 });
  if (!isReceptionAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!receptionOperationsConfigured()) return NextResponse.json({ error: "Reception store is not connected" }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const guestName = clean(body.guestName, 100);
  const room = clean(body.room, 30);
  const checkinDate = clean(body.checkinDate, 20);
  const checkoutDate = clean(body.checkoutDate, 20);
  const bookingRef = clean(body.bookingRef, 100);
  const notes = clean(body.notes, 1000);
  const status = statuses.has(body.status as StayStatus) ? body.status as StayStatus : "booked";
  if (!guestName || !room || !checkinDate || !checkoutDate) return NextResponse.json({ error: "Guest, room and dates are required" }, { status: 400 });
  if (checkoutDate < checkinDate) return NextResponse.json({ error: "Checkout cannot be before check-in" }, { status: 400 });

  try {
    const stay = await createStay({
      id: `ST-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      bookingRef,
      guestName,
      room,
      checkinDate,
      checkoutDate,
      status,
      source: "manual_reception",
      notes,
    });
    return NextResponse.json({ stay });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create stay" }, { status: 502 });
  }
}
