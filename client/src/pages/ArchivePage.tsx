import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import SiteFooter from '@/components/SiteFooter';
import { getAllPosts, type Post } from '@/lib/content';
import { useDocumentMeta } from '@/hooks/use-document-meta';

function groupByYear(posts: Post[]): Array<[string, Post[]]> {
  const byYear = new Map<string, Post[]>();
  for (const post of posts) {
    const year = String(new Date(post.date).getFullYear());
    const existing = byYear.get(year);
    if (existing) {
      existing.push(post);
    } else {
      byYear.set(year, [post]);
    }
  }
  // getAllPosts() is already newest-first, so years come out in the right
  // order (and posts within each year stay newest-first) just by iterating
  // insertion order — no separate sort needed.
  return Array.from(byYear.entries());
}

export default function ArchivePage() {
  const [, setLocation] = useLocation();
  const allPosts = getAllPosts();
  const years = groupByYear(allPosts);

  useDocumentMeta({
    title: 'संग्रह (Archive)',
    description: `प्राजक्तप्रभा वरील सर्व ${allPosts.length} लेखन, वर्षानुसार.`,
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

          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-2" data-testid="archive-heading">
            संग्रह (Archive)
          </h1>
          <p className="text-muted-foreground" data-testid="archive-count">
            {allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'}, by year
          </p>
        </div>

        {years.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Nothing published yet.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {years.map(([year, posts]) => (
              <section key={year} data-testid={`archive-year-${year}`}>
                <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6 pb-2 border-b">
                  {year}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.map((post) => (
                    <ContentCard key={post.id} {...post} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <SiteFooter className="mt-16" />
    </div>
  );
}
