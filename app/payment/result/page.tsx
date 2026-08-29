import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment return | Anna's Garden Hotel", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ provider?: string; ref?: string }> };

export default async function PaymentResultPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <main className="payment-page">
      <section className="payment-result">
        <p className="seo-kicker">PAYMENT RETURN</p>
        <h1>We’re checking the payment.</h1>
        <p>The bank has returned you to Anna’s Garden. A payment should be treated as confirmed only after the hotel or the bank status confirms it. If you need immediate confirmation, send your booking reference to reception.</p>
        {params.ref ? <p><strong>Reference:</strong> {params.ref}</p> : null}
        <a href="/guest">Back to guest guide</a>
      </section>
    </main>
  );
}
