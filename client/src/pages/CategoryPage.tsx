import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import { getPostsByCategory, getPaginatedPosts } from '@/lib/content';
import { CATEGORIES as categories } from '@/lib/categories';

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);

  const categoryId = params.category ?? '';
  const currentCategory = categories.find((c) => c.id === categoryId);

  const handleTagClick = (tag: string) => {
    setLocation(`/tag/${encodeURIComponent(tag)}`);
  };

  const handleSearch = (query: string) => {
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background" style={{ paddingTop: 'var(--header-height, 200px)' }}>
        <Header categories={categories} onSearch={handleSearch} />
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => setLocation('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const allCategoryPosts = getPostsByCategory(categoryId);
  const { items, currentPage, totalPages } = getPaginatedPosts(allCategoryPosts, page);

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 'var(--header-height, 200px)' }}>
      <Header categories={categories} onSearch={handleSearch} />

      <main className="max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-2" data-testid="category-heading">
            {currentCategory.label}
          </h1>
          <p className="text-muted-foreground" data-testid="category-count">
            {allCategoryPosts.length} {allCategoryPosts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        {allCategoryPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No posts found in this category yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add a <code>.md</code> file to <code>client/src/content/{categoryId}/</code> to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="category-content-grid">
              {items.map((post) => (
                <ContentCard key={post.id} {...post} onTagClick={handleTagClick} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12" data-testid="pagination">
                <Button
                  variant="outline"
                  onClick={() => { setPage((p) => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                  onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={currentPage === totalPages}
                  data-testid="button-next-page"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-muted/30 border-t py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <p className="text-muted-foreground">
            © 2025 प्राजक्तप्रभा. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
