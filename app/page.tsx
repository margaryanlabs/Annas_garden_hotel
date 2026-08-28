"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

type Lang = "en" | "ru" | "ka";
type GalleryItem = { src: string; label: string; className: string };

const BOOKING_URL = "https://www.booking.com/hotel/ge/annas-garden.html";

// Only Anna's Garden photography already supplied/used for this project.
const media = {
  hero: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760841/1760841267/anna-s-garden-hotel-tbilisi-pic-19.JPEG",
  roomWide: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840185/anna-s-garden-hotel-tbilisi-pic-9.JPEG",
  roomBlue: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760858/1760858077/anna-s-garden-hotel-tbilisi-pic-65.JPEG",
  roomTwin: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760841/1760841051/anna-s-garden-hotel-tbilisi-pic-18.JPEG",
  roomWarm: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760859/1760859625/anna-s-garden-hotel-tbilisi-pic-49.JPEG",
  roomDetail: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760856/1760856470/anna-s-garden-hotel-tbilisi-pic-38.JPEG",
  roomQuiet: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760860/1760860204/anna-s-garden-hotel-tbilisi-pic-50.JPEG",
  corridor201: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760842/1760842628/anna-s-garden-hotel-tbilisi-pic-26.JPEG",
  corridorAlt: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760842/1760842903/anna-s-garden-hotel-tbilisi-pic-28.JPEG",
  dnd: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760857/1760857251/anna-s-garden-hotel-tbilisi-pic-41.JPEG",
  balcony: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760867/1760867157/anna-s-garden-hotel-tbilisi-pic-68.JPEG",
  lobby: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840152/anna-s-garden-hotel-tbilisi-pic-57.JPEG",
  arrival: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760864/1760864967/anna-s-garden-hotel-tbilisi-pic-53.JPEG",
};

const rooms = [
  { src: media.hero, name: "Deluxe Double", meta: "24 m² · queen bed · balcony", note: "Warm light, generous space and a quiet city view." },
  { src: media.roomTwin, name: "Deluxe Twin", meta: "19 m² · two beds", note: "Two proper beds, clean lines and room to settle in." },
  { src: media.roomBlue, name: "Economy Double", meta: "15 m² · full bed", note: "Compact, bright and deliberately simple." },
];

const gallery: GalleryItem[] = [
  { src: media.hero, label: "Deluxe Double · warm light", className: "g-wide" },
  { src: media.corridor201, label: "201 / 204 · threshold", className: "g-tall" },
  { src: media.roomTwin, label: "Deluxe Twin · quiet morning", className: "g-small" },
  { src: media.lobby, label: "Arrival · reflected light", className: "g-small" },
  { src: media.roomBlue, label: "Economy Double · soft blue", className: "g-tall" },
  { src: media.roomWide, label: "Room detail · open space", className: "g-wide" },
  { src: media.corridorAlt, label: "The corridor · evening", className: "g-small" },
  { src: media.roomWarm, label: "Guest room · sunlight", className: "g-small" },
  { src: media.arrival, label: "Welcome · Anna's Garden", className: "g-wide" },
  { src: media.balcony, label: "Balcony · a pause outside", className: "g-tall" },
];

const copy = {
  en: {
    nav: ["Rooms", "Story", "Gallery", "Location"], book: "Book your stay", heroKicker: "ANNA'S GARDEN · TBILISI",
    heroTitle: "A quieter side of Tbilisi.", heroBody: "Bright rooms, reflected light and thoughtful comfort — a calm modern base in the city.", explore: "Explore the stay",
    chapters: ["ARRIVE", "SETTLE", "BREATHE", "WANDER", "STAY"], introKicker: "01 / ARRIVE", introTitle: "Garden without the cliché.",
    introBody: "Not leaves everywhere. Light, stillness, organic lines and the feeling of stepping away from the city for a while.",
    roomsKicker: "02 / SETTLE", roomsTitle: "Rooms made for slowing down.", roomsBody: "Each room gets its own scale and its own moment — no tiny carousel cards.", availability: "Check availability",
    corridorKicker: "03 / BREATHE · 201 / 204", corridorTitle: "Behind every door, a quieter stay.", corridorBody: "The corridor becomes the threshold. Keep scrolling and step inside.", reveal: "STEP INSIDE",
    dndKicker: "QUIET, PLEASE", dndTitle: "Do not disturb.", dndSub: "That’s the idea.", dndBody: "Clean rooms, calm nights and enough space to switch off.",
    balconyKicker: "04 / WANDER", balconyTitle: "Step outside.", balconyBody: "A small pause between your room and Tbilisi.",
    rating: "GUEST RATING", wonderful: "Wonderful", galleryKicker: "LIGHT · REFLECTION · QUIET", galleryTitle: "The stay, frame by frame.", galleryBody: "Strong rooms first. Then thresholds, details and arrival — with room to breathe between them.",
    locationKicker: "TBILISI", locationTitle: "Arrive. Exhale.", locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.", directions: "Open in Maps",
    finalKicker: "05 / STAY", finalTitle: "Come back to quiet.", finalBody: "Check live availability and current rates on Booking.com.",
  },
  ru: {
    nav: ["Номера", "История", "Галерея", "Локация"], book: "Забронировать", heroKicker: "ANNA'S GARDEN · ТБИЛИСИ",
    heroTitle: "Тихая сторона Тбилиси.", heroBody: "Светлые номера, отражения и продуманный комфорт — спокойная современная база в городе.", explore: "Посмотреть отель",
    chapters: ["ПРИЕХАТЬ", "УСТРОИТЬСЯ", "ВЫДОХНУТЬ", "ПОГУЛЯТЬ", "ОСТАТЬСЯ"], introKicker: "01 / ПРИЕХАТЬ", introTitle: "Garden без клише.",
    introBody: "Не листья повсюду. Свет, тишина, органические линии и ощущение, что город на время остаётся снаружи.",
    roomsKicker: "02 / УСТРОИТЬСЯ", roomsTitle: "Номера, в которых хочется замедлиться.", roomsBody: "У каждого номера свой масштаб и свой момент — никаких мелких случайных карточек.", availability: "Проверить даты",
    corridorKicker: "03 / ВЫДОХНУТЬ · 201 / 204", corridorTitle: "За каждой дверью — немного больше тишины.", corridorBody: "Коридор становится порогом. Продолжайте скролл — и заходите внутрь.", reveal: "ЗАХОДИТЕ",
    dndKicker: "ТИШИНА, ПОЖАЛУЙСТА", dndTitle: "Не беспокоить.", dndSub: "В этом и идея.", dndBody: "Чистые номера, спокойные ночи и пространство, где можно отключиться.",
    balconyKicker: "04 / ПОГУЛЯТЬ", balconyTitle: "Выйти на воздух.", balconyBody: "Маленькая пауза между номером и Тбилиси.",
    rating: "ОЦЕНКА ГОСТЕЙ", wonderful: "Превосходно", galleryKicker: "СВЕТ · ОТРАЖЕНИЕ · ТИШИНА", galleryTitle: "Отель, кадр за кадром.", galleryBody: "Сначала сильные номера. Затем коридоры, детали и прибытие — с правильным ритмом.",
    locationKicker: "ТБИЛИСИ", locationTitle: "Приехать. Выдохнуть.", locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.", directions: "Открыть карту",
    finalKicker: "05 / ОСТАТЬСЯ", finalTitle: "Возвращайтесь в тишину.", finalBody: "Актуальные даты и цены доступны на Booking.com.",
  },
  ka: {
    nav: ["ნომრები", "ისტორია", "გალერეა", "მდებარეობა"], book: "დაჯავშნა", heroKicker: "ANNA'S GARDEN · თბილისი",
    heroTitle: "თბილისის მშვიდი მხარე.", heroBody: "ნათელი ოთახები, ანარეკლები და გააზრებული კომფორტი — მშვიდი თანამედროვე ადგილი ქალაქში.", explore: "სასტუმროს ნახვა",
    chapters: ["ჩამოსვლა", "მოწყობა", "ამოსუნთქვა", "გასეირნება", "დარჩენა"], introKicker: "01 / ARRIVE", introTitle: "Garden ზედმეტი კლიშეების გარეშე.", introBody: "სინათლე, სიმშვიდე და ორგანული ხაზები — ქალაქიდან მოკლე პაუზის შეგრძნება.",
    roomsKicker: "02 / SETTLE", roomsTitle: "ოთახები მშვიდი რიტმისთვის.", roomsBody: "თითოეულ ოთახს აქვს საკუთარი სივრცე და საკუთარი მომენტი.", availability: "ხელმისაწვდომობა",
    corridorKicker: "03 / BREATHE · 201 / 204", corridorTitle: "ყოველი კარის მიღმა — მეტი სიმშვიდე.", corridorBody: "დერეფანი ხდება ზღვარი ქალაქსა და ოთახს შორის.", reveal: "შემოდით",
    dndKicker: "QUIET, PLEASE", dndTitle: "არ შემაწუხოთ.", dndSub: "სწორედ ესაა იდეა.", dndBody: "სუფთა ოთახები, მშვიდი ღამეები და სივრცე დასვენებისთვის.",
    balconyKicker: "04 / WANDER", balconyTitle: "გადით აივანზე.", balconyBody: "პატარა პაუზა ოთახსა და თბილისს შორის.",
    rating: "სტუმრების შეფასება", wonderful: "შესანიშნავი", galleryKicker: "LIGHT · REFLECTION · QUIET", galleryTitle: "სასტუმრო კადრებად.", galleryBody: "ოთახები, დერეფნები, დეტალები და ჩამოსვლის მომენტი.",
    locationKicker: "თბილისი", locationTitle: "ჩამოსვლა. ამოსუნთქვა.", locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.", directions: "რუკაზე გახსნა",
    finalKicker: "05 / STAY", finalTitle: "დაუბრუნდით სიმშვიდეს.", finalBody: "აქტუალური ფასები და ხელმისაწვდომობა Booking.com-ზე.",
  },
} as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [menu, setMenu] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [pageProgress, setPageProgress] = useState(0);
  const [thresholdProgress, setThresholdProgress] = useState(0);
  const [cursor, setCursor] = useState({ x: -100, y: -100, label: "" });
  const thresholdRef = useRef<HTMLElement | null>(null);
  const t = useMemo(() => copy[lang], [lang]);

  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - window.innerHeight;
      setPageProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      if (thresholdRef.current) {
        const rect = thresholdRef.current.getBoundingClientRect();
        const travel = Math.max(1, thresholdRef.current.offsetHeight - window.innerHeight);
        const passed = Math.min(travel, Math.max(0, -rect.top));
        setThresholdProgress(passed / travel);
      }
    };
    const move = (e: MouseEvent) => setCursor((old) => ({ ...old, x: e.clientX, y: e.clientY }));
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu || lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu, lightbox]);

  const revealIn = Math.max(0, Math.min(1, (thresholdProgress - 0.24) / 0.18));
  const revealOut = Math.max(0, Math.min(1, (0.72 - thresholdProgress) / 0.18));
  const roomIn = Math.max(0, Math.min(1, (thresholdProgress - 0.56) / 0.32));
  const thresholdStyle = {
    "--corridor-scale": 1 + thresholdProgress * 0.12,
    "--corridor-brightness": 1 - thresholdProgress * 0.22,
    "--vignette-opacity": 1 - thresholdProgress * 0.55,
    "--copy-opacity": Math.max(0, 1 - thresholdProgress * 2.3),
    "--copy-shift": `${-thresholdProgress * 40}px`,
    "--door-width": `${88 - thresholdProgress * 55}vw`,
    "--door-height": `${84 - thresholdProgress * 28}vh`,
    "--door-border": 0.08 + thresholdProgress * 0.32,
    "--door-shadow": thresholdProgress * 0.38,
    "--reveal-opacity": revealIn * revealOut,
    "--room-opacity": roomIn,
    "--room-scale": 1.12 - roomIn * 0.12,
    "--room-clip-y": `${(1 - roomIn) * 18}%`,
    "--room-clip-x": `${(1 - roomIn) * 14}%`,
  } as CSSProperties;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className={`garden-cursor ${cursor.label ? "has-label" : ""}`} style={{ transform: `translate3d(${cursor.x}px,${cursor.y}px,0)` }}><span>{cursor.label}</span></div>
      <svg className="garden-line" viewBox="0 0 72 1000" aria-hidden="true">
        <path className="stem" pathLength="1" style={{ strokeDashoffset: 1 - pageProgress }} d="M38 0 C10 110 62 188 32 292 C8 380 60 474 34 574 C9 674 62 754 31 855 C17 904 33 956 24 1000" />
        <path className="leaf leaf-1" style={{ opacity: pageProgress > .18 ? .65 : 0 }} d="M34 264 C14 253 10 232 14 218 C34 227 43 245 34 264Z" />
        <path className="leaf leaf-2" style={{ opacity: pageProgress > .43 ? .65 : 0 }} d="M35 536 C55 518 63 496 59 482 C42 489 29 509 35 536Z" />
        <path className="leaf leaf-3" style={{ opacity: pageProgress > .68 ? .65 : 0 }} d="M31 805 C12 794 8 773 12 758 C31 768 40 787 31 805Z" />
      </svg>

      <header className="topbar">
        <a href="#main" className="brand" aria-label="Anna's Garden home"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></a>
        <nav className="desktop-nav">{t.nav.map((item, i) => <a key={item} href={["#rooms", "#story", "#gallery", "#location"][i]}>{item}</a>)}</nav>
        <div className="top-actions">
          <div className="langs">{(["en", "ru", "ka"] as Lang[]).map((l) => <button key={l} className={lang === l ? "active" : ""} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}</div>
          <a className="book-ghost" href={BOOKING_URL} target="_blank" rel="noreferrer">{t.book}</a>
          <button className="menu-btn" onClick={() => setMenu(true)} aria-label="Open menu"><i /><i /></button>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <img className="hero-photo" src={media.hero} alt="Anna's Garden Hotel room" fetchPriority="high" />
          <div className="hero-grade" /><div className="hero-light" />
          <div className="hero-copy"><p className="kicker">{t.heroKicker}</p><h1>{t.heroTitle}</h1><p className="lede">{t.heroBody}</p><div className="hero-actions"><a className="btn-primary" href={BOOKING_URL} target="_blank" rel="noreferrer">{t.book}</a><a className="btn-text" href="#rooms">{t.explore}<span>↓</span></a></div></div>
          <div className="chapter-rail">{t.chapters.map((chapter, i) => <a key={chapter} href={["#main", "#rooms", "#story", "#gallery", "#stay"][i]}><span>0{i + 1}</span><strong>{chapter}</strong><i /></a>)}</div>
        </section>

        <section className="intro-section botanical-section"><div className="botanical-shadow shadow-one" aria-hidden="true"><i /><i /><i /><i /></div><p className="kicker">{t.introKicker}</p><h2 data-reflect={t.introTitle}>{t.introTitle}</h2><p>{t.introBody}</p></section>

        <section id="rooms" className="rooms-section">
          <div className="rooms-intro botanical-section"><div className="botanical-shadow shadow-two" aria-hidden="true"><i /><i /><i /></div><p className="kicker">{t.roomsKicker}</p><h2>{t.roomsTitle}</h2><p>{t.roomsBody}</p></div>
          <div className="room-stack">{rooms.map((room, i) => <article className={`room-story room-${i + 1}`} key={room.name}><div className="room-visual" onMouseEnter={() => setCursor((c) => ({ ...c, label: "VIEW" }))} onMouseLeave={() => setCursor((c) => ({ ...c, label: "" }))} onClick={() => setLightbox(i === 0 ? 0 : i === 1 ? 2 : 4)}><img src={room.src} alt={room.name} loading={i === 0 ? "eager" : "lazy"} /><span className="room-index">0{i + 1}</span></div><div className="room-copy"><p className="kicker">ROOM 0{i + 1}</p><h3>{room.name}</h3><p className="room-meta">{room.meta}</p><p>{room.note}</p><a href={BOOKING_URL} target="_blank" rel="noreferrer">{t.availability} ↗</a></div></article>)}</div>
        </section>

        <section id="story" ref={thresholdRef} className="threshold-section" style={thresholdStyle}>
          <div className="threshold-sticky"><img className="threshold-corridor" src={media.corridor201} alt="Anna's Garden corridor with rooms 201 and 204" /><div className="threshold-vignette" /><div className="threshold-copy"><p className="kicker">{t.corridorKicker}</p><h2>{t.corridorTitle}</h2><p>{t.corridorBody}</p></div><div className="door-focus" aria-hidden="true"><span>{t.reveal}</span></div><img className="threshold-room" src={media.hero} alt="Inside a room at Anna's Garden Hotel" /></div>
        </section>

        <section className="dnd-section"><button className="dnd-photo" onClick={() => setLightbox(10)} onMouseEnter={() => setCursor((c) => ({ ...c, label: "OPEN" }))} onMouseLeave={() => setCursor((c) => ({ ...c, label: "" }))}><img src={media.dnd} alt="Do not disturb detail at Anna's Garden Hotel" loading="lazy" /></button><div className="dnd-copy"><p className="kicker">{t.dndKicker}</p><h2>{t.dndTitle}<em>{t.dndSub}</em></h2><p>{t.dndBody}</p><span className="botanical-mark">⌁</span></div></section>

        <section className="balcony-section"><img src={media.balcony} alt="Balcony at Anna's Garden Hotel" loading="lazy" /><div className="balcony-grade" /><div className="balcony-copy"><p className="kicker">{t.balconyKicker}</p><h2>{t.balconyTitle}</h2><p>{t.balconyBody}</p></div></section>

        <section className="rating-section"><div className="rating-lead"><p className="kicker">{t.rating}</p><strong>9.3</strong><h2>{t.wonderful}</h2><p>Booking.com · 27 reviews</p></div><div className="rating-bars">{[["Cleanliness", "9.5"], ["Value", "9.5"], ["Staff", "9.4"], ["Comfort", "9.3"], ["Facilities", "9.3"], ["Location", "8.9"]].map(([label, score]) => <div key={label}><span>{label}</span><b>{score}</b><i><em style={{ width: `${Number(score) * 10}%` }} /></i></div>)}</div></section>

        <section id="gallery" className="gallery-section"><div className="gallery-head"><p className="kicker">{t.galleryKicker}</p><h2>{t.galleryTitle}</h2><p>{t.galleryBody}</p></div><div className="gallery-grid">{gallery.map((item, i) => <button key={`${item.src}-${i}`} className={`gallery-item ${item.className}`} onClick={() => setLightbox(i)} onMouseEnter={() => setCursor((c) => ({ ...c, label: "OPEN" }))} onMouseLeave={() => setCursor((c) => ({ ...c, label: "" }))}><img src={item.src} alt={item.label} loading="lazy" /><span>{String(i + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span><small>{item.label}</small></button>)}</div></section>

        <section id="location" className="arrival-section"><div className="arrival-copy"><p className="kicker">{t.locationKicker}</p><h2>{t.locationTitle}</h2><p>{t.locationBody}</p><a href="https://www.google.com/maps/search/?api=1&query=10+Shalva+Mshvelidze+Street+Tbilisi" target="_blank" rel="noreferrer">{t.directions} ↗</a></div><div className="arrival-photo"><img src={media.lobby} alt="Anna's Garden Hotel reception" loading="lazy" /><span>ARRIVAL / TBILISI</span></div></section>

        <section id="stay" className="final-section botanical-section"><div className="botanical-shadow shadow-final" aria-hidden="true"><i /><i /><i /></div><p className="kicker">{t.finalKicker}</p><h2>{t.finalTitle}</h2><p>{t.finalBody}</p><a className="btn-primary invert" href={BOOKING_URL} target="_blank" rel="noreferrer">{t.book}</a><div className="giant-g">G</div></section>
      </main>

      <footer><div className="footer-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></div><p>10 Shalva Mshvelidze Street · Tbilisi</p><a href={BOOKING_URL} target="_blank" rel="noreferrer">Booking.com ↗</a></footer>

      {menu && <div className="mobile-menu"><div className="mobile-top"><div className="footer-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></div><button onClick={() => setMenu(false)}>×</button></div><nav>{t.nav.map((item, i) => <a key={item} href={["#rooms", "#story", "#gallery", "#location"][i]} onClick={() => setMenu(false)}><span>0{i + 1}</span>{item}</a>)}</nav><div className="mobile-langs">{(["en", "ru", "ka"] as Lang[]).map((l) => <button key={l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}</div><a className="btn-primary" href={BOOKING_URL} target="_blank" rel="noreferrer">{t.book}</a></div>}

      {lightbox !== null && <div className="lightbox"><button className="lightbox-close" onClick={() => setLightbox(null)}>×</button><button className="lightbox-prev" onClick={() => setLightbox((lightbox - 1 + gallery.length) % gallery.length)}>←</button><figure><img src={(lightbox < gallery.length ? gallery[lightbox].src : media.dnd)} alt="Anna's Garden Hotel gallery" /><figcaption><span>{String((lightbox % gallery.length) + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span><strong>{lightbox < gallery.length ? gallery[lightbox].label : "Quiet, please"}</strong></figcaption></figure><button className="lightbox-next" onClick={() => setLightbox((lightbox + 1) % gallery.length)}>→</button></div>}
    </>
  );
}
