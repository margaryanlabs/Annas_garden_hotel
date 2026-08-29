import type { Metadata } from "next";
import ReceptionCommandCenter from "../components/ReceptionCommandCenter";

export const metadata: Metadata = {
  title: "Reception Command Center | Anna's Garden Hotel",
  robots: { index: false, follow: false },
};

export default function ReceptionPage() {
  return <ReceptionCommandCenter />;
}
