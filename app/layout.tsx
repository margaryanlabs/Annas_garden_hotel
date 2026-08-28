import type { Metadata } from "next";
import "./globals.css";
import "./images.css";

export const metadata: Metadata = {
  title: "Anna's Garden Hotel | Tbilisi",
  description:
    "Anna's Garden Hotel in Tbilisi — bright, comfortable rooms, garden and courtyard views, free Wi‑Fi, free parking and a 24-hour front desk.",
  openGraph: {
    title: "Anna's Garden Hotel | Tbilisi",
    description:
      "A calm, modern stay in Tbilisi with bright rooms, garden views and thoughtful comfort.",
    type: "website",
    images: ["/images/hero.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anna's Garden Hotel | Tbilisi",
    description: "A calm, modern stay in Tbilisi.",
    images: ["/images/hero.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
