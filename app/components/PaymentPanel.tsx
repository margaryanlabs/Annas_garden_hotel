"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Config = {
  providers: {
    tbc: boolean;
    bankTransfer: { enabled: boolean; bank?: string; beneficiary?: string; iban?: string; swift?: string | null; currency?: string };
    crypto: { enabled: boolean; asset?: string; network?: string; address?: string };
  };
};

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "995599521751";

export default function PaymentPanel() {
  const [config, setConfig] = useState<Config | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("GEL");
  const [bookingRef, setBookingRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const numericAmount = useMemo(() => Number(amount), [amount]);

  useEffect(() => {
    fetch("/api/payments/config", { cache: "no-store" })
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ providers: { tbc: false, bankTransfer: { enabled: false }, crypto: { enabled: false } } }));
  }, []);

  async function startTbc(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return setError("Enter the agreed payment amount.");
    setLoading(true);
    try {
      const response = await fetch("/api/payments/tbc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount, currency, bookingRef: bookingRef || undefined, language: "EN" }),
      });
      const data = await response.json();
      if (!response.ok || !data.redirectUrl) throw new Error(data.error || "Unable to start payment");
      window.location.href = data.redirectUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start payment");
      setLoading(false);
    }
  }

  function requestInvoice(kind: "bank" | "crypto") {
    const text = `Hello Anna's Garden Hotel. I want to pay by ${kind === "bank" ? "bank transfer" : "crypto"}.${amount ? ` Amount: ${amount} ${currency}.` : ""}${bookingRef ? ` Booking reference: ${bookingRef}.` : ""}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="payment-panel">
      <form className="payment-amount" onSubmit={startTbc}>
        <div><label>Amount<input inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} /></label></div>
        <div><label>Currency<select value={currency} onChange={(e) => setCurrency(e.target.value)}><option>GEL</option><option>USD</option><option>EUR</option></select></label></div>
        <div><label>Booking reference<input placeholder="Optional" value={bookingRef} onChange={(e) => setBookingRef(e.target.value)} /></label></div>
        {config?.providers.tbc ? <button className="payment-primary" disabled={loading}>{loading ? "Opening secure checkout…" : "Pay securely with TBC Checkout"}</button> : null}
      </form>

      {error ? <p className="payment-error">{error}</p> : null}

      <div className="payment-methods">
        <article className={`payment-method ${config?.providers.tbc ? "enabled" : "pending"}`}>
          <span>01 / CARD</span><h2>Georgian bank checkout</h2>
          <p>{config?.providers.tbc ? "Secure hosted checkout powered by TBC. The hotel never sees or stores your card number." : "Bank-card checkout is prepared. It becomes active as soon as the hotel adds its TBC merchant credentials."}</p>
          {config?.providers.tbc ? <button onClick={() => document.querySelector<HTMLInputElement>(".payment-amount input")?.focus()}>Enter amount ↑</button> : <small>TBC merchant activation required</small>}
        </article>

        <article className={`payment-method ${config?.providers.bankTransfer.enabled ? "enabled" : "pending"}`}>
          <span>02 / BANK TRANSFER</span><h2>Transfer to the hotel</h2>
          {config?.providers.bankTransfer.enabled ? <>
            <p><b>{config.providers.bankTransfer.bank}</b><br />{config.providers.bankTransfer.beneficiary}<br /><code>{config.providers.bankTransfer.iban}</code>{config.providers.bankTransfer.swift ? <><br />SWIFT: {config.providers.bankTransfer.swift}</> : null}</p>
            <button onClick={() => requestInvoice("bank")}>Send payment reference on WhatsApp ↗</button>
          </> : <><p>Bank transfer appears automatically once the hotel adds its official Georgian bank account details.</p><button onClick={() => requestInvoice("bank")}>Ask for bank details ↗</button></>}
        </article>

        <article className={`payment-method ${config?.providers.crypto.enabled ? "enabled" : "pending"}`}>
          <span>03 / CRYPTO</span><h2>Crypto payment</h2>
          {config?.providers.crypto.enabled ? <>
            <p><b>{config.providers.crypto.asset} · {config.providers.crypto.network}</b><br /><code className="crypto-address">{config.providers.crypto.address}</code></p>
            <p className="payment-warning">Send only {config.providers.crypto.asset} on the {config.providers.crypto.network} network. The hotel confirms the payment after checking the transaction.</p>
            <button onClick={() => requestInvoice("crypto")}>Send transaction details ↗</button>
          </> : <><p>Crypto checkout is ready to expose only an owner-approved asset, network and wallet address. No wallet is invented or hard-coded.</p><button onClick={() => requestInvoice("crypto")}>Request a crypto invoice ↗</button></>}
        </article>
      </div>

      <p className="payment-footnote">Never send money to account details received from an unrelated person. Confirm the hotel name, amount and payment reference before completing a transfer.</p>
    </div>
  );
}
