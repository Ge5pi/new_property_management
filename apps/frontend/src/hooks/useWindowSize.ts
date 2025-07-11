import { useLayoutEffect, useState } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState<Array<number>>([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
