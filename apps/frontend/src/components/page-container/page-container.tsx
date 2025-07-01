import { ReactNode, memo } from 'react';

import { clsx } from 'clsx';

import { useWindowSize } from 'hooks/useWindowSize';

export interface IPageContainer {
  children: ReactNode;
  className?: string;
}

const PageContainer = ({ className = '', children }: IPageContainer) => {
  const [width] = useWindowSize();

  return <div className={clsx({ 'container px-0': width > 2000 }, className)}>{children}</div>;
};

export default memo(PageContainer);
