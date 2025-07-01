import { ReactNode, createContext, useEffect, useState } from 'react';

import { useWindowSize } from 'hooks/useWindowSize';

interface LayoutContextInterface {
  sidebar: boolean;
  toggleSidebar?: () => void;
}

interface Props {
  children?: ReactNode;
}

export const LayoutContext = createContext<LayoutContextInterface | null>(null);
export const LayoutProvider = ({ children }: Props) => {
  const [width] = useWindowSize();
  const [sidebar, setSidebar] = useState<boolean>(false);
  const toggleSidebar = () => {
    if (width <= 1199) {
      setSidebar(!sidebar);
    }
  };

  useEffect(() => {
    if (width > 1199) {
      setSidebar(false);
    }
  }, [width]);

  useEffect(() => {
    if (sidebar && width <= 1199) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [sidebar, width]);

  const values: LayoutContextInterface = {
    sidebar,
    toggleSidebar,
  };

  return <LayoutContext.Provider value={values}>{children}</LayoutContext.Provider>;
};
