import type { Metadata } from "next";
import { PHONE_DISPLAY } from "../../lib/site";

export const metadata: Metadata = { title: "Privacy Policy | Anna's Garden Hotel", description: "Privacy information for Anna's Garden Hotel website and guest services." };

export default function PrivacyPage() {
  return <main className="seo-page"><nav className="seo-nav"><a className="seo-logo" href="/">ANNA’S GARDEN</a><div className="seo-nav-links"><a href="/terms">Terms</a><a href="/refund-policy">Refunds</a><a href="/contact">Contact</a></div></nav><article className="seo-section"><p className="seo-kicker">PRIVACY</p><h2>Privacy Policy</h2><div className="faq-list">
    <section className="faq-item"><h3>What this site processes</h3><p>The public website may process basic technical request data required to serve pages. If optional analytics is enabled, aggregated usage events such as booking-button clicks may be recorded to understand site performance.</p></section>
    <section className="faq-item"><h3>Guest messages</h3><p>WhatsApp and telephone requests are handled through the guest’s chosen communication provider. The hotel uses the information a guest sends to answer the request, arrange services or manage a stay.</p></section>
    <section className="faq-item"><h3>Payments</h3><p>Card details are entered on the payment provider’s secure checkout and are not collected or stored by this website. Bank-transfer or crypto transaction references may be shared with the hotel for payment confirmation.</p></section>
    <section className="faq-item"><h3>Third-party services</h3><p>The site links to Booking.com, Google Maps, WhatsApp and payment providers. Those services process data under their own privacy terms.</p></section>
    <section className="faq-item"><h3>Questions</h3><p>For privacy questions relating to a stay or direct payment, contact Anna’s Garden Hotel at {PHONE_DISPLAY}.</p></section>
  </div></article></main>;
}
