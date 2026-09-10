import { PrintDesign } from "./types";

/**
 * Add new designs here — each entry just needs an id, display name, and
 * a thumbnail path (drop the artwork in /public/designs/ and point to
 * it). Nothing else in the app needs to change to support a new print.
 */
export const printsCatalog: PrintDesign[] = [
  { id: "sabar-ka-phal", name: "Sabar Ka Phal", thumbnail: "/designs/sabar-ka-phal.png" },
  { id: "sukoon", name: "Sukoon", thumbnail: "/designs/sukoon.png" },
  { id: "scorpio-dark-energy", name: "Scorpio Dark Energy", thumbnail: "/designs/scorpio-dark-energy.png" },
  { id: "abba-nahi-maan-rahe", name: "Abba Nahi Maan Rahe", thumbnail: "/designs/abba-nahi-maan-rahe.png" },
];
