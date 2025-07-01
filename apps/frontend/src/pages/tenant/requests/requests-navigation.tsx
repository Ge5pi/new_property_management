import { ButtonGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

const RequestsHeader = () => {
  const [width] = useWindowSize();

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/requests', 'requests');

  return (
    <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
      <NavLink
        id={`radio-requests`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={path}
        replace={true}
        end
      >
        Service Requests
      </NavLink>
      <NavLink
        id={`radio-orders`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={`${path}/work-orders`}
        end
      >
        Work Orders
      </NavLink>
    </ButtonGroup>
  );
};

export default RequestsHeader;
