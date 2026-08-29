"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BOOKING_URL, MAPS_URL } from "../../lib/site";
import GuestRoomCompanion from "./GuestRoomCompanion";

type Lang = "en" | "ru" | "ka";
type Profile = { name: string; room: string; lang: Lang; checkOut: string };
type Ticket = { id: string; type: string; label: string; createdAt: string; status: "sent" | "prepared" };

type Copy = {
  hello: string; subtitle: string; setup: string; name: string; room: string; checkout: string; continue: string;
  quick: string; quickBody: string; wishes: string; wishesBody: string; history: string; empty: string; sent: string; prepared: string;
  payment: string; map: string; review: string; privateFeedback: string; edit: string; concierge: string; note: string; custom: string;
};

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "995599521751";
const GOOGLE_REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "";

const copy: Record<Lang, Copy> = {
  en: {
    hello: "Welcome back", subtitle: "Your room, your rhythm.", setup: "Make this stay yours.", name: "Your name", room: "Room number", checkout: "Checkout date", continue: "Enter guest hub",
    quick: "What would make things easier?", quickBody: "One tap prepares a clear request for reception. Add a note before sending if you want.",
    wishes: "Make my stay better", wishesBody: "Small preferences can change the whole stay. Choose a mood or write your own request.",
    history: "Your requests", empty: "Nothing sent yet. Your recent requests will appear here on this device.", sent: "Sent to reception", prepared: "Prepared for WhatsApp",
    payment: "Pay / deposit", map: "Open Maps", review: "Leave a verified review", privateFeedback: "Private feedback", edit: "Edit stay", concierge: "Ask concierge", note: "Optional note", custom: "Something else",
  },
  ru: {
    hello: "С возвращением", subtitle: "Ваш номер. Ваш ритм.", setup: "Настройте проживание под себя.", name: "Ваше имя", room: "Номер комнаты", checkout: "Дата выезда", continue: "Открыть Guest Hub",
    quick: "Что сделать для вас?", quickBody: "Одно нажатие готовит понятную заявку для ресепшена. При желании добавьте комментарий.",
    wishes: "Сделать проживание лучше", wishesBody: "Небольшие пожелания сильно меняют ощущение от проживания. Выберите сценарий или напишите своё.",
    history: "Ваши запросы", empty: "Пока ничего не отправлено. Последние запросы будут храниться на этом устройстве.", sent: "Отправлено на ресепшен", prepared: "Подготовлено для WhatsApp",
    payment: "Оплата / депозит", map: "Открыть карту", review: "Оставить проверенный отзыв", privateFeedback: "Написать владельцу", edit: "Изменить данные", concierge: "Спросить консьержа", note: "Комментарий (необязательно)", custom: "Другое пожелание",
  },
  ka: {
    hello: "კეთილი იყოს თქვენი დაბრუნება", subtitle: "თქვენი ოთახი. თქვენი რიტმი.", setup: "მოირგეთ სტუმრობა საკუთარ თავზე.", name: "თქვენი სახელი", room: "ოთახის ნომერი", checkout: "გასვლის თარიღი", continue: "Guest Hub-ის გახსნა",
    quick: "რით შეგვიძლია დაგეხმაროთ?", quickBody: "ერთი შეხებით მზადდება მკაფიო მოთხოვნა რესეფშენისთვის. სურვილის შემთხვევაში დაამატეთ კომენტარი.",
    wishes: "გავაუმჯობესოთ თქვენი სტუმრობა", wishesBody: "პატარა სურვილებს დიდი მნიშვნელობა აქვს. აირჩიეთ სცენარი ან დაწერეთ საკუთარი მოთხოვნა.",
    history: "თქვენი მოთხოვნები", empty: "ჯერ არაფერი გაგიგზავნიათ. ბოლო მოთხოვნები ამ მოწყობილობაზე გამოჩნდება.", sent: "გაგზავნილია რესეფშენში", prepared: "მომზადებულია WhatsApp-ისთვის",
    payment: "გადახდა / დეპოზიტი", map: "რუკის გახსნა", review: "დადასტურებული შეფასება", privateFeedback: "პირადი უკუკავშირი", edit: "მონაცემების შეცვლა", concierge: "კონსიერჟთან კითხვა", note: "დამატებითი შენიშვნა", custom: "სხვა სურვილი",
  },
};

const actions = [
  { type: "housekeeping", icon: "✦", en: "Housekeeping", ru: "Уборка", ka: "დასუფთავება", message: "housekeeping" },
  { type: "towels", icon: "≈", en: "Fresh towels", ru: "Свежие полотенца", ka: "სუფთა პირსახოცები", message: "fresh towels" },
  { type: "late-checkout", icon: "◷", en: "Late checkout", ru: "Поздний выезд", ka: "გვიანი გასვლა", message: "late checkout" },
  { type: "maintenance", icon: "◇", en: "Something in the room", ru: "Проблема в номере", ka: "პრობლემა ოთახში", message: "help with something in my room" },
  { type: "transfer", icon: "↗", en: "Airport transfer", ru: "Трансфер", ka: "ტრანსფერი", message: "an airport transfer" },
  { type: "reception", icon: "·", en: "Reception", ru: "Ресепшен", ka: "რესეფშენი", message: "reception assistance" },
] as const;

const moods = [
  { type: "quiet-evening", en: "Quiet evening", ru: "Тихий вечер", ka: "მშვიდი საღამო", body: "I would appreciate the quietest possible evening and minimal disturbance." },
  { type: "fresh-room", en: "Fresh room", ru: "Свежий номер", ka: "სუფთა ოთახი", body: "Could you please refresh my room when convenient?" },
  { type: "late-morning", en: "Late morning", ru: "Позднее утро", ka: "გვიანი დილა", body: "If possible, I would prefer housekeeping later in the day." },
  { type: "airport-ready", en: "Airport ready", ru: "К аэропорту", ka: "აეროპორტისთვის მზად", body: "Please help me plan my airport departure and transfer." },
  { type: "something-special", en: "Something special", ru: "Особый повод", ka: "განსაკუთრებული შემთხვევა", body: "There is a special occasion during my stay. Please let me know what may be possible." },
] as const;

function makeId() {
  return `AG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function wa(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export default function GuestHub({ initialRoom = "" }: { initialRoom?: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Profile>({ name: "", room: initialRoom, lang: "en", checkOut: "" });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [note, setNote] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("annas-garden-guest-profile");
      if (saved) setProfile(JSON.parse(saved) as Profile);
      const savedTickets = localStorage.getItem("annas-garden-guest-tickets");
      if (savedTickets) setTickets(JSON.parse(savedTickets) as Ticket[]);
    } catch {}
  }, []);

  useEffect(() => {
    if (!profile) return;
    localStorage.setItem("annas-garden-guest-profile", JSON.stringify(profile));
  }, [profile]);

  const lang = profile?.lang || draft.lang;
  const t = copy[lang];
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (lang === "ru") return hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
    if (lang === "ka") return hour < 12 ? "დილა მშვიდობისა" : "კეთილი დღე";
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  }, [lang]);

  function saveProfile(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.room.trim()) return;
    setProfile({ ...draft, name: draft.name.trim(), room: draft.room.trim() });
  }

  async function sendRequest(type: string, label: string, body: string, overrideNote?: string) {
    if (!profile) return;
    const id = makeId();
    const requestNote = overrideNote ?? note;
    const fullMessage = `Anna's Garden Hotel guest request\nTicket: ${id}\nGuest: ${profile.name}\nRoom: ${profile.room}\nRequest: ${label}\n${body}${requestNote.trim() ? `\nNote: ${requestNote.trim()}` : ""}`;
    let status: Ticket["status"] = "prepared";
    let fallbackUrl = wa(fullMessage);
    try {
      const response = await fetch("/api/guest/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, label, message: body, note: requestNote, profile }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.delivered) status = "sent";
      if (typeof data.whatsappUrl === "string") fallbackUrl = data.whatsappUrl;
    } catch {}

    const ticket: Ticket = { id, type, label, createdAt: new Date().toISOString(), status };
    const next = [ticket, ...tickets].slice(0, 12);
    setTickets(next);
    localStorage.setItem("annas-garden-guest-tickets", JSON.stringify(next));
    window.dispatchEvent(new Event("annas:guest-tickets"));
    setNote("");
    setActive(null);
    if (status === "prepared") window.open(fallbackUrl, "_blank", "noopener,noreferrer");
  }

  async function sendFeedback(event: FormEvent) {
    event.preventDefault();
    if (!profile || !feedback.trim()) return;
    const id = makeId();
    try {
      const response = await fetch("/api/guest/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "private-feedback", label: "Private guest feedback", message: feedback.trim(), note: "", profile }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.delivered) {
        window.open(wa(`Private feedback · ${id}\nGuest: ${profile.name}\nRoom: ${profile.room}\n${feedback.trim()}`), "_blank", "noopener,noreferrer");
      }
      setFeedbackSent(true);
      setFeedback("");
    } catch {
      window.open(wa(`Private feedback · ${id}\nGuest: ${profile.name}\nRoom: ${profile.room}\n${feedback.trim()}`), "_blank", "noopener,noreferrer");
    }
  }

  if (!profile) {
    return (
      <main className="guest-os guest-onboarding">
        <div className="guest-orbit orbit-a" /><div className="guest-orbit orbit-b" />
        <section className="guest-onboard-card">
          <div className="guest-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></div>
          <p className="guest-kicker">PRIVATE GUEST ACCESS</p>
          <h1>{t.setup}</h1>
          <p className="guest-onboard-copy">No account. No password. Just the details that help the hotel take care of your stay.</p>
          <form onSubmit={saveProfile} className="guest-profile-form">
            <label>{t.name}<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} autoComplete="name" required /></label>
            <label>{t.room}<input value={draft.room} onChange={(e) => setDraft({ ...draft, room: e.target.value })} inputMode="numeric" required /></label>
            <label>{t.checkout}<input type="date" value={draft.checkOut} onChange={(e) => setDraft({ ...draft, checkOut: e.target.value })} /></label>
            <label>Language<select value={draft.lang} onChange={(e) => setDraft({ ...draft, lang: e.target.value as Lang })}><option value="en">English</option><option value="ru">Русский</option><option value="ka">ქართული</option></select></label>
            <button type="submit">{t.continue} →</button>
          </form>
          <p className="guest-privacy-note">Saved only on this device. The hotel receives information only when you send a request.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="guest-os guest-dashboard">
      <header className="guest-os-topbar">
        <a href="/" className="guest-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></a>
        <div className="guest-room-pill"><span>ROOM</span><strong>{profile.room}</strong></div>
        <button onClick={() => { setDraft(profile); setProfile(null); }}>{t.edit}</button>
      </header>

      <section className="guest-welcome-panel">
        <div>
          <p className="guest-kicker">{greeting.toUpperCase()} · ROOM {profile.room}</p>
          <h1>{t.hello}, {profile.name}.</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="guest-stay-meta"><span>CHECKOUT</span><strong>{profile.checkOut || "—"}</strong><small>Reception is available 24 hours.</small></div>
      </section>

      <GuestRoomCompanion profile={profile} onRequest={sendRequest} />

      <section className="guest-command-section">
        <div className="guest-section-head"><p className="guest-kicker">ONE TAP SERVICE</p><h2>{t.quick}</h2><p>{t.quickBody}</p></div>
        <div className="guest-command-grid">
          {actions.map((action) => (
            <button key={action.type} className={active === action.type ? "active" : ""} onClick={() => setActive(active === action.type ? null : action.type)}>
              <span>{action.icon}</span><strong>{action[lang]}</strong><em>REQUEST →</em>
            </button>
          ))}
        </div>
        {active ? <div className="guest-request-composer">
          <div><span>REQUEST</span><strong>{actions.find((item) => item.type === active)?.[lang]}</strong></div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.note} rows={3} />
          <button onClick={() => {
            const action = actions.find((item) => item.type === active);
            if (action) sendRequest(action.type, action[lang], `I would like to request ${action.message}.`);
          }}>Send request →</button>
        </div> : null}
      </section>

      <section className="guest-mood-section">
        <div className="guest-section-head"><p className="guest-kicker">MAKE IT YOURS</p><h2>{t.wishes}</h2><p>{t.wishesBody}</p></div>
        <div className="guest-mood-row">
          {moods.map((mood, i) => <button key={mood.type} onClick={() => sendRequest(mood.type, mood[lang], mood.body)}><span>0{i + 1}</span><strong>{mood[lang]}</strong><em>+</em></button>)}
        </div>
        <div className="guest-custom-wish"><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.custom} rows={3} /><button onClick={() => note.trim() && sendRequest("custom", t.custom, note.trim())}>{t.concierge} →</button></div>
      </section>

      <section className="guest-utility-strip">
        <a href="/pay"><span>01</span><strong>{t.payment}</strong><em>→</em></a>
        <a href={MAPS_URL} target="_blank" rel="noreferrer"><span>02</span><strong>{t.map}</strong><em>↗</em></a>
        <a href={BOOKING_URL} target="_blank" rel="noreferrer"><span>03</span><strong>{t.review}</strong><em>↗</em></a>
        {GOOGLE_REVIEW_URL ? <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer"><span>04</span><strong>Google Review</strong><em>↗</em></a> : null}
      </section>

      <section className="guest-history-section">
        <div className="guest-section-head"><p className="guest-kicker">REQUEST MEMORY</p><h2>{t.history}</h2></div>
        {tickets.length ? <div className="guest-ticket-list">{tickets.map((ticket) => <article key={ticket.id}><div><span>{ticket.id}</span><strong>{ticket.label}</strong></div><p>{new Date(ticket.createdAt).toLocaleString()}</p><em className={ticket.status}>{ticket.status === "sent" ? t.sent : t.prepared}</em></article>)}</div> : <p className="guest-empty">{t.empty}</p>}
      </section>

      <section className="guest-feedback-section">
        <div><p className="guest-kicker">PRIVATE CHANNEL</p><h2>{t.privateFeedback}</h2><p>Tell the hotel directly if something can be improved. Public review links remain available above for every guest.</p></div>
        <form onSubmit={sendFeedback}><textarea value={feedback} onChange={(e) => { setFeedback(e.target.value); setFeedbackSent(false); }} rows={5} placeholder="Write privately to the hotel…" /><button type="submit">Send privately →</button>{feedbackSent ? <span>Thank you. Your message has been prepared or delivered.</span> : null}</form>
      </section>

      <footer className="guest-os-footer"><div className="guest-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>TBILISI</small></div><p>Quiet service, when you need it.</p><a href="/guest/qr">Guest QR →</a></footer>
    </main>
  );
}
