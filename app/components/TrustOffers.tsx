"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Lang = "en" | "ru" | "ka";
type Props = { lang: Lang };

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "995599521751";
const GOOGLE_REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "";
const wa = (message: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

const copy = {
  en: {
    kicker: "WHY GUESTS CHOOSE US", title: "Small hotel. Clear reasons to stay.", body: "The strongest patterns in verified guest feedback are simple: cleanliness, comfort, helpful people and good value.",
    reasons: [["9.5", "Cleanliness", "Guests repeatedly highlight clean rooms, fresh linens and tidy bathrooms."], ["9.5", "Value", "A strong value score for a modern, comfortable stay in Tbilisi."], ["9.4", "Staff", "Friendly, responsive help before and during the stay."], ["Quiet", "Rest", "A calmer stay away from the loudest parts of the city." ]],
    offerKicker: "SPECIAL STAYS", offerTitle: "Ask for the stay that fits you.", offerBody: "No fake discounts. These are direct requests; the hotel confirms availability and the exact price before you pay.",
    offers: [["Airport Welcome", "Room + airport transfer request in one message.", "Hello Anna's Garden Hotel. I would like an Airport Welcome quote with room and airport transfer."], ["Quiet Weekend", "Ask for a Deluxe room and late-checkout option, subject to availability.", "Hello Anna's Garden Hotel. I would like a Quiet Weekend quote and to ask about late checkout."], ["Longer Stay", "Request a direct quote for 3+ nights and the best available conditions.", "Hello Anna's Garden Hotel. I would like a direct quote for a stay of 3 or more nights."]],
    ask: "Request this stay", google: "Review us on Google",
  },
  ru: {
    kicker: "ПОЧЕМУ ВЫБИРАЮТ НАС", title: "Небольшой отель. Понятные причины остаться.", body: "В подтверждённых отзывах постоянно повторяются четыре вещи: чистота, комфорт, отзывчивость и хорошее соотношение цены и качества.",
    reasons: [["9.5", "Чистота", "Гости отмечают чистые номера, свежее бельё и аккуратные ванные."], ["9.5", "Цена / качество", "Высокая оценка value для современного и комфортного проживания в Тбилиси."], ["9.4", "Персонал", "Дружелюбная и быстрая помощь до приезда и во время проживания."], ["Тихо", "Отдых", "Более спокойное проживание вдали от самых шумных частей города."]],
    offerKicker: "СПЕЦИАЛЬНЫЕ СЦЕНАРИИ", offerTitle: "Запросите формат проживания под себя.", offerBody: "Без выдуманных скидок. Отель сначала подтверждает наличие и точную цену, и только потом вы оплачиваете.",
    offers: [["Airport Welcome", "Номер + запрос трансфера из аэропорта одним сообщением.", "Здравствуйте. Хочу получить предложение Airport Welcome: номер и трансфер из аэропорта."], ["Quiet Weekend", "Запрос Deluxe и позднего выезда, если это возможно.", "Здравствуйте. Хочу предложение Quiet Weekend и узнать, возможен ли поздний выезд."], ["Longer Stay", "Запрос прямой цены на 3+ ночи и лучших доступных условий.", "Здравствуйте. Хочу прямое предложение на проживание от 3 ночей."]],
    ask: "Запросить предложение", google: "Оставить отзыв в Google",
  },
  ka: {
    kicker: "რატომ გვირჩევენ", title: "პატარა სასტუმრო. დარჩენის მკაფიო მიზეზები.", body: "დადასტურებულ შეფასებებში ხშირად მეორდება სისუფთავე, კომფორტი, ყურადღებიანი პერსონალი და კარგი ღირებულება.",
    reasons: [["9.5", "სისუფთავე", "სტუმრები ხშირად აღნიშნავენ სუფთა ნომრებს, თეთრეულსა და აბაზანებს."], ["9.5", "ღირებულება", "ძლიერი value შეფასება თანამედროვე და კომფორტული სტუმრობისთვის თბილისში."], ["9.4", "პერსონალი", "მეგობრული და სწრაფი დახმარება ჩამოსვლამდე და სტუმრობისას."], ["Quiet", "დასვენება", "უფრო მშვიდი გარემო ქალაქის ყველაზე ხმაურიანი უბნებისგან მოშორებით."]],
    offerKicker: "SPECIAL STAYS", offerTitle: "მოითხოვეთ თქვენზე მორგებული სტუმრობა.", offerBody: "გამოგონილი ფასდაკლებების გარეშე. სასტუმრო წინასწარ ადასტურებს ხელმისაწვდომობასა და ზუსტ ფასს.",
    offers: [["Airport Welcome", "ნომერი და აეროპორტის ტრანსფერის მოთხოვნა ერთ შეტყობინებაში.", "Hello Anna's Garden Hotel. I would like an Airport Welcome quote with room and airport transfer."], ["Quiet Weekend", "Deluxe ნომერი და გვიანი გასვლის მოთხოვნა, ხელმისაწვდომობის შემთხვევაში.", "Hello Anna's Garden Hotel. I would like a Quiet Weekend quote and to ask about late checkout."], ["Longer Stay", "პირდაპირი შეთავაზება 3+ ღამისთვის.", "Hello Anna's Garden Hotel. I would like a direct quote for a stay of 3 or more nights."]],
    ask: "მოთხოვნის გაგზავნა", google: "Google-ზე შეფასება",
  },
} as const;

export default function TrustOffers({ lang }: Props) {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const t = copy[lang];

  useEffect(() => {
    const gallery = document.querySelector(".gallery-section");
    if (!gallery?.parentElement) return;
    let node = document.getElementById("trust-offers-root");
    if (!node) { node = document.createElement("div"); node.id = "trust-offers-root"; gallery.insertAdjacentElement("afterend", node); }
    setMount(node);
    return () => { if (node && node.childElementCount === 0) node.remove(); };
  }, []);

  if (!mount) return null;
  return createPortal(<section className="trust-offers">
    <div className="trust-reasons"><div className="trust-head"><p className="kicker">{t.kicker}</p><h2>{t.title}</h2><p>{t.body}</p></div><div className="reason-grid">{t.reasons.map(([score,title,body]) => <article key={title}><strong>{score}</strong><h3>{title}</h3><p>{body}</p></article>)}</div></div>
    <div className="offers-wrap"><div className="trust-head"><p className="kicker">{t.offerKicker}</p><h2>{t.offerTitle}</h2><p>{t.offerBody}</p></div><div className="offers-grid">{t.offers.map(([title,body,message],i) => <article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{body}</p><a href={wa(message)} target="_blank" rel="noreferrer">{t.ask} ↗</a></article>)}</div>{GOOGLE_REVIEW_URL ? <a className="google-review-cta" href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer">{t.google} ↗</a> : null}</div>
  </section>, mount);
}
