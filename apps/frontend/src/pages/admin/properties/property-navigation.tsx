import { ButtonGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

const PropertyHeader = () => {
  const [width] = useWindowSize();

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/properties', 'properties');

  return (
    <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
      <NavLink
        id={`radio-properties`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={path}
        replace={true}
        end
      >
        Properties
      </NavLink>
      <NavLink
        id={`radio-associations`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={`${path}/associations`}
        end
      >
        Associations
      </NavLink>
    </ButtonGroup>
  );
};

export default PropertyHeader;
