import { NextRequest, NextResponse } from "next/server";
import { getTbcPayment, isTbcConfigured } from "../../../../../lib/tbc";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isTbcConfigured()) return NextResponse.json({ ok: false }, { status: 503 });

  try {
    const body = await request.json().catch(() => ({}));
    const paymentId = String(body.PaymentId || body.paymentId || "");
    if (!paymentId) return NextResponse.json({ ok: false, error: "PaymentId missing" }, { status: 400 });

    const payment = await getTbcPayment(paymentId);
    console.info("TBC verified callback", { paymentId, payment });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("TBC callback verification error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
