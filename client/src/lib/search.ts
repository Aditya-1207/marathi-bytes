import { getAllPosts, type Post } from './content';

/**
 * Devanagari can encode the same visible grapheme more than one way
 * (precomposed vs. base letter + combining mark), and text arriving from the
 * CMS, a phone keyboard, and a desktop paste don't always agree on which.
 * Normalizing both sides to NFC is what makes a typed "भेट" match a stored
 * "भेट". `toLowerCase` is a no-op for Devanagari — the script is unicameral —
 * but still matters for the Latin titles and tags that sit alongside it.
 */
export function normalizeText(value: string): string {
  return value.normalize('NFC').toLowerCase();
}

/**
 * Percent-decode a route param. wouter runs `decodeURI` over the path, which
 * turns `%E0%A4%AD` back into `भ` but deliberately leaves reserved characters
 * (`%2F`, `%26`, …) encoded — this finishes the job for tags that contain one.
 */
export function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    // Malformed escape sequence (a bare `%` in the URL). Use it as it came in
    // rather than throwing a render error.
    return value;
  }
}

/**
 * Substring match across everything a reader would reasonably expect to search:
 * the title, the excerpt, the body, the category, and the tags. The whole corpus
 * is already in memory (see `content.ts`), so this stays a plain filter — no
 * index to build or keep in sync.
 *
 * The slug (`id`) and the Latin category id are searched alongside the
 * Devanagari label on purpose. Every post here is written in Devanagari, but
 * plenty of readers are on a phone with no Marathi keyboard — matching the
 * transliterated slug lets them find "प्रेमाची भावना" by typing "premaachi",
 * and the ukhane collection by typing "ukhane".
 */
export function searchPosts(query: string): Post[] {
  const needle = normalizeText(query.trim());
  if (!needle) return [];

  return getAllPosts().filter((post) => {
    const haystack = normalizeText(
      [
        post.title,
        post.excerpt,
        post.content,
        post.categoryLabel,
        post.category,
        post.id,
        ...post.tags,
      ].join('\n'),
    );
    return haystack.includes(needle);
  });
}

/** Posts carrying `tag`, compared normalized so casing and NFC/NFD don't split a tag in two. */
export function getPostsByTag(tag: string): Post[] {
  const needle = normalizeText(tag.trim());
  if (!needle) return [];

  return getAllPosts().filter((post) =>
    post.tags.some((postTag) => normalizeText(postTag.trim()) === needle),
  );
}

export interface TagSummary {
  /** The tag as authored, for display. */
  tag: string;
  count: number;
}

/**
 * Every tag in use, most-used first. Tags that differ only by case or Unicode
 * form collapse into one entry — the first spelling encountered wins for display.
 */
export function getAllTags(): TagSummary[] {
  const byNormalized = new Map<string, TagSummary>();

  for (const post of getAllPosts()) {
    for (const rawTag of post.tags) {
      const tag = rawTag.trim();
      if (!tag) continue;

      const key = normalizeText(tag);
      const existing = byNormalized.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        byNormalized.set(key, { tag, count: 1 });
      }
    }
  }

  return Array.from(byNormalized.values()).sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'mr'),
  );
}
