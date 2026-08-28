"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "en" | "ru" | "ka";

const BOOKING_URL = "https://www.booking.com/hotel/ge/annas-garden.html";

const copy = {
  en: {
    nav: ["Rooms", "Hotel", "Gallery", "Location"],
    book: "Book your stay",
    menu: "Menu",
    eyebrow: "ANNA'S GARDEN · TBILISI",
    title: "A quieter side of Tbilisi.",
    intro:
      "Bright rooms, calm details and thoughtful comfort — a modern base for discovering the city at your own pace.",
    explore: "Explore the hotel",
    highlights: ["Garden & courtyard views", "Free Wi‑Fi", "Free private parking", "24-hour front desk"],
    roomsEyebrow: "STAY",
    roomsTitle: "Light, space and a room of your own.",
    roomsBody:
      "Air-conditioned, soundproof rooms with private bathrooms, clean lines and the small comforts that make a city stay easy.",
    roomNames: ["Deluxe Double", "Deluxe Twin", "Economy Double"],
    roomMeta: ["24 m² · queen bed · balcony", "19 m² · two beds", "15 m² · double bed"],
    roomLinks: ["See availability", "See availability", "See availability"],
    quote: "Made for quiet stays.",
    quoteBody: "Fresh interiors, restful rooms and an address that lets you come back to calm.",
    hotelEyebrow: "ANNA'S GARDEN",
    hotelTitle: "Small scale. Thoughtful comfort.",
    hotelBody:
      "Anna's Garden Hotel is a modern Tbilisi stay with garden and inner-courtyard views, room service, airport transfers on request and a welcoming 24-hour front desk.",
    ratingLabel: "Guest rating",
    ratingWord: "Wonderful",
    ratingSub: "Booking.com snapshot · Aug 2026",
    categories: ["Cleanliness", "Value", "Staff"],
    categoryScores: ["9.5", "9.5", "9.4"],
    amenitiesTitle: "Everything you need, nothing you don't.",
    amenities: ["Air conditioning", "Soundproof rooms", "Private bathrooms", "Flat-screen TV", "Electric kettle", "Room service", "Airport shuttle", "Laundry"],
    galleryEyebrow: "GALLERY",
    galleryTitle: "Light. Reflection. Quiet.",
    locationEyebrow: "TBILISI",
    locationTitle: "A calm base in the city.",
    locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.",
    locationFacts: ["~10 km from Tbilisi International Airport", "Garden & inner-courtyard views", "Free on-site private parking"],
    finalTitle: "Your room in Tbilisi is waiting.",
    finalBody: "Check live availability and current rates on Booking.com.",
    bookingTitle: "Plan your stay",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    continue: "Check availability",
    close: "Close",
    footer: "Anna's Garden Hotel · Tbilisi",
  },
  ru: {
    nav: ["Номера", "Отель", "Галерея", "Локация"],
    book: "Забронировать",
    menu: "Меню",
    eyebrow: "ANNA'S GARDEN · ТБИЛИСИ",
    title: "Тихая сторона Тбилиси.",
    intro:
      "Светлые номера, спокойные детали и продуманный комфорт — современная база для знакомства с городом в своём ритме.",
    explore: "Посмотреть отель",
    highlights: ["Вид на сад и двор", "Бесплатный Wi‑Fi", "Бесплатная парковка", "Стойка 24/7"],
    roomsEyebrow: "ПРОЖИВАНИЕ",
    roomsTitle: "Свет, пространство и свой ритм.",
    roomsBody:
      "Кондиционируемые и звукоизолированные номера с собственными ванными комнатами и всем необходимым для спокойного городского отдыха.",
    roomNames: ["Deluxe Double", "Deluxe Twin", "Economy Double"],
    roomMeta: ["24 м² · queen bed · балкон", "19 м² · две кровати", "15 м² · двуспальная кровать"],
    roomLinks: ["Проверить даты", "Проверить даты", "Проверить даты"],
    quote: "Создано для спокойного отдыха.",
    quoteBody: "Свежий интерьер, тихие номера и место, куда приятно возвращаться после города.",
    hotelEyebrow: "ANNA'S GARDEN",
    hotelTitle: "Небольшой отель. Продуманный комфорт.",
    hotelBody:
      "Anna's Garden Hotel — современный отель в Тбилиси с видами на сад и внутренний двор, room service, трансфером по запросу и круглосуточной стойкой.",
    ratingLabel: "Оценка гостей",
    ratingWord: "Превосходно",
    ratingSub: "Снимок Booking.com · август 2026",
    categories: ["Чистота", "Цена / качество", "Персонал"],
    categoryScores: ["9.5", "9.5", "9.4"],
    amenitiesTitle: "Всё нужное — без лишнего.",
    amenities: ["Кондиционер", "Звукоизоляция", "Собственная ванная", "Телевизор", "Электрочайник", "Room service", "Трансфер", "Прачечная"],
    galleryEyebrow: "ГАЛЕРЕЯ",
    galleryTitle: "Свет. Отражения. Тишина.",
    locationEyebrow: "ТБИЛИСИ",
    locationTitle: "Спокойная база в городе.",
    locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.",
    locationFacts: ["Около 10 км до аэропорта Тбилиси", "Виды на сад и внутренний двор", "Бесплатная частная парковка"],
    finalTitle: "Ваш номер в Тбилиси ждёт.",
    finalBody: "Проверьте актуальные даты и цены на Booking.com.",
    bookingTitle: "Спланировать проживание",
    checkIn: "Заезд",
    checkOut: "Выезд",
    guests: "Гости",
    continue: "Проверить наличие",
    close: "Закрыть",
    footer: "Anna's Garden Hotel · Тбилиси",
  },
  ka: {
    nav: ["ნომრები", "სასტუმრო", "გალერეა", "მდებარეობა"],
    book: "დაჯავშნა",
    menu: "მენიუ",
    eyebrow: "ANNA'S GARDEN · თბილისი",
    title: "თბილისის მშვიდი მხარე.",
    intro:
      "ნათელი ოთახები, მშვიდი დეტალები და გააზრებული კომფორტი — თანამედროვე ადგილი ქალაქის საკუთარ რიტმში აღმოსაჩენად.",
    explore: "სასტუმროს ნახვა",
    highlights: ["ბაღისა და ეზოს ხედები", "უფასო Wi‑Fi", "უფასო პარკინგი", "24-საათიანი რეცეფცია"],
    roomsEyebrow: "დარჩენა",
    roomsTitle: "სინათლე, სივრცე და საკუთარი რიტმი.",
    roomsBody:
      "კონდიცირებული და ხმისგან იზოლირებული ნომრები პირადი სააბაზანოებით და მშვიდი დასვენებისთვის საჭირო კომფორტით.",
    roomNames: ["Deluxe Double", "Deluxe Twin", "Economy Double"],
    roomMeta: ["24 მ² · queen bed · აივანი", "19 მ² · ორი საწოლი", "15 მ² · ორმაგი საწოლი"],
    roomLinks: ["თავისუფალი თარიღები", "თავისუფალი თარიღები", "თავისუფალი თარიღები"],
    quote: "შექმნილია მშვიდი დასვენებისთვის.",
    quoteBody: "ახალი ინტერიერი, მშვიდი ნომრები და ადგილი, სადაც ქალაქის შემდეგ დაბრუნება სასიამოვნოა.",
    hotelEyebrow: "ANNA'S GARDEN",
    hotelTitle: "პატარა მასშტაბი. გააზრებული კომფორტი.",
    hotelBody:
      "Anna's Garden Hotel — თანამედროვე სასტუმრო თბილისში ბაღისა და შიდა ეზოს ხედებით, room service-ით, ტრანსფერით მოთხოვნით და 24-საათიანი რეცეფციით.",
    ratingLabel: "სტუმრების შეფასება",
    ratingWord: "შესანიშნავი",
    ratingSub: "Booking.com · აგვისტო 2026",
    categories: ["სისუფთავე", "ფასი / ხარისხი", "პერსონალი"],
    categoryScores: ["9.5", "9.5", "9.4"],
    amenitiesTitle: "ყველაფერი საჭირო — ზედმეტის გარეშე.",
    amenities: ["კონდიციონერი", "ხმის იზოლაცია", "პირადი სააბაზანო", "ტელევიზორი", "ელექტრო ჩაიდანი", "Room service", "ტრანსფერი", "სამრეცხაო"],
    galleryEyebrow: "გალერეა",
    galleryTitle: "სინათლე. ანარეკლი. სიმშვიდე.",
    locationEyebrow: "თბილისი",
    locationTitle: "მშვიდი ბაზა ქალაქში.",
    locationBody: "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia.",
    locationFacts: ["დაახლოებით 10 კმ თბილისის აეროპორტამდე", "ბაღისა და შიდა ეზოს ხედები", "უფასო კერძო პარკინგი"],
    finalTitle: "თქვენი ნომერი თბილისში გელოდებათ.",
    finalBody: "იხილეთ ხელმისაწვდომობა და მიმდინარე ფასები Booking.com-ზე.",
    bookingTitle: "დაგეგმეთ დარჩენა",
    checkIn: "შესვლა",
    checkOut: "გასვლა",
    guests: "სტუმრები",
    continue: "ხელმისაწვდომობის ნახვა",
    close: "დახურვა",
    footer: "Anna's Garden Hotel · თბილისი",
  },
} as const;

const slots = [
  "atlas-0",
  "atlas-1",
  "atlas-2",
  "atlas-3",
  "atlas-4",
  "atlas-5",
  "atlas-6",
  "atlas-7",
];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const t = copy[lang];

  useEffect(() => {
    const saved = window.localStorage.getItem("annas-language") as Lang | null;
    if (saved && copy[saved]) setLang(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("annas-language", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const bookingHref = useMemo(() => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkin", checkIn);
    if (checkOut) params.set("checkout", checkOut);
    params.set("group_adults", guests);
    return `${BOOKING_URL}?${params.toString()}`;
  }, [checkIn, checkOut, guests]);

  const selectLang = (next: Lang) => {
    setLang(next);
    setMenuOpen(false);
  };

  return (
    <main>
      <a className="skip-link" href="#content">Skip to content</a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Anna's Garden Hotel home">
          <span>ANNA'S</span>
          <small>GARDEN HOTEL</small>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#rooms">{t.nav[0]}</a>
          <a href="#hotel">{t.nav[1]}</a>
          <a href="#gallery">{t.nav[2]}</a>
          <a href="#location">{t.nav[3]}</a>
        </nav>
        <div className="header-actions">
          <div className="langs" aria-label="Language">
            {(["en", "ru", "ka"] as Lang[]).map((code) => (
              <button
                className={lang === code ? "active" : ""}
                key={code}
                onClick={() => selectLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="header-book" onClick={() => setBookingOpen(true)}>
            {t.book}
          </button>
          <button
            className="menu-button"
            aria-expanded={menuOpen}
            aria-label={t.menu}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="hero-copy">{t.intro}</p>
          <div className="hero-ctas">
            <button className="primary-cta" onClick={() => setBookingOpen(true)}>
              {t.book}
            </button>
            <a className="text-cta" href="#rooms">
              <span className="arrow-circle">↓</span>
              {t.explore}
            </a>
          </div>
        </div>
        <div className="hero-highlights" aria-label="Hotel highlights">
          {t.highlights.map((item, i) => (
            <div key={item}>
              <span className="highlight-index">0{i + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <div id="content" />

      <section className="section rooms-section" id="rooms">
        <div className="section-head">
          <p className="eyebrow">{t.roomsEyebrow}</p>
          <h2>{t.roomsTitle}</h2>
          <p>{t.roomsBody}</p>
        </div>

        <div className="rooms-grid">
          {[4, 5, 2].map((slot, i) => (
            <article className={`room-card room-${i + 1}`} key={t.roomNames[i]}>
              <div className={`atlas ${slots[slot]}`} role="img" aria-label={t.roomNames[i]} />
              <div className="room-caption">
                <div>
                  <span>0{i + 1}</span>
                  <h3>{t.roomNames[i]}</h3>
                  <p>{t.roomMeta[i]}</p>
                </div>
                <button onClick={() => setBookingOpen(true)}>{t.roomLinks[i]} ↗</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-break">
        <div className={`atlas ${slots[3]}`} role="img" aria-label="Anna's Garden Hotel corridor" />
        <div className="editorial-copy">
          <p className="eyebrow">ANNA'S GARDEN</p>
          <h2>{t.quote}</h2>
          <p>{t.quoteBody}</p>
        </div>
      </section>

      <section className="section hotel-section" id="hotel">
        <div className="hotel-copy">
          <p className="eyebrow">{t.hotelEyebrow}</p>
          <h2>{t.hotelTitle}</h2>
          <p>{t.hotelBody}</p>
          <a href="#location" className="underlined-link">{t.nav[3]} ↘</a>
        </div>
        <div className="hotel-images">
          <div className={`atlas ${slots[0]}`} />
          <div className={`atlas ${slots[1]}`} />
        </div>
      </section>

      <section className="rating-section" aria-label="Guest review scores">
        <div className="rating-main">
          <p className="eyebrow">{t.ratingLabel}</p>
          <strong>9.3</strong>
          <h2>{t.ratingWord}</h2>
          <p>{t.ratingSub}</p>
        </div>
        <div className="rating-categories">
          {t.categories.map((label, i) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{t.categoryScores[i]}</strong>
              <i><b style={{ width: `${Number(t.categoryScores[i]) * 10}%` }} /></i>
            </div>
          ))}
        </div>
      </section>

      <section className="section amenities-section">
        <div>
          <p className="eyebrow">COMFORT</p>
          <h2>{t.amenitiesTitle}</h2>
        </div>
        <div className="amenities-grid">
          {t.amenities.map((item, i) => (
            <div key={item}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="section gallery-heading">
          <p className="eyebrow">{t.galleryEyebrow}</p>
          <h2>{t.galleryTitle}</h2>
        </div>
        <div className="gallery-grid">
          {slots.map((slot, i) => (
            <div
              key={slot}
              className={`gallery-item gallery-item-${i + 1} atlas ${slot}`}
              role="img"
              aria-label={`Anna's Garden Hotel ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="location-section" id="location">
        <div className="location-copy">
          <p className="eyebrow">{t.locationEyebrow}</p>
          <h2>{t.locationTitle}</h2>
          <p className="address">{t.locationBody}</p>
          <ul>
            {t.locationFacts.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
          <a
            className="underlined-link"
            href="https://www.google.com/maps/search/?api=1&query=10+Shalva+Mshvelidze+Street+Tbilisi"
            target="_blank"
            rel="noreferrer"
          >
            Google Maps ↗
          </a>
        </div>
        <iframe
          title="Anna's Garden Hotel location"
          src="https://www.google.com/maps?q=10%20Shalva%20Mshvelidze%20Street%20Tbilisi&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <section className="final-cta">
        <p className="eyebrow">ANNA'S GARDEN · TBILISI</p>
        <h2>{t.finalTitle}</h2>
        <p>{t.finalBody}</p>
        <button className="light-cta" onClick={() => setBookingOpen(true)}>{t.book} ↗</button>
      </section>

      <footer>
        <div className="footer-brand">
          <span>ANNA'S</span>
          <small>GARDEN HOTEL</small>
        </div>
        <p>{t.footer}</p>
        <a href={BOOKING_URL} target="_blank" rel="noreferrer">Booking.com ↗</a>
      </footer>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true">
          <div className="mobile-menu-top">
            <div className="footer-brand"><span>ANNA'S</span><small>GARDEN HOTEL</small></div>
            <button onClick={() => setMenuOpen(false)}>×</button>
          </div>
          <nav>
            {["rooms", "hotel", "gallery", "location"].map((id, i) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                <span>0{i + 1}</span>{t.nav[i]}
              </a>
            ))}
          </nav>
          <div className="mobile-langs">
            {(["en", "ru", "ka"] as Lang[]).map((code) => (
              <button key={code} onClick={() => selectLang(code)}>{code.toUpperCase()}</button>
            ))}
          </div>
          <button className="mobile-book" onClick={() => { setMenuOpen(false); setBookingOpen(true); }}>
            {t.book}
          </button>
        </div>
      )}

      {bookingOpen && (
        <div className="booking-backdrop" role="presentation" onMouseDown={() => setBookingOpen(false)}>
          <aside
            className="booking-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t.bookingTitle}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="booking-close" onClick={() => setBookingOpen(false)} aria-label={t.close}>×</button>
            <p className="eyebrow">ANNA'S GARDEN · TBILISI</p>
            <h2>{t.bookingTitle}</h2>
            <label>{t.checkIn}<input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></label>
            <label>{t.checkOut}<input type="date" value={checkOut} min={checkIn || undefined} onChange={(e) => setCheckOut(e.target.value)} /></label>
            <label>{t.guests}
              <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                <option value="1">1</option><option value="2">2</option><option value="3">3</option>
              </select>
            </label>
            <a className="booking-submit" href={bookingHref} target="_blank" rel="noreferrer">{t.continue} ↗</a>
            <p className="booking-note">Booking is completed securely on Booking.com.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
