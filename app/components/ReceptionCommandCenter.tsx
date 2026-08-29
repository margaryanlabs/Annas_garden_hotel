"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Status = "new" | "acknowledged" | "in_progress" | "done" | "cancelled";
type Priority = "low" | "normal" | "high" | "urgent";
type RequestItem = {
  id: string; request_type: string; label: string; message: string | null; note: string | null;
  guest_name: string; room: string; lang: string | null; checkout_date: string | null; status: Status;
  priority: Priority; source: string; assigned_to: string | null; operator_note: string | null;
  created_at: string; updated_at: string; completed_at: string | null;
};

type Feed = { configured: boolean; requests: RequestItem[]; rooms: string[]; refreshedAt?: string; error?: string };

const statusLabel: Record<Status, string> = { new: "NEW", acknowledged: "ACKNOWLEDGED", in_progress: "IN PROGRESS", done: "DONE", cancelled: "CANCELLED" };
const priorityLabel: Record<Priority, string> = { low: "LOW", normal: "NORMAL", high: "HIGH", urgent: "URGENT" };
const typeGlyph: Record<string, string> = { housekeeping: "✦", towels: "≈", "late-checkout": "◷", maintenance: "◇", transfer: "↗", reception: "·", "quiet-evening": "☾", "fresh-room": "✧", "late-morning": "◌", "airport-ready": "↗", "something-special": "✺", feedback: "“" };

function age(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.max(0, Math.floor(ms / 60000));
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function ReceptionCommandCenter() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [feed, setFeed] = useState<Feed>({ configured: false, requests: [], rooms: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"active" | Status | "all">("active");
  const [roomFilter, setRoomFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const response = await fetch("/api/reception/requests", { cache: "no-store" });
      if (response.status === 401) { setAuth(false); return; }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setAuth(response.status === 503 ? null : true);
        setFeed({ configured: false, requests: [], rooms: [], error: data.error || "Unable to load reception feed" });
        return;
      }
      setAuth(true);
      setFeed(data as Feed);
    } catch {
      setFeed((current) => ({ ...current, error: "Reception feed is temporarily unavailable" }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (auth !== true) return;
    const timer = window.setInterval(() => load(true), 15000);
    return () => window.clearInterval(timer);
  }, [auth, load]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoginError("");
    const response = await fetch("/api/reception/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setLoginError(data.error || "Access denied"); return; }
    setCode("");
    await load();
  }

  async function logout() {
    await fetch("/api/reception/logout", { method: "POST" });
    setAuth(false);
    setFeed({ configured: false, requests: [], rooms: [] });
  }

  async function update(id: string, patch: Partial<Pick<RequestItem, "status" | "priority" | "assigned_to" | "operator_note">>) {
    setSaving(id);
    try {
      const response = await fetch(`/api/reception/requests/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Update failed");
      setFeed((current) => ({ ...current, requests: current.requests.map((item) => item.id === id ? data.request : item) }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to update request");
    } finally { setSaving(null); }
  }

  const activeRequests = useMemo(() => feed.requests.filter((item) => !["done", "cancelled"].includes(item.status)), [feed.requests]);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return feed.requests.filter((item) => {
      const statusOk = filter === "all" ? true : filter === "active" ? !["done", "cancelled"].includes(item.status) : item.status === filter;
      const roomOk = roomFilter === "all" || item.room === roomFilter;
      const searchOk = !q || [item.id, item.guest_name, item.room, item.label, item.request_type, item.note || ""].join(" ").toLowerCase().includes(q);
      return statusOk && roomOk && searchOk;
    });
  }, [feed.requests, filter, roomFilter, search]);

  const selected = feed.requests.find((item) => item.id === selectedId) || null;
  useEffect(() => { setNoteDraft(selected?.operator_note || ""); }, [selectedId, selected?.operator_note]);

  const doneToday = feed.requests.filter((item) => item.status === "done" && item.completed_at && new Date(item.completed_at).toDateString() === new Date().toDateString()).length;
  const urgent = activeRequests.filter((item) => item.priority === "urgent" || item.priority === "high").length;
  const transfers = activeRequests.filter((item) => item.request_type.includes("transfer") || item.request_type.includes("airport")).length;

  if (auth === false) return (
    <main className="reception-login">
      <div className="reception-login-orbit orbit-one" /><div className="reception-login-orbit orbit-two" />
      <form onSubmit={login} className="reception-login-card">
        <a href="/" className="rc-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>RECEPTION</small></a>
        <p className="rc-kicker">PRIVATE OPERATIONS</p><h1>Command the stay.</h1>
        <p>Guest requests, rooms, transfers and service status in one quiet workspace.</p>
        <label>Reception access code<input autoFocus type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="••••••••" /></label>
        {loginError ? <p className="reception-login-error">{loginError}</p> : null}
        <button type="submit">ENTER COMMAND CENTER →</button>
      </form>
    </main>
  );

  if (auth === null && !loading) return (
    <main className="reception-login"><div className="reception-login-card"><a href="/" className="rc-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>RECEPTION</small></a><p className="rc-kicker">SETUP REQUIRED</p><h1>Reception access is not configured.</h1><p>Add <code>RECEPTION_ACCESS_CODE</code> and optionally <code>RECEPTION_SESSION_SECRET</code> in Vercel. The dashboard intentionally has no public default password.</p></div></main>
  );

  return (
    <main className="reception-command">
      <header className="rc-topbar">
        <a href="/" className="rc-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>RECEPTION</small></a>
        <div className="rc-live"><i className={feed.configured ? "online" : "offline"} /><span>{feed.configured ? "LIVE STORE" : "STORE NOT CONNECTED"}</span><small>{feed.refreshedAt ? `updated ${age(feed.refreshedAt)}` : ""}</small></div>
        <div className="rc-actions"><a href="/guest/qr" target="_blank">Guest QR</a><button onClick={() => load()}>Refresh</button><button onClick={logout}>Lock</button></div>
      </header>

      <section className="rc-hero">
        <div><p className="rc-kicker">TODAY · RECEPTION COMMAND</p><h1>What needs attention?</h1><p>One queue for every guest request. Acknowledge it, take ownership, finish it — nothing disappears into chat history.</p></div>
        <div className="rc-clock"><strong>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong><span>{new Date().toLocaleDateString([], { weekday: "long", day: "2-digit", month: "short" })}</span></div>
      </section>

      {!feed.configured ? <section className="rc-setup-banner"><div><p className="rc-kicker">PERSISTENCE</p><h2>Command Center is ready. Connect the request store.</h2><p>The UI and APIs are live, but durable shared history is intentionally disabled until the Supabase table and server key are connected. Guest requests still fall back to WhatsApp/webhook.</p></div><code>SUPABASE_URL<br/>SUPABASE_SERVICE_ROLE_KEY</code></section> : null}
      {feed.error ? <div className="rc-error">{feed.error}</div> : null}

      <section className="rc-metrics">
        <article><span>OPEN NOW</span><strong>{activeRequests.length}</strong><small>all unresolved requests</small></article>
        <article><span>HIGH PRIORITY</span><strong>{urgent}</strong><small>high + urgent</small></article>
        <article><span>TRANSFERS</span><strong>{transfers}</strong><small>active airport requests</small></article>
        <article><span>DONE TODAY</span><strong>{doneToday}</strong><small>completed service moments</small></article>
      </section>

      <section className="rc-room-section">
        <div className="rc-section-head"><div><p className="rc-kicker">ROOM PULSE</p><h2>Rooms at a glance.</h2></div><button className={roomFilter === "all" ? "active" : ""} onClick={() => setRoomFilter("all")}>ALL ROOMS</button></div>
        <div className="rc-room-board">
          {feed.rooms.length ? feed.rooms.map((room) => {
            const open = activeRequests.filter((item) => item.room === room);
            const latest = open[0];
            return <button key={room} className={`${roomFilter === room ? "selected" : ""} ${open.length ? "has-open" : "quiet"}`} onClick={() => setRoomFilter(roomFilter === room ? "all" : room)}>
              <span>ROOM</span><strong>{room}</strong><i>{open.length ? `${open.length} open` : "quiet"}</i>{latest ? <small>{latest.label}</small> : <small>No active requests</small>}
            </button>;
          }) : <p className="rc-empty">Rooms will appear from <code>RECEPTION_ROOM_LIST</code> or incoming guest requests.</p>}
        </div>
      </section>

      <section className="rc-queue-section">
        <div className="rc-queue-head">
          <div><p className="rc-kicker">LIVE QUEUE</p><h2>Every request. One place.</h2></div>
          <div className="rc-filters">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guest, room, ticket…" />
            <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}><option value="active">Active</option><option value="new">New</option><option value="acknowledged">Acknowledged</option><option value="in_progress">In progress</option><option value="done">Done</option><option value="cancelled">Cancelled</option><option value="all">All</option></select>
          </div>
        </div>

        <div className="rc-queue">
          {loading ? <p className="rc-empty">Loading reception queue…</p> : visible.length === 0 ? <p className="rc-empty">No requests match this view.</p> : visible.map((item) => (
            <article key={item.id} className={`rc-ticket status-${item.status} priority-${item.priority}`} onClick={() => setSelectedId(item.id)}>
              <div className="rc-ticket-glyph">{typeGlyph[item.request_type] || "·"}</div>
              <div className="rc-ticket-main"><div className="rc-ticket-line"><span>{item.id}</span><em>{age(item.created_at)}</em></div><h3>{item.label}</h3><p>{item.guest_name} · Room {item.room}{item.note ? ` · ${item.note}` : ""}</p></div>
              <div className="rc-ticket-meta"><span className={`rc-priority p-${item.priority}`}>{priorityLabel[item.priority]}</span><span className={`rc-status s-${item.status}`}>{statusLabel[item.status]}</span></div>
              <div className="rc-ticket-quick" onClick={(e) => e.stopPropagation()}>
                {item.status === "new" ? <button disabled={saving === item.id} onClick={() => update(item.id, { status: "acknowledged" })}>Acknowledge</button> : null}
                {item.status === "acknowledged" ? <button disabled={saving === item.id} onClick={() => update(item.id, { status: "in_progress" })}>Start</button> : null}
                {!["done", "cancelled"].includes(item.status) ? <button className="done" disabled={saving === item.id} onClick={() => update(item.id, { status: "done" })}>Done</button> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {selected ? <aside className="rc-drawer" onClick={() => setSelectedId(null)}><div className="rc-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <button className="rc-close" onClick={() => setSelectedId(null)}>×</button><p className="rc-kicker">{selected.id}</p><h2>{selected.label}</h2><p className="rc-drawer-lead">{selected.guest_name} · Room {selected.room}</p>
        <dl><div><dt>Status</dt><dd>{statusLabel[selected.status]}</dd></div><div><dt>Priority</dt><dd>{priorityLabel[selected.priority]}</dd></div><div><dt>Created</dt><dd>{new Date(selected.created_at).toLocaleString()}</dd></div><div><dt>Checkout</dt><dd>{selected.checkout_date || "—"}</dd></div></dl>
        {selected.message ? <section><span>REQUEST</span><p>{selected.message}</p></section> : null}{selected.note ? <section><span>GUEST NOTE</span><p>{selected.note}</p></section> : null}
        <label>Priority<select value={selected.priority} onChange={(e) => update(selected.id, { priority: e.target.value as Priority })}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
        <label>Assigned to<input value={selected.assigned_to || ""} onChange={(e) => setFeed((current) => ({ ...current, requests: current.requests.map((x) => x.id === selected.id ? { ...x, assigned_to: e.target.value } : x) }))} onBlur={(e) => update(selected.id, { assigned_to: e.target.value || null })} placeholder="Name / shift" /></label>
        <label>Internal note<textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="What reception should remember…" /><button onClick={() => update(selected.id, { operator_note: noteDraft || null })}>Save note</button></label>
        <div className="rc-drawer-actions"><button onClick={() => update(selected.id, { status: "acknowledged" })}>Acknowledge</button><button onClick={() => update(selected.id, { status: "in_progress" })}>In progress</button><button className="done" onClick={() => update(selected.id, { status: "done" })}>Mark done</button><button className="cancel" onClick={() => update(selected.id, { status: "cancelled" })}>Cancel</button></div>
      </div></aside> : null}

      <footer className="rc-footer"><div className="rc-brand"><span>ANNA’S</span><strong>GARDEN</strong><small>RECEPTION OS</small></div><p>Guest QR → request → reception → done.</p><div><a href="/guest" target="_blank">Guest OS</a><a href="/pay" target="_blank">Payments</a></div></footer>
    </main>
  );
}
