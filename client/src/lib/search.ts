import { getAllPosts, type Post } from './content';
import { devanagariToLatin } from './transliterate';

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

interface SearchIndexEntry {
  post: Post;
  /** Normalized original text plus its transliteration, concatenated once. */
  haystack: string;
}

// A handful of manually-created posts have hand-typed Latin filenames
// (aai.md, premaachi-bhavna.md, …) from before the CMS existed, but every
// post published through Decap gets its slug from `{{slug}}` in
// config.yml — generated straight from the Devanagari title, with no
// transliteration. So the slug, the title, the tags, and the body of a real
// post are *entirely* Devanagari; there is no Latin text in it for a plain
// substring search to match against no matter which fields are included.
// `devanagariToLatin` derives one, so a reader who types "bhet" can still
// find a post titled "भेट" — this is what makes search work for content
// added after this file was written, not just the four legacy posts.
//
// Built once and reused across every keystroke: `getAllPosts()` re-parses
// every markdown file on each call (see content.ts), and transliteration adds
// its own per-post cost — neither should redo work while a reader is typing.
let searchIndex: SearchIndexEntry[] | null = null;

function getSearchIndex(): SearchIndexEntry[] {
  if (searchIndex) return searchIndex;

  searchIndex = getAllPosts().map((post) => {
    const raw = [
      post.title,
      post.excerpt,
      post.content,
      post.categoryLabel,
      post.category,
      post.id,
      ...post.tags,
    ].join('\n');

    return {
      post,
      haystack: normalizeText(`${raw}\n${devanagariToLatin(raw)}`),
    };
  });

  return searchIndex;
}

/**
 * Substring match across everything a reader would reasonably expect to
 * search: the title, the excerpt, the body, the category, the tags — in both
 * their original script and a phonetic Latin transliteration.
 */
export function searchPosts(query: string): Post[] {
  const needle = normalizeText(query.trim());
  if (!needle) return [];

  return getSearchIndex()
    .filter((entry) => entry.haystack.includes(needle))
    .map((entry) => entry.post);
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
