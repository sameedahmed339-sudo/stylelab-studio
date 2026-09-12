import { PrintCategory, PrintItem, ZodiacSignId } from "./types";

export type ZodiacElement = "Fire" | "Earth" | "Air" | "Water";

export interface ZodiacSign {
  id: ZodiacSignId;
  symbol: string;
  element: ZodiacElement;
  dateRange: string;
  traits: string;
  /** Category this sign's personality maps to most strongly. */
  primaryCategory: PrintCategory;
  /** Secondary affinity, used as a lighter scoring bonus. */
  secondaryCategory: PrintCategory;
}

/**
 * All 12 signs, grouped by element, each with a primary + secondary
 * print-category affinity. These affinities are an editorial judgment
 * call (classic trait language mapped onto the 4 catalog vibes) rather
 * than a rigid element→category formula — e.g. Scorpio (a water sign)
 * still maps to "Dark & Edgy" because that's the sign's actual
 * personality archetype, matching the existing "Scorpio Dark Energy"
 * print. Adjust freely; nothing else in the app depends on these exact
 * choices.
 */
export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: "Aries", symbol: "♈", element: "Fire", dateRange: "Mar 21 – Apr 19", traits: "Bold, competitive, first to move", primaryCategory: "Dark & Edgy", secondaryCategory: "Mindset & Stoic" },
  { id: "Taurus", symbol: "♉", element: "Earth", dateRange: "Apr 20 – May 20", traits: "Grounded, stubborn, loves comfort", primaryCategory: "Mindset & Stoic", secondaryCategory: "Minimalist" },
  { id: "Gemini", symbol: "♊", element: "Air", dateRange: "May 21 – Jun 20", traits: "Witty, social, dual nature", primaryCategory: "Desi Humor", secondaryCategory: "Minimalist" },
  { id: "Cancer", symbol: "♋", element: "Water", dateRange: "Jun 21 – Jul 22", traits: "Emotional, nurturing, home-loving", primaryCategory: "Minimalist", secondaryCategory: "Mindset & Stoic" },
  { id: "Leo", symbol: "♌", element: "Fire", dateRange: "Jul 23 – Aug 22", traits: "Dramatic, confident, center of attention", primaryCategory: "Dark & Edgy", secondaryCategory: "Desi Humor" },
  { id: "Virgo", symbol: "♍", element: "Earth", dateRange: "Aug 23 – Sep 22", traits: "Analytical, perfectionist, disciplined", primaryCategory: "Mindset & Stoic", secondaryCategory: "Minimalist" },
  { id: "Libra", symbol: "♎", element: "Air", dateRange: "Sep 23 – Oct 22", traits: "Charming, social, allergic to conflict", primaryCategory: "Desi Humor", secondaryCategory: "Minimalist" },
  { id: "Scorpio", symbol: "♏", element: "Water", dateRange: "Oct 23 – Nov 21", traits: "Intense, mysterious, magnetic", primaryCategory: "Dark & Edgy", secondaryCategory: "Mindset & Stoic" },
  { id: "Sagittarius", symbol: "♐", element: "Fire", dateRange: "Nov 22 – Dec 21", traits: "Adventurous, blunt, philosophical", primaryCategory: "Dark & Edgy", secondaryCategory: "Desi Humor" },
  { id: "Capricorn", symbol: "♑", element: "Earth", dateRange: "Dec 22 – Jan 19", traits: "Ambitious, patient, disciplined", primaryCategory: "Mindset & Stoic", secondaryCategory: "Minimalist" },
  { id: "Aquarius", symbol: "♒", element: "Air", dateRange: "Jan 20 – Feb 18", traits: "Quirky, independent, rebellious thinker", primaryCategory: "Desi Humor", secondaryCategory: "Dark & Edgy" },
  { id: "Pisces", symbol: "♓", element: "Water", dateRange: "Feb 19 – Mar 20", traits: "Dreamy, artistic, quietly deep", primaryCategory: "Minimalist", secondaryCategory: "Mindset & Stoic" },
];

export const ELEMENT_GROUPS: { element: ZodiacElement; signs: ZodiacSignId[] }[] = [
  { element: "Fire", signs: ["Aries", "Leo", "Sagittarius"] },
  { element: "Earth", signs: ["Taurus", "Virgo", "Capricorn"] },
  { element: "Air", signs: ["Gemini", "Libra", "Aquarius"] },
  { element: "Water", signs: ["Cancer", "Scorpio", "Pisces"] },
];

export function getSign(id: ZodiacSignId): ZodiacSign {
  const sign = ZODIAC_SIGNS.find((s) => s.id === id);
  if (!sign) throw new Error(`Unknown zodiac sign: ${id}`);
  return sign;
}

export interface QuizAnswers {
  sign: ZodiacSignId;
  energyCategory: PrintCategory;
  feelCategory: PrintCategory;
}

export interface ZodiacMatchResult {
  sign: ZodiacSign;
  recommendedCategory: PrintCategory;
  scoredPrints: { print: PrintItem; score: number }[];
  topPrintIds: string[];
}

/**
 * Scores every catalog print against the quiz answers and returns the
 * ranked list plus a headline "recommendedCategory" the catalog UI can
 * auto-switch its tab to. Direct sign tags (e.g. a design literally
 * themed around Scorpio) outweigh category-level affinity, which in
 * turn outweighs the two follow-up mindset questions.
 */
export function matchZodiacToPrints(answers: QuizAnswers, catalog: PrintItem[]): ZodiacMatchResult {
  const sign = getSign(answers.sign);

  const scoredPrints = catalog
    .map((print) => {
      let score = 0;
      if (print.zodiacSigns?.includes(sign.id)) score += 5;
      if (print.category === sign.primaryCategory) score += 3;
      if (print.category === sign.secondaryCategory) score += 1;
      if (print.category === answers.energyCategory) score += 2;
      if (print.category === answers.feelCategory) score += 2;
      return { print, score };
    })
    .sort((a, b) => b.score - a.score);

  const topPrintIds = scoredPrints.filter((p) => p.score > 0).slice(0, 3).map((p) => p.print.id);

  return {
    sign,
    recommendedCategory: sign.primaryCategory,
    scoredPrints,
    topPrintIds,
  };
}
