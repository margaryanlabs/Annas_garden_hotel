"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";

type Lang = "en" | "ru" | "ka";

const BOOKING_URL = "https://www.booking.com/hotel/ge/annas-garden.html";

const media = {
  hero: "/media/hero-premium.svg",
  roomWarm: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760841/1760841267/anna-s-garden-hotel-tbilisi-pic-19.JPEG",
  roomBalcony: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760867/1760867157/anna-s-garden-hotel-tbilisi-pic-68.JPEG",
  roomBlue: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760858/1760858077/anna-s-garden-hotel-tbilisi-pic-65.JPEG",
  roomTwin: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760841/1760841051/anna-s-garden-hotel-tbilisi-pic-18.JPEG",
  roomWide: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840185/anna-s-garden-hotel-tbilisi-pic-9.JPEG",
  corridor: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760842/1760842994/anna-s-garden-hotel-tbilisi-pic-29.JPEG",
  corridorAlt: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760842/1760842903/anna-s-garden-hotel-tbilisi-pic-28.JPEG",
  dnd: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760857/1760857251/anna-s-garden-hotel-tbilisi-pic-41.JPEG",
  lobby: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840152/anna-s-garden-hotel-tbilisi-pic-57.JPEG",
  arrival: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760864/1760864967/anna-s-garden-hotel-tbilisi-pic-53.JPEG",
};

const gallery = [
  media.roomWarm,
  media.corridorAlt,
  media.roomBlue,
  media.roomWide,
  media.corridor,
  media.roomTwin,
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840190/anna-s-garden-hotel-tbilisi-pic-13.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840175/anna-s-garden-hotel-tbilisi-pic-5.JPEG",
  media.lobby,
  media.roomBalcony,
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760860/1760860204/anna-s-garden-hotel-tbilisi-pic-50.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760859/1760859625/anna-s-garden-hotel-tbilisi-pic-49.JPEG",
];

const copy = {
  en: {
    nav: ["Rooms", "Story", "Gallery", "Location"],
    book: "Book your stay",
    heroKicker: "ANNA'S GARDEN · TBILISI",
    heroTitle: "A quieter side of Tbilisi.",
    heroBody: "Bright rooms, reflected light and thoughtful comfort — a calm modern base in the city.",
    explore: "Explore the stay",
    chapters: ["ARRIVE", "SETTLE", "BREATHE", "WANDER", "STAY"],
    roomsKicker: "02 / SETTLE",
    roomsTitle: "Rooms made for slowing down.",
    roomsBody: "No carousel of tiny cards. Each room gets space, light and a proper moment.",
    roomNames: ["Deluxe Double", "Deluxe Twin", "Economy Double"],
    roomMeta: ["24 m² · queen bed · balcony", "19 m² · two beds", "15 m² · full bed"],
    roomNotes: ["Warm light, a generous bed and a quiet city view.", "Two proper beds, clean lines and room to settle in.", "Compact, calm and deliberately simple."],
    availability: "Check availability",
    corridorTitle: "Behind every door, a quieter stay.",
    corridorBody: "201 / 204 is not filler photography. It is a chapter — the threshold between the city and the room.",
    revealTitle: "Step inside.",
    dndTitle: "Do not disturb.",
    dndSub: "That’s the idea.",
    dndBody: "A small hotel with a simple promise: clean rooms, calm nights and enough space to switch off.",
    balconyTitle: "Step outside.",
    balconyBody: "Selected rooms open onto a private balcony — a small pause between your room and Tbilisi.",
    rating: "Guest rating",
    wonderful: "Wonderful",
    galleryKicker: "LIGHT · REFLECTION · QUIET",
    galleryTitle: "A gallery with rhythm.",
    galleryBody: "Large frames, quiet details, no random repetition.",
    locationTitle: "Arrive. Exhale.",
    locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.",
    directions: "Open in Maps",
    finalTitle: "Come back to quiet.",
    finalBody: "Check live availability and current rates on Booking.com.",
  },
  ru: {
    nav: ["Номера", "История", "Галерея", "Локация"],
    book: "Забронировать",
    heroKicker: "ANNA'S GARDEN · ТБИЛИСИ",
    heroTitle: "Тихая сторона Тбилиси.",
    heroBody: "Светлые номера, отражения и продуманный комфорт — спокойная современная база в городе.",
    explore: "Посмотреть отель",
    chapters: ["ПРИЕХАТЬ", "УСТРОИТЬСЯ", "ВЫДОХНУТЬ", "ПОГУЛЯТЬ", "ОСТАТЬСЯ"],
    roomsKicker: "02 / УСТРОИТЬСЯ",
    roomsTitle: "Номера, в которых хочется замедлиться.",
    roomsBody: "Без мелких случайных карточек. Каждый номер получает пространство, свет и собственный момент.",
    roomNames: ["Deluxe Double", "Deluxe Twin", "Economy Double"],
    roomMeta: ["24 м² · queen bed · балкон", "19 м² · две кровати", "15 м² · двуспальная кровать"],
    roomNotes: ["Тёплый свет, большая кровать и спокойный городской вид.", "Две полноценные кровати, чистые линии и достаточно пространства.", "Компактный, тихий и намеренно простой."],
    availability: "Проверить даты",
    corridorTitle: "За каждой дверью — немного больше тишины.",
    corridorBody: "201 / 204 — не проходная фотография, а отдельная глава: граница между городом и номером.",
    revealTitle: "Заходите.",
    dndTitle: "Не беспокоить.",
    dndSub: "В этом и идея.",
    dndBody: "Небольшой отель с простым обещанием: чистые номера, спокойные ночи и место, где можно отключиться.",
    balconyTitle: "Выйти на воздух.",
    balconyBody: "В некоторых номерах есть собственный балкон — небольшая пауза между номером и Тбилиси.",
    rating: "Оценка гостей",
    wonderful: "Превосходно",
    galleryKicker: "СВЕТ · ОТРАЖЕНИЕ · ТИШИНА",
    galleryTitle: "Галерея с ритмом.",
    galleryBody: "Большие кадры, тихие детали и никаких случайных повторов.",
    locationTitle: "Приехать. Выдохнуть.",
    locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.",
    directions: "Открыть карту",
    finalTitle: "Возвращайтесь в тишину.",
    finalBody: "Актуальные даты и цены доступны на Booking.com.",
  },
  ka: {
    nav: ["ნომრები", "ისტორია", "გალერეა", "მდებარეობა"],
    book: "დაჯავშნა",
    heroKicker: "ANNA'S GARDEN · თბილისი",
    heroTitle: "თბილისის მშვიდი მხარე.",
    heroBody: "ნათელი ოთახები, სინათლის ანარეკლები და გააზრებული კომფორტი — მშვიდი თანამედროვე ადგილი ქალაქში.",
    explore: "სასტუმროს ნახვა",
    chapters: ["ჩამოსვლა", "მოწყობა", "ამოსუნთქვა", "გასეირნება", "დარჩენა"],
    roomsKicker: "02 / SETTLE",
    roomsTitle: "ოთახები მშვიდი რიტმისთვის.",
    roomsBody: "თითოეულ ოთახს აქვს სივრცე, სინათლე და საკუთარი მომენტი.",
    roomNames: ["Deluxe Double", "Deluxe Twin", "Economy Double"],
    roomMeta: ["24 მ² · queen bed · აივანი", "19 მ² · ორი საწოლი", "15 მ² · ორმაგი საწოლი"],
    roomNotes: ["თბილი სინათლე და მშვიდი ქალაქის ხედი.", "ორი სრულფასოვანი საწოლი და სუფთა ხაზები.", "კომპაქტური, მშვიდი და მარტივი."],
    availability: "ხელმისაწვდომობა",
    corridorTitle: "ყოველი კარის მიღმა — მეტი სიმშვიდე.",
    corridorBody: "201 / 204 არის გადასვლა ქალაქიდან ოთახში — არა უბრალოდ ფოტო.",
    revealTitle: "შემოდით.",
    dndTitle: "არ შემაწუხოთ.",
    dndSub: "სწორედ ესაა იდეა.",
    dndBody: "სუფთა ოთახები, მშვიდი ღამეები და სივრცე დასასვენებლად.",
    balconyTitle: "გადით აივანზე.",
    balconyBody: "ზოგიერთ ნომერს აქვს საკუთარი აივანი — პატარა პაუზა ოთახსა და თბილისს შორის.",
    rating: "სტუმრების შეფასება",
    wonderful: "შესანიშნავი",
    galleryKicker: "სინათლე · ანარეკლი · სიმშვიდე",
    galleryTitle: "გალერეა რიტმით.",
    galleryBody: "დიდი კადრები, მშვიდი დეტალები და ნაკლები გამეორება.",
    locationTitle: "ჩამოსვლა. ამოსუნთქვა.",
    locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.",
    directions: "რუკაზე ნახვა",
    finalTitle: "დაუბრუნდით სიმშვიდეს.",
    finalBody: "აქტუალური თარიღები და ფასები Booking.com-ზეა.",
  },
} as const;

const roomImages = [media.roomWarm, media.roomTwin, media.roomBlue];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [menu, setMenu] = useState(false);
  const [booking, setBooking] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [doorProgress, setDoorProgress] = useState(0);
  const [cursor, setCursor] = useState({ x: -100, y: -100, label: "" });
  const t = useMemo(() => copy[lang], [lang]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);

      const door = document.querySelector<HTMLElement>(".door-transition");
      if (door) {
        const rect = door.getBoundingClientRect();
        const raw = (window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.25);
        setDoorProgress(Math.max(0, Math.min(1, raw)));
      }
    };
    const onMove = (e: MouseEvent) => setCursor((c) => ({ ...c, x: e.clientX, y: e.clientY }));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu || booking || lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu, booking, lightbox]);

  const cursorEnter = (label: string) => setCursor((c) => ({ ...c, label }));
  const cursorLeave = () => setCursor((c) => ({ ...c, label: "" }));
  const revealInset = Math.max(0, 14 - doorProgress * 14);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className={`garden-cursor ${cursor.label ? "is-active" : ""}`} style={{ transform: `translate3d(${cursor.x}px,${cursor.y}px,0)` }}>{cursor.label && <span>{cursor.label}</span>}</div>

      <svg className="garden-line" viewBox="0 0 100 1000" aria-hidden="true">
        <path className="stem" pathLength="1" style={{ strokeDashoffset: 1 - scrollProgress }} d="M55 0 C20 98 88 162 48 252 C12 338 87 402 52 506 C22 596 80 660 49 750 C21 836 72 912 45 1000" />
        <path className={`leaf leaf-1 ${scrollProgress > .16 ? "grown" : ""}`} d="M50 265 C24 250 18 226 23 211 C46 221 57 239 50 265Z" />
        <path className={`leaf leaf-2 ${scrollProgress > .42 ? "grown" : ""}`} d="M53 515 C77 493 88 470 84 451 C61 461 48 484 53 515Z" />
        <path className={`leaf leaf-3 ${scrollProgress > .68 ? "grown" : ""}`} d="M48 760 C21 747 16 721 20 705 C42 714 56 735 48 760Z" />
      </svg>

      <header className="topbar">
        <a href="#" className="brand" aria-label="Anna's Garden Hotel home"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></a>
        <nav className="desktop-nav">{t.nav.map((item, i) => <a key={item} href={["#rooms", "#story", "#gallery", "#location"][i]}>{item}</a>)}</nav>
        <div className="top-actions">
          <div className="langs">{(["en", "ru", "ka"] as Lang[]).map((l) => <button key={l} onClick={() => setLang(l)} className={lang === l ? "active" : ""}>{l.toUpperCase()}</button>)}</div>
          <button className="book-ghost" onClick={() => setBooking(true)}>{t.book}</button>
          <button className="menu-btn" onClick={() => setMenu(true)} aria-label="Open menu"><i /><i /></button>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-media" style={{ backgroundImage: `url(${media.hero})`, transform: `scale(${1.025 + Math.min(scrollProgress * .18, .055)}) translate3d(${Math.min(scrollProgress * -2.2, -.8)}%,0,0)` }} />
          <div className="hero-shade" />
          <div className="botanical-shadow botanical-shadow-hero" />
          <div className="hero-copy">
            <p className="kicker">{t.heroKicker}</p>
            <h1 data-reflection={t.heroTitle}>{t.heroTitle}</h1>
            <p className="lede">{t.heroBody}</p>
            <div className="hero-actions"><button className="btn-primary" onClick={() => setBooking(true)}>{t.book}</button><a className="btn-text" href="#rooms">{t.explore}<span>↓</span></a></div>
          </div>
          <div className="hero-facts"><div><span>9.3</span><small>Booking.com</small></div><div><span>24/7</span><small>Front desk</small></div><div><span>TBILISI</span><small>10 Shalva Mshvelidze</small></div></div>
          <div className="chapter-rail">{t.chapters.map((x, i) => <div key={x}><span>0{i + 1}</span><strong>{x}</strong><i>⌁</i></div>)}</div>
        </section>

        <section className="manifesto section-light">
          <div className="botanical-shadow botanical-shadow-a" />
          <p className="kicker">01 / ARRIVE</p>
          <h2>Garden without the cliché.</h2>
          <p>Not fake leaves. Light, shadow, reflection, quiet and an organic line that grows as you move through the stay.</p>
        </section>

        <section id="rooms" className="rooms-stage">
          <div className="rooms-heading"><p className="kicker">{t.roomsKicker}</p><h2>{t.roomsTitle}</h2><p>{t.roomsBody}</p></div>
          {roomImages.map((src, i) => (
            <article className={`room-story room-story-${i + 1}`} key={src}>
              <button className="room-visual" onClick={() => setLightbox(gallery.indexOf(src) >= 0 ? gallery.indexOf(src) : 0)} onMouseEnter={() => cursorEnter("VIEW")} onMouseLeave={cursorLeave}>
                <img src={src} alt={t.roomNames[i]} loading={i === 0 ? "eager" : "lazy"} />
                <span className="room-index">0{i + 1}</span>
              </button>
              <div className="room-copy"><p className="kicker">ROOM 0{i + 1}</p><h3>{t.roomNames[i]}</h3><p className="room-meta">{t.roomMeta[i]}</p><p>{t.roomNotes[i]}</p><button className="text-link" onClick={() => setBooking(true)}>{t.availability} ↗</button></div>
            </article>
          ))}
        </section>

        <section id="story" className="door-transition">
          <div className="corridor-media" style={{ backgroundImage: `url(${media.corridor})`, transform: `scale(${1.02 + doorProgress * .08})` }} />
          <div className="corridor-shade" />
          <div className="door-frame" style={{ opacity: .22 + doorProgress * .55, transform: `translate(-50%,-50%) scale(${1 - doorProgress * .06})` }} />
          <div className="door-copy"><p className="kicker">03 / BREATHE · 201 / 204</p><h2>{t.corridorTitle}</h2><p>{t.corridorBody}</p></div>
        </section>

        <section className="room-reveal section-light">
          <div className="reveal-label"><p className="kicker">THRESHOLD</p><h2>{t.revealTitle}</h2></div>
          <div className="reveal-frame" style={{ clipPath: `inset(${revealInset}% ${revealInset * .55}% ${revealInset}% ${revealInset * .55}% round ${Math.max(0, 14 - doorProgress * 12)}px)` }}>
            <img src={media.roomWide} alt="Anna's Garden room interior" />
          </div>
        </section>

        <section className="dnd-section">
          <button className="dnd-photo" onClick={() => setLightbox(4)} onMouseEnter={() => cursorEnter("OPEN")} onMouseLeave={cursorLeave} style={{ backgroundImage: `url(${media.dnd})` }} aria-label="Open do not disturb photo" />
          <div className="dnd-copy"><p className="kicker">QUIET, PLEASE</p><h2>{t.dndTitle}<span>{t.dndSub}</span></h2><p>{t.dndBody}</p><div className="editorial-mark">⌁</div></div>
        </section>

        <section className="balcony-section">
          <div className="balcony-media" style={{ backgroundImage: `url(${media.roomBalcony})` }} />
          <div className="balcony-shade" />
          <div className="balcony-card"><span>04 / WANDER</span><h2>{t.balconyTitle}</h2><p>{t.balconyBody}</p></div>
        </section>

        <section className="rating-section">
          <div className="rating-score"><p className="kicker">{t.rating}</p><strong>9.3</strong><h2>{t.wonderful}</h2><p>Booking.com · 9.3 / 10</p></div>
          <div className="rating-bars">{[["Cleanliness", "9.5"], ["Value", "9.5"], ["Staff", "9.4"], ["Comfort", "9.3"], ["Location", "8.9"]].map(([label, score]) => <div key={label}><span>{label}</span><b>{score}</b><i><em style={{ width: `${Number(score) * 10}%` }} /></i></div>)}</div>
        </section>

        <section id="gallery" className="gallery-section">
          <div className="gallery-head"><p className="kicker">{t.galleryKicker}</p><h2>{t.galleryTitle}</h2><p>{t.galleryBody}</p></div>
          <div className="gallery-grid">{gallery.map((src, i) => <button className={`gallery-tile tile-${i + 1}`} key={`${src}-${i}`} onClick={() => setLightbox(i)} onMouseEnter={() => cursorEnter("OPEN")} onMouseLeave={cursorLeave}><img src={src} alt={`Anna's Garden Hotel photo ${i + 1}`} loading="lazy" /><span>{String(i + 1).padStart(2, "0")}</span></button>)}</div>
        </section>

        <section id="location" className="arrival-section section-light">
          <div className="arrival-copy"><p className="kicker">05 / STAY · TBILISI</p><h2>{t.locationTitle}</h2><p>{t.locationBody}</p><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=10+Shalva+Mshvelidze+Street+Tbilisi" target="_blank" rel="noreferrer">{t.directions} ↗</a></div>
          <div className="arrival-image" style={{ backgroundImage: `url(${media.lobby})` }}><span>ARRIVAL</span></div>
          <div className="arrival-detail" style={{ backgroundImage: `url(${media.arrival})` }} />
        </section>

        <section className="final-section"><div className="botanical-shadow botanical-shadow-final" /><p className="kicker">ANNA’S GARDEN · TBILISI</p><h2>{t.finalTitle}</h2><p>{t.finalBody}</p><button className="btn-primary invert" onClick={() => setBooking(true)}>{t.book}</button><div className="brand-mark">G</div></section>
      </main>

      <footer><div className="footer-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></div><p>10 Shalva Mshvelidze Street · Tbilisi</p><a href={BOOKING_URL} target="_blank" rel="noreferrer">Booking.com ↗</a></footer>

      {menu && <div className="mobile-menu"><div className="mobile-top"><div className="footer-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></div><button onClick={() => setMenu(false)}>×</button></div><nav>{t.nav.map((item, i) => <a key={item} onClick={() => setMenu(false)} href={["#rooms", "#story", "#gallery", "#location"][i]}><span>0{i + 1}</span>{item}</a>)}</nav><div className="mobile-langs">{(["en", "ru", "ka"] as Lang[]).map((l) => <button key={l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}</div><button className="btn-primary" onClick={() => { setMenu(false); setBooking(true); }}>{t.book}</button></div>}

      {booking && <div className="booking-backdrop" onMouseDown={(e) => { if (e.currentTarget === e.target) setBooking(false); }}><div className="booking-drawer"><button className="close" onClick={() => setBooking(false)}>×</button><p className="kicker">ANNA’S GARDEN</p><h2>Plan your stay.</h2><label>Check-in<input type="date" /></label><label>Check-out<input type="date" /></label><label>Guests<select defaultValue="2"><option>1</option><option>2</option><option>3</option><option>4</option></select></label><a className="btn-primary booking-link" href={BOOKING_URL} target="_blank" rel="noreferrer">Check availability ↗</a><p className="booking-note">Live rates and availability are provided by Booking.com.</p></div></div>}

      {lightbox !== null && <div className="lightbox"><button className="lightbox-close" onClick={() => setLightbox(null)}>×</button><button className="lightbox-prev" onClick={() => setLightbox((lightbox - 1 + gallery.length) % gallery.length)}>←</button><img src={gallery[lightbox]} alt={`Anna's Garden Hotel photo ${lightbox + 1}`} /><div className="lightbox-meta"><span>{String(lightbox + 1).padStart(2, "0")} / {gallery.length}</span><strong>ANNA’S GARDEN · TBILISI</strong></div><button className="lightbox-next" onClick={() => setLightbox((lightbox + 1) % gallery.length)}>→</button></div>}
    </>
  );
}
