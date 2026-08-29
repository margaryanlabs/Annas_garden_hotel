import { NextResponse } from "next/server";
import { isReceptionAuthorized, receptionConfigured } from "../../../../../lib/reception-auth";
import { updateShiftHandover } from "../../../../../lib/reception-operations";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!receptionConfigured()) return NextResponse.json({ error: "Reception access is not configured" }, { status: 503 });
  if (!isReceptionAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const patch: { pinned?: boolean; resolved?: boolean } = {};
  if (typeof body.pinned === "boolean") patch.pinned = body.pinned;
  if (typeof body.resolved === "boolean") patch.resolved = body.resolved;
  if (!Object.keys(patch).length) return NextResponse.json({ error: "No valid changes" }, { status: 400 });
  try {
    const handover = await updateShiftHandover(id, patch);
    if (!handover) return NextResponse.json({ error: "Handover note not found" }, { status: 404 });
    return NextResponse.json({ handover });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update handover" }, { status: 502 });
  }
}
