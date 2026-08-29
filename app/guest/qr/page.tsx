import type { Metadata } from "next";
import QRCode from "qrcode";
import { SITE_URL } from "../../../lib/site";

export const metadata: Metadata = {
  title: "Guest QR | Anna's Garden Hotel",
  robots: { index: false, follow: false },
};

export default async function GuestQrPage() {
  const guestUrl = `${SITE_URL}/guest`;
  const dataUrl = await QRCode.toDataURL(guestUrl, { width: 720, margin: 2, errorCorrectionLevel: "H" });

  return (
    <main className="guest-qr-page">
      <section className="guest-qr-card">
        <p className="seo-kicker">ANNA’S GARDEN · TBILISI</p>
        <h1>Scan for your stay.</h1>
        <p>Reception · housekeeping · towels · transfer · payment · directions · reviews</p>
        <img src={dataUrl} alt="QR code opening Anna's Garden Hotel guest guide" />
        <p className="guest-qr-meta">{guestUrl}</p>
        <p className="qr-print">Use your browser’s Print command to create a reception or room card.</p>
      </section>
    </main>
  );
}
