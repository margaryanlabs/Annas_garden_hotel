import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ADDRESS, BOOKING_URL, HOTEL_AMENITIES, ROOMS, SITE_URL } from "../../../lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ROOMS.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = ROOMS.find((item) => item.slug === slug);
  if (!room) return {};
  const url = `${SITE_URL}/rooms/${room.slug}`;
  return {
    title: `${room.name} | Anna's Garden Hotel Tbilisi`,
    description: `${room.description} Book ${room.name} at Anna's Garden Hotel, Tbilisi.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${room.name} · Anna's Garden Hotel`,
      description: room.description,
      url,
      type: "website",
      images: [{ url: room.image, alt: room.name }],
    },
  };
}

export default async function RoomPage({ params }: Props) {
  const { slug } = await params;
  const room = ROOMS.find((item) => item.slug === slug);
  if (!room) notFound();

  const url = `${SITE_URL}/rooms/${room.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Anna's Garden Hotel", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Rooms", item: `${SITE_URL}/rooms` },
          { "@type": "ListItem", position: 3, name: room.name, item: url },
        ],
      },
      {
        "@type": "HotelRoom",
        name: room.name,
        description: room.description,
        url,
        image: room.image.startsWith("http") ? room.image : `${SITE_URL}${room.image.split("?")[0]}`,
        occupancy: { "@type": "QuantitativeValue", maxValue: room.occupancy },
        bed: room.bed,
        amenityFeature: room.amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
        containedInPlace: { "@type": "Hotel", name: "Anna's Garden Hotel", address: ADDRESS, url: SITE_URL },
      },
    ],
  };

  return (
    <main className="seo-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <nav className="seo-nav">
        <a className="seo-logo" href="/">ANNA’S GARDEN</a>
        <div className="seo-nav-links"><a href="/rooms">All rooms</a><a href="/faq">FAQ</a><a className="seo-book" href={BOOKING_URL} target="_blank" rel="noreferrer">Book</a></div>
      </nav>
      <article className="seo-room">
        <div className="seo-room-photo"><img src={room.image} alt={`${room.name} at Anna's Garden Hotel in Tbilisi`} /></div>
        <div className="seo-room-copy">
          <p className="seo-kicker">ANNA’S GARDEN · TBILISI</p>
          <h1>{room.name}</h1>
          <p>{room.description}</p>
          <div className="seo-facts"><div className="seo-fact">{room.size}</div><div className="seo-fact">{room.bed}</div><div className="seo-fact">Up to {room.occupancy} guests</div><div className="seo-fact">Private bathroom</div></div>
          <h2>Room essentials</h2>
          <ul className="seo-amenities">{room.amenities.map((item) => <li key={item}>{item}</li>)}</ul>
          <p>Hotel amenities also include {HOTEL_AMENITIES.slice(0, 6).join(", ")}.</p>
          <div className="seo-cta-row"><a className="seo-cta primary" href={BOOKING_URL} target="_blank" rel="noreferrer">Check availability</a><a className="seo-cta" href="/contact">Contact hotel</a></div>
        </div>
      </article>
    </main>
  );
}
