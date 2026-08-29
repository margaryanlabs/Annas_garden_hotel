import type { Metadata } from "next";
import { MAPS_URL, SITE_URL } from "../../lib/site";

export const metadata: Metadata = {
  title: "Tbilisi Guide | Anna's Garden Hotel",
  description: "A compact Tbilisi guide from Anna's Garden Hotel: Old Tbilisi, Holy Trinity Cathedral, Dry Bridge Market, Freedom Square and Tbilisi International Airport.",
  alternates: { canonical: `${SITE_URL}/tbilisi-guide` },
  openGraph: {
    title: "A small Tbilisi guide · Anna's Garden Hotel",
    description: "Useful places to save before your stay in Tbilisi.",
    url: `${SITE_URL}/tbilisi-guide`,
    type: "article",
  },
};

const places = [
  { name: "Old Tbilisi", query: "Old Tbilisi Georgia", text: "Historic streets, wooden balconies, sulfur-bath architecture and some of the city’s most recognizable atmosphere." },
  { name: "Holy Trinity Cathedral", query: "Holy Trinity Cathedral Tbilisi", text: "A major Tbilisi landmark and a useful orientation point when exploring the city." },
  { name: "Dry Bridge Market", query: "Dry Bridge Market Tbilisi", text: "An open-air market known for antiques, art, vintage objects and browsing." },
  { name: "Freedom Square", query: "Freedom Square Tbilisi", text: "A central meeting point with easy access toward Rustaveli Avenue and the old city." },
  { name: "Tbilisi International Airport", query: "Tbilisi International Airport", text: "Save the airport location before arrival and contact the hotel if you would like to ask about a transfer." },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Anna's Garden Hotel Tbilisi guide",
  itemListElement: places.map((place, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: place.name,
  })),
};

export default function TbilisiGuidePage() {
  return (
    <main className="seo-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <nav className="seo-nav"><a className="seo-logo" href="/">ANNA’S GARDEN</a><div className="seo-nav-links"><a href="/rooms">Rooms</a><a href="/contact">Hotel location</a></div></nav>
      <section className="seo-content-page">
        <p className="seo-kicker">TBILISI · LOCAL GUIDE</p>
        <h1>A few places worth saving before you arrive.</h1>
        <p className="seo-lead">A deliberately short list — useful landmarks and places to explore, with direct Google Maps links instead of copied travel-guide filler.</p>
        <div className="seo-guide-grid">
          {places.map((place, index) => <article className="seo-guide-item" key={place.name}><span>0{index + 1}</span><h2>{place.name}</h2><p>{place.text}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`} target="_blank" rel="noreferrer">Open in Maps ↗</a></article>)}
        </div>
        <div className="seo-location-note"><div><p className="seo-kicker">YOUR BASE</p><h2>Anna’s Garden Hotel</h2><p>10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.</p></div><a className="seo-cta primary" href={MAPS_URL} target="_blank" rel="noreferrer">Hotel on Google Maps ↗</a></div>
      </section>
    </main>
  );
}
