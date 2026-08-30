/**
 * A naive Latin-oriented word-count regex (`\w+`, or anything relying on
 * `\b` word boundaries) silently returns near-zero for Devanagari text —
 * `\w` in JS only matches `[A-Za-z0-9_]`. Marathi (like most Indic scripts
 * written with spaces) is whitespace-delimited, so a plain split already
 * counts it correctly; `Intl.Segmenter`'s word segmentation does the same
 * job without relying on that whitespace convention holding everywhere
 * (compound punctuation, the Devanagari danda "।", …), with a manual
 * whitespace-split fallback for a browser old enough to lack it.
 */
function countWords(text: string): number {
  const stripped = text.replace(/[#*_`>~[\]()]/g, ' ').trim();
  if (!stripped) return 0;

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('mr', { granularity: 'word' });
    return Array.from(segmenter.segment(stripped)).filter((s) => s.isWordLike).length;
  }

  return stripped.split(/\s+/).filter(Boolean).length;
}

/**
 * Minutes to read `text`, rounded up to at least 1 so a short poem never
 * shows "0 min read". 150 words/minute is a commonly-cited average adult
 * reading speed; treated as an approximation, not a precise figure — there
 * is no authoritative Marathi-specific reading-speed benchmark to use instead.
 */
export function estimateReadingTime(text: string, wordsPerMinute = 150): number {
  const words = countWords(text);
  return Math.max(1, Math.round(words / wordsPerMinute));
}
