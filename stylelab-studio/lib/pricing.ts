import { PricingBreakdown, PrintType, TeeColor, Size } from "./types";

/**
 * Canonical, non-negotiable price table.
 * This lives server-side-shaped on purpose: every price the UI ever shows
 * is derived by calling calculatePricing() below, never read off of state
 * that a user could mutate via devtools. Even if someone tampers with
 * component props or intercepts intermediate state, the WhatsApp handler
 * re-derives the final numbers from these constants immediately before
 * building the message (see lib/whatsapp.ts).
 */
export const BASE_TEE_PRICE = 1200;
export const KARACHI_DELIVERY_FEE = 250;

export const PRINT_PRICES: Record<PrintType, number> = {
  none: 0,
  a4: 300,
  a3: 400,
};

export const PRINT_LABELS: Record<PrintType, string> = {
  none: "No Print (Plain Tee)",
  a4: "A4 Custom Print",
  a3: "A3 Custom Print",
};

export const SIZES: Size[] = ["M", "L", "XL"];

export const TEE_COLORS: TeeColor[] = [
  { id: "jet-black", name: "Jet Black", hex: "#090A0F", printTone: "light" },
  { id: "off-white", name: "Off-White / Cream", hex: "#F2EFE9", printTone: "dark" },
  { id: "slate-grey", name: "Slate Grey", hex: "#4A4E53", printTone: "light" },
  { id: "crimson-maroon", name: "Crimson Maroon", hex: "#5B1325", printTone: "light" },
  { id: "navy-blue", name: "Navy Blue", hex: "#1B2432", printTone: "light" },
];

/**
 * Single source of truth for every price shown in the UI and sent to
 * WhatsApp. Always call this fresh — never cache/store the numbers it
 * returns in a way that could be edited before checkout.
 */
export function calculatePricing(printType: PrintType): PricingBreakdown {
  const basePrice = BASE_TEE_PRICE;
  const printPrice = PRINT_PRICES[printType] ?? 0;
  const deliveryFee = KARACHI_DELIVERY_FEE;

  const productSubtotal = basePrice + printPrice;
  const total = productSubtotal + deliveryFee;

  const advance = Math.round(productSubtotal * 0.5) + deliveryFee;
  const codBalance = total - advance;

  return { basePrice, printPrice, deliveryFee, total, advance, codBalance };
}

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}
