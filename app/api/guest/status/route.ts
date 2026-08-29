import { NextResponse } from "next/server";
import { getReceptionRequestStatuses, receptionStoreConfigured } from "../../../../lib/reception-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ids = (url.searchParams.get("ids") || "")
    .split(",")
    .map((id) => id.replace(/[^A-Za-z0-9:_-]/g, "").slice(0, 40))
    .filter(Boolean)
    .slice(0, 30);

  if (!ids.length) return NextResponse.json({ configured: receptionStoreConfigured(), statuses: [] });

  try {
    const statuses = await getReceptionRequestStatuses(ids);
    return NextResponse.json({ configured: receptionStoreConfigured(), statuses, refreshedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ configured: receptionStoreConfigured(), statuses: [] }, { status: 200 });
  }
}
