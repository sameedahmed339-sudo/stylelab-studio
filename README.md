# StyleLab Studio — T-Shirt Customizer

A 2D tee customizer built with Next.js 14 (App Router), Tailwind CSS,
Framer Motion, and Lucide React. Obsidian dark studio theme with glowing
cyan accents, a real studio-model preview with dynamic pants color
matching, a Vibe & Zodiac Matcher quiz, and a WhatsApp checkout deep link.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's new in this version

1. **Studio model preview** (`components/ModelStudio.tsx`) — replaces the
   old flat SVG mockup with your real studio photo. Selecting a tee color
   swaps in a precomputed composite where both the tee **and** the pants
   are recolored (see "Dynamic pants mapping" below), with a Front/Back/Side
   toggle and a live print overlay positioned on the chest or back.
2. **Vibe & Zodiac Matcher** (`components/VibeQuizModal.tsx`) — a 3-step
   quiz (zodiac sign → everyday energy → desired impression) that scores
   every catalog print and highlights the best matches with a "For you"
   badge, auto-switching the catalog to the matched category.
3. **Categorized, config-driven prints catalog** (`lib/prints-catalog.ts`)
   — unchanged in spirit from before: add a design by adding one object,
   no other code changes needed. Each item can now optionally carry
   `zodiacSigns` tags for the quiz.

## Before going live

1. **WhatsApp number** — set your real number in `lib/whatsapp.ts`
   (`WHATSAPP_NUMBER`), country code first, digits only, no `+`.
2. **Print artwork** — drop PNGs into `public/` matching the filenames
   in `lib/prints-catalog.ts`, or add new entries to that array to grow
   the catalog.
3. **Back / Side model photos** — only the Front angle has a real photo
   right now (the one you sent). Back and Side currently fall back to
   the Front image with a small "coming soon" badge. See
   `scripts/README.md` for the exact steps to process new angle photos
   through the same mask + recolor pipeline once you have them.

## Dynamic pants mapping (brief section 1)

Configured in `lib/model-config.ts` → `PANTS_COLOR_MAP`:

| Tee color | Pants |
|---|---|
| Jet Black | Grey |
| Off-White / Cream | Olive / Khaki |
| Slate Grey | Warm Cream contrast *(not specified in the brief — my extrapolation, change freely)* |
| Crimson Maroon | Light Grey |
| Navy Blue | Off-White |

These aren't recolored live in the browser — they're **precomputed**
JPEGs (`public/model/front-{colorId}.jpg`) generated once via
`scripts/generate_final_composites.py`, using an HSV hue/saturation swap
that keeps your photo's real fabric folds and shading. That means zero
runtime image-processing cost and guaranteed visual quality; the
trade-off is that adding a 6th tee color means re-running the script
rather than it working automatically.

## Architecture / where things live

- `lib/types.ts` — all shared types (colors, sizes, print options,
  catalog items, zodiac sign IDs, customizer state).
- `lib/pricing.ts` — **single source of truth** for every price. Base
  tee, print add-ons, delivery fee, and the 50/50 advance-vs-COD split
  are all computed by `calculatePricing()`.
- `lib/model-config.ts` — pants color mapping, which camera angles have
  real photos yet, and the chest/back print placement boxes (as % of
  the image) for each print size/position combo.
- `lib/zodiac.ts` — all 12 signs with element + primary/secondary print
  category affinity, and `matchZodiacToPrints()`, the scoring function
  behind the quiz's recommendations.
- `lib/sanitize.ts` — strips tags/scripts from any free-text input
  (custom print text) and validates uploaded image files client-side.
- `lib/whatsapp.ts` — builds the final `wa.me` deep link. It re-derives
  pricing from `lib/pricing.ts` at call time rather than accepting a
  pre-computed total, so DOM/devtools tampering with on-screen numbers
  can't change what gets sent to the seller.
- `lib/prints-catalog.ts` — array-based design catalog with categories
  and optional zodiac tags. Add a design by adding one object; no other
  file needs to change.
- `components/` — `ModelStudio` (studio preview + angle toggle + print
  overlay), `ColorSwatches`, `SizeChips`, `PrintOptions`,
  `PrintsCatalog` (category tabs + uploader + zodiac badges),
  `VibeQuizModal`, `PriceSummary`, `WhatsAppButton`.
- `app/page.tsx` — owns all customizer state (`useState` for color,
  size, print size/position, selected design, custom text, quiz result)
  and wires it into the components above.
- `scripts/` — standalone Python tools (not part of the Next.js app)
  used to turn a studio photo into the masked, recolorable assets in
  `public/model/`. See `scripts/README.md`.

## Security notes (see brief section 5B)

- All free-text input is passed through `sanitizeText()` before it's
  stored in state or rendered, stripping HTML tags, `on*=` handlers, and
  `javascript:` URIs. Nothing in the app uses `dangerouslySetInnerHTML`.
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

