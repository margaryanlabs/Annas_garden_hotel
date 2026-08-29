import { redirect } from "next/navigation";

export const metadata = {
  title: "Guest QR | Anna's Garden Hotel",
  robots: { index: false, follow: false },
};

export default function ShortQrRoute() {
  redirect("/guest/qr");
}
