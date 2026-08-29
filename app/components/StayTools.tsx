"use client";

import { FormEvent, useMemo, useState } from "react";
import { BOOKING_URL, MAPS_URL, ROOMS } from "../../lib/site";

type Lang = "en" | "ru" | "ka";
type Props = { lang: Lang };

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "995599521751";

const text = {
  en: {
    kicker: "PLAN YOUR STAY",
    title: "Everything you need, before you arrive.",
    body: "Check dates, compare rooms, message the hotel or arrange an airport transfer without hunting through different pages.",
    check: "Check your dates",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    rooms: "Rooms",
    search: "Search availability",
    concierge: "WhatsApp concierge",
    conciergeBody: "Ask about a room, late arrival, parking or anything else before your stay.",
    message: "Message the hotel",
    transfer: "Airport transfer",
    transferBody: "Send your flight details and number of guests. The hotel can confirm the transfer directly with you.",
    flight: "Flight number (optional)",
    people: "Passengers",
    transferCta: "Request transfer",
    compare: "Compare rooms",
    compareBody: "A quick view of the three room types currently presented on the site.",
    rating: "Guest proof",
    ratingBody: "Booking.com currently shows a 9.3 guest rating based on 27 reviews. We link to the source rather than copying or inventing review text.",
    reviews: "See rating on Booking.com",
    guide: "A small Tbilisi guide",
    guideBody: "Useful places to open directly in Maps while planning your stay.",
    map: "Open in Maps",
    welcome: "Already staying with us?",
    welcomeBody: "Open the guest page for directions, reception help, housekeeping requests, towels, transfer and late-checkout requests.",
    welcomeCta: "Open guest page",
  },
  ru: {
    kicker: "СПЛАНИРУЙТЕ ПРОЖИВАНИЕ",
    title: "Всё нужное ещё до приезда.",
    body: "Проверьте даты, сравните номера, напишите в отель или запросите трансфер из аэропорта в одном месте.",
    check: "Проверить даты",
    checkIn: "Заезд",
    checkOut: "Выезд",
    guests: "Гости",
    rooms: "Номера",
    search: "Проверить наличие",
    concierge: "WhatsApp-консьерж",
    conciergeBody: "Спросите про номер, поздний заезд, парковку или любые детали до приезда.",
    message: "Написать в отель",
    transfer: "Трансфер из аэропорта",
    transferBody: "Отправьте номер рейса и количество гостей. Отель сможет подтвердить трансфер напрямую.",
    flight: "Номер рейса (необязательно)",
    people: "Пассажиры",
    transferCta: "Запросить трансфер",
    compare: "Сравнить номера",
    compareBody: "Короткое сравнение трёх типов номеров, которые сейчас представлены на сайте.",
    rating: "Отзывы гостей",
    ratingBody: "Booking.com сейчас показывает оценку 9.3 на основе 27 отзывов. Мы ведём на источник и не выдумываем тексты отзывов.",
    reviews: "Открыть рейтинг Booking.com",
    guide: "Небольшой гид по Тбилиси",
    guideBody: "Полезные места, которые можно сразу открыть на карте при планировании поездки.",
    map: "Открыть карту",
    welcome: "Уже живёте у нас?",
    welcomeBody: "Откройте гостевую страницу: адрес, помощь ресепшена, уборка, полотенца, трансфер и запрос позднего выезда.",
    welcomeCta: "Гостевая страница",
  },
  ka: {
    kicker: "დაგეგმეთ თქვენი ვიზიტი",
    title: "ყველაფერი, რაც ჩამოსვლამდე გჭირდებათ.",
    body: "შეამოწმეთ თარიღები, შეადარეთ ნომრები, მისწერეთ სასტუმროს ან მოითხოვეთ აეროპორტის ტრანსფერი ერთ სივრცეში.",
    check: "თარიღების შემოწმება",
    checkIn: "ჩამოსვლა",
    checkOut: "გასვლა",
    guests: "სტუმრები",
    rooms: "ნომრები",
    search: "ხელმისაწვდომობის ნახვა",
    concierge: "WhatsApp კონსიერჟი",
    conciergeBody: "ჰკითხეთ ნომრის, გვიანი ჩამოსვლის, პარკინგის ან სხვა დეტალების შესახებ.",
    message: "მისწერეთ სასტუმროს",
    transfer: "აეროპორტის ტრანსფერი",
    transferBody: "გამოგვიგზავნეთ რეისის ნომერი და სტუმრების რაოდენობა. სასტუმრო პირდაპირ დაგიდასტურებთ ტრანსფერს.",
    flight: "რეისის ნომერი (არასავალდებულო)",
    people: "მგზავრები",
    transferCta: "ტრანსფერის მოთხოვნა",
    compare: "ნომრების შედარება",
    compareBody: "საიტზე წარმოდგენილი სამი ტიპის ნომრის მოკლე შედარება.",
    rating: "სტუმრების შეფასება",
    ratingBody: "Booking.com ამჟამად აჩვენებს 9.3 შეფასებას 27 მიმოხილვის საფუძველზე. ჩვენ ვუთითებთ წყაროს და არ ვიგონებთ შეფასებებს.",
    reviews: "Booking.com-ზე ნახვა",
    guide: "პატარა თბილისური გზამკვლევი",
    guideBody: "სასარგებლო ადგილები, რომლებიც შეგიძლიათ პირდაპირ Maps-ში გახსნათ.",
    map: "რუკაზე გახსნა",
    welcome: "უკვე ჩვენი სტუმარი ხართ?",
    welcomeBody: "გახსენით სტუმრის გვერდი მისამართისთვის, რესეფშენთან კავშირისთვის, დასუფთავების, პირსახოცების, ტრანსფერისა და გვიანი გასვლის მოთხოვნებისთვის.",
    welcomeCta: "სტუმრის გვერდი",
  },
} as const;

const guide = [
  { name: "Old Tbilisi", query: "Old Tbilisi Georgia", note: "Historic streets, balconies and the old-city atmosphere." },
  { name: "Holy Trinity Cathedral", query: "Holy Trinity Cathedral Tbilisi", note: "One of Tbilisi’s defining landmarks." },
  { name: "Dry Bridge Market", query: "Dry Bridge Market Tbilisi", note: "Antiques, art and a very local browse." },
  { name: "Freedom Square", query: "Freedom Square Tbilisi", note: "A central point for exploring the city." },
  { name: "Tbilisi International Airport", query: "Tbilisi International Airport", note: "Useful for arrival, departure and transfer planning." },
];

function track(event: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", event, params);
}

function whatsapp(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function StayTools({ lang }: Props) {
  const t = text[lang];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [flight, setFlight] = useState("");
  const [passengers, setPassengers] = useState(2);

  const minCheckout = useMemo(() => checkIn || new Date().toISOString().slice(0, 10), [checkIn]);

  function submitAvailability(event: FormEvent) {
    event.preventDefault();
    const url = new URL(BOOKING_URL);
    if (checkIn) url.searchParams.set("checkin", checkIn);
    if (checkOut) url.searchParams.set("checkout", checkOut);
    url.searchParams.set("group_adults", String(guests));
    url.searchParams.set("no_rooms", String(roomCount));
    url.searchParams.set("group_children", "0");
    track("check_availability", { guests, rooms: roomCount });
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  function submitTransfer(event: FormEvent) {
    event.preventDefault();
    const message = `Hello Anna's Garden Hotel. I would like to request an airport transfer.\nPassengers: ${passengers}${flight ? `\nFlight: ${flight}` : ""}\nPlease confirm availability and details.`;
    track("airport_transfer_request", { passengers });
    window.open(whatsapp(message), "_blank", "noopener,noreferrer");
  }

  const conciergeText = "Hello Anna's Garden Hotel. I have a question about my stay.";

  return (
    <section className="stay-tools" id="plan-your-stay">
      <div className="stay-tools-head">
        <p className="kicker">{t.kicker}</p>
        <h2>{t.title}</h2>
        <p>{t.body}</p>
      </div>

      <div className="stay-tools-grid">
        <article className="stay-panel stay-panel-booking">
          <p className="stay-eyebrow">01</p><h3>{t.check}</h3>
          <form className="stay-form" onSubmit={submitAvailability}>
            <label>{t.checkIn}<input type="date" value={checkIn} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setCheckIn(e.target.value)} /></label>
            <label>{t.checkOut}<input type="date" value={checkOut} min={minCheckout} onChange={(e) => setCheckOut(e.target.value)} /></label>
            <label>{t.guests}<select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>{[1,2,3,4].map((n) => <option key={n}>{n}</option>)}</select></label>
            <label>{t.rooms}<select value={roomCount} onChange={(e) => setRoomCount(Number(e.target.value))}>{[1,2,3].map((n) => <option key={n}>{n}</option>)}</select></label>
            <button type="submit">{t.search} ↗</button>
          </form>
        </article>

        <article className="stay-panel stay-panel-concierge">
          <p className="stay-eyebrow">02</p><h3>{t.concierge}</h3><p>{t.conciergeBody}</p>
          <a className="stay-action" href={whatsapp(conciergeText)} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_concierge")}>{t.message} ↗</a>
        </article>

        <article className="stay-panel stay-panel-transfer">
          <p className="stay-eyebrow">03</p><h3>{t.transfer}</h3><p>{t.transferBody}</p>
          <form className="transfer-form" onSubmit={submitTransfer}>
            <input aria-label={t.flight} placeholder={t.flight} value={flight} onChange={(e) => setFlight(e.target.value)} />
            <label>{t.people}<select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}>{[1,2,3,4,5,6].map((n) => <option key={n}>{n}</option>)}</select></label>
            <button type="submit">{t.transferCta} ↗</button>
          </form>
        </article>
      </div>

      <div className="room-compare-block">
        <div className="stay-subhead"><p className="kicker">ROOMS</p><h3>{t.compare}</h3><p>{t.compareBody}</p></div>
        <div className="room-compare-table" role="table" aria-label="Room comparison">
          {ROOMS.map((room, i) => (
            <a href={`/rooms/${room.slug}`} className="room-compare-card" key={room.slug}>
              <span>0{i + 1}</span><h4>{room.shortName}</h4><p>{room.size}</p><p>{room.bed}</p><p>Up to {room.occupancy} guests</p><strong>View room →</strong>
            </a>
          ))}
        </div>
      </div>

      <div className="proof-guide-grid">
        <article className="proof-card">
          <p className="kicker">9.3 / 10</p><h3>{t.rating}</h3><p>{t.ratingBody}</p>
          <a href={BOOKING_URL} target="_blank" rel="noreferrer" onClick={() => track("booking_reviews_click")}>{t.reviews} ↗</a>
        </article>
        <article className="guide-card">
          <div className="stay-subhead"><p className="kicker">TBILISI</p><h3>{t.guide}</h3><p>{t.guideBody}</p></div>
          <div className="guide-list">{guide.map((place) => <a key={place.name} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`} target="_blank" rel="noreferrer"><strong>{place.name}</strong><span>{place.note}</span><em>{t.map} ↗</em></a>)}</div>
          <a className="hotel-map-link" href={MAPS_URL} target="_blank" rel="noreferrer">Anna’s Garden on Google Maps ↗</a>
        </article>
      </div>

      <div className="guest-page-banner">
        <div><p className="kicker">DIGITAL GUEST GUIDE</p><h3>{t.welcome}</h3><p>{t.welcomeBody}</p></div>
        <a href="/welcome">{t.welcomeCta} →</a>
      </div>
    </section>
  );
}
