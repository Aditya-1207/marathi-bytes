import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import ContentCard from '@/components/ContentCard';
import AboutSection from '@/components/AboutSection';
import SocialMediaSection from '@/components/SocialMediaSection';
import { getAllPosts, getPaginatedPosts } from '@/lib/content';
import { NAV_CATEGORIES as categories } from '@/lib/categories';
import heroImage from '@assets/generated_images/dance_performance_hero_image.png';
import poetryImage from '@assets/generated_images/poetry_calligraphy_thumbnail.png';
import cultureImage from '@assets/generated_images/cultural_celebration_thumbnail.png';
import profileImage from '@assets/generated_images/about_section_portrait.png';

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

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);

  const allPosts = getAllPosts();
  const { items, currentPage, totalPages } = getPaginatedPosts(allPosts, page);

  const handleTagClick = (tag: string) => {
    setLocation(`/tag/${encodeURIComponent(tag)}`);
  };

  const handleSearch = (query: string) => {
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 'var(--header-height, 200px)' }}>
      <Header categories={categories} onSearch={handleSearch} />

      <main>
        <section className="max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-8" data-testid="latest-content-heading">
            Latest Content
          </h2>

          {items.length === 0 ? (
            <p className="text-muted-foreground text-lg">No posts yet. Add a .md file to the content folder to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="content-grid">
              {items.map((post) => (
                <ContentCard
                  key={post.id}
                  {...post}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          )}

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
