import type { Metadata } from "next";
import { ADDRESS, BOOKING_URL, HOTEL_AMENITIES, SITE_URL } from "../../lib/site";

export const metadata: Metadata = {
  title: "FAQ | Anna's Garden Hotel Tbilisi",
  description: "Check-in, check-out, parking, Wi-Fi, airport shuttle, room amenities and other useful information for Anna's Garden Hotel in Tbilisi.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

const FAQ = [
  ["What time is check-in?", "Check-in is from 2:00 PM until midnight."],
  ["What time is check-out?", "Check-out is from 10:00 AM until 12:00 PM."],
  ["Is Wi-Fi free?", "Yes. Free Wi-Fi is available to hotel guests."],
  ["Is parking available?", "Yes. Free private parking is available on site."],
  ["Does the hotel offer an airport shuttle?", "Airport shuttle service is available. Contact the hotel for current arrangements and pricing."],
  ["Are the rooms air-conditioned?", "Yes. The listed guest rooms include air conditioning."],
  ["Are rooms non-smoking?", "The hotel lists non-smoking rooms among its main amenities."],
  ["Are pets allowed?", "Pets are not allowed at the property."],
  ["Are children welcome?", "Yes. Children of all ages are welcome. Booking conditions depend on the selected room and dates."],
  ["Where is Anna's Garden Hotel?", `The hotel is at ${ADDRESS}.`],
];

export default function FAQPage() {
  return (
    <main className="seo-page">
      <nav className="seo-nav"><a className="seo-logo" href="/">ANNA’S GARDEN</a><div className="seo-nav-links"><a href="/rooms">Rooms</a><a href="/contact">Contact</a><a className="seo-book" href={BOOKING_URL} target="_blank" rel="noreferrer">Book</a></div></nav>
      <header className="seo-hero"><p className="seo-kicker">GOOD TO KNOW</p><h1>Before you arrive.</h1><p>Simple answers to the practical questions guests usually ask before a stay.</p></header>
      <section className="seo-section">
        <div className="faq-list">{FAQ.map(([question, answer]) => <article className="faq-item" key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div>
      </section>
      <section className="seo-section"><p className="seo-kicker">AMENITIES</p><h2>The essentials.</h2><ul className="seo-amenities">{HOTEL_AMENITIES.map((item) => <li key={item}>{item}</li>)}</ul></section>
    </main>
  );
}
