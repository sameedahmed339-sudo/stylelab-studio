# StyleLab Studio — T-Shirt Customizer

A 2D tee customizer built with Next.js 14 (App Router), Tailwind CSS, Framer
Motion, and Lucide React. Obsidian dark studio theme with glowing cyan
accents, live SVG preview, and a WhatsApp checkout deep link.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Before going live

1. **WhatsApp number** — set your real number in `lib/whatsapp.ts`
   (`WHATSAPP_NUMBER`), country code first, digits only, no `+`.
2. **Print artwork** — drop PNGs into `public/designs/` matching the
   filenames in `lib/prints-catalog.ts`, or just add new entries to that
   array to grow the catalog.
3. **Garment art** — `components/TShirtCanvas.tsx` ships a flat SVG
   silhouette as a placeholder. Swap the `<path d="...">` for a real
   traced garment vector (front + back) when you have one; the color
   animation and print-overlay math key off the same `viewBox="0 0 360
   460"` coordinate space, so nothing else needs to change.

## Architecture / where things live

- `lib/types.ts` — all shared types (colors, sizes, print options, state).
- `lib/pricing.ts` — **single source of truth** for every price. Base
  tee, print add-ons, delivery fee, and the 50/50 advance-vs-COD split
  are all computed by `calculatePricing()`.
- `lib/sanitize.ts` — strips tags/scripts from any free-text input
  (custom print text) and validates uploaded image files client-side.
- `lib/whatsapp.ts` — builds the final `wa.me` deep link. It re-derives
  pricing from `lib/pricing.ts` at call time rather than accepting a
  pre-computed total, so DOM/devtools tampering with on-screen numbers
  can't change what gets sent to the seller.
- `lib/prints-catalog.ts` — array-based design catalog. Add a design by
  adding one object; no other file needs to change.
- `components/` — one component per concern (canvas, swatches, size
  chips, print options, catalog + uploader, price summary, CTA button).
- `app/page.tsx` — owns all customizer state (`useState` for color,
  size, print size/position, selected design, custom text) and wires it
  into the components above.

## Security notes (see brief section 5B)

- All free-text input is passed through `sanitizeText()` before it's
  stored in state or rendered, stripping HTML tags, `on*=` handlers, and
  `javascript:` URIs. Nothing in the app uses
  `dangerouslySetInnerHTML`.
- Uploaded images are validated by MIME type and size
  (`isSafeImageFile()`) and are only ever used as local
  `URL.createObjectURL()` previews — they're never uploaded anywhere in
  this stateless build.
- Pricing is never trusted from component props or intermediate state
  at checkout time — `buildWhatsAppOrderUrl()` recomputes the full
  breakdown fresh from the constants in `lib/pricing.ts` immediately
  before opening the WhatsApp link.
- No server, no database, no API routes — the app is fully static/CSR
  and has no SQL-injection or server-side attack surface. Deploy as a
  static export or on any serverless host.

## Customizing pricing

Edit the constants at the top of `lib/pricing.ts`:

```ts
export const BASE_TEE_PRICE = 1200;
export const KARACHI_DELIVERY_FEE = 250;
export const PRINT_PRICES = { none: 0, a4: 300, a3: 400 };
```

Every price shown in the UI and sent via WhatsApp derives from these.
