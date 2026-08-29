"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

type StayStatus = "booked" | "arriving" | "checked_in" | "checked_out" | "cancelled";
type HousekeepingStatus = "clean" | "dirty" | "in_progress" | "inspected" | "dnd";
type Stay = { id:string; booking_ref:string|null; guest_name:string; room:string; checkin_date:string; checkout_date:string; status:StayStatus; source:string; notes:string|null; created_at:string; updated_at:string };
type RoomOps = { room:string; housekeeping_status:HousekeepingStatus; room_note:string|null; updated_at:string };
type Handover = { id:string; message:string; created_by:string|null; pinned:boolean; resolved_at:string|null; created_at:string };
type Payment = { id:string; booking_ref:string|null; provider:string; amount:number|null; currency:string|null; status:string; room:string|null; guest_name:string|null; created_at:string; updated_at:string };
type GuestRequest = { id:string; request_type:string; label:string; guest_name:string; room:string; status:string; priority:string; note:string|null; created_at:string; completed_at:string|null };
type Feed = { configured:boolean; stays:Stay[]; roomOps:RoomOps[]; handovers:Handover[]; payments:Payment[]; requests:GuestRequest[]; rooms:string[]; refreshedAt?:string; error?:string };

const hkLabels: Record<HousekeepingStatus,string> = { clean:"CLEAN", dirty:"DIRTY", in_progress:"CLEANING", inspected:"INSPECTED", dnd:"DND" };
const stayLabels: Record<StayStatus,string> = { booked:"BOOKED", arriving:"ARRIVING", checked_in:"IN HOUSE", checked_out:"CHECKED OUT", cancelled:"CANCELLED" };

function today() { return new Date().toLocaleDateString("en-CA"); }
function age(iso:string) {
  const m = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function ReceptionOperationsDeck() {
  const [feed, setFeed] = useState<Feed>({ configured:false, stays:[], roomOps:[], handovers:[], payments:[], requests:[], rooms:[] });
  const [authorized, setAuthorized] = useState<boolean|null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [roomFocus, setRoomFocus] = useState("all");
  const [showStayForm, setShowStayForm] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [stayRoom, setStayRoom] = useState("");
  const [checkinDate, setCheckinDate] = useState(today());
  const [checkoutDate, setCheckoutDate] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [stayNotes, setStayNotes] = useState("");
  const [handoverText, setHandoverText] = useState("");
  const [handoverBy, setHandoverBy] = useState("");
  const [alerts, setAlerts] = useState(false);
  const seenRequests = useRef<Set<string>>(new Set());
  const initializedAlerts = useRef(false);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setError("");
    try {
      const response = await fetch("/api/reception/ops", { cache:"no-store" });
      if (response.status === 401) { setAuthorized(false); return; }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setAuthorized(response.status === 503 ? null : true); setError(data.error || "Unable to load operations"); return; }
      setAuthorized(true);
      setFeed(data as Feed);
    } catch { setError("Operations feed is temporarily unavailable"); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (authorized !== true) return;
    const timer = window.setInterval(() => load(true), 20000);
    return () => window.clearInterval(timer);
  }, [authorized, load]);

  useEffect(() => {
    try { setAlerts(localStorage.getItem("annas-reception-alerts") === "on"); } catch {}
  }, []);

  useEffect(() => {
    const current = feed.requests.filter((item) => item.status === "new");
    if (!initializedAlerts.current) {
      current.forEach((item) => seenRequests.current.add(item.id));
      initializedAlerts.current = true;
      return;
    }
    const fresh = current.filter((item) => !seenRequests.current.has(item.id));
    current.forEach((item) => seenRequests.current.add(item.id));
    if (!alerts || !fresh.length) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 660; gain.gain.value = .035; osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .13);
    } catch {}
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      const first = fresh[0];
      new Notification("Anna’s Garden · new guest request", { body: `${first.label} · Room ${first.room} · ${first.guest_name}` });
    }
  }, [feed.requests, alerts]);

  async function enableAlerts() {
    let ok = true;
    if (typeof Notification !== "undefined" && Notification.permission === "default") ok = (await Notification.requestPermission()) === "granted";
    setAlerts(ok);
    try { localStorage.setItem("annas-reception-alerts", ok ? "on" : "off"); } catch {}
  }

  async function api(path:string, method:string, body?:unknown) {
    setBusy(path); setError("");
    try {
      const response = await fetch(path, { method, headers:{ "Content-Type":"application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Action failed");
      await load(true);
      return data;
    } catch (e) { setError(e instanceof Error ? e.message : "Action failed"); return null; }
    finally { setBusy(""); }
  }

  async function createStay(event:FormEvent) {
    event.preventDefault();
    if (!guestName.trim() || !stayRoom.trim() || !checkinDate || !checkoutDate) return;
    const result = await api("/api/reception/stays", "POST", { guestName, room:stayRoom, checkinDate, checkoutDate, bookingRef, notes:stayNotes, status: checkinDate === today() ? "arriving" : "booked" });
    if (result) { setGuestName(""); setStayRoom(""); setBookingRef(""); setStayNotes(""); setCheckoutDate(""); setShowStayForm(false); }
  }

  async function updateStay(id:string, status:StayStatus) { await api(`/api/reception/stays/${encodeURIComponent(id)}`, "PATCH", { status }); }
  async function setHousekeeping(room:string, status:HousekeepingStatus) { await api(`/api/reception/rooms/${encodeURIComponent(room)}`, "PATCH", { housekeeping_status:status }); }
  async function createHandover(event:FormEvent) {
    event.preventDefault();
    if (!handoverText.trim()) return;
    const result = await api("/api/reception/handover", "POST", { message:handoverText, createdBy:handoverBy, pinned:false });
    if (result) setHandoverText("");
  }
  async function updateHandover(id:string, patch:{ pinned?:boolean; resolved?:boolean }) { await api(`/api/reception/handover/${encodeURIComponent(id)}`, "PATCH", patch); }

  const day = today();
  const arrivals = feed.stays.filter((s) => s.checkin_date === day && !["checked_in","checked_out","cancelled"].includes(s.status));
  const inHouse = feed.stays.filter((s) => s.status === "checked_in" || (s.checkin_date <= day && s.checkout_date > day && !["checked_out","cancelled"].includes(s.status)));
  const departures = feed.stays.filter((s) => s.checkout_date === day && !["checked_out","cancelled"].includes(s.status));
  const roomMap = useMemo(() => new Map(feed.roomOps.map((item) => [item.room, item])), [feed.roomOps]);
  const activeStayByRoom = useMemo(() => {
    const map = new Map<string,Stay>();
    feed.stays.filter((s) => s.status === "checked_in" || (s.checkin_date <= day && s.checkout_date > day && !["checked_out","cancelled"].includes(s.status))).forEach((s) => map.set(s.room, s));
    return map;
  }, [feed.stays, day]);

  const timeline = useMemo(() => {
    if (roomFocus === "all") return [] as { when:string; kind:string; title:string; meta:string }[];
    const events:{ when:string; kind:string; title:string; meta:string }[] = [];
    feed.requests.filter((r) => r.room === roomFocus).forEach((r) => events.push({ when:r.created_at, kind:"REQUEST", title:r.label, meta:`${r.guest_name} · ${r.status.toUpperCase()}` }));
    feed.stays.filter((s) => s.room === roomFocus).forEach((s) => {
      events.push({ when:`${s.checkin_date}T00:00:00`, kind:"STAY", title:`${s.guest_name} · check-in`, meta:`${s.checkin_date} → ${s.checkout_date} · ${stayLabels[s.status]}` });
      events.push({ when:`${s.checkout_date}T23:59:00`, kind:"STAY", title:`${s.guest_name} · checkout`, meta:s.booking_ref || "No booking reference" });
    });
    feed.payments.filter((p) => p.room === roomFocus || (!!p.booking_ref && feed.stays.some((s) => s.room === roomFocus && s.booking_ref === p.booking_ref))).forEach((p) => events.push({ when:p.updated_at || p.created_at, kind:"PAYMENT", title:`${p.provider.toUpperCase()} · ${p.status}`, meta:p.amount == null ? (p.booking_ref || "Payment event") : `${p.amount} ${p.currency || ""} · ${p.booking_ref || ""}` }));
    return events.sort((a,b) => new Date(b.when).getTime() - new Date(a.when).getTime());
  }, [roomFocus, feed.requests, feed.stays, feed.payments]);

  if (authorized === false || authorized === null) return null;

  return (
    <main className="reception-ops-extension">
      <section className="ro-intro">
        <div><p className="rc-kicker">OPERATIONS DECK</p><h2>The whole stay, not just the request.</h2><p>Arrivals, departures, housekeeping, payments and shift memory — attached to rooms and guests instead of disappearing into separate chats.</p></div>
        <div className="ro-intro-actions"><button onClick={() => setShowStayForm(true)}>+ ADD STAY</button><button className={alerts ? "active" : ""} onClick={enableAlerts}>{alerts ? "ALERTS ON" : "ENABLE ALERTS"}</button><button onClick={() => load()}>REFRESH</button></div>
      </section>

      {!feed.configured ? <section className="ro-offline"><strong>LIVE STORE NOT CONNECTED</strong><p>This operations layer is deployed, but durable arrivals, housekeeping, handover and payment history will stay empty until the Supabase migrations and server-only service key are connected.</p></section> : null}
      {error || feed.error ? <div className="rc-error">{error || feed.error}</div> : null}

      <section className="ro-today">
        <div className="ro-section-title"><p className="rc-kicker">TODAY FLOW</p><h3>Arrive. Stay. Depart.</h3><span>{day}</span></div>
        <div className="ro-flow-grid">
          <FlowColumn title="ARRIVALS" count={arrivals.length} empty="No confirmed arrivals loaded for today.">{arrivals.map((s) => <StayCard key={s.id} stay={s} actionLabel="CHECK IN" onAction={() => updateStay(s.id,"checked_in")} busy={busy.includes(s.id)} />)}</FlowColumn>
          <FlowColumn title="IN HOUSE" count={inHouse.length} empty="No in-house stays loaded.">{inHouse.map((s) => <StayCard key={s.id} stay={s} actionLabel={s.checkout_date === day ? "CHECK OUT" : "OPEN ROOM"} onAction={() => s.checkout_date === day ? updateStay(s.id,"checked_out") : setRoomFocus(s.room)} busy={busy.includes(s.id)} />)}</FlowColumn>
          <FlowColumn title="DEPARTURES" count={departures.length} empty="No departures loaded for today.">{departures.map((s) => <StayCard key={s.id} stay={s} actionLabel="CHECK OUT" onAction={() => updateStay(s.id,"checked_out")} busy={busy.includes(s.id)} />)}</FlowColumn>
        </div>
      </section>

      <section className="ro-housekeeping">
        <div className="ro-section-title"><div><p className="rc-kicker">HOUSEKEEPING BOARD</p><h3>Room state in one glance.</h3></div><p>Tap a status to move the room through the cleaning cycle. DND stays explicit.</p></div>
        <div className="ro-room-grid">
          {feed.rooms.map((room) => {
            const ops = roomMap.get(room); const stay = activeStayByRoom.get(room); const state = ops?.housekeeping_status || null;
            return <article key={room} className={`ro-room hk-${state || "unknown"}`}>
              <header><span>ROOM</span><strong>{room}</strong><em>{stay ? "OCCUPIED" : "NO STAY LOADED"}</em></header>
              <p>{stay ? stay.guest_name : "Guest data will appear from arrivals / PMS."}</p>
              <div className="ro-hk-status"><b>{state ? hkLabels[state] : "NOT SET"}</b><small>{ops?.updated_at ? `updated ${age(ops.updated_at)}` : "choose a housekeeping state"}</small></div>
              <div className="ro-hk-actions">{(["clean","dirty","in_progress","inspected","dnd"] as HousekeepingStatus[]).map((status) => <button key={status} className={state === status ? "active" : ""} disabled={busy.includes(room)} onClick={() => setHousekeeping(room,status)}>{hkLabels[status]}</button>)}</div>
            </article>;
          })}
          {!feed.rooms.length ? <p className="rc-empty">Room cards appear from RECEPTION_ROOM_LIST, stays or guest requests.</p> : null}
        </div>
      </section>

      <section className="ro-split">
        <div className="ro-timeline-panel">
          <div className="ro-section-title"><div><p className="rc-kicker">ROOM TIMELINE</p><h3>One room. One memory.</h3></div><select value={roomFocus} onChange={(e) => setRoomFocus(e.target.value)}><option value="all">Choose room</option>{feed.rooms.map((room) => <option key={room} value={room}>Room {room}</option>)}</select></div>
          {roomFocus === "all" ? <p className="ro-placeholder">Choose a room to see stays, requests and payment events together.</p> : timeline.length ? <div className="ro-timeline">{timeline.map((event, i) => <article key={`${event.when}-${i}`}><span>{event.kind}</span><div><strong>{event.title}</strong><p>{event.meta}</p></div><time>{new Date(event.when).toLocaleString()}</time></article>)}</div> : <p className="ro-placeholder">No timeline events for Room {roomFocus} yet.</p>}
        </div>

        <div className="ro-payments-panel">
          <div className="ro-section-title"><div><p className="rc-kicker">PAYMENTS</p><h3>Money without guessing.</h3></div><a href="/pay" target="_blank">OPEN PAY PAGE ↗</a></div>
          <div className="ro-payments">{feed.payments.length ? feed.payments.slice(0,12).map((p) => <article key={p.id}><div><span>{p.provider.toUpperCase()}</span><strong>{p.amount == null ? "—" : `${p.amount} ${p.currency || ""}`}</strong></div><p>{p.booking_ref || p.id}</p><em>{p.status}</em><time>{age(p.updated_at || p.created_at)}</time></article>) : <p className="ro-placeholder">No tracked payment events yet. TBC events will appear here after the payment store is connected.</p>}</div>
        </div>
      </section>

      <section className="ro-handover">
        <div className="ro-section-title"><div><p className="rc-kicker">SHIFT HANDOVER</p><h3>Nothing important dies with the shift.</h3></div><p>Leave operational memory for the next person: late arrivals, transfers, unpaid balances, maintenance or special guest context.</p></div>
        <div className="ro-handover-layout">
          <form onSubmit={createHandover} className="ro-handover-form"><label>Your name / shift<input value={handoverBy} onChange={(e) => setHandoverBy(e.target.value)} placeholder="Night shift / Nino" /></label><label>What must the next shift know?<textarea value={handoverText} onChange={(e) => setHandoverText(e.target.value)} placeholder="Room 204 asked for a 05:30 transfer…" /></label><button disabled={!handoverText.trim() || busy.includes("handover")} type="submit">SAVE FOR NEXT SHIFT →</button></form>
          <div className="ro-handover-list">{feed.handovers.filter((h) => !h.resolved_at).length ? feed.handovers.filter((h) => !h.resolved_at).map((h) => <article key={h.id} className={h.pinned ? "pinned" : ""}><header><span>{h.pinned ? "PINNED" : "HANDOVER"}</span><time>{age(h.created_at)}</time></header><p>{h.message}</p><footer><small>{h.created_by || "Reception"}</small><div><button onClick={() => updateHandover(h.id,{ pinned:!h.pinned })}>{h.pinned ? "UNPIN" : "PIN"}</button><button onClick={() => updateHandover(h.id,{ resolved:true })}>RESOLVE</button></div></footer></article>) : <p className="ro-placeholder">No open handover notes.</p>}</div>
        </div>
      </section>

      {showStayForm ? <aside className="ro-modal" onClick={() => setShowStayForm(false)}><form className="ro-modal-card" onSubmit={createStay} onClick={(e) => e.stopPropagation()}><button type="button" className="ro-modal-close" onClick={() => setShowStayForm(false)}>×</button><p className="rc-kicker">MANUAL ARRIVAL</p><h3>Add a stay.</h3><p>Use this until a PMS/channel-manager feed is connected. No fake bookings are created automatically.</p><div className="ro-form-grid"><label>Guest name<input required value={guestName} onChange={(e) => setGuestName(e.target.value)} /></label><label>Room<input required value={stayRoom} onChange={(e) => setStayRoom(e.target.value)} list="room-options" /><datalist id="room-options">{feed.rooms.map((room) => <option key={room} value={room} />)}</datalist></label><label>Check-in<input required type="date" value={checkinDate} onChange={(e) => setCheckinDate(e.target.value)} /></label><label>Checkout<input required type="date" min={checkinDate} value={checkoutDate} onChange={(e) => setCheckoutDate(e.target.value)} /></label><label>Booking reference<input value={bookingRef} onChange={(e) => setBookingRef(e.target.value)} placeholder="Booking / direct / optional" /></label><label className="wide">Reception note<textarea value={stayNotes} onChange={(e) => setStayNotes(e.target.value)} /></label></div><button className="ro-submit" type="submit" disabled={busy.includes("stays")}>ADD TO TODAY FLOW →</button></form></aside> : null}
    </main>
  );
}

function FlowColumn({ title, count, empty, children }:{ title:string; count:number; empty:string; children:React.ReactNode }) {
  return <article className="ro-flow-column"><header><span>{title}</span><strong>{String(count).padStart(2,"0")}</strong></header><div>{count ? children : <p className="ro-placeholder">{empty}</p>}</div></article>;
}

function StayCard({ stay, actionLabel, onAction, busy }:{ stay:Stay; actionLabel:string; onAction:()=>void; busy:boolean }) {
  return <article className="ro-stay-card"><div className="ro-stay-room"><span>ROOM</span><strong>{stay.room}</strong></div><div className="ro-stay-copy"><span>{stayLabels[stay.status]}</span><h4>{stay.guest_name}</h4><p>{stay.checkin_date} → {stay.checkout_date}{stay.booking_ref ? ` · ${stay.booking_ref}` : ""}</p>{stay.notes ? <small>{stay.notes}</small> : null}</div><button disabled={busy} onClick={onAction}>{actionLabel}</button></article>;
}
