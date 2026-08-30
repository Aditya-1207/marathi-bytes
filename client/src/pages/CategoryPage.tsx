import { useLocation, useParams } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import PostGrid from '@/components/PostGrid';
import SiteFooter from '@/components/SiteFooter';
import { getPostsByCategory } from '@/lib/content';
import { CATEGORIES as categories } from '@/lib/categories';

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const [, setLocation] = useLocation();

  const categoryId = params.category ?? '';
  const currentCategory = categories.find((c) => c.id === categoryId);

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background" style={{ paddingTop: 'var(--header-height, 200px)' }}>
        <Header />
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => setLocation('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const allCategoryPosts = getPostsByCategory(categoryId);

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 'var(--header-height, 200px)' }}>
      <Header />

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

        <PostGrid
          posts={allCategoryPosts}
          resetKey={categoryId}
          gridTestId="category-content-grid"
          emptyState={
            <>
              <p className="text-lg text-muted-foreground">No posts found in this category yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add a <code>.md</code> file to <code>client/src/content/{categoryId}/</code> to get started.
              </p>
            </>
          }
        />
      </main>

      <SiteFooter className="mt-16" />
    </div>
  );
}
