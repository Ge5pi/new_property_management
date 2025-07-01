import { Fragment, useState } from 'react';
import { Button, Container, Nav, NavLink, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { clsx } from 'clsx';

import { BackButton } from 'components/back-button';
import { useLayoutState } from 'components/layouts/hooks';
import { SearchInput } from 'components/search-input';

import { Hamburger } from 'core-ui/hamburger';
import { ArrowBack, GearIcon, LogoutIcon, SearchIcon } from 'core-ui/icons';

import { useAuthState } from 'hooks/useAuthState';
import { useWindowSize } from 'hooks/useWindowSize';

import { PERMISSIONS } from 'constants/permissions';
import { getPathBasedRole } from 'utils/functions';

import './header.styles.css';

const Header = () => {
  const { activeRoute } = useAuthState();

  return (
    <Navbar bg="transparent">
      <Container fluid>
        <Navbar.Brand as={Link} className="navbar-heading fw-black" to={getPathBasedRole(activeRoute)}>
          Moody Rock LLC
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

interface IAuthHeader {
  responsiveMenu?: boolean;
  settingsButton?: boolean;
  onLogout: () => void;
}

export const AuthHeader = ({ responsiveMenu = true, settingsButton = true, onLogout }: IAuthHeader) => {
  const { toggleSidebar, sidebar } = useLayoutState();
  const { isAccessible, activeRoute } = useAuthState();
  const [searchBar, setSearchBarState] = useState<boolean>(false);
  const [width] = useWindowSize();

  const toggleSearch = () => {
    setSearchBarState(!searchBar);
  };

  const handleGoToSettings = () => {
    sessionStorage.setItem('__FROM_PATH__', encodeURIComponent(window.location.pathname));
  };

  const LogoutButtons = (
    <Button
      size="sm"
      className={clsx('navbar-btn navbar-btn-light d-md-block', { searchBar: 'd-none' })}
      variant={'light'}
      onClick={onLogout}
    >
      <LogoutIcon /> <span className={'d-sm-inline-block d-none'}>Logout</span>
    </Button>
  );

  return (
    <Navbar bg="white" variant="light">
      <Container fluid>
        <div className={clsx('align-items-center', { 'd-md-flex d-none': searchBar }, { 'd-flex': !searchBar })}>
          {responsiveMenu && <Hamburger toggled={sidebar} handleToggle={toggleSidebar} />}
          <Navbar.Brand as={Link} className="navbar-heading fw-black" to={getPathBasedRole(activeRoute)}>
            Moody Rock LLC
          </Navbar.Brand>
        </div>
        <Navbar.Collapse id="navbarScroll">
          <Button
            onClick={toggleSearch}
            className={clsx('ms-auto me-2 text-dark d-md-none', { 'd-none': !searchBar })}
            size="sm"
            variant={'outline-secondary'}
          >
            <ArrowBack />
          </Button>
          <Nav className="auth-navbar-items">
            <SearchInput
              formClass={`form-95 d-md-block ${searchBar ? '' : 'd-none'}`}
              placeholder={'Search for anything'}
            />
          </Nav>

          <div className="ms-auto d-flex gap-2">
            <Button
              onClick={toggleSearch}
              className={clsx('ms-auto text-dark d-md-none', { 'd-none': searchBar })}
              size="sm"
              variant="outline-secondary"
            >
              <SearchIcon />
            </Button>
            {settingsButton && isAccessible(PERMISSIONS.SYSTEM_PREFERENCES) ? (
              !responsiveMenu ? (
                <BackButton
                  backToSavedPath
                  title={width <= 600 ? undefined : 'Back to home'}
                  className={clsx('ms-auto d-md-block', { 'd-none': searchBar })}
                />
              ) : (
                <Fragment>
                  <NavLink
                    as={Link}
                    to={'settings/system-preferences'}
                    className={clsx('btn navbar-btn text-primary navbar-btn-light d-md-block btn-sm btn-light', {
                      'd-none': searchBar,
                    })}
                    style={{ padding: '0.25rem 0.5rem' }}
                    onClick={handleGoToSettings}
                  >
                    <GearIcon />
                  </NavLink>
                  {LogoutButtons}
                </Fragment>
              )
            ) : (
              LogoutButtons
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
