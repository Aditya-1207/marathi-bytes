import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      setVisible(scrolled > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Go to top"
      data-testid="button-scroll-to-top"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.75rem',
        height: '2.75rem',
        borderRadius: '50%',
        backgroundColor: 'hsl(27 82% 48%)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
    >
      <ArrowUp style={{ width: '1.25rem', height: '1.25rem' }} />
    </button>
  );
}
