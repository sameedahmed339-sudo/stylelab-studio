import { CustomizerState } from "./types";
import { calculatePricing, formatPKR, PRINT_LABELS } from "./pricing";
import { sanitizeText, encodeForUrl } from "./sanitize";

/** Replace with your real WhatsApp Business number (country code, no +, no spaces). */
export const WHATSAPP_NUMBER = "923XXXXXXXXX";

/**
 * Builds the final wa.me deep link.
 *
 * Security note: this function takes the raw CustomizerState — color,
 * size, print type/position, custom text — but it NEVER accepts a
 * pre-computed price object from the caller. Pricing is derived here,
 * from lib/pricing.ts constants, the instant before the link is built.
 * That means even if a user manipulated on-screen numbers via devtools,
 * the message sent to the seller is always correct.
 */
export function buildWhatsAppOrderUrl(state: CustomizerState): string {
  const { color, size, printType, printPosition, selectedDesign, customText } = state;

  // Recompute from scratch — do not trust any cached totals.
  const pricing = calculatePricing(printType);

  const printLabel = PRINT_LABELS[printType];
  const positionLabel =
    printType === "none" ? "N/A" : printPosition === "back" ? "Back Panel" : "Front Chest";

  const designLine =
    printType !== "none" && selectedDesign ? `\n• Design: ${sanitizeText(selectedDesign.name, 60)}` : "";

  const customTextLine =
    printType !== "none" && customText.trim()
      ? `\n• Custom Text: ${sanitizeText(customText, 120)}`
      : "";

  const message = [
    "Hi StyleLab Studio! I want to order a custom tee:",
    "• Product: Drop-Shoulder Boxy Silhouette Tee",
    `• Color: ${color.name}`,
    `• Size: ${size}`,
    `• Print Type: ${printLabel}`,
    `• Print Position: ${positionLabel}${designLine}${customTextLine}`,
    "----------------------------------",
    `• Total Price: ${formatPKR(pricing.total)}`,
    `• Advance Payable (50% + Delivery): ${formatPKR(pricing.advance)}`,
    `• COD Amount on Delivery: ${formatPKR(pricing.codBalance)}`,
    "----------------------------------",
    "City: Karachi",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeForUrl(message)}`;
}
