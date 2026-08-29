import type { Metadata } from "next";
import { ADDRESS, BOOKING_URL, MAPS_URL, PHONE_HREF } from "../../lib/site";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "995599521751";
const wa = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const metadata: Metadata = {
  title: "Guest Guide | Anna's Garden Hotel",
  description: "Digital guest guide for Anna's Garden Hotel in Tbilisi.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/welcome" },
};

const actions = [
  { title: "Reception", body: "Need help with your room or your stay? Contact reception directly.", href: PHONE_HREF, cta: "Call reception" },
  { title: "Housekeeping", body: "Request room cleaning at a convenient time.", href: wa("Hello Anna's Garden Hotel. I would like to request housekeeping for my room. Please let me know the available time."), cta: "Request cleaning" },
  { title: "Fresh towels", body: "Need extra or fresh towels? Send a quick request.", href: wa("Hello Anna's Garden Hotel. Could I please request fresh towels for my room?"), cta: "Request towels" },
  { title: "Late check-out", body: "Standard check-out is by 12:00. Ask reception whether a later departure is possible.", href: wa("Hello Anna's Garden Hotel. I would like to ask whether late check-out is available for my stay."), cta: "Ask about late check-out" },
  { title: "Airport transfer", body: "Arrange a ride to or from Tbilisi International Airport.", href: wa("Hello Anna's Garden Hotel. I would like to arrange an airport transfer. Please send me the details."), cta: "Request transfer" },
  { title: "Hotel location", body: ADDRESS, href: MAPS_URL, cta: "Open Google Maps" },
];

export default function WelcomePage() {
  return (
    <main className="welcome-page">
      <nav className="welcome-nav"><a className="welcome-logo" href="/">ANNA’S GARDEN</a><a href={BOOKING_URL} target="_blank" rel="noreferrer">Booking.com ↗</a></nav>
      <header className="welcome-hero"><p className="kicker">DIGITAL GUEST GUIDE</p><h1>Welcome to Anna’s Garden.</h1><p>Everything useful during your stay in one quiet page — directions, reception, housekeeping, towels, transfer and late check-out requests.</p></header>
      <section className="welcome-grid">
        {actions.map((action, i) => <article className="welcome-card" key={action.title}><p className="kicker">0{i + 1}</p><h2>{action.title}</h2><p>{action.body}</p><a href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel={action.href.startsWith("http") ? "noreferrer" : undefined}>{action.cta} ↗</a></article>)}
      </section>
      <div className="welcome-note"><p><strong>Wi-Fi:</strong> ask reception for the current network and password. We deliberately do not publish guest Wi-Fi credentials on the public website.</p><a href={PHONE_HREF}>Need help? Call reception →</a></div>
    </main>
  );
}
