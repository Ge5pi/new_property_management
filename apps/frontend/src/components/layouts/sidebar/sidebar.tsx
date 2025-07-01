import { MouseEventHandler, ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';

import { clsx } from 'clsx';

import { useLayoutState } from 'components/layouts/hooks';

import Breadcrumbs from 'core-ui/breadcrumb/breadcrumbs';

import { useAuthState } from 'hooks/useAuthState';

import { ISidebarRoutes } from 'interfaces/IRoutes';

import './sidebar.styles.css';

interface Props {
  children?: ReactNode;
  routes: ISidebarRoutes[];
  NavAction?: () => JSX.Element;
  noSidebar?: boolean;
}

const Sidebar = ({ children, noSidebar = false, routes, NavAction }: Props) => {
  const { toggleSidebar, sidebar } = useLayoutState();
  const { sidebarLinks } = useAuthState();

  // Todo: Removable | replace routes with context (based on role);
  const validRoutes = useMemo(() => sidebarLinks(routes), [sidebarLinks, routes]);

  return (
    <div className={clsx('wrapper row gx-0 wui-side-menu', { 'no-sidebar': noSidebar })}>
      {!noSidebar && (
        <div id="sidebar" className={clsx('col-auto bg-primary wui-side-menu', { active: sidebar })}>
          <nav>
            <ul className="wui-side-menu-items">
              {validRoutes.map((item, inx) => {
                const navLinks = item.subNav && sidebarLinks(item.subNav);
                const defaultPath = navLinks && navLinks.length > 0 ? `${item.path}/${navLinks[0].path}` : item.path;
                return <SidebarLinks item={item} rootPath={defaultPath} key={inx} navLinks={navLinks} />;
              })}
            </ul>
          </nav>
        </div>
      )}

      <div id="content-wrapper" className="col">
        <div className="bg-white shadow-sm sub-navbar border border-start-0 border-end-0 border-2">
          <Container fluid>
            <Row className="align-items-center justify-content-between flex-wrap">
              {noSidebar && (
                <Col lg={'auto'}>
                  <div style={{ marginLeft: 240 }}></div>
                </Col>
              )}
              <Col>
                <div className="breadcrumb-wrapper">
                  <Breadcrumbs />
                </div>
              </Col>
              {NavAction && (
                <Col xs={'auto'}>
                  <NavAction />
                </Col>
              )}
            </Row>
          </Container>
        </div>
        <div id="content" className="container-fluid">
          {children}
        </div>
      </div>
      <div className={clsx('wui-overlay', { active: sidebar })} onClick={toggleSidebar}></div>
    </div>
  );
};

export default Sidebar;

interface ISidebarLinks {
  item: ISidebarRoutes;
  navLinks?: ISidebarRoutes[];
  rootPath: string;
}

const SidebarLinks = ({ item, rootPath, navLinks }: ISidebarLinks) => {
  const { pathname } = useLocation();
  const { toggleSidebar } = useLayoutState();
  const childRef = useRef(rootPath);

  const [isNavEnabled, setSubNavStatus] = useState(false);
  const [currentPath, setCurrentPath] = useState(rootPath);

  const handleLinkClick: MouseEventHandler<HTMLAnchorElement> = event => {
    if (event.currentTarget.pathname === pathname) {
      event.preventDefault();
    }

    if (navLinks && navLinks.length > 0 && !event.ctrlKey) {
      setSubNavStatus(!isNavEnabled);
      return;
    }
  };

  const handleSubItemClick: MouseEventHandler<HTMLAnchorElement> = event => {
    if (event.currentTarget.pathname === pathname) {
      event.preventDefault();
      return;
    }

    if (!event.ctrlKey) {
      setCurrentPath(event.currentTarget.pathname);
    }
  };

  const Icon = item.icon;

  useLayoutEffect(() => {
    if (navLinks && navLinks.length > 0 && pathname.includes(item.path)) {
      childRef.current = `${item.path}/${navLinks[0].path}`;
      setCurrentPath(pathname);
      setSubNavStatus(true);
      return;
    }

    setSubNavStatus(false);
    setCurrentPath(childRef.current);
  }, [pathname, navLinks, item.path]);

  if (item.path && navLinks && navLinks.length <= 0) return null;

  return (
    <li onClick={toggleSidebar}>
      <NavLink
        to={currentPath}
        className={clsx('wui-side-menu-item', { 'wui-side-menu-dropdown': navLinks && navLinks.length > 0 }, 'small')}
        onClick={handleLinkClick}
      >
        {Icon && (
          <i className="col-auto menu-icon">
            <Icon />
          </i>
        )}
        <span className="col-4 box-title">{item.title}</span>
        {navLinks && navLinks.length > 0 && <IconArrowToggle active={isNavEnabled} />}
      </NavLink>
      {isNavEnabled && navLinks && navLinks.length > 0 && (
        <ul className="wui-side-menu-items wui-side-menu-dropdown-items">
          {navLinks.map((subItem, idx) => (
            <li key={idx}>
              <NavLink
                to={`${item.path}/${subItem.path}`}
                onClick={handleSubItemClick}
                className="link link-light wui-side-menu-dropdown-item small"
              >
                <span className="box-title">{subItem.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const IconArrowToggle = ({ active = false }: { active: boolean }) => {
  return (
    <svg
      width="15"
      height="8"
      viewBox="0 0 15 8"
      className={clsx('arrow', { 'arrow-active': active }, 'col')}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
