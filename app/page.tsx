"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "en" | "ru" | "ka";

const BOOKING_URL = "https://www.booking.com/hotel/ge/annas-garden.html";

const PHOTOS = [
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840152/anna-s-garden-hotel-tbilisi-pic-57.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760864/1760864967/anna-s-garden-hotel-tbilisi-pic-53.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840489/anna-s-garden-hotel-tbilisi-pic-16.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760859/1760859625/anna-s-garden-hotel-tbilisi-pic-49.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840185/anna-s-garden-hotel-tbilisi-pic-9.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760856/1760856470/anna-s-garden-hotel-tbilisi-pic-38.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760858/1760858077/anna-s-garden-hotel-tbilisi-pic-65.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760860/1760860204/anna-s-garden-hotel-tbilisi-pic-50.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840183/anna-s-garden-hotel-tbilisi-pic-8.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760841/1760841051/anna-s-garden-hotel-tbilisi-pic-18.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840182/anna-s-garden-hotel-tbilisi-pic-63.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760842/1760842628/anna-s-garden-hotel-tbilisi-pic-26.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760842/1760842994/anna-s-garden-hotel-tbilisi-pic-29.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760857/1760857251/anna-s-garden-hotel-tbilisi-pic-41.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760842/1760842903/anna-s-garden-hotel-tbilisi-pic-28.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840187/anna-s-garden-hotel-tbilisi-pic-11.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760867/1760867157/anna-s-garden-hotel-tbilisi-pic-68.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840190/anna-s-garden-hotel-tbilisi-pic-13.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760840/1760840175/anna-s-garden-hotel-tbilisi-pic-5.JPEG",
  "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760841/1760841267/anna-s-garden-hotel-tbilisi-pic-19.JPEG",
];

const copy = {
  en: {
    nav: ["Rooms", "Story", "Gallery", "Location"],
    book: "Book your stay",
    eyebrow: "ANNA'S GARDEN · TBILISI",
    title: "A quieter side of Tbilisi.",
    intro: "Bright rooms, reflected light and thoughtful comfort — a calm modern base in the city.",
    explore: "Explore the stay",
    chapter: ["ARRIVE", "SETTLE", "BREATHE", "WANDER", "STAY"],
    roomsEyebrow: "ROOMS",
    roomsTitle: "Space to settle in.",
    roomsBody: "Clean lines, soft light and the small comforts that make a city stay feel easy.",
    roomNames: ["Deluxe Double", "Deluxe Twin", "Economy Double"],
    roomMeta: ["24 m² · queen bed · balcony", "19 m² · two beds", "15 m² · full bed"],
    doorTitle: "Behind every door, a quieter stay.",
    dndTitle: "Do not disturb. That’s the idea.",
    dndBody: "A small hotel with a simple promise: clean rooms, calm nights and space to switch off.",
    balconyTitle: "Step outside.",
    balconyBody: "Selected rooms open onto a private balcony — a little pause between the room and the city.",
    rating: "Guest rating",
    wonderful: "Wonderful",
    ratingNote: "Booking.com · 9.3 / 10",
    galleryTitle: "Light. Reflection. Quiet.",
    amenitiesTitle: "Everything you need. Nothing you don’t.",
    amenities: ["Free Wi‑Fi", "Free private parking", "24-hour front desk", "Garden views", "Soundproof rooms", "Air conditioning", "Airport shuttle", "Room service"],
    locationTitle: "A calm base in Tbilisi.",
    locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.",
    finalTitle: "Come back to quiet.",
    finalBody: "Check live availability and current rates on Booking.com.",
  },
  ru: {
    nav: ["Номера", "История", "Галерея", "Локация"],
    book: "Забронировать",
    eyebrow: "ANNA'S GARDEN · ТБИЛИСИ",
    title: "Тихая сторона Тбилиси.",
    intro: "Светлые номера, отражения и продуманный комфорт — спокойная современная база в городе.",
    explore: "Посмотреть отель",
    chapter: ["ПРИЕХАТЬ", "УСТРОИТЬСЯ", "ВЫДОХНУТЬ", "ПОГУЛЯТЬ", "ОСТАТЬСЯ"],
    roomsEyebrow: "НОМЕРА",
    roomsTitle: "Пространство, чтобы выдохнуть.",
    roomsBody: "Чистые линии, мягкий свет и всё необходимое для спокойного отдыха в городе.",
    roomNames: ["Deluxe Double", "Deluxe Twin", "Economy Double"],
    roomMeta: ["24 м² · queen bed · балкон", "19 м² · две кровати", "15 м² · двуспальная кровать"],
    doorTitle: "За каждой дверью — немного больше тишины.",
    dndTitle: "Не беспокоить. В этом и идея.",
    dndBody: "Небольшой отель с простым обещанием: чистые номера, спокойные ночи и место, где можно отключиться.",
    balconyTitle: "Выйти на воздух.",
    balconyBody: "В некоторых номерах есть балкон — маленькая пауза между номером и городом.",
    rating: "Оценка гостей",
    wonderful: "Превосходно",
    ratingNote: "Booking.com · 9.3 / 10",
    galleryTitle: "Свет. Отражения. Тишина.",
    amenitiesTitle: "Всё нужное. Без лишнего.",
    amenities: ["Бесплатный Wi‑Fi", "Бесплатная парковка", "Стойка 24/7", "Вид на сад", "Звукоизоляция", "Кондиционер", "Трансфер", "Room service"],
    locationTitle: "Спокойная база в Тбилиси.",
    locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.",
    finalTitle: "Возвращайтесь в тишину.",
    finalBody: "Проверьте актуальные даты и цены на Booking.com.",
  },
  ka: {
    nav: ["ნომრები", "ისტორია", "გალერეა", "მდებარეობა"],
    book: "დაჯავშნა",
    eyebrow: "ANNA'S GARDEN · თბილისი",
    title: "თბილისის მშვიდი მხარე.",
    intro: "ნათელი ოთახები, სინათლის ანარეკლები და გააზრებული კომფორტი — მშვიდი თანამედროვე ადგილი ქალაქში.",
    explore: "სასტუმროს ნახვა",
    chapter: ["ჩამოსვლა", "მოწყობა", "ამოსუნთქვა", "გასეირნება", "დარჩენა"],
    roomsEyebrow: "ნომრები",
    roomsTitle: "სივრცე დასვენებისთვის.",
    roomsBody: "სუფთა ხაზები, რბილი სინათლე და ყველაფერი, რაც მშვიდ ქალაქურ დასვენებას სჭირდება.",
    roomNames: ["Deluxe Double", "Deluxe Twin", "Economy Double"],
    roomMeta: ["24 მ² · queen bed · აივანი", "19 მ² · ორი საწოლი", "15 მ² · ორმაგი საწოლი"],
    doorTitle: "ყოველი კარის მიღმა — მეტი სიმშვიდე.",
    dndTitle: "არ შემაწუხოთ. სწორედ ესაა იდეა.",
    dndBody: "პატარა სასტუმრო მარტივი დაპირებით: სუფთა ოთახები, მშვიდი ღამეები და სივრცე დასვენებისთვის.",
    balconyTitle: "გადით აივანზე.",
    balconyBody: "ზოგიერთ ნომერს აქვს აივანი — პატარა პაუზა ოთახსა და ქალაქს შორის.",
    rating: "სტუმრების შეფასება",
    wonderful: "შესანიშნავი",
    ratingNote: "Booking.com · 9.3 / 10",
    galleryTitle: "სინათლე. ანარეკლი. სიმშვიდე.",
    amenitiesTitle: "ყველაფერი საჭირო. ზედმეტის გარეშე.",
    amenities: ["უფასო Wi‑Fi", "უფასო პარკინგი", "24-საათიანი რეცეფცია", "ბაღის ხედი", "ხმის იზოლაცია", "კონდიციონერი", "ტრანსფერი", "Room service"],
    locationTitle: "მშვიდი ადგილი თბილისში.",
    locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.",
    finalTitle: "დაუბრუნდით სიმშვიდეს.",
    finalBody: "შეამოწმეთ თავისუფალი თარიღები და მიმდინარე ფასები Booking.com-ზე.",
  },
} as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [menu, setMenu] = useState(false);
  const [booking, setBooking] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [cursor, setCursor] = useState({ x: -100, y: -100, label: "" });
  const t = useMemo(() => copy[lang], [lang]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
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

  const openPhoto = (i: number) => setLightbox(i);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="garden-cursor" style={{ transform: `translate3d(${cursor.x}px,${cursor.y}px,0)` }}>{cursor.label && <span>{cursor.label}</span>}</div>
      <svg className="garden-line" viewBox="0 0 100 1000" aria-hidden="true">
        <path pathLength="1" style={{ strokeDashoffset: 1 - progress }} d="M54 0 C18 95 88 160 48 250 C10 335 88 400 52 505 C22 594 80 658 49 748 C20 835 72 910 44 1000" />
        <path className="garden-leaf leaf-a" d="M50 265 C24 250 19 226 23 211 C46 221 57 239 50 265Z" />
        <path className="garden-leaf leaf-b" d="M53 515 C77 493 88 470 84 451 C61 461 48 484 53 515Z" />
        <path className="garden-leaf leaf-c" d="M48 760 C21 747 16 721 20 705 C42 714 56 735 48 760Z" />
      </svg>

      <header className="topbar">
        <a href="#" className="brand" aria-label="Anna's Garden Hotel home"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></a>
        <nav className="desktop-nav">{t.nav.map((item, i) => <a key={item} href={["#rooms","#story","#gallery","#location"][i]}>{item}</a>)}</nav>
        <div className="top-actions">
          <div className="langs">{(["en","ru","ka"] as Lang[]).map((l)=><button key={l} onClick={()=>setLang(l)} className={lang===l?"active":""}>{l.toUpperCase()}</button>)}</div>
          <button className="book-ghost" onClick={()=>setBooking(true)}>{t.book}</button>
          <button className="menu-btn" onClick={()=>setMenu(true)} aria-label="Open menu"><i/><i/></button>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-media" /><div className="hero-shade" /><div className="botanical-shadow shadow-hero" />
          <div className="hero-copy"><p className="kicker">{t.eyebrow}</p><h1>{t.title}</h1><p className="lede">{t.intro}</p><div className="hero-actions"><button className="btn-primary" onClick={()=>setBooking(true)}>{t.book}</button><a className="btn-text" href="#rooms">{t.explore}<span>↓</span></a></div></div>
          <div className="chapter-rail">{t.chapter.map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}</div>
        </section>

        <section className="intro-section section-light"><div className="botanical-shadow shadow-a" /><p className="kicker">ANNA’S GARDEN</p><h2>Garden without the cliché.</h2><p>Light, space, doors, reflections and the calm of a small hotel — that is the visual language of this stay.</p></section>

        <section id="rooms" className="rooms-story">
          <div className="rooms-heading"><p className="kicker">{t.roomsEyebrow}</p><h2>{t.roomsTitle}</h2><p>{t.roomsBody}</p></div>
          {[0,1,2].map((room,i)=>(<article className={`room-story room-story-${i+1}`} key={t.roomNames[i]}><div className="room-photo-wrap" onMouseEnter={()=>setCursor(c=>({...c,label:"VIEW"}))} onMouseLeave={()=>setCursor(c=>({...c,label:""}))} onClick={()=>openPhoto([3,6,9][i])}><img src={PHOTOS[[3,6,9][i]]} alt={t.roomNames[i]} loading={i===0?"eager":"lazy"} /></div><div className="room-info"><span>0{i+1}</span><div><h3>{t.roomNames[i]}</h3><p>{t.roomMeta[i]}</p></div><button onClick={()=>setBooking(true)}>Availability ↗</button></div></article>))}
        </section>

        <section id="story" className="door-chapter"><div className="corridor-media" /><div className="door-overlay"><span className="chapter-number">03 / BREATHE</span><h2>{t.doorTitle}</h2></div></section>

        <section className="dnd-section"><div className="dnd-photo" /><div className="dnd-copy"><p className="kicker">QUIET, PLEASE</p><h2>{t.dndTitle}</h2><p>{t.dndBody}</p><div className="tiny-leaf" aria-hidden="true">⌁</div></div></section>

        <section className="balcony-section"><div className="balcony-media" /><div className="balcony-card"><span>04 / WANDER</span><h2>{t.balconyTitle}</h2><p>{t.balconyBody}</p></div></section>

        <section className="rating-section"><div className="rating-score"><p className="kicker">{t.rating}</p><strong>9.3</strong><h2>{t.wonderful}</h2><p>{t.ratingNote}</p></div><div className="rating-bars">{[["Cleanliness","9.5"],["Value","9.5"],["Staff","9.4"],["Comfort","9.3"],["Location","8.9"]].map(([label,score])=><div key={label}><span>{label}</span><b>{score}</b><i><em style={{width:`${Number(score)*10}%`}}/></i></div>)}</div></section>

        <section className="amenities-section section-light"><div><p className="kicker">GOOD TO KNOW</p><h2>{t.amenitiesTitle}</h2></div><div className="amenities-list">{t.amenities.map((a,i)=><div key={a}><span>0{i+1}</span><p>{a}</p></div>)}</div></section>

        <section id="gallery" className="gallery-section"><div className="gallery-head"><p className="kicker">GALLERY</p><h2>{t.galleryTitle}</h2><p>20 photographs. One small hotel. Open any frame.</p></div><div className="gallery-grid">{PHOTOS.slice(0,16).map((src,i)=><button className={`gallery-tile tile-${i+1}`} key={src} onClick={()=>openPhoto(i)} onMouseEnter={()=>setCursor(c=>({...c,label:"OPEN"}))} onMouseLeave={()=>setCursor(c=>({...c,label:""}))}><img src={src} alt={`Anna's Garden Hotel photo ${i+1}`} loading="lazy" /><span>{String(i+1).padStart(2,"0")}</span></button>)}</div></section>

        <section id="location" className="location-section"><div className="location-copy"><p className="kicker">TBILISI</p><h2>{t.locationTitle}</h2><p>{t.locationBody}</p><a href="https://www.google.com/maps/search/?api=1&query=10+Shalva+Mshvelidze+Street+Tbilisi" target="_blank" rel="noreferrer">Open in Maps ↗</a></div><iframe title="Anna's Garden Hotel map" loading="lazy" src="https://www.google.com/maps?q=10%20Shalva%20Mshvelidze%20Street%20Tbilisi&output=embed" /></section>

        <section className="final-section"><div className="botanical-shadow shadow-final" /><p className="kicker">05 / STAY</p><h2>{t.finalTitle}</h2><p>{t.finalBody}</p><button className="btn-primary invert" onClick={()=>setBooking(true)}>{t.book}</button><div className="brand-mark">G</div></section>
      </main>

      <footer><div className="footer-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></div><p>10 Shalva Mshvelidze Street · Tbilisi</p><a href={BOOKING_URL} target="_blank" rel="noreferrer">Booking.com ↗</a></footer>

      {menu && <div className="mobile-menu"><div className="mobile-top"><div className="footer-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></div><button onClick={()=>setMenu(false)}>×</button></div><nav>{t.nav.map((item,i)=><a key={item} onClick={()=>setMenu(false)} href={["#rooms","#story","#gallery","#location"][i]}><span>0{i+1}</span>{item}</a>)}</nav><div className="mobile-langs">{(["en","ru","ka"] as Lang[]).map(l=><button key={l} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div><button className="btn-primary" onClick={()=>{setMenu(false);setBooking(true)}}>{t.book}</button></div>}

      {booking && <div className="booking-backdrop" onMouseDown={(e)=>{if(e.currentTarget===e.target)setBooking(false)}}><div className="booking-drawer"><button className="close" onClick={()=>setBooking(false)}>×</button><p className="kicker">ANNA’S GARDEN</p><h2>Plan your stay.</h2><label>Check-in<input type="date"/></label><label>Check-out<input type="date"/></label><label>Guests<select defaultValue="2"><option>1</option><option>2</option><option>3</option><option>4</option></select></label><a className="btn-primary booking-link" href={BOOKING_URL} target="_blank" rel="noreferrer">Check availability ↗</a><p className="booking-note">Live rates and availability are provided by Booking.com.</p></div></div>}

      {lightbox !== null && <div className="lightbox"><button className="lightbox-close" onClick={()=>setLightbox(null)}>×</button><button className="lightbox-prev" onClick={()=>setLightbox((lightbox-1+PHOTOS.length)%PHOTOS.length)}>←</button><img src={PHOTOS[lightbox]} alt={`Anna's Garden Hotel photo ${lightbox+1}`} /><div className="lightbox-meta"><span>{String(lightbox+1).padStart(2,"0")} / {PHOTOS.length}</span><strong>ANNA’S GARDEN · TBILISI</strong></div><button className="lightbox-next" onClick={()=>setLightbox((lightbox+1)%PHOTOS.length)}>→</button></div>}
    </>
  );
}
