import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa6';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 560);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      onClick={scrollToTop}
      style={{ bottom: '1.5rem', left: 'auto', position: 'fixed', right: '1.5rem' }}
      className={`focus-ring button-glow z-[9999] grid h-12 w-12 place-items-center rounded-full bg-moss text-white shadow-lift transition duration-300 hover:-translate-y-1 hover:bg-ink sm:h-14 sm:w-14 ${
        isVisible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <FaArrowUp className="relative z-10 text-sm sm:text-base" aria-hidden="true" />
    </button>
  );
}

export default ScrollToTop;
