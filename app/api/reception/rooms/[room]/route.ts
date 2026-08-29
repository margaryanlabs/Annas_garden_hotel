import { NextResponse } from "next/server";
import { isReceptionAuthorized, receptionConfigured } from "../../../../../lib/reception-auth";
import { HousekeepingStatus, upsertRoomOps } from "../../../../../lib/reception-operations";

const statuses = new Set<HousekeepingStatus>(["clean", "dirty", "in_progress", "inspected", "dnd"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ room: string }> }) {
  if (!receptionConfigured()) return NextResponse.json({ error: "Reception access is not configured" }, { status: 503 });
  if (!isReceptionAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { room } = await params;
  const body = await request.json().catch(() => ({}));
  const patch: { housekeeping_status?: HousekeepingStatus; room_note?: string | null } = {};
  if (typeof body.housekeeping_status === "string" && statuses.has(body.housekeeping_status as HousekeepingStatus)) patch.housekeeping_status = body.housekeeping_status as HousekeepingStatus;
  if (typeof body.room_note === "string" || body.room_note === null) patch.room_note = typeof body.room_note === "string" ? body.room_note.trim().slice(0, 1000) || null : null;
  if (!Object.keys(patch).length) return NextResponse.json({ error: "No valid changes" }, { status: 400 });
  try {
    const roomOps = await upsertRoomOps(room.slice(0, 30), patch);
    return NextResponse.json({ roomOps });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update room" }, { status: 502 });
  }
}
