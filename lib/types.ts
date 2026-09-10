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

export interface PrintDesign {
  id: string;
  name: string;
  /** Path or data URL used for the on-canvas preview thumbnail */
  thumbnail: string;
  isCustom?: boolean;
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
  selectedDesign: PrintDesign | null;
  customText: string;
}
