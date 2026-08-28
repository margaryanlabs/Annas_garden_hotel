import type { Metadata } from "next";
import "./globals.css";

const HERO = "/media/hero-user.webp";

export const metadata: Metadata = {
  metadataBase: new URL("https://annas-garden-hotel.vercel.app"),
  title: "Anna's Garden Hotel | Tbilisi",
  description:
    "Anna's Garden Hotel in Tbilisi — bright, comfortable rooms, calm interiors, free Wi‑Fi, free parking and a 24-hour front desk.",
  openGraph: {
    title: "Anna's Garden Hotel | Tbilisi",
    description: "A calm, modern stay in Tbilisi with bright rooms and thoughtful comfort.",
    type: "website",
    images: [HERO],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anna's Garden Hotel | Tbilisi",
    description: "A calm, modern stay in Tbilisi.",
    images: [HERO],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          .hero {
            background-image: url('/media/hero-user.webp') !important;
            background-size: cover !important;
            background-position: center center !important;
            background-repeat: no-repeat !important;
          }
          .hero-photo {
            opacity: 0 !important;
          }
          @media (max-width: 700px) {
            .hero {
              background-position: 52% center !important;
            }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
