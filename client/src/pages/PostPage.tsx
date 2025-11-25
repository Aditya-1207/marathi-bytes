import { useLocation, useParams } from 'wouter';
import { ArrowLeft, Calendar, Facebook, Share2 } from 'lucide-react';
import { SiWhatsapp, SiX } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import CategoryBadge from '@/components/CategoryBadge';
import TagPill from '@/components/TagPill';
import ContentCard from '@/components/ContentCard';
import poetryImage from '@assets/generated_images/poetry_calligraphy_thumbnail.png';
import articlesImage from '@assets/generated_images/articles_nature_thumbnail.png';
import ukhaneImage from '@assets/generated_images/ukhane_wedding_thumbnail.png';
import cultureImage from '@assets/generated_images/cultural_celebration_thumbnail.png';

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const postId = params.id || '';

  const categories = [
    { id: 'poetry', name: 'Poetry', label: 'काव्य-संग्रह' },
    { id: 'articles', name: 'Articles', label: 'आठवणींचा ठेवा' },
    { id: 'ukhane', name: 'Ukhane', label: 'उखाणे' },
  ];

  const allPosts = [
    {
      id: 'poem1',
      title: 'प्रेमाची भावना',
      excerpt: 'प्रेमाची भावना अनोखी असते...',
      content: `प्रेमाची भावना अनोखी असते। ती मनाला स्पर्श करते आणि जीवनाला अर्थ देते।

प्रेम हे केवळ एक भावना नाही, तर जीवनाचा अनुभव आहे। प्रेमात आपण स्वतःला विसरतो आणि दुसऱ्याच्या आनंदात आपला आनंद शोधतो।

या कवितेत प्रेमाच्या विविध रंगांचे वर्णन केले आहे - पहिल्या भेटीची चाहूल, मनातील उथळणारा उत्साह, आणि कायमच्या साथीचं स्वप्न।

प्रेम म्हणजे फक्त शब्दांत व्यक्त करता येत नाही. ते ह्रदयात अनुभवावं लागतं, जगावं लागतं।`,
      category: 'poetry',
      categoryLabel: 'काव्य-संग्रह',
      date: '2025-11-20',
      thumbnail: poetryImage,
      tags: ['प्रेम', 'भावना', 'जीवन'],
    },
    {
      id: 'article1',
      title: 'आठवणींचा ठेवा',
      excerpt: 'बालपणाच्या आठवणी नेहमीच गोड असतात...',
      content: `बालपणाच्या आठवणी नेहमीच गोड असतात। गावातील मस्ती, शाळेतील मित्र, आणि आजीच्या गोष्टी - हे सगळं मनात कायमचं राहतं।

मला आठवतं ते उन्हाळ्याच्या सुट्टीतले दिवस। आजीच्या गावी जाणं, तिथल्या मोकळ्या मैदानात खेळणं, आणि संध्याकाळी सगळे मिळून बसून गप्पा मारणं।

शाळेतील दिवस देखील खूप आनंददायक होते। मित्रांसोबत गंमत करणं, शिक्षकांच्या शिकवण्या, आणि सण-उत्सवातील उत्साह।

आज जरी आपण मोठे झालो, पण त्या आठवणी मात्र मनात ताज्या राहतात।`,
      category: 'articles',
      categoryLabel: 'आठवणींचा ठेवा',
      date: '2025-11-18',
      thumbnail: articlesImage,
      tags: ['आठवणी', 'बालपण', 'गाव'],
    },
    {
      id: 'ukhane1',
      title: 'लग्नाचे उखाणे',
      excerpt: 'पारंपरिक मराठी लग्नातील उखाणे खूप महत्त्वाची असतात...',
      content: `पारंपरिक मराठी लग्नातील उखाणे खूप महत्त्वाची असतात। ही उखाणे वधू-वर आणि त्यांच्या कुटुंबीयांसाठी आशीर्वाद आणि शुभेच्छा व्यक्त करतात।

उखाणे म्हणजे काव्यमय आशीर्वाद। प्रत्येक विधीत, प्रत्येक वेळी, विशिष्ट उखाणे म्हटली जातात।

हल्दीच्या विधीसाठी वेगळी उखाणे, मेहंदीसाठी वेगळी, आणि लग्नसमारंभासाठी वेगळी। प्रत्येक उखान्यात वधू-वराच्या सुखी जीवनाची कामना असते।

या परंपरा आपल्या संस्कृतीचा एक महत्त्वाचा भाग आहेत आणि त्या टिकवून ठेवणं आपलं कर्तव्य आहे।`,
      category: 'ukhane',
      categoryLabel: 'उखाणे',
      date: '2025-11-15',
      thumbnail: ukhaneImage,
      tags: ['लग्न', 'परंपरा', 'उखाणे'],
    },
  ];

  const post = allPosts.find((p) => p.id === postId);
  const relatedPosts = post
    ? allPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3)
    : [];

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag);
    setLocation(`/tag/${encodeURIComponent(tag)}`);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
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

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      console.log('Share:', platform);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header categories={categories} onSearch={handleSearch} />
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Button onClick={() => setLocation('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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

        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full max-h-[500px] object-cover rounded-lg mb-8"
          data-testid="post-image"
        />

        <div className="prose prose-lg max-w-none mb-12" data-testid="post-content">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6 leading-relaxed text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        <Card className="p-6 mb-12">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share this post
          </h3>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare('facebook')}
              data-testid="button-share-facebook"
            >
              <Facebook className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare('twitter')}
              data-testid="button-share-twitter"
            >
              <SiX className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare('whatsapp')}
              data-testid="button-share-whatsapp"
            >
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
              {relatedPosts.map((relatedPost) => (
                <ContentCard key={relatedPost.id} {...relatedPost} onTagClick={handleTagClick} />
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
