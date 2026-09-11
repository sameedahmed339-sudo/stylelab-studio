export interface ZodiacProfile {
  sign: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  categoryMatch: string;
  description: string;
}

export const zodiacProfiles: ZodiacProfile[] = [
  { sign: 'Aries', element: 'Fire', categoryMatch: 'Dark & Edgy', description: 'Bold, driven, and unapologetically intense.' },
  { sign: 'Leo', element: 'Fire', categoryMatch: 'Dark & Edgy', description: 'Charismatic, fierce, and born to stand out.' },
  { sign: 'Sagittarius', element: 'Fire', categoryMatch: 'Mindset & Stoic', description: 'Adventurous wanderer seeking deeper truths.' },
  { sign: 'Taurus', element: 'Earth', categoryMatch: 'Mindset & Stoic', description: 'Unshakable patience and grounded focus.' },
  { sign: 'Virgo', element: 'Earth', categoryMatch: 'Minimalist', description: 'Detail-oriented perfectionist playing the long game.' },
  { sign: 'Capricorn', element: 'Earth', categoryMatch: 'Mindset & Stoic', description: 'Relentless hustler building an empire quietly.' },
  { sign: 'Gemini', element: 'Air', categoryMatch: 'Desi Humor', description: 'Witty, versatile, and effortlessly conversational.' },
  { sign: 'Libra', element: 'Air', categoryMatch: 'Minimalist', description: 'Seeking balance, aesthetics, and clean flows.' },
  { sign: 'Aquarius', element: 'Air', categoryMatch: 'Dark & Edgy', description: 'Visionary rebel breaking the conventional mold.' },
  { sign: 'Cancer', element: 'Water', categoryMatch: 'Mindset & Stoic', description: 'Deeply intuitive and protecting inner peace.' },
  { sign: 'Scorpio', element: 'Water', categoryMatch: 'Dark & Edgy', description: 'Magnetic nocturnal energy and unyielding focus.' },
  { sign: 'Pisces', element: 'Water', categoryMatch: 'Minimalist', description: 'Dreamy soul navigating the chaos with quiet calm.' },
];
