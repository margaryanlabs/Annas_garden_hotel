import type { Metadata } from "next";
import { ADDRESS, BOOKING_URL, MAPS_URL, PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "../../lib/site";

export const metadata: Metadata = {
  title: "Contact & Location | Anna's Garden Hotel Tbilisi",
  description: `Contact Anna's Garden Hotel at ${PHONE_DISPLAY}. Find us at ${ADDRESS}.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <main className="seo-page">
      <nav className="seo-nav"><a className="seo-logo" href="/">ANNA’S GARDEN</a><div className="seo-nav-links"><a href="/rooms">Rooms</a><a href="/faq">FAQ</a><a className="seo-book" href={BOOKING_URL} target="_blank" rel="noreferrer">Book</a></div></nav>
      <header className="seo-hero"><p className="seo-kicker">TBILISI · GEORGIA</p><h1>Arrive. Exhale.</h1><p>Book online, call the hotel directly, or open the exact address in Maps.</p></header>
      <section className="seo-section">
        <div className="contact-grid">
          <article className="contact-card"><small>Phone</small><a href={PHONE_HREF}>{PHONE_DISPLAY}</a></article>
          <article className="contact-card"><small>Address</small><strong>{ADDRESS}</strong></article>
          <article className="contact-card"><small>Directions</small><a href={MAPS_URL} target="_blank" rel="noreferrer">Open in Maps ↗</a></article>
        </div>
      </section>
      <section className="seo-section"><p className="seo-kicker">RESERVATIONS</p><h2>Ready to stay?</h2><div className="seo-cta-row"><a className="seo-cta primary" href={BOOKING_URL} target="_blank" rel="noreferrer">Check live availability</a><a className="seo-cta" href={PHONE_HREF}>Call the hotel</a></div></section>
    </main>
  );
}
