import { PrintItem } from "./types";

/**
 * Add new designs here — each entry just needs an id, name, category,
 * price, image path, and description. Drop the artwork in /public/ at
 * the path referenced by `image`. Nothing else in the app needs to
 * change to support a new print or a new category: the catalog UI
 * derives its category tabs from whatever categories show up here.
 */
export const printsCatalog: PrintItem[] = [
  {
    id: "sabar-ka-phal",
    name: "Sabar Ka Phal",
    category: "Mindset & Stoic",
    price: 300,
    image: "/sabar-ka-phal.png",
    description: "For the ones playing the long game quietly.",
  },
  {
    id: "sukoon",
    name: "Sukoon",
    category: "Mindset & Stoic",
    price: 300,
    image: "/sukoon.png",
    description: "Inner peace amidst urban chaos.",
  },
  {
    id: "scorpio-dark-energy",
    name: "Scorpio Dark Energy",
    category: "Dark & Edgy",
    price: 400,
    image: "/scorpio-dark-energy.png",
    description: "Unyielding nocturnal intensity.",
  },
  {
    id: "abba-nahi-maan-rahe",
    name: "Abba Nahi Maan Rahe",
    category: "Desi Humor",
    price: 300,
    image: "/abba-nahi-maan-rahe.png",
    description: "The eternal household struggle.",
  },
];
