# Reception Command Center

Private operator route: `/reception`

## What is already implemented

- private access-code login using an HttpOnly cookie
- 12-hour reception session
- live queue with 15-second refresh
- room pulse board
- filters by status, room and search
- priorities: low / normal / high / urgent
- lifecycle: new → acknowledged → in progress → done / cancelled
- assignment field and internal operator note
- today metrics for open requests, high-priority items, transfers and completed tasks
- direct links to Guest QR, Guest OS and payments
- guest requests automatically attempt to persist into the shared reception store before webhook / WhatsApp fallback

## Required private Vercel variables

Do not put these values in GitHub.

```bash
RECEPTION_ACCESS_CODE=<choose a strong reception PIN/password>
RECEPTION_SESSION_SECRET=<long random secret>
RECEPTION_ROOM_LIST=201,204
```

Add the real full room list to `RECEPTION_ROOM_LIST` once confirmed by the hotel owner.

## Durable shared request history

The repository contains the migration:

`supabase/migrations/20260829_anna_guest_requests.sql`

Apply it to the Supabase project used by the hotel, then set these **server-only** Vercel variables:

```bash
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only service role key>
```

Never expose the service-role key through `NEXT_PUBLIC_*`.

When the store is configured, `/api/guest/request` inserts every Guest OS request into `anna_guest_requests`. `/api/reception/requests` reads the queue and `/api/reception/requests/[id]` updates status, priority, assignment and internal notes.

If the store is unavailable, guest requests still fall back to the configured webhook or prepared WhatsApp message. The dashboard explicitly shows `STORE NOT CONNECTED` rather than pretending persistence exists.

## Optional delivery automation

The existing webhook can run in parallel with the shared store:

```bash
GUEST_REQUEST_WEBHOOK_URL=
GUEST_REQUEST_WEBHOOK_TOKEN=
```

This can later notify Telegram, Slack, a CRM or another automation without changing the Guest OS UI.

## Security

- `/reception` is `noindex`.
- There is no public default reception password.
- Operator endpoints reject requests without the signed reception cookie.
- The Supabase table has RLS enabled and intentionally has no public policies; server routes use the service-role key.
- Guest-facing code never receives the service-role key.
