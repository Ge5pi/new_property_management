import { useEffect, useState } from 'react';

export function useWindowScroll() {
  const [scrollPosition, setPosition] = useState({ scrollX: 0, scrollY: 0, bottom: false });

  useEffect(() => {
    function updatePosition() {
      const bottom =
        Math.round(document.documentElement.clientHeight + document.documentElement.scrollTop) >=
        Math.round(document.documentElement.scrollHeight);
      setPosition({ scrollX: window.scrollX, scrollY: window.scrollY, bottom });
    }

    window.addEventListener('scroll', updatePosition);
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
}
