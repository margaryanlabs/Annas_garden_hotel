const TBC_BASE_URL = process.env.TBC_BASE_URL || "https://api.tbcbank.ge";

type Json = Record<string, unknown>;

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function isTbcConfigured() {
  return Boolean(process.env.TBC_API_KEY && process.env.TBC_CLIENT_ID && process.env.TBC_CLIENT_SECRET);
}

export async function getTbcAccessToken() {
  const apiKey = required("TBC_API_KEY");
  const clientId = required("TBC_CLIENT_ID");
  const clientSecret = required("TBC_CLIENT_SECRET");

  const body = new URLSearchParams({ client_id: clientId, client_secret: clientSecret });
  const response = await fetch(`${TBC_BASE_URL}/v1/tpay/access-token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", apikey: apiKey },
    body,
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as Json;
  if (!response.ok) throw new Error(`TBC token request failed (${response.status})`);
  const token = payload.access_token || payload.accessToken || payload.token;
  if (typeof token !== "string" || !token) throw new Error("TBC access token missing in response");
  return { token, apiKey };
}

function findRedirectUrl(input: unknown): string | null {
  if (!input || typeof input !== "object") return null;
  const object = input as Record<string, unknown>;
  for (const key of ["approval_url", "approvalUrl", "redirect_url", "redirectUrl", "paymentUrl", "url", "href"]) {
    const value = object[key];
    if (typeof value === "string" && /^https?:\/\//i.test(value)) return value;
  }
  for (const value of Object.values(object)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findRedirectUrl(item);
        if (found) return found;
      }
    } else if (value && typeof value === "object") {
      const found = findRedirectUrl(value);
      if (found) return found;
    }
  }
  return null;
}

export async function createTbcPayment(input: {
  amount: number;
  currency: "GEL" | "USD" | "EUR";
  bookingRef: string;
  description: string;
  returnUrl: string;
  callbackUrl: string;
  language: "EN" | "KA";
}) {
  const { token, apiKey } = await getTbcAccessToken();
  const response = await fetch(`${TBC_BASE_URL}/v1/tpay/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: { currency: input.currency, total: Number(input.amount.toFixed(2)) },
      returnurl: input.returnUrl,
      callbackUrl: input.callbackUrl,
      preAuth: false,
      language: input.language,
      merchantPaymentId: input.bookingRef.slice(0, 50),
      description: input.description.slice(0, 30),
      expirationMinutes: 12,
    }),
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as Json;
  if (!response.ok) throw new Error(`TBC create payment failed (${response.status})`);
  return { payload, redirectUrl: findRedirectUrl(payload) };
}

export async function getTbcPayment(paymentId: string) {
  const { token, apiKey } = await getTbcAccessToken();
  const response = await fetch(`${TBC_BASE_URL}/v1/tpay/payments/${encodeURIComponent(paymentId)}`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as Json;
  if (!response.ok) throw new Error(`TBC payment status failed (${response.status})`);
  return payload;
}
