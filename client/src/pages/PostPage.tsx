import { useLocation, useParams } from 'wouter';
import { ArrowLeft, Calendar, Clock, Facebook, Share2 } from 'lucide-react';
import { SiWhatsapp, SiX } from 'react-icons/si';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import CategoryBadge from '@/components/CategoryBadge';
import TagPill from '@/components/TagPill';
import ContentCard from '@/components/ContentCard';
import LatestPosts from '@/components/LatestPosts';
import SiteFooter from '@/components/SiteFooter';
import { getPostById, getPostsByCategory } from '@/lib/content';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { postUrl } from '@/lib/seo';
import { estimateReadingTime } from '@/lib/reading-time';

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const postId = params.id ?? '';

  const post = getPostById(postId);

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

  useDocumentMeta({
    title: post?.title ?? 'Post Not Found',
    description: post?.excerpt ?? 'This post could not be found.',
    image: post?.thumbnail,
    type: post ? 'article' : 'website',
    publishedTime: post ? new Date(post.date).toISOString() : undefined,
    url: post ? postUrl(post.id) : undefined,
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-background" style={{ paddingTop: 'var(--header-height, 200px)' }}>
        <Header />
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

  const readingTime = estimateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 'var(--header-height, 200px)' }}>
      <Header />

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
          <div className="flex items-center gap-2" data-testid="post-reading-time">
            <Clock className="w-4 h-4" />
            {readingTime} मिनिट वाचन
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2" data-testid="post-tags">
              {post.tags.map((tag) => (
                <TagPill key={tag} tag={tag} />
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
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6" data-testid="related-posts-heading">
              More from {post.categoryLabel}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((related) => (
                <ContentCard key={related.id} {...related} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6" data-testid="latest-posts-heading">
            ताज्या पोस्ट्स (Latest Everywhere)
          </h2>
          <LatestPosts excludeId={post.id} />
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
