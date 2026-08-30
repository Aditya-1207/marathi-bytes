import { load as parseYaml } from 'js-yaml';
import { getCategory } from './categories';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryLabel: string;
  date: string;
  thumbnail: string;
  tags: string[];
}

export interface CategoryFiles {
  category: string;
  /** Map of file path -> raw markdown-with-frontmatter contents. */
  files: Record<string, string>;
}

/**
 * Content and the CMS author root-relative paths (e.g. "/blog-images/x.png"),
 * but the production build is served from a subpath, so root-relative paths
 * must be rebased onto it. `baseUrl` is passed in rather than read from
 * `import.meta.env` so this stays callable from plain Node build scripts
 * (the prerender and RSS generators), which have no Vite runtime.
 */
export function resolveAssetPath(assetPath: string, baseUrl: string): string {
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(assetPath)) return assetPath; // absolute URL
  return baseUrl.replace(/\/$/, '') + '/' + assetPath.replace(/^\//, '');
}

export function parseFrontmatter(raw: string): { data: Record<string, string | string[]>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw.trim() };

  const parsed = parseYaml(match[1]);
  const data: Record<string, string | string[]> = {};
  if (parsed && typeof parsed === 'object') {
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        data[key] = value.map((v) => String(v));
      } else if (value !== null && value !== undefined) {
        data[key] = value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
      }
    }
  }

  return { data, content: match[2].trim() };
}

/**
 * Parses every post out of `allFiles` into sorted `Post[]`. Kept independent
 * of *how* the files were read (Vite's `import.meta.glob` in the browser
 * build, `fs.readdirSync` in the Node build scripts) so both share exactly
 * one implementation of frontmatter parsing, excerpt derivation, and
 * thumbnail resolution — the same category of drift Phase 3 eliminated for
 * category labels is just as possible here between the site and its RSS
 * feed/share-preview generator if they parsed posts independently.
 */
export function parsePosts(allFiles: CategoryFiles[], baseUrl: string): Post[] {
  const posts: Post[] = [];

  for (const { category, files } of allFiles) {
    for (const [path, raw] of Object.entries(files)) {
      // Vite's `import.meta.glob` keys are always forward-slash, but the
      // Node build scripts build real OS paths — backslash on Windows. Split
      // on either so `id` comes out as just the filename in both.
      const filename = path.split(/[/\\]/).pop() ?? '';
      const id = filename.replace(/\.md$/, '');

      // Skip placeholder README
      if (id.toLowerCase() === 'readme') continue;

      const { data, content } = parseFrontmatter(raw);

      // Whichever source it comes from (explicit frontmatter, or sliced from
      // the raw body), collapse newlines/runs of whitespace to single spaces.
      // Without this, a post with no frontmatter excerpt carries the
      // markdown body's hard line breaks straight into the fallback — fine
      // in a CSS-wrapped card, but landing literally inside a meta tag's
      // `content="..."` attribute for a share preview.
      const rawExcerpt =
        typeof data.excerpt === 'string' && data.excerpt
          ? data.excerpt
          : content.replace(/[#*_`>]/g, '').slice(0, 160).trimEnd() + '…';
      const excerpt = rawExcerpt.replace(/\s+/g, ' ').trim();

      posts.push({
        id,
        title: typeof data.title === 'string' ? data.title : id,
        excerpt,
        content,
        category,
        categoryLabel: getCategory(category)?.label ?? category,
        date: typeof data.date === 'string' ? data.date : '2025-01-01',
        thumbnail: resolveAssetPath(
          typeof data.thumbnail === 'string' && data.thumbnail
            ? data.thumbnail
            : (getCategory(category)?.defaultThumbnail ?? ''),
          baseUrl,
        ),
        tags: Array.isArray(data.tags) ? data.tags : [],
      });
    }
  }

  // Latest first
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
