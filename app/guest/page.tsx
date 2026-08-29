import type { Metadata } from "next";
import GuestHub from "../components/GuestHub";

export const metadata: Metadata = {
  title: "Guest Hub | Anna's Garden Hotel",
  description: "Private digital guest hub for Anna's Garden Hotel: room requests, preferences, transfer, payments, directions and feedback.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ room?: string }> };

export default async function GuestPage({ searchParams }: Props) {
  const params = await searchParams;
  const room = typeof params.room === "string" ? params.room.replace(/[^0-9A-Za-z-]/g, "").slice(0, 12) : "";
  return <GuestHub initialRoom={room} />;
}
