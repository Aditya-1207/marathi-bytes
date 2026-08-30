import { useLocation, useSearch, Link } from 'wouter';
import { ArrowLeft, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import PostGrid from '@/components/PostGrid';
import SiteFooter from '@/components/SiteFooter';
import TagPill from '@/components/TagPill';
import { searchPosts, getAllTags } from '@/lib/search';

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();

  const query = (new URLSearchParams(searchString).get('q') ?? '').trim();
  const results = searchPosts(query);
  const tags = getAllTags();

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

          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-2" data-testid="search-heading">
            {query ? <>शोध: “{query}”</> : 'शोध (Search)'}
          </h1>

          {query && (
            <p className="text-muted-foreground" data-testid="search-count">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>

        {!query ? (
          <div className="text-center py-16" data-testid="search-prompt">
            <p className="text-lg text-muted-foreground">
              Type in the search box above to find a poem, article, or ukhana.
            </p>
            {tags.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground mt-8 mb-4">Or browse by tag:</p>
                <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                  {tags.map(({ tag }) => (
                    <TagPill key={tag} tag={tag} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <PostGrid
            posts={results}
            resetKey={query}
            gridTestId="search-content-grid"
            emptyState={
              <div data-testid="search-empty">
                <SearchX className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  Nothing matched “{query}”.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try a shorter word, or{' '}
                  <Link href="/" className="underline hover:text-foreground">
                    browse everything
                  </Link>
                  .
                </p>
                {tags.length > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground mt-8 mb-4">Popular tags:</p>
                    <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                      {tags.slice(0, 12).map(({ tag }) => (
                        <TagPill key={tag} tag={tag} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            }
          />
        )}
      </main>

      <SiteFooter className="mt-16" />
    </div>
  );
}
