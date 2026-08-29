import type { Metadata } from "next";
import PaymentPanel from "../components/PaymentPanel";

export const metadata: Metadata = {
  title: "Secure payment | Anna's Garden Hotel",
  description: "Pay Anna's Garden Hotel by Georgian bank checkout, bank transfer or approved crypto method.",
  robots: { index: false, follow: false },
};

export default function PayPage() {
  return (
    <main className="payment-page">
      <nav className="seo-nav">
        <a className="seo-logo" href="/">ANNA’S GARDEN</a>
        <div className="seo-nav-links"><a href="/guest">Guest guide</a><a href="/contact">Contact</a></div>
      </nav>
      <section className="payment-hero">
        <p className="seo-kicker">PAYMENT · TBILISI</p>
        <h1>Simple payment. Clear confirmation.</h1>
        <p>Choose the payment route agreed with the hotel. Card payments are redirected to the bank’s secure checkout; bank and crypto details are shown only when the owner has configured them.</p>
      </section>
      <PaymentPanel />
    </main>
  );
}
