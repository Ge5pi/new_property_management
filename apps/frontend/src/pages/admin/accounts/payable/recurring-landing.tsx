import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import RecurringCRUD from './components/recurring-form/recurring-form';
import Recurring from './recurring';

const RecurringLanding = () => {
  const { hash } = useLocation();

  const [childRender, handleChildRender] = useState({
    hash: '',
    render: '',
  });

  useEffect(() => {
    if (hash === '#/details') {
      handleChildRender({
        hash: hash,
        render: 'details',
      });
    } else if (hash === '#/edit' || hash === '#/create') {
      handleChildRender({
        hash: hash,
        render: 'crud',
      });
    }

    return () => {
      handleChildRender({
        hash: '',
        render: '',
      });
    };
  }, [hash]);

  if (childRender.render === 'crud') {
    return <RecurringCRUD />;
  }
  return <Recurring />;
};

export default RecurringLanding;
