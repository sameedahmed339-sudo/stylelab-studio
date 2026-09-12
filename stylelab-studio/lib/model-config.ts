import { TeeColorId } from "./types";

/**
 * Dynamic pant color mapping (brief section 1). Each tee color maps to
 * a contrasting pant treatment. These composites are PRECOMPUTED
 * (public/model/front-{colorId}.jpg) — see scripts/README below for
 * how they were generated — rather than recolored live in the browser,
 * so quality is guaranteed and there's zero runtime image-processing
 * cost.
 */
export const PANTS_COLOR_MAP: Record<TeeColorId, { hex: string; label: string }> = {
  "jet-black": { hex: "#9C9FA5", label: "Grey" },
  "off-white": { hex: "#7A6A4F", label: "Olive / Khaki" },
  "slate-grey": { hex: "#D8CFC0", label: "Warm Cream contrast" },
  "crimson-maroon": { hex: "#C7C3BB", label: "Light Grey" },
  "navy-blue": { hex: "#F2EFE9", label: "Off-White" },
};

export type ModelAngle = "front" | "back" | "side";

export const MODEL_ANGLES: ModelAngle[] = ["front", "back", "side"];

/**
 * Which angles currently have a real studio photo behind them. Only
 * "front" ships with actual photography today (the image you sent us).
 * Back/Side fall back to the front photo with a small "angle coming
 * soon" badge until matching back/side shots are supplied — see
 * scripts/build_masks.py docstring for how to process new angles once
 * you have them.
 */
export const AVAILABLE_ANGLES: Record<ModelAngle, boolean> = {
  front: true,
  back: false,
  side: false,
};

/** Chest/back print placement box, as a % of the image's own width/height. */
export interface PrintBox {
  leftPct: number;
  topPct: number;
  widthPct: number;
  heightPct: number;
}

const FRONT_CHEST_A4: PrintBox = { leftPct: 41, topPct: 24, widthPct: 18, heightPct: 16 };
const FRONT_CHEST_A3: PrintBox = { leftPct: 38, topPct: 22, widthPct: 24, heightPct: 21 };
const BACK_PANEL_A4: PrintBox = { leftPct: 39, topPct: 20, widthPct: 22, heightPct: 20 };
const BACK_PANEL_A3: PrintBox = { leftPct: 35, topPct: 18, widthPct: 30, heightPct: 26 };

export function getPrintBox(size: "a4" | "a3", position: "front" | "back"): PrintBox {
  if (position === "back") return size === "a3" ? BACK_PANEL_A3 : BACK_PANEL_A4;
  return size === "a3" ? FRONT_CHEST_A3 : FRONT_CHEST_A4;
}

export function getModelImage(colorId: TeeColorId, angle: ModelAngle): string {
  // Back/Side reuse the front photo until real photography is supplied.
  const usableAngle: ModelAngle = AVAILABLE_ANGLES[angle] ? angle : "front";
  return `/model/${usableAngle}-${colorId}.jpg`;
}
