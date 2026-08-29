# Anna's Garden Hotel

Production hotel website for Anna's Garden Hotel, Tbilisi.

## Current product

- Cinematic editorial homepage and mobile layout
- Room storytelling and fullscreen gallery
- Verified Booking.com guest-review showcase
- Why Guests Choose Us + honest special-stay request flows
- Dedicated indexable room pages
- EN / RU / KA search landing pages
- FAQ, contact/location and Tbilisi guide
- Hotel + HotelRoom structured data
- `robots.txt`, `sitemap.xml`, canonical and hreflang
- Web app manifest and AI-readable `llms.txt`
- Check-dates flow that opens Booking.com with dates/guests
- WhatsApp concierge and airport-transfer request flow
- Room comparison
- Personalized Guest OS at `/guest`
- Room-aware printable Guest QR at `/guest/qr?room=204`
- Guest request tickets with local request history
- Optional operator webhook for housekeeping/towels/checkout/transfer/feedback requests
- Guest payment page at `/pay`
- TBC Checkout server adapter
- Optional Georgian bank-transfer instructions
- Optional owner-approved crypto payment instructions
- Payment return/callback routes
- Terms, privacy, refund and accommodation-service policies
- Persistent Dates / Book / Pay / Call / Map actions
- Optional Google Analytics event tracking

## Core environment variables

```bash
# Final custom domain.
NEXT_PUBLIC_SITE_URL=https://your-domain.example

# Google Search Console verification token.
GOOGLE_SITE_VERIFICATION=

# Optional Google Analytics 4 measurement ID.
NEXT_PUBLIC_GA_ID=

# WhatsApp in international digits only, no + or spaces.
NEXT_PUBLIC_WHATSAPP_NUMBER=995599521751

# Optional direct Google review URL from the verified Business Profile.
NEXT_PUBLIC_GOOGLE_REVIEW_URL=
```

## Guest OS / request delivery

The guest hub stores the guest name, room, language, checkout date and recent ticket history only in that guest's browser. The hotel receives guest data only when the guest actively sends a request.

Every request receives an `AG-XXXXXX` ticket ID. If no operator backend is configured, `/api/guest/request` returns a prefilled WhatsApp URL and the guest sends it to reception. If an operator webhook is configured, requests are delivered server-to-server instead.

```bash
# Optional HTTPS endpoint for the owner's future operator dashboard / CRM / automation.
GUEST_REQUEST_WEBHOOK_URL=

# Optional shared bearer token sent to that webhook.
GUEST_REQUEST_WEBHOOK_TOKEN=
```

Webhook payload event name: `hotel.guest_request`. It includes ticket ID, request type, label, guest name, room, language, checkout date, note and creation timestamp.

The current UI never pretends that a request is "in progress" or "done" unless a real backend is later added to provide those states. Without the webhook, the request history shows that the WhatsApp message was prepared. With a successful webhook delivery it shows that the request was sent to reception.

## TBC Checkout

TBC is the first implemented Georgian acquiring adapter. Do not expose these server-side values in `NEXT_PUBLIC_*` variables.

```bash
TBC_API_KEY=
TBC_CLIENT_ID=
TBC_CLIENT_SECRET=
# Optional test endpoint override during merchant testing.
# TBC_BASE_URL=https://test-api.tbcbank.ge
```

The website starts a hosted TBC Checkout payment through `/api/payments/tbc`, sends callbacks to `/api/payments/tbc/callback`, and returns the guest to `/payment/result`.

Before enabling live card payments, register the hotel/company as a TBC E-Commerce merchant, create a developer app/API key, configure the callback URL in the TBC merchant dashboard, test the integration and complete the bank's go-live review.

## Georgian bank transfer

The transfer option is hidden until official hotel/company bank details are configured.

```bash
BANK_TRANSFER_BANK=
BANK_TRANSFER_BENEFICIARY=
BANK_TRANSFER_IBAN=
BANK_TRANSFER_SWIFT=
BANK_TRANSFER_CURRENCY=GEL
```

Never put a personal or unverified IBAN into the source code.

## Crypto payment

Crypto details are hidden until the owner approves one exact asset, network and address.

```bash
CRYPTO_PAYMENT_ASSET=USDT
CRYPTO_PAYMENT_NETWORK=
CRYPTO_PAYMENT_ADDRESS=
```

The UI tells guests to use only the configured asset/network and to send the transaction reference to the hotel for confirmation. Do not guess wallet addresses or networks.

## Guest QR

`/guest/qr` generates a high-error-correction generic QR pointing to `/guest`. Add a room query to create a room-specific print card, for example `/guest/qr?room=204`; that QR opens `/guest?room=204` with the room number already filled in. Use it for reception, bedside cards or room folders. Because the QR URL is built from `NEXT_PUBLIC_SITE_URL`, connect the final hotel domain before printing permanent cards.

## Google launch checklist

1. Connect the final custom domain in Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` and redeploy.
3. Create / claim the Google Business Profile.
4. Add final website, phone, address, Booking URL, check-in/out and hotel amenities.
5. Add the site to Google Search Console.
6. Set `GOOGLE_SITE_VERIFICATION`, redeploy and verify ownership.
7. Submit `/sitemap.xml`.
8. Request indexing for the main content pages.
9. Add real photos to the Business Profile and consistently collect genuine reviews.
10. Set `NEXT_PUBLIC_GOOGLE_REVIEW_URL` once Google provides the direct review link.
11. Set `NEXT_PUBLIC_GA_ID` if conversion analytics are wanted.

## Payment go-live checklist

1. Confirm the legal/business entity and hotel bank account that will receive funds.
2. Review `/terms`, `/refund-policy`, `/privacy`, `/service-policy` and `/contact` with the owner before bank submission.
3. Apply for Georgian acquiring (TBC adapter is ready; a Bank of Georgia adapter can be added beside it).
4. Add merchant credentials only as Vercel server environment variables.
5. Configure and verify the payment callback URL.
6. Test success, failure, cancellation, duplicate clicks and refund handling before going live.
7. Only then expose direct card payment to all guests.

## Important

The website does not invent prices, availability, bank accounts, crypto wallets, discounts, guest reviews or request statuses. Live rates and availability currently come from Booking.com. Direct-payment methods become visible only when the corresponding owner-controlled credentials/details are configured.
