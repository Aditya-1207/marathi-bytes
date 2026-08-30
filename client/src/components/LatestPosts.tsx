import ContentCard from '@/components/ContentCard';
import { getAllPosts } from '@/lib/content';

interface LatestPostsProps {
  count?: number;
  /** Excludes a post from the strip — for showing this on the post's own page. */
  excludeId?: string;
}

/**
 * A compact, sitewide "what's newest" strip — reusable, unlike the
 * homepage's main feed (which is the full paginated archive, not a teaser).
 * Placed on PostPage: the existing "More from {category}" section there
 * only ever suggests same-category posts, so this is a genuinely different
 * discovery path (newest across every category), not a duplicate of it.
 */
export default function LatestPosts({ count = 2, excludeId }: LatestPostsProps) {
  const posts = getAllPosts()
    .filter((p) => p.id !== excludeId)
    .slice(0, count);

  if (posts.length === 0) return null;

  // Matches "More from {category}"'s grid exactly (client/src/pages/PostPage.tsx)
  // — same narrow max-w-3xl container, so a different column count here would
  // read as visually inconsistent on the one page this currently appears on.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="latest-posts">
      {posts.map((post) => (
        <ContentCard key={post.id} {...post} />
      ))}
    </div>
  );
}
