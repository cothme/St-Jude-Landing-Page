import { ReactNode, useEffect, useRef, useState } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default Reveal;
