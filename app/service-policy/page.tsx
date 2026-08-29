import type { Metadata } from "next";
import { ADDRESS } from "../../lib/site";

export const metadata: Metadata = { title: "Service Policy | Anna's Garden Hotel", description: "How accommodation and guest services are provided by Anna's Garden Hotel." };

export default function ServicePolicyPage() {
  return <main className="seo-page"><nav className="seo-nav"><a className="seo-logo" href="/">ANNA’S GARDEN</a><div className="seo-nav-links"><a href="/terms">Terms</a><a href="/refund-policy">Refunds</a><a href="/contact">Contact</a></div></nav><article className="seo-section"><p className="seo-kicker">SERVICE DELIVERY</p><h2>Accommodation service policy</h2><div className="faq-list">
    <section className="faq-item"><h3>What is delivered</h3><p>Anna’s Garden Hotel provides accommodation and related guest services at {ADDRESS}. There is no physical product shipping associated with a room booking.</p></section>
    <section className="faq-item"><h3>When the service is delivered</h3><p>The accommodation service is provided during the confirmed stay dates. Standard check-in begins at 14:00 and standard check-out is by 12:00 unless another arrangement is confirmed by the hotel.</p></section>
    <section className="faq-item"><h3>Additional services</h3><p>Airport transfer, late checkout or other extras are supplied only after the hotel confirms availability, scope and any applicable price.</p></section>
    <section className="faq-item"><h3>Confirmation</h3><p>A Booking.com confirmation or direct written confirmation from the hotel identifies the agreed room or service, stay dates and payment conditions.</p></section>
  </div></article></main>;
}
