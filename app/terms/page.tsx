import type { Metadata } from "next";
import { ADDRESS, BOOKING_URL, PHONE_DISPLAY } from "../../lib/site";

export const metadata: Metadata = { title: "Terms & Conditions | Anna's Garden Hotel", description: "Terms and conditions for Anna's Garden Hotel website, bookings and direct payments." };

export default function TermsPage() {
  return <main className="seo-page"><nav className="seo-nav"><a className="seo-logo" href="/">ANNA’S GARDEN</a><div className="seo-nav-links"><a href="/privacy">Privacy</a><a href="/refund-policy">Refunds</a><a href="/contact">Contact</a></div></nav><article className="seo-section"><p className="seo-kicker">LEGAL · TBILISI</p><h2>Terms & Conditions</h2><div className="faq-list">
    <section className="faq-item"><h3>Hotel and website</h3><p>This website presents Anna’s Garden Hotel at {ADDRESS}. Hotel contact: {PHONE_DISPLAY}. Information and room imagery are provided to help guests plan a stay.</p></section>
    <section className="faq-item"><h3>Bookings</h3><p>Bookings made through Booking.com are governed by the rate, cancellation and payment conditions displayed by Booking.com at the time of reservation. <a href={BOOKING_URL}>Booking.com</a> is an external booking channel.</p></section>
    <section className="faq-item"><h3>Direct payment</h3><p>A direct payment should only be made after the hotel and guest agree the booking or service, amount, currency and reference. Bank-card payments are processed on the payment provider’s secure checkout. The hotel website does not request or store full card numbers.</p></section>
    <section className="faq-item"><h3>Arrival and departure</h3><p>Standard check-in starts at 14:00 and standard check-out is by 12:00. Early check-in or late checkout is subject to availability and may involve an additional charge confirmed by the hotel before acceptance.</p></section>
    <section className="faq-item"><h3>Accuracy and changes</h3><p>Availability, prices and specific room assignments can change. The booking confirmation or direct written confirmation from the hotel is the controlling record for an individual stay.</p></section>
  </div></article></main>;
}
