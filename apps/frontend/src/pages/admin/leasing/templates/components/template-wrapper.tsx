import { ButtonGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

const TemplateWrapper = () => {
  const [width] = useWindowSize();

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/templates', 'templates');

  return (
    <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
      <NavLink id={`radio-vendors`} className={'btn btn-primary fw-bold primary-tab px-4'} to={path} replace={true} end>
        Rental Templates
      </NavLink>
      <NavLink
        id={`radio-vendor-types`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={`${path}/leases`}
        end
      >
        Lease Template
      </NavLink>
    </ButtonGroup>
  );
};

export default TemplateWrapper;
