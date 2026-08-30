import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import PostGrid from '@/components/PostGrid';
import AboutSection from '@/components/AboutSection';
import SocialMediaSection from '@/components/SocialMediaSection';
import SiteFooter from '@/components/SiteFooter';
import { getAllPosts } from '@/lib/content';
import heroImage from '@assets/generated_images/dance_performance_hero_image.png';
import poetryImage from '@assets/generated_images/poetry_calligraphy_thumbnail.png';
import cultureImage from '@assets/generated_images/cultural_celebration_thumbnail.png';
import profileImage from '@assets/generated_images/about_section_portrait.png';

// Visual-only hero imagery. These slides previously carried "View on Instagram"
// links to placeholder post URLs that did not exist; the links are gone rather
// than pointing readers at a 404. See spec.md Phase 3.
const carouselSlides = [
  {
    image: heroImage,
    caption: 'नृत्य - माझे जीवन (Dance - My Life)',
  },
  {
    image: poetryImage,
    caption: 'शब्दांच्या माळा (Garland of Words)',
  },
  {
    image: cultureImage,
    caption: 'संस्कृतीचा रंग (Colors of Culture)',
  },
];

export default function HomePage() {
  const allPosts = getAllPosts();

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 'var(--header-height, 200px)' }}>
      <Header />

      <main>
        <section className="max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-8" data-testid="latest-content-heading">
            Latest Content
          </h2>

          <PostGrid
            posts={allPosts}
            emptyState={
              <p className="text-muted-foreground text-lg">
                No posts yet. Add a .md file to the content folder to get started.
              </p>
            }
          />
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

      <SiteFooter />
    </div>
  );
}
