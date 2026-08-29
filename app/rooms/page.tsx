import type { Metadata } from "next";
import { BOOKING_URL, ROOMS, SITE_URL } from "../../lib/site";

export const metadata: Metadata = {
  title: "Rooms | Anna's Garden Hotel Tbilisi",
  description: "Explore Deluxe Double, Deluxe Twin and Economy Double rooms at Anna's Garden Hotel in Tbilisi, Georgia.",
  alternates: { canonical: `${SITE_URL}/rooms` },
  openGraph: {
    title: "Rooms at Anna's Garden Hotel Tbilisi",
    description: "Bright, quiet rooms with private bathrooms, air conditioning and free Wi-Fi.",
    url: `${SITE_URL}/rooms`,
    type: "website",
  },
};

export default function RoomsPage() {
  return (
    <main className="seo-page">
      <nav className="seo-nav">
        <a className="seo-logo" href="/">ANNA’S GARDEN</a>
        <div className="seo-nav-links">
          <a href="/faq">FAQ</a><a href="/contact">Contact</a><a className="seo-book" href={BOOKING_URL} target="_blank" rel="noreferrer">Book</a>
        </div>
      </nav>
      <header className="seo-hero">
        <p className="seo-kicker">ROOMS · TBILISI</p>
        <h1>Space to slow down.</h1>
        <p>Three room types, quiet interiors and the essentials done properly: private bathrooms, air conditioning, soundproofing and free Wi-Fi.</p>
      </header>
      <section className="seo-grid" aria-label="Room types">
        {ROOMS.map((room) => (
          <a className="seo-card" href={`/rooms/${room.slug}`} key={room.slug}>
            <img src={room.image} alt={`${room.name} at Anna's Garden Hotel Tbilisi`} loading="lazy" />
            <div className="seo-card-copy">
              <p className="seo-meta">{room.size} · {room.bed}</p>
              <h2>{room.shortName}</h2>
              <p>{room.description}</p>
            </div>
          </a>
        ))}
      </section>
    </main>
  );
}
