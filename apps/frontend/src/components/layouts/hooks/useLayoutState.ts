import { useContext } from 'react';

import { LayoutContext } from 'components/layouts/context/layout-context';

export const useLayoutState = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayoutState must be used in LayoutProvider');
  return { ...context };
};
