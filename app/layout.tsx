import type { Metadata } from "next";
import "./globals.css";

const HERO = "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760841/1760841267/anna-s-garden-hotel-tbilisi-pic-19.JPEG";

export const metadata: Metadata = {
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
  return <html lang="en"><body>{children}</body></html>;
}
