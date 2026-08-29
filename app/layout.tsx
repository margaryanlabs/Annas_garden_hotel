import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./seo.css";
import "./stay-tools.css";
import "./guide.css";
import "./reviews.css";
import "./payments.css";
import SiteEnhancements from "./components/SiteEnhancements";
import { BOOKING_URL, HOTEL_AMENITIES, MAPS_URL, PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "../lib/site";

const HERO = "/media/hero-user.webp?v=exact-hero-20260828";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Anna's Garden Hotel | Tbilisi, Georgia", template: "%s · Anna's Garden Hotel" },
  description: "Anna's Garden Hotel in Tbilisi — bright, comfortable rooms with private bathrooms, air conditioning, free Wi-Fi, free private parking and a 24-hour front desk.",
  applicationName: "Anna's Garden Hotel",
  alternates: { canonical: "/", languages: { "en-US": SITE_URL, "ru-RU": `${SITE_URL}/ru`, "ka-GE": `${SITE_URL}/ka`, "x-default": SITE_URL } },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { title: "Anna's Garden Hotel | Tbilisi, Georgia", description: "A quiet modern stay in Tbilisi with bright rooms, free Wi-Fi and free private parking.", type: "website", url: SITE_URL, siteName: "Anna's Garden Hotel", locale: "en_US", alternateLocale: ["ru_RU", "ka_GE"], images: [{ url: HERO, alt: "Anna's Garden Hotel room in Tbilisi" }] },
  twitter: { card: "summary_large_image", title: "Anna's Garden Hotel | Tbilisi", description: "A quiet modern stay in Tbilisi, Georgia.", images: [HERO] },
  verification: GOOGLE_VERIFICATION ? { google: GOOGLE_VERIFICATION } : undefined,
  category: "travel",
};

const hotelSchema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: "Anna's Garden Hotel", inLanguage: ["en", "ru", "ka"] },
    { "@type": "Hotel", "@id": `${SITE_URL}/#hotel`, name: "Anna's Garden Hotel", url: SITE_URL, image: `${SITE_URL}/media/hero-user.webp`, telephone: PHONE_DISPLAY, sameAs: [BOOKING_URL], address: { "@type": "PostalAddress", streetAddress: "10 Shalva Mshvelidze Street", postalCode: "0190", addressLocality: "Tbilisi", addressCountry: "GE" }, checkinTime: "14:00", checkoutTime: "12:00", petsAllowed: false, amenityFeature: HOTEL_AMENITIES.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })) },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema).replace(/</g, "\\u003c") }} />
    <link rel="preconnect" href="https://annas-garden.tbilisi-hotels.com" /><link rel="dns-prefetch" href="https://annas-garden.tbilisi-hotels.com" />
    <style>{`.hero{background-image:url('/media/hero-user.webp?v=exact-hero-20260828')!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important}.hero-photo{opacity:0!important}@media(max-width:700px){.hero{background-position:52% center!important}}`}</style>
  </head><body>
    {children}<SiteEnhancements />
    <nav className="seo-footer-links" aria-label="Hotel information">
      <a href="/rooms">Rooms</a><a href="/faq">FAQ</a><a href="/contact">Contact</a><a href="/tbilisi-guide">Tbilisi Guide</a><a href="/guest">Guest Guide</a><a href="/pay">Payment</a><a href="/terms">Terms</a><a href="/refund-policy">Refunds</a><a href="/privacy">Privacy</a><a href="/service-policy">Service</a><a href="/ru" lang="ru">RU</a><a href="/ka" lang="ka">KA</a><a href={BOOKING_URL} target="_blank" rel="noreferrer">Booking.com ↗</a>
    </nav>
    <aside className="booking-dock" aria-label="Quick hotel actions"><a href="/#plan-your-stay">Dates</a><a href={BOOKING_URL} target="_blank" rel="noreferrer">Book</a><a href="/pay">Pay</a><a href={PHONE_HREF}>Call</a><a href={MAPS_URL} target="_blank" rel="noreferrer">Map</a></aside>
    {GA_ID ? <><Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" /><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}</Script></> : null}
  </body></html>;
}
