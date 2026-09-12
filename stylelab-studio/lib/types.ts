export type TeeColorId =
  | "jet-black"
  | "off-white"
  | "slate-grey"
  | "crimson-maroon"
  | "navy-blue";

export interface TeeColor {
  id: TeeColorId;
  name: string;
  hex: string;
  /** Whether print artwork should render in a light or dark variant on this base */
  printTone: "light" | "dark";
}

export type Size = "M" | "L" | "XL";

export type PrintType = "none" | "a4" | "a3";

export type PrintPosition = "front" | "back";

/**
 * Catalog categories describe the *vibe* of a design for browsing.
 * "Custom" is reserved for user-uploaded artwork and isn't part of the
 * curated catalog data.
 */
export type PrintCategory =
  | "Mindset & Stoic"
  | "Dark & Edgy"
  | "Desi Humor"
  | "Minimalist"
  | "Custom";

export type ZodiacSignId =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export interface PrintItem {
  id: string;
  name: string;
  category: PrintCategory;
  /**
   * Display price for this design (matches an A4/A3 print price from
   * lib/pricing.ts). This is informational metadata, not a second
   * pricing source: selecting a design auto-syncs the app's actual
   * `printType`, so the one calculatePricing() table in lib/pricing.ts
   * is still the only place a charge is ever computed.
   */
  price: number;
  image: string;
  description: string;
  isCustom?: boolean;
  /** Optional direct zodiac-sign tags for the Vibe & Zodiac Matcher quiz. */
  zodiacSigns?: ZodiacSignId[];
}

export interface PricingBreakdown {
  basePrice: number;
  printPrice: number;
  deliveryFee: number;
  total: number;
  advance: number;
  codBalance: number;
}

export interface CustomizerState {
  color: TeeColor;
  size: Size;
  printType: PrintType;
  printPosition: PrintPosition | null;
  selectedDesign: PrintItem | null;
  customText: string;
}
