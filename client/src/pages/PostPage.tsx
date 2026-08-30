import { useLocation, useParams } from 'wouter';
import { ArrowLeft, Calendar, Facebook, Share2 } from 'lucide-react';
import { SiWhatsapp, SiX } from 'react-icons/si';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import CategoryBadge from '@/components/CategoryBadge';
import TagPill from '@/components/TagPill';
import ContentCard from '@/components/ContentCard';
import { getPostById, getPostsByCategory } from '@/lib/content';
import { CATEGORIES as categories } from '@/lib/categories';

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const postId = params.id ?? '';

  const post = getPostById(postId);

  const handleSearch = (query: string) => {
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleTagClick = (tag: string) => {
    setLocation(`/tag/${encodeURIComponent(tag)}`);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title ?? '';
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
        break;
    }
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background" style={{ paddingTop: 'var(--header-height, 200px)' }}>
        <Header categories={categories} onSearch={handleSearch} />
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Button onClick={() => setLocation('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const relatedPosts = getPostsByCategory(post.category)
    .filter((p) => p.id !== post.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 'var(--header-height, 200px)' }}>
      <Header categories={categories} onSearch={handleSearch} />

      <article className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <Button
          variant="ghost"
          onClick={() => setLocation(`/category/${post.category}`)}
          className="mb-8"
          data-testid="button-back-category"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {post.categoryLabel}
        </Button>

        <div className="mb-6">
          <CategoryBadge category={post.category} categoryLabel={post.categoryLabel} />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight" data-testid="post-title">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-muted-foreground">
          <div className="flex items-center gap-2" data-testid="post-date">
            <Calendar className="w-4 h-4" />
            {new Date(post.date).toLocaleDateString('mr-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2" data-testid="post-tags">
              {post.tags.map((tag) => (
                <TagPill key={tag} tag={tag} onClick={handleTagClick} />
              ))}
            </div>
          )}
        </div>

        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full max-h-[500px] object-cover rounded-lg mb-8"
            data-testid="post-image"
          />
        )}

        <div
          className="prose prose-lg max-w-none mb-12 leading-relaxed [&>p]:mb-5 [&>h1]:font-serif [&>h2]:font-serif [&>h3]:font-serif"
          data-testid="post-content"
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <Card className="p-6 mb-12">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share this post
          </h3>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" onClick={() => handleShare('facebook')} data-testid="button-share-facebook">
              <Facebook className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShare('twitter')} data-testid="button-share-twitter">
              <SiX className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShare('whatsapp')} data-testid="button-share-whatsapp">
              <SiWhatsapp className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6" data-testid="related-posts-heading">
              More from {post.categoryLabel}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((related) => (
                <ContentCard key={related.id} {...related} onTagClick={handleTagClick} />
              ))}
            </div>
          </div>
        )}
      </article>

      <footer className="bg-muted/30 border-t py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <p className="text-muted-foreground">
            © 2025 प्राजक्तप्रभा. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
