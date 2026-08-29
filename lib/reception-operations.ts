export type StayStatus = "booked" | "arriving" | "checked_in" | "checked_out" | "cancelled";
export type HousekeepingStatus = "clean" | "dirty" | "in_progress" | "inspected" | "dnd";

export type Stay = {
  id: string;
  booking_ref: string | null;
  guest_name: string;
  room: string;
  checkin_date: string;
  checkout_date: string;
  status: StayStatus;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RoomOps = {
  room: string;
  housekeeping_status: HousekeepingStatus;
  room_note: string | null;
  updated_at: string;
};

export type ShiftHandover = {
  id: string;
  message: string;
  created_by: string | null;
  pinned: boolean;
  resolved_at: string | null;
  created_at: string;
};

export type PaymentEvent = {
  id: string;
  booking_ref: string | null;
  provider: string;
  amount: number | null;
  currency: string | null;
  status: string;
  room: string | null;
  guest_name: string | null;
  created_at: string;
  updated_at: string;
};

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function receptionOperationsConfigured() {
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

async function list<T>(table: string, query = "") {
  if (!receptionOperationsConfigured()) return [] as T[];
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ""}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`${table} list failed: ${await parseError(response)}`);
  return (await response.json()) as T[];
}

export async function listStays() {
  return list<Stay>("anna_stays", "select=*&order=checkin_date.asc,created_at.desc&limit=300");
}

export async function createStay(input: {
  id: string;
  bookingRef?: string;
  guestName: string;
  room: string;
  checkinDate: string;
  checkoutDate: string;
  status?: StayStatus;
  source?: string;
  notes?: string;
}) {
  if (!receptionOperationsConfigured()) throw new Error("Reception store is not configured");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/anna_stays`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({
      id: input.id,
      booking_ref: input.bookingRef || null,
      guest_name: input.guestName,
      room: input.room,
      checkin_date: input.checkinDate,
      checkout_date: input.checkoutDate,
      status: input.status || "booked",
      source: input.source || "manual",
      notes: input.notes || null,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Stay create failed: ${await parseError(response)}`);
  return ((await response.json()) as Stay[])[0];
}

export async function updateStay(id: string, patch: Partial<Pick<Stay, "status" | "room" | "checkin_date" | "checkout_date" | "booking_ref" | "notes">>) {
  if (!receptionOperationsConfigured()) throw new Error("Reception store is not configured");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/anna_stays?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Stay update failed: ${await parseError(response)}`);
  return ((await response.json()) as Stay[])[0] || null;
}

export async function listRoomOps() {
  return list<RoomOps>("anna_room_ops", "select=*&order=room.asc");
}

export async function upsertRoomOps(room: string, patch: { housekeeping_status?: HousekeepingStatus; room_note?: string | null }) {
  if (!receptionOperationsConfigured()) throw new Error("Reception store is not configured");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/anna_room_ops?on_conflict=room`, {
    method: "POST",
    headers: headers({ Prefer: "resolution=merge-duplicates,return=representation" }),
    body: JSON.stringify({ room, ...patch, updated_at: new Date().toISOString() }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Room ops update failed: ${await parseError(response)}`);
  return ((await response.json()) as RoomOps[])[0] || null;
}

export async function listShiftHandovers() {
  return list<ShiftHandover>("anna_shift_handover", "select=*&order=pinned.desc,created_at.desc&limit=100");
}

export async function createShiftHandover(input: { id: string; message: string; createdBy?: string; pinned?: boolean }) {
  if (!receptionOperationsConfigured()) throw new Error("Reception store is not configured");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/anna_shift_handover`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({ id: input.id, message: input.message, created_by: input.createdBy || null, pinned: Boolean(input.pinned) }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Handover create failed: ${await parseError(response)}`);
  return ((await response.json()) as ShiftHandover[])[0];
}

export async function updateShiftHandover(id: string, patch: { pinned?: boolean; resolved?: boolean }) {
  if (!receptionOperationsConfigured()) throw new Error("Reception store is not configured");
  const body: Record<string, unknown> = {};
  if (typeof patch.pinned === "boolean") body.pinned = patch.pinned;
  if (typeof patch.resolved === "boolean") body.resolved_at = patch.resolved ? new Date().toISOString() : null;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/anna_shift_handover?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Handover update failed: ${await parseError(response)}`);
  return ((await response.json()) as ShiftHandover[])[0] || null;
}

export async function listPaymentEvents() {
  return list<PaymentEvent>("anna_payment_events", "select=*&order=created_at.desc&limit=100");
}

export async function upsertPaymentEvent(input: {
  id: string;
  bookingRef?: string;
  provider: string;
  amount?: number | null;
  currency?: string | null;
  status: string;
  room?: string | null;
  guestName?: string | null;
}) {
  if (!receptionOperationsConfigured()) return null;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/anna_payment_events?on_conflict=id`, {
    method: "POST",
    headers: headers({ Prefer: "resolution=merge-duplicates,return=representation" }),
    body: JSON.stringify({
      id: input.id,
      booking_ref: input.bookingRef || null,
      provider: input.provider,
      amount: input.amount ?? null,
      currency: input.currency || null,
      status: input.status,
      room: input.room || null,
      guest_name: input.guestName || null,
      updated_at: new Date().toISOString(),
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Payment event update failed: ${await parseError(response)}`);
  return ((await response.json()) as PaymentEvent[])[0] || null;
}
