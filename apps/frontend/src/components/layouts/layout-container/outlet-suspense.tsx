import { Outlet } from 'react-router-dom';

import { SuspenseHOC } from 'core-ui/suspense/suspense-hoc';

const OutletSuspense = () => {
  return <Outlet />;
};

export default SuspenseHOC(OutletSuspense);
