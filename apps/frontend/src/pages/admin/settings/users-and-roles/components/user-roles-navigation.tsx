import { ButtonGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

const UsersRolesHeader = () => {
  const [width] = useWindowSize();

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/users-and-roles', 'users-and-roles');

  return (
    <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
      <NavLink id={`radio-users`} className={'btn btn-primary fw-bold primary-tab px-4'} to={path} replace={true} end>
        Users
      </NavLink>
      <NavLink id={`radio-roles`} className={'btn btn-primary fw-bold primary-tab px-4'} to={`${path}/roles`} end>
        Roles
      </NavLink>
    </ButtonGroup>
  );
};

export default UsersRolesHeader;
