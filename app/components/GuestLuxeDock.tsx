"use client";

import { MAPS_URL, PHONE_HREF } from "../../lib/site";

export default function GuestLuxeDock({ room = "" }: { room?: string }) {
  const qr = room ? `/guest/qr?room=${encodeURIComponent(room)}` : "/guest/qr";
  return (
    <aside className="guest-luxe-dock" aria-label="Guest concierge shortcuts">
      <span className="guest-luxe-dock-label">CONCIERGE</span>
      <a href={PHONE_HREF}><i>24H</i><strong>Reception</strong></a>
      <a href="/pay"><i>PAY</i><strong>Payment</strong></a>
      <a href={qr}><i>QR</i><strong>My QR</strong></a>
      <a href={MAPS_URL} target="_blank" rel="noreferrer"><i>↗</i><strong>Maps</strong></a>
    </aside>
  );
}
