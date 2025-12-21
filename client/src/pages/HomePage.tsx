import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import ContentCard from '@/components/ContentCard';
import AboutSection from '@/components/AboutSection';
import SocialMediaSection from '@/components/SocialMediaSection';
import heroImage from '@assets/generated_images/dance_performance_hero_image.png';
import poetryImage from '@assets/generated_images/poetry_calligraphy_thumbnail.png';
import cultureImage from '@assets/generated_images/cultural_celebration_thumbnail.png';
import profileImage from '@assets/generated_images/about_section_portrait.png';
import articlesImage from '@assets/generated_images/articles_nature_thumbnail.png';
import ukhaneImage from '@assets/generated_images/ukhane_wedding_thumbnail.png';

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [visibleCount, setVisibleCount] = useState(10);

  const categories = [
    { id: 'poetry', name: 'Poetry', label: 'काव्य-संग्रह' },
    { id: 'articles', name: 'Articles', label: 'आठवणींचा ठेवा' },
    { id: 'ukhane', name: 'Ukhane', label: 'उखाणे' },
  ];

  const carouselSlides = [
    {
      image: heroImage,
      caption: 'नृत्य - माझे जीवन (Dance - My Life)',
      instagramLink: 'https://instagram.com/p/example1',
    },
    {
      image: poetryImage,
      caption: 'शब्दांच्या माळा (Garland of Words)',
      instagramLink: 'https://instagram.com/p/example2',
    },
    {
      image: cultureImage,
      caption: 'संस्कृतीचा रंग (Colors of Culture)',
      instagramLink: 'https://instagram.com/p/example3',
    },
  ];

  const mockContent = [
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
      id: 'ukhane1',
      title: 'लग्नाचे उखाणे',
      excerpt: 'पारंपरिक मराठी लग्नातील उखाणे खूप महत्त्वाची असतात. ही उखाणे वधू-वर आणि त्यांच्या कुटुंबीयांसाठी आशीर्वाद आणि शुभेच्छा व्यक्त करतात...',
      category: 'ukhane',
      categoryLabel: 'उखाणे',
      date: '2025-11-15',
      thumbnail: ukhaneImage,
      tags: ['लग्न', 'परंपरा', 'उखाणे'],
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
      id: 'poem3',
      title: 'आई',
      excerpt: 'आईचं प्रेम अतुलनीय आहे. तिच्या ममतेत आणि काळजीत आपलं संपूर्ण जग वसलेलं असतं...',
      category: 'poetry',
      categoryLabel: 'काव्य-संग्रह',
      date: '2025-11-08',
      thumbnail: poetryImage,
      tags: ['आई', 'प्रेम', 'कुटुंब'],
    },
  ];

  const visibleContent = mockContent.slice(0, visibleCount);
  const hasMore = visibleCount < mockContent.length;

  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag);
    setLocation(`/tag/${encodeURIComponent(tag)}`);
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, mockContent.length));
    console.log('Load more clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} onSearch={handleSearch} />

      <main>
        <section className="max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-8" data-testid="latest-content-heading">
            Latest Content
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="content-grid">
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
                data-testid="button-load-more"
              >
                View More...
              </Button>
            </div>
          )}
        </section>

        <AboutSection
          image={profileImage}
          bioMarathi="मी प्राजक्तप्रभा. लेखन, नृत्य आणि गायन हे माझे आवडते छंद आहेत. मी माझ्या कवितांमधून जीवनातील विविध भावना व्यक्त करते. नृत्य माझ्या जीवनाचा एक महत्त्वाचा भाग आहे. माझ्या ब्लॉगवर तुम्हाला कविता, लेख आणि उखाणे वाचायला मिळतील."
          bioEnglish="I'm Prajakta Prabha. Writing, dancing, and singing are my favorite hobbies. Through my poetry, I express various emotions of life. Dance is an important part of my life. On my blog, you'll find poetry, articles, and traditional Marathi verses."
          onContact={() => window.location.href = 'mailto:contact@example.com'}
        />

        <SocialMediaSection />

        <section className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
          <HeroCarousel slides={carouselSlides} />
        </section>
      </main>

      <footer className="bg-muted/30 border-t py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <p className="text-muted-foreground" data-testid="footer-text">
            © 2025 प्राजक्तप्रभा. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
