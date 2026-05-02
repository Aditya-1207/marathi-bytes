import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import AboutSection from '@/components/AboutSection';
import SocialMediaSection from '@/components/SocialMediaSection';
import profileImage from '@assets/generated_images/about_section_portrait.png';

export default function AboutPage() {
  const [, setLocation] = useLocation();

  const categories = [
    { id: 'poetry', name: 'Poetry', label: 'काव्य-संग्रह' },
    { id: 'articles', name: 'Articles', label: 'आठवणींचा ठेवा' },
    { id: 'ukhane', name: 'Ukhane', label: 'उखाणे' },
  ];

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 'var(--header-height, 200px)' }}>
      <Header categories={categories} onSearch={handleSearch} />

      <main>
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-8"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <AboutSection
          image={profileImage}
          bioMarathi="मी प्राजक्तप्रभा. लेखन, नृत्य आणि गायन हे माझे आवडते छंद आहेत. मी माझ्या कवितांमधून जीवनातील विविध भावना व्यक्त करते. नृत्य माझ्या जीवनाचा एक महत्त्वाचा भाग आहे आणि मी शास्त्रीय नृत्य शिकत आहे. या ब्लॉगच्या माध्यमातून मी माझे विचार, अनुभव आणि सर्जनशीलता तुमच्यासोबत सामायिक करते. माझ्या ब्लॉगवर तुम्हाला कविता, लेख आणि पारंपरिक मराठी उखाणे वाचायला मिळतील. मी आशा करते की माझे लेखन तुम्हाला आवडेल आणि तुम्ही माझ्या या प्रवासाचा भाग व्हाल."
          bioEnglish="I'm Prajakta Prabha, a passionate writer, dancer, and creative soul. Through my poetry, I express the various emotions and experiences of life. Dance is an integral part of who I am, and I'm trained in classical Indian dance forms. This blog is my platform to share my thoughts, experiences, and creativity with you. Here you'll find poetry that touches the heart, articles about life's moments, and traditional Marathi verses (ukhane). I hope my writing resonates with you and that you'll join me on this creative journey."
          onContact={() => window.location.href = 'mailto:contact@example.com'}
        />

        <SocialMediaSection />
      </main>

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
