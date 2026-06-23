import { useEffect } from 'react';

const gradientSelector = '.card-sheen, .button-glow';

function CursorGradient() {
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(gradientSelector) : null;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      target.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`);
      target.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return null;
}

export default CursorGradient;
