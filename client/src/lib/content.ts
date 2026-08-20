import { load as parseYaml } from 'js-yaml';

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

const CATEGORY_LABELS: Record<string, string> = {
  poetry: 'काव्य-संग्रह',
  articles: 'आठवणींचा ठेवा',
  ukhane: 'उखाणे',
  instagram: 'Instagram',
};

const CATEGORY_DEFAULT_THUMBNAILS: Record<string, string> = {
  poetry: '/blog-images/poetry_calligraphy_thumbnail.png',
  articles: '/blog-images/articles_nature_thumbnail.png',
  ukhane: '/blog-images/ukhane_wedding_thumbnail.png',
  instagram: '/blog-images/cultural_celebration_thumbnail.png',
};

function parseFrontmatter(raw: string): { data: Record<string, string | string[]>; content: string } {
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

// Vite glob — patterns must be static strings
const poetryFiles = import.meta.glob('../content/poetry/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const articleFiles = import.meta.glob('../content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const ukhaneFiles = import.meta.glob('../content/ukhane/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const instagramFiles = import.meta.glob('../content/instagram/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const ALL_FILES: Array<{ category: string; files: Record<string, string> }> = [
  { category: 'poetry', files: poetryFiles },
  { category: 'articles', files: articleFiles },
  { category: 'ukhane', files: ukhaneFiles },
  { category: 'instagram', files: instagramFiles },
];

function buildPosts(): Post[] {
  const posts: Post[] = [];

  for (const { category, files } of ALL_FILES) {
    for (const [path, raw] of Object.entries(files)) {
      const filename = path.split('/').pop() ?? '';
      const id = filename.replace(/\.md$/, '');

      // Skip placeholder README
      if (id.toLowerCase() === 'readme') continue;

      const { data, content } = parseFrontmatter(raw);

      const excerpt =
        typeof data.excerpt === 'string' && data.excerpt
          ? data.excerpt
          : content.replace(/[#*_`>]/g, '').slice(0, 160).trimEnd() + '…';

      posts.push({
        id,
        title: typeof data.title === 'string' ? data.title : id,
        excerpt,
        content,
        category,
        categoryLabel: CATEGORY_LABELS[category] ?? category,
        date: typeof data.date === 'string' ? data.date : '2025-01-01',
        thumbnail:
          typeof data.thumbnail === 'string' && data.thumbnail
            ? data.thumbnail
            : (CATEGORY_DEFAULT_THUMBNAILS[category] ?? ''),
        tags: Array.isArray(data.tags) ? data.tags : [],
      });
    }
  }

  // Latest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export const POSTS_PER_PAGE = 10;

export function getAllPosts(): Post[] {
  return buildPosts();
}

export function getPostsByCategory(category: string): Post[] {
  return buildPosts().filter((p) => p.category === category);
}

export function getPostById(id: string): Post | undefined {
  return buildPosts().find((p) => p.id === id);
}

export function getPaginatedPosts(posts: Post[], page: number) {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * POSTS_PER_PAGE;
  return {
    items: posts.slice(start, start + POSTS_PER_PAGE),
    currentPage: safePage,
    totalPages,
    totalItems: posts.length,
  };
}
