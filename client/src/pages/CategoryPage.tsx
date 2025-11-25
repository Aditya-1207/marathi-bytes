import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import poetryImage from '@assets/generated_images/poetry_calligraphy_thumbnail.png';
import articlesImage from '@assets/generated_images/articles_nature_thumbnail.png';
import ukhaneImage from '@assets/generated_images/ukhane_wedding_thumbnail.png';
import cultureImage from '@assets/generated_images/cultural_celebration_thumbnail.png';
import heroImage from '@assets/generated_images/dance_performance_hero_image.png';

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const [, setLocation] = useLocation();
  const [visibleCount, setVisibleCount] = useState(10);

  const categoryId = params.category || '';

  const categories = [
    { id: 'poetry', name: 'Poetry', label: 'काव्य-संग्रह' },
    { id: 'articles', name: 'Articles', label: 'आठवणींचा ठेवा' },
    { id: 'ukhane', name: 'Ukhane', label: 'उखाणे' },
  ];

  const currentCategory = categories.find((c) => c.id === categoryId);

  const allContent = [
    {
      id: 'poem1',
      title: 'प्रेमाची भावना',
      excerpt: 'प्रेमाची भावना अनोखी असते. ती मनाला स्पर्श करते आणि जीवनाला अर्थ देते. या कवितेत प्रेमाच्या विविध रंगांचे वर्णन केले आहे...',
      category: 'poetry',
      categoryLabel: 'काव्य-संग्रह',
      date: '2025-11-20',
      thumbnail: poetryImage,
      tags: ['प्रेम', 'भावना', 'जीवन'],
    },
    {
      id: 'poem2',
      title: 'निसर्गाचे सौंदर्य',
      excerpt: 'पावसाळ्यातील हिरवळ, पक्ष्यांचे किलबिल, आणि फुलांचे सौंदर्य - निसर्ग नेहमीच आपल्याला आनंदित करतो...',
      category: 'poetry',
      categoryLabel: 'काव्य-संग्रह',
      date: '2025-11-12',
      thumbnail: cultureImage,
      tags: ['निसर्ग', 'सौंदर्य', 'पाऊस'],
    },
    {
      id: 'poem3',
      title: 'आई',
      excerpt: 'आईचं प्रेम अतुलनीय आहे. तिच्या ममतेत आणि काळजीत आपलं संपूर्ण जग वसलेलं असतं...',
      category: 'poetry',
      categoryLabel: 'काव्य-संग्रह',
      date: '2025-11-08',
      thumbnail: poetryImage,
      tags: ['आई', 'प्रेम', 'कुटुंब'],
    },
    {
      id: 'article1',
      title: 'आठवणींचा ठेवा',
      excerpt: 'बालपणाच्या आठवणी नेहमीच गोड असतात. गावातील मस्ती, शाळेतील मित्र, आणि आजीच्या गोष्टी - हे सगळं मनात कायमचं राहतं...',
      category: 'articles',
      categoryLabel: 'आठवणींचा ठेवा',
      date: '2025-11-18',
      thumbnail: articlesImage,
      tags: ['आठवणी', 'बालपण', 'गाव'],
    },
    {
      id: 'article2',
      title: 'नृत्याचा प्रवास',
      excerpt: 'माझा नृत्याचा प्रवास लहानपणापासून सुरू झाला. शास्त्रीय नृत्य शिकताना आलेले अनुभव आणि आव्हाने...',
      category: 'articles',
      categoryLabel: 'आठवणींचा ठेवा',
      date: '2025-11-10',
      thumbnail: heroImage,
      tags: ['नृत्य', 'कला', 'प्रवास'],
    },
    {
      id: 'ukhane1',
      title: 'लग्नाचे उखाणे',
      excerpt: 'पारंपरिक मराठी लग्नातील उखाणे खूप महत्त्वाची असतात. ही उखाणे वधू-वर आणि त्यांच्या कुटुंबीयांसाठी आशीर्वाद आणि शुभेच्छा व्यक्त करतात...',
      category: 'ukhane',
      categoryLabel: 'उखाणे',
      date: '2025-11-15',
      thumbnail: ukhaneImage,
      tags: ['लग्न', 'परंपरा', 'उखाणे'],
    },
  ];

  const categoryContent = allContent.filter((c) => c.category === categoryId);
  const visibleContent = categoryContent.slice(0, visibleCount);
  const hasMore = visibleCount < categoryContent.length;

  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag);
    setLocation(`/tag/${encodeURIComponent(tag)}`);
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, categoryContent.length));
    console.log('Load more clicked');
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Header categories={categories} onSearch={handleSearch} />
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => setLocation('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
            {categoryContent.length} {categoryContent.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        {categoryContent.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No posts found in this category yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="category-content-grid">
              {visibleContent.map((content) => (
                <ContentCard
                  key={content.id}
                  {...content}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button 
                  onClick={loadMore} 
                  size="lg"
                  className="px-8"
                  data-testid="button-category-load-more"
                >
                  View More...
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
