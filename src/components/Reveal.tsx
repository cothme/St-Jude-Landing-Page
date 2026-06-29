import { ReactNode, useEffect, useRef, useState } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'down' | 'up'>('down');
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState<'down' | 'up'>('down');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      scrollDirection.current = currentY < lastScrollY.current ? 'up' : 'down';
      lastScrollY.current = currentY;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDirection(scrollDirection.current);
          setIsVisible(true);
          return;
        }

        setIsVisible(false);
      },
      { rootMargin: '-8% 0px -8% 0px', threshold: 0.08 },
    );

    window.addEventListener('scroll', handleScroll, { passive: true });
    observer.observe(element);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      data-reveal-direction={direction}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

export default Reveal;
