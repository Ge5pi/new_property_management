import { Navigate, Outlet } from 'react-router-dom';

import { useAuthState } from 'hooks/useAuthState';

import { getPathBasedRole } from 'utils/functions';

const PrivateRoute = () => {
  const { activeRoute } = useAuthState();

  const path = getPathBasedRole(activeRoute);
  const pathname = window.location.pathname;

  if (activeRoute === 'LOG_OUT') {
    const root = pathname.startsWith('/admin') || pathname.includes('/admin') ? '/admin' : '/tenant';
    return <Navigate to={`${root}?fallback=${pathname}`} replace />;
  } else {
    if (activeRoute === 'ADMIN') {
      if (path === '/tenant') {
        return <Navigate to={'/admin'} replace />;
      }
    } else {
      if (path === '/admin') {
        return <Navigate to={'/tenant'} replace />;
      }
    }
  }

  return <Outlet />;
};

export default PrivateRoute;

export const ProtectedRoute = () => {
  const { activeRoute } = useAuthState();
  const { pathname } = window.location;
  if (activeRoute === 'ADMIN' || activeRoute === 'TENANT') {
    const path = getPathBasedRole(activeRoute);
    if (pathname.endsWith(path)) {
      return <Navigate to={`${path}/dashboard`} replace />;
    }
  }

  return <Outlet />;
};
