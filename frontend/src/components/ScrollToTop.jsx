import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={`
        fixed bottom-8 right-6 z-50
        p-3 rounded-xl
        bg-accentBlue text-white
        border border-accentBlue/60
        shadow-[0_4px_24px_-4px_rgba(37,99,235,0.5)]
        transition-all duration-300 ease-in-out
        hover:bg-hoverBlue hover:-translate-y-1
        hover:shadow-[0_8px_28px_-4px_rgba(37,99,235,0.6)]
        active:scale-95
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTop;
