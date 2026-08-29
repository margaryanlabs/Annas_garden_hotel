# Guest Room Companion

Public guest route: `/guest`
Easy QR studio shortcut: `/qr`
Room-specific guest route: `/guest?room=204`
Room-specific QR: `/guest/qr?room=204`

## Included now

- digital room/stay card
- Wi-Fi card with reveal/copy when credentials are configured
- request Wi-Fi details when credentials are not published
- full cleaning / quick refresh
- fresh towels / bed linen / toiletries
- extra pillow / extra blanket
- trash removal
- Do Not Disturb request
- room temperature / climate help
- maintenance request
- luggage help
- preferred service timing + free-text note
- wake-up request with time picker
- 24-hour reception call
- WhatsApp
- SMS deep link
- Georgia emergency 112 shortcut
- Tbilisi guide
- checkout assistant: payment, late checkout, airport transfer, luggage storage, review
- optional tipping link
- live guest request status polling when Reception Supabase storage is connected

All operational services are requests, not automatic promises. Reception confirms availability, timing and any applicable charge.

## Wi-Fi configuration

Set server variables in Vercel. Do not commit real credentials to GitHub.

```bash
GUEST_WIFI_NAME=<hotel wifi ssid>
GUEST_WIFI_PASSWORD=<hotel wifi password>
GUEST_WIFI_NOTE=<optional short note, e.g. Same network on all floors>
```

If `GUEST_WIFI_NAME` is absent, Guest OS shows `Ask reception for access` instead of inventing credentials.

Note: the Guest Hub is a public web route. Only publish Wi-Fi credentials here if the hotel intentionally wants in-house guests with the QR/link to see them.

## Optional tipping

```bash
GUEST_TIP_URL=<real approved tip/payment URL>
```

The tipping action is hidden unless a real URL is configured.

## Live request status

Guest tickets poll `/api/guest/status` every 15 seconds. The endpoint exposes only safe operational fields (`id`, `status`, timestamps), not guest messages or personal details.

It becomes live after the existing reception Supabase store is connected with:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

and the reception migrations are applied.

## SMS

The current Guest OS provides a native `sms:` action to message the hotel reception number from the guest's phone. Automated outbound SMS requires a real SMS provider/account and should be integrated through a server-side provider adapter or webhook; no provider credentials or fake SMS behavior are hard-coded.
