import { Rss } from 'lucide-react';

interface SiteFooterProps {
  className?: string;
}

export default function SiteFooter({ className = '' }: SiteFooterProps) {
  return (
    <footer className={`bg-muted/30 border-t py-8 ${className}`}>
      <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col items-center gap-3 text-center">
        {/*
          Absolute-from-root, not relative — this footer renders on nested
          routes like /post/<slug>, where a relative "rss.xml" href would
          resolve to /post/rss.xml instead of the site root.
        */}
        <a
          href={`${import.meta.env.BASE_URL}rss.xml`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover-elevate rounded-full px-3 py-1.5"
          data-testid="link-rss"
        >
          <Rss className="w-4 h-4" />
          RSS Feed
        </a>
        <p className="text-muted-foreground" data-testid="footer-text">
          © 2025 प्राजक्तप्रभा. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
