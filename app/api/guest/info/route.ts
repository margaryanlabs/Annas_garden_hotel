import { NextResponse } from "next/server";
import { ADDRESS, MAPS_URL, PHONE_DISPLAY, PHONE_HREF } from "../../../../lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const wifiName = (process.env.GUEST_WIFI_NAME || "").trim();
  const wifiPassword = (process.env.GUEST_WIFI_PASSWORD || "").trim();
  const wifiNote = (process.env.GUEST_WIFI_NOTE || "").trim();
  const tipUrl = (process.env.GUEST_TIP_URL || "").trim();

  return NextResponse.json({
    wifi: {
      configured: Boolean(wifiName),
      name: wifiName,
      password: wifiPassword,
      note: wifiNote,
    },
    tipUrl,
    checkIn: "14:00",
    checkOut: "12:00",
    reception: "24 hours",
    phoneDisplay: PHONE_DISPLAY,
    phoneHref: PHONE_HREF,
    smsHref: PHONE_HREF.replace(/^tel:/, "sms:"),
    whatsappHref: `https://wa.me/${PHONE_HREF.replace(/\D/g, "")}`,
    address: ADDRESS,
    mapsUrl: MAPS_URL,
    emergencyHref: "tel:112",
  });
}
