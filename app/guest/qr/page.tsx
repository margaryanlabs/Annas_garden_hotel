import type { Metadata } from "next";
import QRCode from "qrcode";
import { SITE_URL } from "../../../lib/site";

export const metadata: Metadata = {
  title: "Guest QR | Anna's Garden Hotel",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ room?: string }> };

export default async function GuestQrPage({ searchParams }: Props) {
  const params = await searchParams;
  const room = typeof params.room === "string" ? params.room.replace(/[^0-9A-Za-z-]/g, "").slice(0, 12) : "";
  const guestUrl = room ? `${SITE_URL}/guest?room=${encodeURIComponent(room)}` : `${SITE_URL}/guest`;
  const dataUrl = await QRCode.toDataURL(guestUrl, { width: 720, margin: 2, errorCorrectionLevel: "H" });

  return (
    <main className="guest-qr-page">
      <section className="guest-qr-card">
        <p className="seo-kicker">ANNA’S GARDEN · TBILISI</p>
        <h1>{room ? `Room ${room}. One scan.` : "Scan for your stay."}</h1>
        <p>Reception · housekeeping · towels · transfer · payment · directions · reviews</p>
        <img src={dataUrl} alt={room ? `QR code for Anna's Garden Hotel room ${room}` : "QR code opening Anna's Garden Hotel guest hub"} />
        <p className="guest-qr-meta">{guestUrl}</p>
        <div className="guest-qr-builder">
          <form method="get">
            <input name="room" defaultValue={room} placeholder="Room number" aria-label="Room number" />
            <button type="submit">Create room QR</button>
          </form>
          <p className="qr-print">Use your browser’s Print command to create a reception card, bedside card or room-specific QR.</p>
        </div>
      </section>
    </main>
  );
}
