import type { Metadata } from "next";
import ReceptionCommandCenter from "../components/ReceptionCommandCenter";
import ReceptionOperationsDeck from "../components/ReceptionOperationsDeck";

export const metadata: Metadata = {
  title: "Reception Command Center | Anna's Garden Hotel",
  robots: { index: false, follow: false },
};

export default function ReceptionPage() {
  return <><ReceptionCommandCenter /><ReceptionOperationsDeck /></>;
}
