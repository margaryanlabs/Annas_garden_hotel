import { createHash, timingSafeEqual } from "crypto";

export const RECEPTION_COOKIE = "anna_reception_session";

function secretMaterial() {
  const code = process.env.RECEPTION_ACCESS_CODE || "";
  const secret = process.env.RECEPTION_SESSION_SECRET || code;
  return { code, secret };
}

export function receptionConfigured() {
  return Boolean(process.env.RECEPTION_ACCESS_CODE);
}

export function receptionToken() {
  const { code, secret } = secretMaterial();
  if (!code) return "";
  return createHash("sha256").update(`anna-garden:${code}:${secret}`).digest("hex");
}

export function verifyReceptionCode(input: string) {
  const { code } = secretMaterial();
  if (!code || !input) return false;
  const a = Buffer.from(createHash("sha256").update(input).digest("hex"));
  const b = Buffer.from(createHash("sha256").update(code).digest("hex"));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isReceptionAuthorized(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${RECEPTION_COOKIE}=([^;]+)`));
  const value = match?.[1] || "";
  const expected = receptionToken();
  if (!value || !expected) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
