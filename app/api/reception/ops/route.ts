import { NextResponse } from "next/server";
import { isReceptionAuthorized, receptionConfigured } from "../../../../lib/reception-auth";
import { listReceptionRequests } from "../../../../lib/reception-store";
import { listPaymentEvents, listRoomOps, listShiftHandovers, listStays, receptionOperationsConfigured } from "../../../../lib/reception-operations";

const DEFAULT_ROOMS = (process.env.RECEPTION_ROOM_LIST || "201,204").split(",").map((value) => value.trim()).filter(Boolean);

export async function GET(request: Request) {
  if (!receptionConfigured()) return NextResponse.json({ error: "Reception access is not configured" }, { status: 503 });
  if (!isReceptionAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!receptionOperationsConfigured()) {
    return NextResponse.json({ configured: false, stays: [], roomOps: [], handovers: [], payments: [], requests: [], rooms: DEFAULT_ROOMS, refreshedAt: new Date().toISOString() });
  }

  try {
    const [stays, roomOps, handovers, payments, requests] = await Promise.all([
      listStays(), listRoomOps(), listShiftHandovers(), listPaymentEvents(), listReceptionRequests(250),
    ]);
    const dynamicRooms = [
      ...stays.map((item) => item.room),
      ...roomOps.map((item) => item.room),
      ...requests.map((item) => item.room),
    ].filter(Boolean);
    const rooms = Array.from(new Set([...DEFAULT_ROOMS, ...dynamicRooms])).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    return NextResponse.json({ configured: true, stays, roomOps, handovers, payments, requests, rooms, refreshedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ configured: true, stays: [], roomOps: [], handovers: [], payments: [], requests: [], rooms: DEFAULT_ROOMS, error: error instanceof Error ? error.message : "Unable to load operations" }, { status: 502 });
  }
}
