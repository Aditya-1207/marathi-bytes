import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface AboutSectionProps {
  image: string;
  bioMarathi: string;
  bioEnglish: string;
  onContact?: () => void;
}

export default function AboutSection({ image, bioMarathi, bioEnglish, onContact }: AboutSectionProps) {
  const handleContact = () => {
    if (onContact) {
      onContact();
    }
    console.log('Contact clicked');
  };

  return (
    <section className="py-16 md:py-20" data-testid="about-section">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12" data-testid="about-heading">
          माझ्याबद्दल (About Me)
        </h2>
        
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-6 md:p-8">
            <div className="flex items-center justify-center">
              <img
                src={image}
                alt="Profile"
                className="rounded-xl max-w-sm w-full h-auto shadow-lg"
                data-testid="about-image"
              />
            </div>
            
            <div className="flex flex-col justify-center gap-6">
              <div className="space-y-4">
                <p className="text-lg leading-relaxed" lang="mr" data-testid="about-bio-marathi">
                  {bioMarathi}
                </p>
                <p className="text-base text-muted-foreground leading-relaxed" lang="en" data-testid="about-bio-english">
                  {bioEnglish}
                </p>
              </div>
              
              <Button 
                onClick={handleContact} 
                size="lg"
                className="w-fit"
                data-testid="button-contact"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Me
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
