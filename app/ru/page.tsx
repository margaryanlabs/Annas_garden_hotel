import type { Metadata } from "next";
import { ADDRESS, BOOKING_URL, HOTEL_AMENITIES, ROOMS, SITE_URL } from "../../lib/site";

export const metadata: Metadata = {
  title: "Anna's Garden Hotel в Тбилиси | Номера и бронирование",
  description: "Anna's Garden Hotel в Тбилиси: светлые номера, бесплатный Wi‑Fi и парковка, кондиционер, круглосуточная стойка регистрации. Адрес, номера и бронирование.",
  alternates: {
    canonical: `${SITE_URL}/ru`,
    languages: { "en-US": SITE_URL, "ru-RU": `${SITE_URL}/ru`, "ka-GE": `${SITE_URL}/ka`, "x-default": SITE_URL },
  },
};

export default function RussianPage() {
  return (
    <main className="seo-page" lang="ru">
      <nav className="seo-nav"><a className="seo-logo" href="/">ANNA’S GARDEN</a><div className="seo-nav-links"><a href="/rooms">Номера</a><a href="/faq">FAQ</a><a className="seo-book" href={BOOKING_URL} target="_blank" rel="noreferrer">Забронировать</a></div></nav>
      <header className="seo-hero"><p className="seo-kicker">ANNA’S GARDEN · ТБИЛИСИ</p><h1>Тихая сторона Тбилиси.</h1><p>Современный небольшой отель со светлыми номерами, приватными ванными комнатами, кондиционером, бесплатным Wi‑Fi и собственной бесплатной парковкой.</p></header>
      <section className="seo-grid">{ROOMS.map((room) => <a className="seo-card" href={`/rooms/${room.slug}`} key={room.slug}><img src={room.image} alt={`${room.name} в Anna's Garden Hotel`} loading="lazy"/><div className="seo-card-copy"><p className="seo-meta">{room.size} · {room.bed}</p><h2>{room.shortName}</h2><p>{room.description}</p></div></a>)}</section>
      <section className="seo-section"><p className="seo-kicker">УДОБСТВА</p><h2>Всё необходимое для спокойного проживания.</h2><ul className="seo-amenities">{HOTEL_AMENITIES.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className="seo-section"><p className="seo-kicker">АДРЕС</p><h2>{ADDRESS}</h2><div className="seo-cta-row"><a className="seo-cta primary" href={BOOKING_URL} target="_blank" rel="noreferrer">Проверить даты</a><a className="seo-cta" href="/contact">Контакты</a></div></section>
    </main>
  );
}
