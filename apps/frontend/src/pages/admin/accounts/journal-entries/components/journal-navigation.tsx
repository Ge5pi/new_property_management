import { ButtonGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

const JournalHeader = () => {
  const [width] = useWindowSize();

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/journal-entries', 'journal-entries');

  return (
    <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
      <NavLink
        id={`radio-journal-assets`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={path + '/asset'}
        replace={true}
        end
      >
        Assets
      </NavLink>
      <NavLink
        id={`radio-journal-liability`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={path + '/liability'}
        replace={true}
        end
      >
        Liability
      </NavLink>
      <NavLink
        id={`radio-journal-equity`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={path + '/equity'}
        replace={true}
        end
      >
        Equity
      </NavLink>
      <NavLink
        id={`radio-journal-income`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={path + '/income'}
        end
      >
        Income
      </NavLink>
      <NavLink
        id={`radio-journal-expense`}
        className={'btn btn-primary fw-bold primary-tab px-4'}
        to={path + '/expense'}
        end
      >
        Expense
      </NavLink>
    </ButtonGroup>
  );
};

export default JournalHeader;
