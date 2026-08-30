import { useLocation, useParams, Link } from 'wouter';
import { ArrowLeft, TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import PostGrid from '@/components/PostGrid';
import SiteFooter from '@/components/SiteFooter';
import TagPill from '@/components/TagPill';
import { getPostsByTag, getAllTags, decodeRouteParam } from '@/lib/search';
import { useDocumentMeta } from '@/hooks/use-document-meta';

export default function TagPage() {
  const params = useParams<{ tag: string }>();
  const [, setLocation] = useLocation();

  const tag = decodeRouteParam(params.tag ?? '').trim();
  const posts = getPostsByTag(tag);
  const allTags = getAllTags();

  useDocumentMeta({
    title: `#${tag}`,
    description: `"${tag}" टॅग असलेल्या ${posts.length} पोस्ट.`,
  });

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

          <h1
            className="text-4xl md:text-5xl font-bold font-serif mb-2 flex items-center gap-3"
            data-testid="tag-heading"
          >
            <TagIcon className="w-8 h-8 text-primary shrink-0" />
            {tag}
          </h1>
          <p className="text-muted-foreground" data-testid="tag-count">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        <PostGrid
          posts={posts}
          resetKey={tag}
          gridTestId="tag-content-grid"
          emptyState={
            <div data-testid="tag-empty">
              <p className="text-lg text-muted-foreground">
                No posts are tagged “{tag}”.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <Link href="/" className="underline hover:text-foreground">
                  Browse everything
                </Link>{' '}
                instead.
              </p>
              {allTags.length > 0 && (
                <>
                  <p className="text-sm text-muted-foreground mt-8 mb-4">Tags in use:</p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                    {allTags.map(({ tag: available }) => (
                      <TagPill key={available} tag={available} />
                    ))}
                  </div>
                </>
              )}
            </div>
          }
        />
      </main>

      <SiteFooter className="mt-16" />
    </div>
  );
}
