import { NextRequest, NextResponse } from "next/server";
import { createTbcPayment, isTbcConfigured } from "../../../../lib/tbc";
import { SITE_URL } from "../../../../lib/site";

export const dynamic = "force-dynamic";

const currencies = new Set(["GEL", "USD", "EUR"]);

export async function POST(request: NextRequest) {
  if (!isTbcConfigured()) {
    return NextResponse.json({ error: "TBC Checkout is not configured yet." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const currency = String(body.currency || "GEL").toUpperCase();
    const bookingRef = String(body.bookingRef || `AG-${Date.now()}`).replace(/[^A-Za-z0-9_-]/g, "-");
    const language = body.language === "KA" ? "KA" : "EN";

    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) {
      return NextResponse.json({ error: "Invalid payment amount." }, { status: 400 });
    }
    if (!currencies.has(currency)) {
      return NextResponse.json({ error: "Unsupported currency." }, { status: 400 });
    }

    const callbackUrl = `${SITE_URL}/api/payments/tbc/callback`;
    const returnUrl = `${SITE_URL}/payment/result?provider=tbc&ref=${encodeURIComponent(bookingRef)}`;
    const { payload, redirectUrl } = await createTbcPayment({
      amount,
      currency: currency as "GEL" | "USD" | "EUR",
      bookingRef,
      description: "Anna's Garden stay",
      returnUrl,
      callbackUrl,
      language,
    });

    if (!redirectUrl) {
      return NextResponse.json({ error: "TBC did not return a checkout URL.", providerResponse: payload }, { status: 502 });
    }

    return NextResponse.json({ redirectUrl, bookingRef });
  } catch (error) {
    console.error("TBC payment creation error", error);
    return NextResponse.json({ error: "Unable to start bank payment." }, { status: 500 });
  }
}
