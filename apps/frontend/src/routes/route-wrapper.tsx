import { Fragment, PropsWithChildren, useMemo } from 'react';
import { IndexRouteObject, NonIndexRouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { NoteAllowed } from 'components/not-allowed';

import { useAuthState } from 'hooks/useAuthState';

import { getUserAccountType } from 'utils/functions';

import { adminRoutes, AdminLayoutWrapper, LoginPageGuard } from './admin-routes';
import { tenantRoutes, TenantLayoutWrapper, TenantLoginPageGuard } from './tenant-routes';

export declare type RouteWithPermissions = RouteIndex | RouteNonIndex;
declare interface RouteIndex extends Omit<IndexRouteObject, 'children'> {
  key?: string;
  subscription?: boolean;
  children?: undefined;
}

declare interface RouteNonIndex extends Omit<NonIndexRouteObject, 'children'> {
  key?: string;
  subscription?: boolean;
  children?: RouteWithPermissions[];
}

export const RouterWrapper = () => {
  const { activeRoute } = useAuthState();

  const router = useMemo(() => {
    const commonRoutes: RouteWithPermissions[] = [
      {
        path: '/',
        element: <LoginPageGuard />,
      },
      {
        path: 'admin/login',
        element: <LoginPageGuard />,
      },
      {
        path: 'tenant/login',
        element: <TenantLoginPageGuard />,
      },
    ];

    switch (activeRoute) {
      case 'ADMIN':
        return createBrowserRouter([
          ...commonRoutes,
          {
            path: 'admin',
            element: <AdminLayoutWrapper />,
            children: adminRoutes,
          },
        ]);
      case 'TENANT':
        return createBrowserRouter([
          ...commonRoutes,
          {
            path: 'tenant',
            element: <TenantLayoutWrapper />,
            children: tenantRoutes,
          },
        ]);
      default:
        return createBrowserRouter([
          ...commonRoutes,
          {
            path: 'admin',
            element: <AdminLayoutWrapper />,
            children: adminRoutes,
          },
          {
            path: 'tenant',
            element: <TenantLayoutWrapper />,
            children: tenantRoutes,
          },
        ]);
    }
  }, [activeRoute]);

  return <RouterProvider router={router} />;
};

const getRoutes = (arr: RouteWithPermissions[]) => {
  return arr.map(route => {
    if (route.element && route.key) {
      route.element = <AuthGuard routeKey={route.key}>{route.element}</AuthGuard>;
    }

    if (route.element && route.subscription) {
      route.element = <GuardSuperUser subscription={route.subscription}>{route.element}</GuardSuperUser>;
    }

    if (route.children) {
      route.children = getRoutes(route.children);
    }

    return route;
  });
};

const AuthGuard = ({ routeKey, children }: PropsWithChildren<{ routeKey: string }>) => {
  const { isAccessible } = useAuthState();
  const isAllowed = useMemo(() => isAccessible(routeKey), [routeKey, isAccessible]);

  if (isAllowed) {
    return <Fragment>{children}</Fragment>;
  }

  return <NoteAllowed />;
};

const GuardSuperUser = ({ subscription, children }: PropsWithChildren<{ subscription?: boolean }>) => {
  const { user, authenticated } = useAuthState();
  const isAllowed = useMemo(() => {
    const is_superuser = user && getUserAccountType(user) === 'SUPER_ADMIN';
    if (user && !is_superuser && authenticated && subscription) {
      return false;
    }
    return true;
  }, [user, authenticated, subscription]);

  if (!isAllowed) {
    return <NoteAllowed />;
  }

  return <Fragment>{children}</Fragment>;
};