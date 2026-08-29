"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BOOKING_URL } from "../../lib/site";

type Lang = "en" | "ru" | "ka";
type Props = { lang: Lang };

const content = {
  en: {
    kicker: "VERIFIED GUEST VOICES",
    title: "The kind of quiet people remember.",
    intro: "A transparent snapshot of what verified Booking.com guests consistently mention about Anna’s Garden.",
    source: "Read all verified reviews",
    note: "Review text below is paraphrased from verified Booking.com guest feedback, not invented or copied verbatim.",
    most: "Guests mention most",
    categories: "Category scores",
    cards: [
      { person: "David", country: "Israel", text: "A very comfortable bed, a good bathroom, excellent cleanliness and strong value for the stay." },
      { person: "Mariam", country: "Georgia", text: "New, clean and comfortable rooms, nearby supermarkets and staff who are friendly and ready to help." },
      { person: "Tatiana", country: "Russia", text: "A quiet freshly renovated room and a kind, responsive owner who is easy to reach when needed." },
      { person: "Aida", country: "Kazakhstan", text: "Very clean rooms with the essentials in place, fresh white linens and towels, and a comfortable overall stay." },
    ],
  },
  ru: {
    kicker: "ПРОВЕРЕННЫЕ ОТЗЫВЫ ГОСТЕЙ",
    title: "Тишина, которую запоминают.",
    intro: "Честный срез того, что гости с подтверждённым проживанием чаще всего отмечают об Anna’s Garden на Booking.com.",
    source: "Все проверенные отзывы",
    note: "Тексты ниже аккуратно перефразированы по реальным отзывам Booking.com — ничего не придумано и не скопировано дословно.",
    most: "Чаще всего отмечают",
    categories: "Оценки по категориям",
    cards: [
      { person: "David", country: "Израиль", text: "Очень удобная кровать, хороший санузел, высокий уровень чистоты и отличное соотношение цены и качества." },
      { person: "Mariam", country: "Грузия", text: "Новый, чистый и комфортный отель; рядом магазины, а персонал дружелюбный и всегда готов помочь." },
      { person: "Tatiana", country: "Россия", text: "Тихий номер со свежим ремонтом и доброжелательный, отзывчивый владелец, к которому легко обратиться." },
      { person: "Aida", country: "Казахстан", text: "Очень чистые номера, всё необходимое на месте, белоснежное бельё и полотенца, отдыхать комфортно." },
    ],
  },
  ka: {
    kicker: "დადასტურებული სტუმრების შეფასებები",
    title: "სიმშვიდე, რომელიც გახსოვთ.",
    intro: "Booking.com-ზე დადასტურებული სტუმრების უკუკავშირის გამჭვირვალე მიმოხილვა Anna’s Garden-ის შესახებ.",
    source: "ყველა დადასტურებული შეფასება",
    note: "ქვემოთ მოცემული ტექსტები რეალური Booking.com შეფასებების გადმოცემაა და არა გამოგონილი ციტატები.",
    most: "რას ახსენებენ ყველაზე ხშირად",
    categories: "კატეგორიების შეფასებები",
    cards: [
      { person: "David", country: "Israel", text: "კომფორტული საწოლი, კარგი აბაზანა, მაღალი სისუფთავე და ძალიან კარგი ფასის შესაბამისობა." },
      { person: "Mariam", country: "Georgia", text: "ახალი, სუფთა და კომფორტული სასტუმრო, ახლოს მაღაზიებით და მეგობრული, დამხმარე პერსონალით." },
      { person: "Tatiana", country: "Russia", text: "წყნარი, ახლად განახლებული ნომერი და კეთილი, ყურადღებიანი მფლობელი, რომელსაც მარტივად დაუკავშირდებით." },
      { person: "Aida", country: "Kazakhstan", text: "ძალიან სუფთა ნომრები, საჭირო ნივთები ადგილზე, სუფთა თეთრეული და კომფორტული გარემო." },
    ],
  },
} as const;

const scores = [
  ["Cleanliness", "9.5"],
  ["Value", "9.5"],
  ["Staff", "9.4"],
  ["Comfort", "9.3"],
  ["Facilities", "9.3"],
  ["Location", "8.9"],
] as const;

const topics = ["Clean", "Room", "Location", "Bathroom", "Bed"];

export default function ReviewsShowcase({ lang }: Props) {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const t = content[lang];

  useEffect(() => {
    const rating = document.querySelector(".rating-section");
    if (!rating?.parentElement) return;
    let node = document.getElementById("reviews-portal-root");
    if (!node) {
      node = document.createElement("div");
      node.id = "reviews-portal-root";
      rating.insertAdjacentElement("afterend", node);
    }
    setMount(node);
    return () => {
      if (node && node.childElementCount === 0) node.remove();
    };
  }, []);

  if (!mount) return null;

  return createPortal(
    <section className="reviews-showcase" id="reviews" aria-label="Verified guest reviews">
      <div className="reviews-shell">
        <div className="reviews-head">
          <div>
            <p className="kicker">{t.kicker}</p>
            <h2>{t.title}</h2>
            <p className="reviews-intro">{t.intro}</p>
          </div>
          <a className="reviews-score" href={BOOKING_URL} target="_blank" rel="noreferrer">
            <span>BOOKING.COM</span>
            <strong>9.3</strong>
            <em>Wonderful · 27 reviews</em>
          </a>
        </div>

        <div className="reviews-topic-row" aria-label={t.most}>
          <small>{t.most}</small>
          {topics.map((topic) => <span key={topic}>{topic}</span>)}
        </div>

        <div className="reviews-cards">
          {t.cards.map((card, i) => (
            <article className={`review-card review-card-${i + 1}`} key={`${card.person}-${card.country}`}>
              <div className="review-card-top"><span>{String(i + 1).padStart(2, "0")}</span><b>VERIFIED STAY</b></div>
              <p>{card.text}</p>
              <footer><strong>{card.person}</strong><span>{card.country}</span></footer>
            </article>
          ))}
        </div>

        <div className="reviews-bottom">
          <div className="reviews-categories">
            <p className="kicker">{t.categories}</p>
            <div className="reviews-score-grid">
              {scores.map(([label, score]) => (
                <div key={label}><span>{label}</span><strong>{score}</strong><i><em style={{ width: `${Number(score) * 10}%` }} /></i></div>
              ))}
            </div>
          </div>
          <div className="reviews-source">
            <p>{t.note}</p>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer">{t.source} ↗</a>
          </div>
        </div>
      </div>
    </section>,
    mount,
  );
}
