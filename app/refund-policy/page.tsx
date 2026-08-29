import type { Metadata } from "next";
import { PHONE_DISPLAY } from "../../lib/site";

export const metadata: Metadata = { title: "Cancellation & Refund Policy | Anna's Garden Hotel", description: "Cancellation and refund information for Anna's Garden Hotel bookings and direct payments." };

export default function RefundPolicyPage() {
  return <main className="seo-page"><nav className="seo-nav"><a className="seo-logo" href="/">ANNA’S GARDEN</a><div className="seo-nav-links"><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/contact">Contact</a></div></nav><article className="seo-section"><p className="seo-kicker">CANCELLATIONS · REFUNDS</p><h2>Refund policy</h2><div className="faq-list">
    <section className="faq-item"><h3>Your rate conditions control</h3><p>Cancellation and refund eligibility depends on the rate and conditions shown before booking or sent by the hotel before a direct payment. Guests should review those conditions before completing payment.</p></section>
    <section className="faq-item"><h3>Booking.com reservations</h3><p>For reservations made through Booking.com, cancellation, no-show and refund conditions are the conditions attached to that reservation in Booking.com.</p></section>
    <section className="faq-item"><h3>Direct payments</h3><p>For a direct payment, the hotel confirms the service, amount and applicable cancellation terms before the guest pays. If a direct payment is eligible for a refund under those agreed terms, the hotel will arrange the refund to the original payment route where technically available, or agree another lawful return method with the guest.</p></section>
    <section className="faq-item"><h3>Processing time</h3><p>After the hotel initiates an eligible refund, the time for funds to appear depends on the bank, card network or payment provider and is outside the hotel website’s control.</p></section>
    <section className="faq-item"><h3>Requesting a refund</h3><p>Contact the hotel at {PHONE_DISPLAY} and include the guest name, booking reference, payment date and payment method. Do not send full card credentials by message.</p></section>
  </div></article></main>;
}
