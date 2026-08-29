import { NextResponse } from "next/server";
import { RECEPTION_COOKIE, receptionConfigured, receptionToken, verifyReceptionCode } from "../../../../lib/reception-auth";

export async function POST(request: Request) {
  if (!receptionConfigured()) return NextResponse.json({ error: "Reception access is not configured" }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!verifyReceptionCode(code)) return NextResponse.json({ error: "Invalid access code" }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(RECEPTION_COOKIE, receptionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
