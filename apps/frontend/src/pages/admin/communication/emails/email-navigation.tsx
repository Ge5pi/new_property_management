import { ButtonGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

const EmailHeader = () => {
  const [width] = useWindowSize();

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/emails', 'emails');

  return (
    <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
      <NavLink id={`radio-emails`} className={'btn btn-primary fw-bold primary-tab px-4'} to={path} replace={true} end>
        Email
      </NavLink>
      <NavLink
        id={`radio-emails-template`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={`${path}/template`}
        end
      >
        Template
      </NavLink>
    </ButtonGroup>
  );
};

export default EmailHeader;
