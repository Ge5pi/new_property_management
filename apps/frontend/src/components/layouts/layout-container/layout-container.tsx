import { LayoutProvider } from 'components/layouts/context/layout-context';
import { AuthHeader } from 'components/layouts/header';
import OutletSuspense from 'components/layouts/layout-container/outlet-suspense';
import { Sidebar } from 'components/layouts/sidebar';

import { useAuthState } from 'hooks/useAuthState';

import { AdminNavbar } from '../admin-navbar';

export interface IAdminLayout {
  noSidebar?: boolean;
}

const AdminLayout = ({ noSidebar = false }: IAdminLayout) => {
  const { routes, handleLogout } = useAuthState();
  return (
    <LayoutProvider>
      <AuthHeader responsiveMenu={!noSidebar} onLogout={handleLogout} />
      <Sidebar noSidebar={noSidebar} routes={routes} NavAction={!noSidebar ? AdminNavbar : undefined}>
        <OutletSuspense />
      </Sidebar>
    </LayoutProvider>
  );
};

export default AdminLayout;

export const TenantLayout = () => {
  const { routes, handleLogout } = useAuthState();
  return (
    <LayoutProvider>
      <AuthHeader settingsButton={false} onLogout={handleLogout} />
      <Sidebar routes={routes}>
        <OutletSuspense />
      </Sidebar>
    </LayoutProvider>
  );
};
