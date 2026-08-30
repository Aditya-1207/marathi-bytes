import { Link } from 'wouter';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import PostGrid from '@/components/PostGrid';
import TagCloud from '@/components/TagCloud';
import AboutSection from '@/components/AboutSection';
import SocialMediaSection from '@/components/SocialMediaSection';
import SiteFooter from '@/components/SiteFooter';
import { getAllPosts } from '@/lib/content';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { resolveAssetPath } from '@/lib/posts';

// Visual-only hero imagery. These slides previously carried "View on Instagram"
// links to placeholder post URLs that did not exist; the links are gone rather
// than pointing readers at a 404. See spec.md Phase 3.
//
// These come from `/blog-images/` (via resolveAssetPath, same as post
// thumbnails) rather than a Vite asset import — Phase 6 moved them there so
// every image on the site lives in one place, gets compressed by the same
// build-time step, and there's nothing left importing `attached_assets/`.
const carouselSlides = [
  {
    image: resolveAssetPath('/blog-images/dance_performance_hero_image.png', import.meta.env.BASE_URL),
    caption: 'नृत्य - माझे जीवन (Dance - My Life)',
  },
  {
    image: resolveAssetPath('/blog-images/poetry_calligraphy_thumbnail.png', import.meta.env.BASE_URL),
    caption: 'शब्दांच्या माळा (Garland of Words)',
  },
  {
    image: resolveAssetPath('/blog-images/cultural_celebration_thumbnail.png', import.meta.env.BASE_URL),
    caption: 'संस्कृतीचा रंग (Colors of Culture)',
  },
];

const profileImage = resolveAssetPath('/blog-images/about_section_portrait.png', import.meta.env.BASE_URL);

export default function HomePage() {
  const allPosts = getAllPosts();

  useDocumentMeta({
    title: 'Home',
    description: 'प्राजक्तप्रभा - A creative blog showcasing Marathi poetry, dance, and cultural expression. Explore original काव्य, articles, and उखाणे.',
  });

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

        <section className="max-w-6xl mx-auto px-6 md:px-8 pb-12 md:pb-16" data-testid="browse-section">
          <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6 text-center" data-testid="browse-heading">
            विषयानुसार शोधा (Browse by Tag)
          </h2>
          <TagCloud />
          <p className="text-center mt-8">
            <Link href="/archive" className="text-primary hover:underline font-medium" data-testid="link-view-archive">
              पूर्ण संग्रह वर्षानुसार पहा (View the full archive by year) →
            </Link>
          </p>
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
