import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SOCIAL_LINKS } from '@/lib/social';

export default function SocialMediaSection() {
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
          {SOCIAL_LINKS.map(({ id, name, icon: Icon, url, description }) => (
            <Card key={id} className="hover-elevate transition-all" data-testid={`social-card-${id}`}>
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  data-testid={`button-follow-${id}`}
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    Follow on {name}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
