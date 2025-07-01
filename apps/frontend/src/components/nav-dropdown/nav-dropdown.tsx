import { useCallback, useMemo } from 'react';
import { Dropdown } from 'react-bootstrap';

import { useAuthState } from 'hooks/useAuthState';

import { INavDropdown } from 'interfaces/INav';

import './nav-dropdown.styles.css';

const NavDropdown = ({ Icon = null, items = [], DropdownTitle = '' }: INavDropdown) => {
  const { isAccessible } = useAuthState();
  const isItemEnabled = useCallback((permission: string) => isAccessible(permission), [isAccessible]);
  const isAllItemsDisabled = useMemo(() => {
    return items.every(item => {
      if (item.permission && !isAccessible(item.permission)) return true;
      return false;
    });
  }, [items, isAccessible]);

  if (isAllItemsDisabled) return null;

  return (
    <Dropdown className="sub-navbar-dropdown">
      <Dropdown.Toggle
        variant="primary"
        size="sm"
        className="ms-0 sub-navbar-dropdown-toggle no-dropdown-arrow"
        id="nav-dropdown-actions"
      >
        {Icon}
      </Dropdown.Toggle>
      <Dropdown.Menu className="stay-on-top sub-navbar-dropdown-menu">
        {DropdownTitle && (
          <Dropdown.Item
            as={'div'}
            className="sub-navbar-dropdown-title small"
            onClick={event => event.stopPropagation()}
          >
            {DropdownTitle}
          </Dropdown.Item>
        )}
        {items.map((item, inx) => {
          if (item.permission && !isItemEnabled(item.permission)) {
            return null;
          }

          if (item.divider) {
            return <Dropdown.Divider key={inx} />;
          }

          return (
            <Dropdown.Item className="sub-navbar-dropdown-menu-item small" key={inx} as={'div'} onClick={item.onClick}>
              {item.innerHtml}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NavDropdown;
