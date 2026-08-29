export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://annas-garden-hotel.vercel.app").replace(/\/$/, "");
export const BOOKING_URL = "https://www.booking.com/hotel/ge/annas-garden.html";
export const PHONE_DISPLAY = "+995 599 52 17 51";
export const PHONE_HREF = "tel:+995599521751";
export const ADDRESS = "10 Shalva Mshvelidze Street, 0190 Tbilisi, Georgia";
export const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=10+Shalva+Mshvelidze+Street+Tbilisi";

export const HOTEL_AMENITIES = [
  "Free Wi-Fi",
  "Free private parking",
  "24-hour front desk",
  "Airport shuttle",
  "Air conditioning",
  "Room service",
  "Non-smoking rooms",
  "Garden",
  "Heating",
  "Laundry",
] as const;

export const ROOMS = [
  {
    slug: "deluxe-double",
    name: "Deluxe Double Room",
    shortName: "Deluxe Double",
    size: "24 m² / 258 ft²",
    bed: "1 queen bed",
    occupancy: 2,
    image: "/media/hero-user.webp?v=exact-hero-20260828",
    description: "A spacious double room with a balcony, garden or inner-courtyard view, air conditioning, a private bathroom, flat-screen TV, soundproofing and free Wi-Fi.",
    amenities: ["Private balcony", "Queen bed", "Private bathroom", "Air conditioning", "Soundproofing", "Free Wi-Fi", "Flat-screen TV", "Electric kettle"],
  },
  {
    slug: "deluxe-twin",
    name: "Deluxe Twin Room",
    shortName: "Deluxe Twin",
    size: "Approx. 19 m²",
    bed: "2 beds",
    occupancy: 2,
    image: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760841/1760841051/anna-s-garden-hotel-tbilisi-pic-18.JPEG",
    description: "A bright twin room for two guests with clean modern interiors, air conditioning, a private bathroom, flat-screen TV and free Wi-Fi.",
    amenities: ["Two beds", "Private bathroom", "Air conditioning", "Soundproofing", "Free Wi-Fi", "Flat-screen TV", "Electric kettle"],
  },
  {
    slug: "economy-double",
    name: "Economy Double Room",
    shortName: "Economy Double",
    size: "15 m² / 161 ft²",
    bed: "1 full bed",
    occupancy: 2,
    image: "https://annas-garden.tbilisi-hotels.com/data/Pics/OriginalPhoto/17608/1760858/1760858077/anna-s-garden-hotel-tbilisi-pic-65.JPEG",
    description: "A compact, comfortable double room with garden or inner-courtyard view, air conditioning, private bathroom, flat-screen TV, soundproofing and free Wi-Fi.",
    amenities: ["Full bed", "Garden / courtyard view", "Private bathroom", "Air conditioning", "Soundproofing", "Free Wi-Fi", "Flat-screen TV"],
  },
] as const;
