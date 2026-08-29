import { NextResponse } from "next/server";
import { RECEPTION_COOKIE } from "../../../../lib/reception-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(RECEPTION_COOKIE, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
