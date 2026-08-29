import type { Metadata } from "next";
import QRCode from "qrcode";
import { SITE_URL } from "../../../lib/site";

export const metadata: Metadata = {
  title: "Guest QR Studio | Anna's Garden Hotel",
  description: "Create a general or room-specific QR for Anna's Garden Hotel Guest Hub.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ room?: string }> };

export default async function GuestQrPage({ searchParams }: Props) {
  const params = await searchParams;
  const room = typeof params.room === "string" ? params.room.replace(/[^0-9A-Za-z-]/g, "").slice(0, 12) : "";
  const guestUrl = room ? `${SITE_URL}/guest?room=${encodeURIComponent(room)}` : `${SITE_URL}/guest`;
  const dataUrl = await QRCode.toDataURL(guestUrl, {
    width: 840,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#172019", light: "#ffffff" },
  });
  const presetRooms = Array.from(new Set((process.env.RECEPTION_ROOM_LIST || "").split(",").map((value) => value.trim()).filter(Boolean))).slice(0, 30);

  return (
    <main className="guest-qr-page">
      <section className="guest-qr-card">
        <p className="guest-kicker">ANNA’S GARDEN · GUEST ACCESS</p>
        <h1>{room ? `Room ${room}. One scan.` : "Your stay, one scan away."}</h1>
        <p>Reception, housekeeping, fresh towels, late checkout, transfer, payment, directions and feedback — one quiet guest experience.</p>
        <img src={dataUrl} alt={room ? `QR code for Anna's Garden Hotel room ${room}` : "QR code opening Anna's Garden Hotel Guest Hub"} />
        <p className="guest-qr-meta">{guestUrl}</p>

        <div className="guest-qr-actions">
          <a href={guestUrl}>Open Guest Hub →</a>
          <a href="/guest">General Guest Hub</a>
        </div>

        <div className="guest-qr-builder">
          <form method="get">
            <input name="room" defaultValue={room} placeholder="Room number" aria-label="Room number" autoComplete="off" />
            <button type="submit">Create room QR</button>
          </form>
          {presetRooms.length ? <div className="guest-qr-presets" aria-label="Room QR shortcuts">
            {presetRooms.map((preset) => <a key={preset} href={`/guest/qr?room=${encodeURIComponent(preset)}`}>Room {preset}</a>)}
          </div> : null}
          <p className="qr-print">Print this page for reception, bedside cards or room folders. Permanent cards should be printed only after the final hotel domain is connected.</p>
          <p className="qr-print"><strong>Easy shortcut:</strong> open <code>/qr</code> from the hotel domain any time.</p>
        </div>
      </section>
    </main>
  );
}
