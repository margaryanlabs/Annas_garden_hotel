import { NextResponse } from "next/server";
import { isReceptionAuthorized, receptionConfigured } from "../../../../lib/reception-auth";
import { listReceptionRequests, receptionStoreConfigured } from "../../../../lib/reception-store";

const DEFAULT_ROOMS = (process.env.RECEPTION_ROOM_LIST || "201,204").split(",").map((value) => value.trim()).filter(Boolean);

export async function GET(request: Request) {
  if (!receptionConfigured()) return NextResponse.json({ error: "Reception access is not configured" }, { status: 503 });
  if (!isReceptionAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const requests = await listReceptionRequests(250);
    const dynamicRooms = requests.map((item) => item.room).filter(Boolean);
    const rooms = Array.from(new Set([...DEFAULT_ROOMS, ...dynamicRooms])).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    return NextResponse.json({ configured: receptionStoreConfigured(), requests, rooms, refreshedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ configured: receptionStoreConfigured(), requests: [], rooms: DEFAULT_ROOMS, error: error instanceof Error ? error.message : "Unable to load requests" }, { status: 502 });
  }
}
