/**
 * Strips any HTML/script constructs from free-text user input (custom
 * print text, notes, etc). We never render this string with
 * dangerouslySetInnerHTML anywhere in the app, but we still sanitize at
 * the source so the same value is safe wherever it ends up — the tee
 * preview overlay, the WhatsApp message, or future persistence.
 */
export function sanitizeText(input: string, maxLength = 120): string {
  if (!input) return "";

  let clean = input
    // strip script/style blocks entirely, including their content
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    // strip any remaining tags
    .replace(/<\/?[^>]+(>|$)/g, "")
    // neutralize event-handler / javascript: patterns
    .replace(/on\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/javascript\s*:/gi, "")
    // collapse control characters
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();

  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }

  return clean;
}

/** Escapes text for safe inclusion inside a URL-encoded query string. */
export function encodeForUrl(input: string): string {
  return encodeURIComponent(input);
}

/**
 * Validates an uploaded design file client-side before it's ever used
 * for preview: type + size guardrails only, no execution of file
 * contents. Actual persistence/storage should re-validate server-side.
 */
export function isSafeImageFile(file: File, maxSizeBytes = 8 * 1024 * 1024): boolean {
  const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
  return allowed.includes(file.type) && file.size <= maxSizeBytes;
}
