import { ButtonGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

const ReceivableHeader = () => {
  const [width] = useWindowSize();

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/receivables', 'receivables');

  return (
    <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
      <NavLink
        id={`radio-receivables`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={path}
        replace={true}
        end
      >
        Rental Invoices
      </NavLink>
      <NavLink id={`radio-charges`} className={'btn btn-primary fw-bold primary-tab px-4'} to={`${path}/charges`} end>
        Charges
      </NavLink>
    </ButtonGroup>
  );
};

export default ReceivableHeader;
