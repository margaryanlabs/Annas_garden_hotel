# Anna's Garden Hotel

Production hotel website for Anna's Garden Hotel, Tbilisi.

## Current product

- Cinematic editorial homepage and mobile layout
- Room storytelling and fullscreen gallery
- Dedicated indexable room pages
- EN / RU / KA search landing pages
- FAQ, contact/location and Tbilisi guide
- Hotel + HotelRoom structured data
- `robots.txt`, `sitemap.xml`, canonical and hreflang
- Web app manifest and AI-readable `llms.txt`
- Check-dates flow that opens Booking.com with dates/guests
- WhatsApp concierge flow
- Airport-transfer request flow
- Room comparison
- Booking.com rating source link (no fabricated review text)
- Digital guest guide at `/welcome`
- Persistent Dates / Book / Call / Map actions
- Optional Google Analytics event tracking

## Production environment variables

```bash
# Set this when a custom domain is connected.
NEXT_PUBLIC_SITE_URL=https://your-domain.example

# Google Search Console HTML/meta verification token.
GOOGLE_SITE_VERIFICATION=

# Optional Google Analytics 4 measurement ID, e.g. G-XXXXXXXXXX.
NEXT_PUBLIC_GA_ID=

# WhatsApp phone in international digits only, no + or spaces.
# Falls back to the current hotel phone if omitted.
NEXT_PUBLIC_WHATSAPP_NUMBER=995599521751
```

## Google launch checklist

1. Connect the final custom domain in Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to that domain and redeploy.
3. Create / claim the Google Business Profile for the hotel.
4. Add the final website URL, phone, address, Booking URL, check-in/out and hotel amenities to the Business Profile.
5. Add the site to Google Search Console.
6. Set `GOOGLE_SITE_VERIFICATION`, redeploy and verify ownership.
7. Submit `/sitemap.xml` in Search Console.
8. Request indexing for `/`, `/rooms`, the three room pages, `/ru`, `/ka`, `/faq`, `/contact` and `/tbilisi-guide`.
9. Add real hotel photos to the Google Business Profile and consistently collect genuine Google reviews.
10. Set `NEXT_PUBLIC_GA_ID` if conversion analytics are wanted.

## Important

The website does not invent prices, availability or guest reviews. Live rates and availability currently come from Booking.com. A future PMS / channel-manager integration can replace this redirect with first-party availability and direct booking.
