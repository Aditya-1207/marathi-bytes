import { parsePosts, type CategoryFiles, type Post } from './posts';

export type { Post };

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

const ALL_FILES: CategoryFiles[] = [
  { category: 'poetry', files: poetryFiles },
  { category: 'articles', files: articleFiles },
  { category: 'ukhane', files: ukhaneFiles },
];

export const POSTS_PER_PAGE = 10;

export function getAllPosts(): Post[] {
  return parsePosts(ALL_FILES, import.meta.env.BASE_URL);
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostById(id: string): Post | undefined {
  return getAllPosts().find((p) => p.id === id);
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
