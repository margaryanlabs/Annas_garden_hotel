"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BOOKING_URL } from "../../lib/site";

type Lang = "en" | "ru" | "ka";
type Profile = { name: string; room: string; lang: Lang; checkOut: string };
type SendRequest = (type: string, label: string, body: string, requestNote?: string) => Promise<void>;
type GuestInfo = {
  wifi: { configured: boolean; name: string; password: string; note: string };
  tipUrl: string;
  checkIn: string;
  checkOut: string;
  reception: string;
  phoneDisplay: string;
  phoneHref: string;
  smsHref: string;
  whatsappHref: string;
  address: string;
  mapsUrl: string;
  emergencyHref: string;
};
type LiveStatus = { id: string; status: "new" | "acknowledged" | "in_progress" | "done" | "cancelled"; updated_at: string; completed_at: string | null };
type LocalTicket = { id: string; label: string; createdAt: string };

const translations = {
  en: {
    stay: "YOUR ROOM COMPANION", title: "Everything for Room", wifi: "Wi-Fi", wifiReady: "Ready to connect", wifiAsk: "Ask reception for access", show: "Show password", hide: "Hide password", copy: "Copy",
    services: "ROOM SERVICE", servicesTitle: "Small things, handled.", preferred: "Preferred time", now: "As soon as possible", thirty: "In about 30 minutes", hour: "In about 1 hour", later: "Later today", note: "Add a note", send: "Send request",
    wake: "WAKE-UP", wakeTitle: "Wake me gently.", wakeBody: "Choose a time and reception will receive a wake-up request.", wakeButton: "Request wake-up",
    contact: "CONTACT", call: "Call", whatsapp: "WhatsApp", sms: "SMS", emergency: "Emergency 112", guide: "Tbilisi guide",
    checkout: "CHECKOUT ASSISTANT", checkoutTitle: "Leave without the rush.", pay: "Pay balance", late: "Late checkout", transfer: "Airport transfer", luggage: "Store luggage", review: "Review stay", tip: "Leave a tip",
    live: "LIVE SERVICE", liveTitle: "What is happening now.", liveOff: "Live status becomes available when the hotel request store is connected.", noRequests: "Your active service tickets will appear here.",
    new: "Received", acknowledged: "Seen by reception", in_progress: "In progress", done: "Done", cancelled: "Cancelled",
  },
  ru: {
    stay: "ВАШ ЦИФРОВОЙ НОМЕР", title: "Всё для номера", wifi: "Wi‑Fi", wifiReady: "Можно подключаться", wifiAsk: "Запросить доступ у ресепшена", show: "Показать пароль", hide: "Скрыть пароль", copy: "Копировать",
    services: "СЕРВИС В НОМЕРЕ", servicesTitle: "Мелочи, о которых не нужно думать.", preferred: "Когда удобно", now: "Как можно скорее", thirty: "Примерно через 30 минут", hour: "Примерно через час", later: "Позже сегодня", note: "Добавить комментарий", send: "Отправить запрос",
    wake: "БУДИЛЬНИК", wakeTitle: "Разбудите меня.", wakeBody: "Выберите время — ресепшен получит запрос на wake-up call.", wakeButton: "Заказать звонок",
    contact: "СВЯЗЬ", call: "Позвонить", whatsapp: "WhatsApp", sms: "SMS", emergency: "Экстренно 112", guide: "Гид по Тбилиси",
    checkout: "ВЫЕЗД", checkoutTitle: "Уехать без суеты.", pay: "Оплатить остаток", late: "Поздний выезд", transfer: "Трансфер в аэропорт", luggage: "Оставить багаж", review: "Оставить отзыв", tip: "Оставить чаевые",
    live: "СТАТУС ЗАПРОСОВ", liveTitle: "Что происходит сейчас.", liveOff: "Live-статусы появятся после подключения общей базы запросов отеля.", noRequests: "Здесь появятся ваши активные заявки.",
    new: "Получено", acknowledged: "Ресепшен увидел", in_progress: "В работе", done: "Готово", cancelled: "Отменено",
  },
  ka: {
    stay: "თქვენი ციფრული ოთახი", title: "ყველაფერი ოთახისთვის", wifi: "Wi‑Fi", wifiReady: "მზადაა დასაკავშირებლად", wifiAsk: "მოითხოვეთ წვდომა რესეფშენთან", show: "პაროლის ჩვენება", hide: "პაროლის დამალვა", copy: "კოპირება",
    services: "ოთახის სერვისი", servicesTitle: "პატარა დეტალები — ჩვენზეა.", preferred: "სასურველი დრო", now: "რაც შეიძლება მალე", thirty: "დაახლოებით 30 წუთში", hour: "დაახლოებით 1 საათში", later: "დღის განმავლობაში", note: "დაამატეთ შენიშვნა", send: "მოთხოვნის გაგზავნა",
    wake: "გაღვიძება", wakeTitle: "გამაღვიძეთ მშვიდად.", wakeBody: "აირჩიეთ დრო და რესეფშენი მიიღებს გაღვიძების მოთხოვნას.", wakeButton: "გაღვიძების მოთხოვნა",
    contact: "კონტაქტი", call: "დარეკვა", whatsapp: "WhatsApp", sms: "SMS", emergency: "სასწრაფო 112", guide: "თბილისის გიდი",
    checkout: "გასვლა", checkoutTitle: "გაემგზავრეთ აუჩქარებლად.", pay: "ბალანსის გადახდა", late: "გვიანი გასვლა", transfer: "აეროპორტის ტრანსფერი", luggage: "ბარგის დატოვება", review: "შეფასება", tip: "ჩაი",
    live: "მოთხოვნების სტატუსი", liveTitle: "რა ხდება ახლა.", liveOff: "Live სტატუსი გამოჩნდება სასტუმროს საერთო მოთხოვნების ბაზის ჩართვის შემდეგ.", noRequests: "თქვენი აქტიური მოთხოვნები აქ გამოჩნდება.",
    new: "მიღებულია", acknowledged: "რესეფშენმა ნახა", in_progress: "მუშავდება", done: "დასრულებულია", cancelled: "გაუქმებულია",
  },
} as const;

const serviceItems = [
  { type: "housekeeping", icon: "✦", en: "Full cleaning", ru: "Полная уборка", ka: "სრული დასუფთავება", body: "Please arrange housekeeping for my room." },
  { type: "refresh-room", icon: "◌", en: "Quick refresh", ru: "Быстро освежить номер", ka: "სწრაფი მოწესრიგება", body: "Please refresh the room without a full cleaning." },
  { type: "towels", icon: "≈", en: "Fresh towels", ru: "Свежие полотенца", ka: "სუფთა პირსახოცები", body: "Please bring fresh towels." },
  { type: "bed-linen", icon: "▤", en: "Bed linen", ru: "Постельное бельё", ka: "თეთრეული", body: "Please change or bring fresh bed linen." },
  { type: "toiletries", icon: "·", en: "Toiletries", ru: "Туалетные принадлежности", ka: "ჰიგიენის ნივთები", body: "Please bring additional bathroom toiletries." },
  { type: "extra-pillow", icon: "◇", en: "Extra pillow", ru: "Доп. подушка", ka: "დამატებითი ბალიში", body: "Please bring an extra pillow." },
  { type: "extra-blanket", icon: "□", en: "Extra blanket", ru: "Доп. одеяло", ka: "დამატებითი პლედი", body: "Please bring an extra blanket." },
  { type: "trash", icon: "⌁", en: "Remove trash", ru: "Забрать мусор", ka: "ნაგვის გატანა", body: "Please remove the trash from my room." },
  { type: "dnd", icon: "☾", en: "Do not disturb", ru: "Не беспокоить", ka: "არ შემაწუხოთ", body: "Please note that I would prefer not to be disturbed." },
  { type: "temperature", icon: "°", en: "Room temperature", ru: "Температура", ka: "ტემპერატურა", body: "Please help with the room temperature or climate control." },
  { type: "maintenance", icon: "△", en: "Fix something", ru: "Что-то сломалось", ka: "რაღაც შესაკეთებელია", body: "I need help with something in the room that is not working correctly." },
  { type: "luggage", icon: "▣", en: "Luggage help", ru: "Помощь с багажом", ka: "ბარგის დახმარება", body: "Please help me with luggage." },
] as const;

export default function GuestRoomCompanion({ profile, onRequest }: { profile: Profile; onRequest: SendRequest }) {
  const [info, setInfo] = useState<GuestInfo | null>(null);
  const [wifiVisible, setWifiVisible] = useState(false);
  const [selected, setSelected] = useState<(typeof serviceItems)[number] | null>(null);
  const [timing, setTiming] = useState("as soon as possible");
  const [serviceNote, setServiceNote] = useState("");
  const [wakeTime, setWakeTime] = useState("08:00");
  const [busy, setBusy] = useState("");
  const [live, setLive] = useState<LiveStatus[]>([]);
  const [liveConfigured, setLiveConfigured] = useState<boolean | null>(null);
  const lang = profile.lang;
  const t = translations[lang];

  useEffect(() => {
    fetch("/api/guest/info", { cache: "no-store" }).then((response) => response.json()).then(setInfo).catch(() => null);
  }, []);

  const loadLive = useCallback(async () => {
    let tickets: LocalTicket[] = [];
    try { tickets = JSON.parse(localStorage.getItem("annas-garden-guest-tickets") || "[]") as LocalTicket[]; } catch {}
    const ids = tickets.map((item) => item.id).slice(0, 12);
    if (!ids.length) { setLive([]); return; }
    try {
      const response = await fetch(`/api/guest/status?ids=${encodeURIComponent(ids.join(","))}`, { cache: "no-store" });
      const data = await response.json();
      setLiveConfigured(Boolean(data.configured));
      setLive(Array.isArray(data.statuses) ? data.statuses : []);
    } catch {}
  }, []);

  useEffect(() => {
    loadLive();
    const timer = window.setInterval(loadLive, 15000);
    const refresh = () => loadLive();
    window.addEventListener("annas:guest-tickets", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("annas:guest-tickets", refresh); };
  }, [loadLive]);

  const localLabels = useMemo(() => {
    let tickets: LocalTicket[] = [];
    try { tickets = JSON.parse(localStorage.getItem("annas-garden-guest-tickets") || "[]") as LocalTicket[]; } catch {}
    return new Map(tickets.map((item) => [item.id, item]));
  }, [live]);

  async function submitService() {
    if (!selected) return;
    setBusy(selected.type);
    await onRequest(selected.type, selected[lang], `${selected.body} Preferred timing: ${timing}.`, serviceNote);
    setBusy(""); setSelected(null); setServiceNote("");
  }

  async function quick(type: string, label: string, body: string, note = "") {
    setBusy(type);
    await onRequest(type, label, body, note);
    setBusy("");
  }

  async function copy(value: string) {
    try { await navigator.clipboard.writeText(value); } catch {}
  }

  const statusLabel = (status: LiveStatus["status"]) => t[status];

  return (
    <>
      <section className="grc-pass">
        <div className="grc-pass-copy">
          <p className="guest-kicker">{t.stay}</p>
          <h2>{t.title} {profile.room}.</h2>
          <div className="grc-pass-meta">
            <span><small>ROOM</small><strong>{profile.room}</strong></span>
            <span><small>CHECKOUT</small><strong>{profile.checkOut || info?.checkOut || "12:00"}</strong></span>
            <span><small>RECEPTION</small><strong>24H</strong></span>
          </div>
        </div>
        <article className="grc-wifi-card">
          <div className="grc-wifi-icon">⌁</div>
          <p className="guest-kicker">{t.wifi}</p>
          {info?.wifi.configured ? <>
            <h3>{info.wifi.name}</h3>
            <p>{t.wifiReady}{info.wifi.note ? ` · ${info.wifi.note}` : ""}</p>
            {info.wifi.password ? <div className="grc-secret"><code>{wifiVisible ? info.wifi.password : "••••••••••"}</code><button onClick={() => setWifiVisible(!wifiVisible)}>{wifiVisible ? t.hide : t.show}</button><button onClick={() => copy(info.wifi.password)}>{t.copy}</button></div> : null}
          </> : <><h3>Free Wi‑Fi</h3><p>{t.wifiAsk}</p><button className="grc-text-button" onClick={() => quick("wifi", t.wifi, "Please send me the Wi-Fi network details for my room.")}>{t.wifiAsk} →</button></>}
        </article>
      </section>

      <section className="grc-services">
        <div className="guest-section-head"><p className="guest-kicker">{t.services}</p><h2>{t.servicesTitle}</h2></div>
        <div className="grc-service-grid">
          {serviceItems.map((item) => <button key={item.type} className={selected?.type === item.type ? "active" : ""} onClick={() => setSelected(item)}><span>{item.icon}</span><strong>{item[lang]}</strong><em>REQUEST</em></button>)}
        </div>
        {selected ? <div className="grc-service-composer">
          <div><p className="guest-kicker">REQUEST</p><h3>{selected[lang]}</h3></div>
          <label>{t.preferred}<select value={timing} onChange={(e) => setTiming(e.target.value)}><option value="as soon as possible">{t.now}</option><option value="in about 30 minutes">{t.thirty}</option><option value="in about 1 hour">{t.hour}</option><option value="later today">{t.later}</option></select></label>
          <label>{t.note}<textarea value={serviceNote} onChange={(e) => setServiceNote(e.target.value)} rows={3} /></label>
          <button disabled={busy === selected.type} onClick={submitService}>{busy === selected.type ? "…" : `${t.send} →`}</button>
        </div> : null}
      </section>

      <section className="grc-wake-contact">
        <article className="grc-wake">
          <p className="guest-kicker">{t.wake}</p><h2>{t.wakeTitle}</h2><p>{t.wakeBody}</p>
          <div><input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} /><button disabled={busy === "wake-up"} onClick={() => quick("wake-up", t.wakeTitle, `Please arrange a wake-up call for ${wakeTime}.`)}>{t.wakeButton} →</button></div>
        </article>
        <article className="grc-contact">
          <p className="guest-kicker">{t.contact}</p><h2>Reception, your way.</h2>
          <div className="grc-contact-grid">
            <a href={info?.phoneHref || "tel:+995599521751"}><span>01</span><strong>{t.call}</strong><small>{info?.phoneDisplay || "+995 599 52 17 51"}</small></a>
            <a href={info?.whatsappHref || "https://wa.me/995599521751"} target="_blank" rel="noreferrer"><span>02</span><strong>{t.whatsapp}</strong><small>CHAT</small></a>
            <a href={info?.smsHref || "sms:+995599521751"}><span>03</span><strong>{t.sms}</strong><small>MESSAGE</small></a>
            <a href="/tbilisi-guide"><span>04</span><strong>{t.guide}</strong><small>EXPLORE</small></a>
            <a className="emergency" href={info?.emergencyHref || "tel:112"}><span>!</span><strong>{t.emergency}</strong><small>GEORGIA</small></a>
          </div>
        </article>
      </section>

      <section className="grc-checkout">
        <div><p className="guest-kicker">{t.checkout}</p><h2>{t.checkoutTitle}</h2><p>{profile.checkOut ? `${profile.name} · Room ${profile.room} · ${profile.checkOut}` : `${profile.name} · Room ${profile.room}`}</p></div>
        <div className="grc-checkout-grid">
          <a href="/pay"><span>PAY</span><strong>{t.pay}</strong><em>→</em></a>
          <button onClick={() => quick("late-checkout", t.late, "I would like to request a late checkout. Please confirm availability and any applicable charge.")}><span>TIME</span><strong>{t.late}</strong><em>+</em></button>
          <button onClick={() => quick("transfer", t.transfer, "Please help me arrange an airport transfer for departure.")}><span>RIDE</span><strong>{t.transfer}</strong><em>+</em></button>
          <button onClick={() => quick("luggage-storage", t.luggage, "May I store my luggage with the hotel before departure?")}><span>BAG</span><strong>{t.luggage}</strong><em>+</em></button>
          <a href={BOOKING_URL} target="_blank" rel="noreferrer"><span>RATE</span><strong>{t.review}</strong><em>↗</em></a>
          {info?.tipUrl ? <a href={info.tipUrl} target="_blank" rel="noreferrer"><span>♥</span><strong>{t.tip}</strong><em>↗</em></a> : null}
        </div>
      </section>

      <section className="grc-live">
        <div className="guest-section-head"><p className="guest-kicker">{t.live}</p><h2>{t.liveTitle}</h2></div>
        {liveConfigured === false ? <p className="grc-live-empty">{t.liveOff}</p> : live.length ? <div className="grc-live-list">{live.map((item) => {
          const local = localLabels.get(item.id);
          return <article key={item.id} className={`status-${item.status}`}><span>{item.id}</span><div><strong>{local?.label || "Guest request"}</strong><p>{statusLabel(item.status)}</p></div><time>{new Date(item.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time><i /></article>;
        })}</div> : <p className="grc-live-empty">{t.noRequests}</p>}
      </section>
    </>
  );
}
