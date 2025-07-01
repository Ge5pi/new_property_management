import { ButtonGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import OutletSuspense from 'components/layouts/layout-container/outlet-suspense';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

const SystemPreferenceWrapper = () => {
  const [width] = useWindowSize();

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/system-preferences', 'system-preferences');

  return (
    <div>
      <div className="mt-3">
        <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
          <NavLink
            id={`radio-types-categories`}
            className={'btn btn-primary fw-bold primary-tab px-4'}
            to={path}
            replace={true}
            end
          >
            Types & Categories
          </NavLink>
          <NavLink
            id={`radio-general`}
            className={'btn btn-primary fw-bold primary-tab px-4'}
            to={`${path}/general`}
            end
          >
            General
          </NavLink>
          <NavLink
            id={`radio-management-fee`}
            className={'btn btn-primary fw-bold primary-tab px-4'}
            to={`${path}/management-fee`}
            end
          >
            Management Fee
          </NavLink>
        </ButtonGroup>
      </div>
      <OutletSuspense />
    </div>
  );
};

export default SystemPreferenceWrapper;
