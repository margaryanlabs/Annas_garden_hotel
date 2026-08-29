import type { Metadata } from "next";
import { ADDRESS, BOOKING_URL, MAPS_URL, PHONE_HREF } from "../../lib/site";

export const metadata: Metadata = {
  title: "Guest Guide | Anna's Garden Hotel",
  description: "Digital guest guide for Anna's Garden Hotel: reception, housekeeping, towels, transfer, payment, directions and reviews.",
  robots: { index: false, follow: false },
};

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "995599521751";
const GOOGLE_REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "";
const wa = (message: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

export default function GuestPage() {
  return (
    <main className="guest-page">
      <nav className="seo-nav"><a className="seo-logo" href="/">ANNA’S GARDEN</a><div className="seo-nav-links"><a href="/pay">Payment</a><a href={PHONE_HREF}>Reception</a></div></nav>
      <section className="guest-hero">
        <p className="seo-kicker">DIGITAL GUEST GUIDE</p>
        <h1>Your stay, one scan away.</h1>
        <p>{ADDRESS}. Keep this page open during your stay for help, requests, payments, transfer and directions.</p>
      </section>
      <section className="guest-grid">
        <article className="guest-card accent"><span>01 / RECEPTION</span><h2>Need help?</h2><p>Message reception about your room, arrival, parking or anything else during the stay.</p><a className="guest-action" href={wa("Hello Anna's Garden Hotel. I am staying at the hotel and need help with:")} target="_blank" rel="noreferrer">Message reception ↗</a></article>
        <article className="guest-card"><span>02 / HOUSEKEEPING</span><h2>Room service request</h2><p>Ask for housekeeping at a convenient time without going downstairs.</p><a className="guest-action" href={wa("Hello Anna's Garden Hotel. Could I request housekeeping for my room? My room number is:")} target="_blank" rel="noreferrer">Request housekeeping ↗</a></article>
        <article className="guest-card"><span>03 / TOWELS</span><h2>Fresh towels</h2><p>Send a quick request and include your room number.</p><a className="guest-action" href={wa("Hello Anna's Garden Hotel. Could I please have fresh towels? My room number is:")} target="_blank" rel="noreferrer">Request towels ↗</a></article>
        <article className="guest-card"><span>04 / CHECKOUT</span><h2>Late checkout</h2><p>Availability can vary by day. Ask reception and they will confirm whether it is possible and any fee.</p><a className="guest-action" href={wa("Hello Anna's Garden Hotel. Is late checkout available for my room? My room number is:")} target="_blank" rel="noreferrer">Ask for late checkout ↗</a></article>
        <article className="guest-card"><span>05 / TRANSFER</span><h2>Airport transfer</h2><p>Send flight number, departure time and number of passengers for confirmation.</p><a className="guest-action" href={wa("Hello Anna's Garden Hotel. I would like to arrange an airport transfer. Flight/time/passengers:")} target="_blank" rel="noreferrer">Arrange transfer ↗</a></article>
        <article className="guest-card accent"><span>06 / PAYMENT</span><h2>Pay or leave a deposit</h2><p>Use the hotel payment page for Georgian bank checkout, bank transfer or an owner-approved crypto method.</p><a className="guest-action" href="/pay">Open payment →</a></article>
        <article className="guest-card"><span>07 / DIRECTIONS</span><h2>Open the hotel in Maps</h2><p>Useful for taxis, deliveries and sharing the hotel location with friends.</p><a className="guest-action" href={MAPS_URL} target="_blank" rel="noreferrer">Google Maps ↗</a></article>
        <article className="guest-card"><span>08 / REVIEW</span><h2>Enjoyed your stay?</h2><p>Verified reviews help a small hotel more than almost anything else.</p><a className="guest-action" href={BOOKING_URL} target="_blank" rel="noreferrer">Review on Booking.com ↗</a>{GOOGLE_REVIEW_URL ? <a className="guest-action" href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer">Review on Google ↗</a> : null}</article>
        <article className="guest-card"><span>09 / QR</span><h2>Print this guest QR</h2><p>For reception desks, room cards and bedside stands. It always points guests back to this service hub.</p><a className="guest-action" href="/guest/qr">Open printable QR →</a></article>
      </section>
    </main>
  );
}
