import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import TabScrollButtons from 'core-ui/tab-scroll/tab-scroll-buttons';

import { useAuthState } from 'hooks/useAuthState';

import { settingsRoutes } from 'routes/sidebar';

import OutletSuspense from '../layout-container/outlet-suspense';

import './secondary-sidebar.styles.css';

const SecondarySidebar = () => {
  const { sidebarLinks } = useAuthState();
  const routes = useMemo(() => sidebarLinks(settingsRoutes), [sidebarLinks]);

  return (
    <div className="wrapper row gx-0">
      <div id="secondary-sidebar" className="col-lg-auto">
        <h1 className="fw-bold h4 mt-1 text-capitalize">Settings</h1>
        <TabScrollButtons tabItems={routes.map(r => ({ key: r.path, value: r.title }))} containerClass="d-lg-none">
          <ul className="sidebar-list d-lg-block d-none">
            {routes.map(({ path, title }) => (
              <li key={path}>
                <NavLink className="sidebar-list-item" to={path}>
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>
        </TabScrollButtons>
      </div>

      <div id="secondary-content-wrapper" className="col">
        <OutletSuspense />
      </div>
    </div>
  );
};

export default SecondarySidebar;
