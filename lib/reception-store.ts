export type ReceptionStatus = "new" | "acknowledged" | "in_progress" | "done" | "cancelled";
export type ReceptionPriority = "low" | "normal" | "high" | "urgent";

export type ReceptionRequest = {
  id: string;
  request_type: string;
  label: string;
  message: string | null;
  note: string | null;
  guest_name: string;
  room: string;
  lang: string | null;
  checkout_date: string | null;
  status: ReceptionStatus;
  priority: ReceptionPriority;
  source: string;
  assigned_to: string | null;
  operator_note: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function receptionStoreConfigured() {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

function headers(extra: Record<string, string> = {}) {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function parseError(response: Response) {
  const text = await response.text().catch(() => "");
  return text.slice(0, 500) || `${response.status} ${response.statusText}`;
}

export async function insertReceptionRequest(input: {
  id: string;
  requestType: string;
  label: string;
  message?: string;
  note?: string;
  guestName: string;
  room: string;
  lang?: string;
  checkoutDate?: string;
  source?: string;
  priority?: ReceptionPriority;
}) {
  if (!receptionStoreConfigured()) return { stored: false as const, reason: "not_configured" as const };
  const response = await fetch(`${SUPABASE_URL}/rest/v1/anna_guest_requests`, {
    method: "POST",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify({
      id: input.id,
      request_type: input.requestType,
      label: input.label,
      message: input.message || null,
      note: input.note || null,
      guest_name: input.guestName,
      room: input.room,
      lang: input.lang || null,
      checkout_date: input.checkoutDate || null,
      source: input.source || "guest_qr",
      priority: input.priority || (input.requestType === "maintenance" ? "high" : "normal"),
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Reception insert failed: ${await parseError(response)}`);
  return { stored: true as const };
}

export async function listReceptionRequests(limit = 200) {
  if (!receptionStoreConfigured()) return [] as ReceptionRequest[];
  const params = new URLSearchParams({
    select: "*",
    order: "created_at.desc",
    limit: String(Math.min(Math.max(limit, 1), 500)),
  });
  const response = await fetch(`${SUPABASE_URL}/rest/v1/anna_guest_requests?${params}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Reception list failed: ${await parseError(response)}`);
  return (await response.json()) as ReceptionRequest[];
}

export async function updateReceptionRequest(id: string, patch: Partial<Pick<ReceptionRequest, "status" | "priority" | "assigned_to" | "operator_note">>) {
  if (!receptionStoreConfigured()) throw new Error("Reception store is not configured");
  const payload: Record<string, unknown> = { ...patch, updated_at: new Date().toISOString() };
  if (patch.status === "done") payload.completed_at = new Date().toISOString();
  if (patch.status && patch.status !== "done") payload.completed_at = null;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/anna_guest_requests?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Reception update failed: ${await parseError(response)}`);
  const rows = (await response.json()) as ReceptionRequest[];
  return rows[0] || null;
}
