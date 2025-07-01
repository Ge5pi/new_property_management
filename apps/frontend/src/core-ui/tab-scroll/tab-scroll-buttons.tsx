import { ReactNode } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { clsx } from 'clsx';

import OutletSuspense from 'components/layouts/layout-container/outlet-suspense';

import { HScroll } from 'core-ui/h-scroll';

interface IProps {
  tabItems: Array<{ key: string; value: string | ReactNode | JSX.Element }>;
  containerClass?: string;
  children?: ReactNode;
}

const TabScrollButtons = ({ children, containerClass = '', tabItems }: IProps) => {
  return (
    <div className="w-100">
      <div className={clsx('position-relative overflow-hidden mx-auto', containerClass)}>
        <Nav className="d-block nav-tabs">
          <HScroll>
            {tabItems.map((tab, inx) => {
              return (
                <Nav.Item key={inx}>
                  <NavLink className="nav-link text-nowrap" to={tab.key} replace={true}>
                    {tab.value}
                  </NavLink>
                </Nav.Item>
              );
            })}
          </HScroll>
        </Nav>
      </div>
      {children ? children : <OutletSuspense />}
    </div>
  );
};

export default TabScrollButtons;
