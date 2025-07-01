import { ButtonGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import OutletSuspense from 'components/layouts/layout-container/outlet-suspense';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

import Statistics from './statistics';

const AdminDashboard = () => {
  const [width] = useWindowSize();

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/dashboard', 'dashboard');

  return (
    <div>
      <Statistics />
      <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
        <NavLink
          id={`radio-general`}
          className={'btn btn-primary fw-bold primary-tab px-4'}
          to={path}
          replace={true}
          end
        >
          General
        </NavLink>
        <NavLink
          id={`radio-financial`}
          className={'btn btn-primary fw-bold primary-tab px-4'}
          to={`${path}/financial`}
          end
        >
          Financial
        </NavLink>
      </ButtonGroup>
      <OutletSuspense />
    </div>
  );
};

export default AdminDashboard;
