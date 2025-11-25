import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Youtube, Facebook } from 'lucide-react';

interface SocialPlatform {
  name: string;
  icon: typeof Instagram;
  url: string;
  description: string;
}

export default function SocialMediaSection() {
  const platforms: SocialPlatform[] = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com',
      description: 'फोटो आणि व्हिडिओ (Photos & Videos)',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com',
      description: 'व्हिडिओ सामग्री (Video Content)',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com',
      description: 'समुदाय (Community)',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30" data-testid="social-section">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-4" data-testid="social-heading">
          मला फॉलो करा (Follow Me)
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Stay connected with me on social media for daily updates, behind-the-scenes content, and more!
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <Card key={platform.name} className="hover-elevate transition-all" data-testid={`social-card-${platform.name.toLowerCase()}`}>
                <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                  <Button 
                    asChild
                    variant="outline"
                    className="w-full"
                    data-testid={`button-follow-${platform.name.toLowerCase()}`}
                  >
                    <a href={platform.url} target="_blank" rel="noopener noreferrer">
                      Follow on {platform.name}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
