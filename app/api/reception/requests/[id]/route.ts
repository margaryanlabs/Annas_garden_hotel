import { NextResponse } from "next/server";
import { isReceptionAuthorized, receptionConfigured } from "../../../../../lib/reception-auth";
import { ReceptionPriority, ReceptionRequest, ReceptionStatus, updateReceptionRequest } from "../../../../../lib/reception-store";

const statuses = new Set<ReceptionStatus>(["new", "acknowledged", "in_progress", "done", "cancelled"]);
const priorities = new Set<ReceptionPriority>(["low", "normal", "high", "urgent"]);
type Patch = Partial<Pick<ReceptionRequest, "status" | "priority" | "assigned_to" | "operator_note">>;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!receptionConfigured()) return NextResponse.json({ error: "Reception access is not configured" }, { status: 503 });
  if (!isReceptionAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const patch: Patch = {};

  if (typeof body.status === "string" && statuses.has(body.status as ReceptionStatus)) patch.status = body.status as ReceptionStatus;
  if (typeof body.priority === "string" && priorities.has(body.priority as ReceptionPriority)) patch.priority = body.priority as ReceptionPriority;
  if (typeof body.assigned_to === "string" || body.assigned_to === null) patch.assigned_to = body.assigned_to?.trim().slice(0, 100) || null;
  if (typeof body.operator_note === "string" || body.operator_note === null) patch.operator_note = body.operator_note?.trim().slice(0, 1000) || null;
  if (!Object.keys(patch).length) return NextResponse.json({ error: "No valid changes" }, { status: 400 });

  try {
    const updated = await updateReceptionRequest(id, patch);
    if (!updated) return NextResponse.json({ error: "Request not found" }, { status: 404 });
    return NextResponse.json({ request: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update request" }, { status: 502 });
  }
}
