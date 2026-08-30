interface SiteFooterProps {
  className?: string;
}

export default function SiteFooter({ className = '' }: SiteFooterProps) {
  return (
    <footer className={`bg-muted/30 border-t py-8 ${className}`}>
      <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
        <p className="text-muted-foreground" data-testid="footer-text">
          © 2025 प्राजक्तप्रभा. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
