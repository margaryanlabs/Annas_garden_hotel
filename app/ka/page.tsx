import type { Metadata } from "next";
import { ADDRESS, BOOKING_URL, HOTEL_AMENITIES, ROOMS, SITE_URL } from "../../lib/site";

export const metadata: Metadata = {
  title: "Anna's Garden Hotel თბილისში | ნომრები და დაჯავშნა",
  description: "Anna's Garden Hotel თბილისში — ნათელი ოთახები, უფასო Wi‑Fi და პარკინგი, კონდიციონერი და 24-საათიანი მიმღები. ნომრები, მისამართი და დაჯავშნა.",
  alternates: {
    canonical: `${SITE_URL}/ka`,
    languages: { "en-US": SITE_URL, "ru-RU": `${SITE_URL}/ru`, "ka-GE": `${SITE_URL}/ka`, "x-default": SITE_URL },
  },
};

export default function GeorgianPage() {
  return (
    <main className="seo-page" lang="ka">
      <nav className="seo-nav"><a className="seo-logo" href="/">ANNA’S GARDEN</a><div className="seo-nav-links"><a href="/rooms">ნომრები</a><a href="/faq">FAQ</a><a className="seo-book" href={BOOKING_URL} target="_blank" rel="noreferrer">დაჯავშნა</a></div></nav>
      <header className="seo-hero"><p className="seo-kicker">ANNA’S GARDEN · თბილისი</p><h1>თბილისის მშვიდი მხარე.</h1><p>თანამედროვე მცირე სასტუმრო ნათელი ოთახებით, პირადი სააბაზანოებით, კონდიციონერით, უფასო Wi‑Fi-ით და უფასო კერძო პარკინგით.</p></header>
      <section className="seo-grid">{ROOMS.map((room) => <a className="seo-card" href={`/rooms/${room.slug}`} key={room.slug}><img src={room.image} alt={`${room.name} Anna's Garden Hotel-ში`} loading="lazy"/><div className="seo-card-copy"><p className="seo-meta">{room.size} · {room.bed}</p><h2>{room.shortName}</h2><p>{room.description}</p></div></a>)}</section>
      <section className="seo-section"><p className="seo-kicker">სერვისები</p><h2>ყველაფერი მშვიდი დასვენებისთვის.</h2><ul className="seo-amenities">{HOTEL_AMENITIES.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className="seo-section"><p className="seo-kicker">მისამართი</p><h2>{ADDRESS}</h2><div className="seo-cta-row"><a className="seo-cta primary" href={BOOKING_URL} target="_blank" rel="noreferrer">ხელმისაწვდომობის ნახვა</a><a className="seo-cta" href="/contact">კონტაქტი</a></div></section>
    </main>
  );
}
