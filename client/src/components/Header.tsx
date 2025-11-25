import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Menu, X, Instagram, Youtube, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  categories?: Array<{ id: string; name: string; label: string }>;
  onSearch?: (query: string) => void;
}

export default function Header({ categories = [], onSearch }: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
      console.log('Search triggered:', searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto">
        <div className="pt-6 pb-4 px-6 md:px-8 text-center border-b">
          <Link href="/">
            <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-tight text-primary cursor-pointer hover-elevate inline-block px-4 py-2 rounded-lg" data-testid="site-title">
              प्राजक्तप्रभा
            </h1>
          </Link>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4" data-testid="site-tagline">
            Welcome to my blog, where I share my poetry, passion for dance, and more. Writing, dancing, and humming are my joys. 
            Follow me on Instagram and YouTube for a glimpse into my world.
          </p>
          
          <div className="flex items-center justify-center gap-4 md:gap-6 mt-4" data-testid="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover-elevate rounded-full p-2" data-testid="link-instagram">
              <Instagram className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover-elevate rounded-full p-2" data-testid="link-youtube">
              <Youtube className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover-elevate rounded-full p-2" data-testid="link-facebook">
              <Facebook className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </a>
          </div>
        </div>

        <div className="px-6 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <nav className="hidden md:flex items-center gap-1" data-testid="navigation">
              <Link href="/">
                <Button 
                  variant={location === '/' ? 'secondary' : 'ghost'} 
                  className="font-medium"
                  data-testid="nav-home"
                >
                  Home
                </Button>
              </Link>
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.id}`}>
                  <Button 
                    variant={location === `/category/${category.id}` ? 'secondary' : 'ghost'}
                    className="font-medium"
                    data-testid={`nav-${category.id}`}
                  >
                    {category.label}
                  </Button>
                </Link>
              ))}
              <Link href="/about">
                <Button 
                  variant={location === '/about' ? 'secondary' : 'ghost'}
                  className="font-medium"
                  data-testid="nav-about"
                >
                  About
                </Button>
              </Link>
            </nav>

            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-xs ml-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </form>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4 space-y-2" data-testid="mobile-menu">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant={location === '/' ? 'secondary' : 'ghost'} className="w-full justify-start" data-testid="mobile-nav-home">
                  Home
                </Button>
              </Link>
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.id}`} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant={location === `/category/${category.id}` ? 'secondary' : 'ghost'} className="w-full justify-start" data-testid={`mobile-nav-${category.id}`}>
                    {category.label}
                  </Button>
                </Link>
              ))}
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                <Button variant={location === '/about' ? 'secondary' : 'ghost'} className="w-full justify-start" data-testid="mobile-nav-about">
                  About
                </Button>
              </Link>
              <form onSubmit={handleSearch} className="pt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="mobile-input-search"
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
