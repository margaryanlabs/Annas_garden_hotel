import { NextRequest, NextResponse } from "next/server";
import { getTbcPayment, isTbcConfigured } from "../../../../../lib/tbc";
import { upsertPaymentEvent } from "../../../../../lib/reception-operations";

export const dynamic = "force-dynamic";

function stringValue(input: unknown, keys: string[]) {
  if (!input || typeof input !== "object") return "";
  const object = input as Record<string, unknown>;
  for (const key of keys) {
    const value = object[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function amountValue(input: unknown) {
  if (!input || typeof input !== "object") return { amount: null as number | null, currency: "" };
  const object = input as Record<string, unknown>;
  const nested = object.amount;
  if (nested && typeof nested === "object") {
    const item = nested as Record<string, unknown>;
    const total = Number(item.total ?? item.amount ?? item.value);
    const currency = typeof item.currency === "string" ? item.currency : "";
    return { amount: Number.isFinite(total) ? total : null, currency };
  }
  const total = Number(object.total ?? object.amount);
  const currency = typeof object.currency === "string" ? object.currency : "";
  return { amount: Number.isFinite(total) ? total : null, currency };
}

export async function POST(request: NextRequest) {
  if (!isTbcConfigured()) return NextResponse.json({ ok: false }, { status: 503 });

  try {
    const body = await request.json().catch(() => ({}));
    const record = body as Record<string, unknown>;
    const paymentId = String(record.PaymentId || record.paymentId || "");
    if (!paymentId) return NextResponse.json({ ok: false, error: "PaymentId missing" }, { status: 400 });

    const payment = await getTbcPayment(paymentId);
    const bookingRef = stringValue(payment, ["merchantPaymentId", "merchantPaymentID", "merchant_payment_id", "orderId", "order_id"]);
    const status = stringValue(payment, ["status", "paymentStatus", "payment_status", "state"]) || "verified_callback";
    const { amount, currency } = amountValue(payment);

    try {
      await upsertPaymentEvent({
        id: `tbc:${bookingRef || paymentId}`,
        bookingRef: bookingRef || undefined,
        provider: "tbc",
        amount,
        currency: currency || undefined,
        status,
      });
    } catch (error) {
      console.warn("Unable to persist verified TBC status for reception", error);
    }

    console.info("TBC verified callback", { paymentId, bookingRef, status });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("TBC callback verification error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
