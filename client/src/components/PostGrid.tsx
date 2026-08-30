import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContentCard from '@/components/ContentCard';
import { getPaginatedPosts, type Post } from '@/lib/content';

interface PostGridProps {
  posts: Post[];
  /** Rendered instead of the grid when `posts` is empty. */
  emptyState: ReactNode;
  /**
   * Changing this resets pagination to page 1 — pass whatever identifies the
   * current list (the search query, the tag, the category id). Without it, a
   * reader on page 2 who searches for something new lands on a page 2 that may
   * not exist for the new results.
   */
  resetKey?: string;
  gridTestId?: string;
}

/**
 * The shared listing body used by the category, search, and tag pages: a
 * responsive card grid plus pagination, or an empty state.
 */
export default function PostGrid({
  posts,
  emptyState,
  resetKey = '',
  gridTestId = 'content-grid',
}: PostGridProps) {
  const [page, setPage] = useState(1);
  const { items, currentPage, totalPages } = getPaginatedPosts(posts, page);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const goToPage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (posts.length === 0) {
    return <div className="text-center py-16">{emptyState}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid={gridTestId}>
        {items.map((post) => (
          <ContentCard key={post.id} {...post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12" data-testid="pagination">
          <Button
            variant="outline"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground" data-testid="page-indicator">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            data-testid="button-next-page"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </>
  );
}
