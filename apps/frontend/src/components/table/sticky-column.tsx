import { useEffect, useRef, useState } from 'react';

import { clsx } from 'clsx';

import { useWindowSize } from 'hooks/useWindowSize';

const StickyColumn = ({ sticky }: { sticky?: boolean }) => {
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [parent, setParent] = useState<HTMLElement | null>(null);
  const [width] = useWindowSize();

  useEffect(() => {
    setParent(prev => {
      if (stickyRef.current) {
        return stickyRef.current.closest('.table-responsive');
      }
      return prev;
    });
  }, [width]);

  if (sticky && width > 480) {
    return (
      <div
        className={clsx('position-absolute end-0 top-0 bottom-0 start-0', {
          'sticky-column': parent && hasScroll(parent, 'horizontal'),
        })}
        ref={stickyRef}
        style={{ zIndex: -1 }}
      />
    );
  }

  return null;
};

const hasScroll = (el: HTMLElement, direction: 'vertical' | 'horizontal') => {
  const dir = direction === 'vertical' ? 'scrollTop' : 'scrollLeft';
  let result = !!el[dir];

  if (!result) {
    el[dir] = 1;
    result = !!el[dir];
    el[dir] = 0;
  }
  return result;
};
export default StickyColumn;
