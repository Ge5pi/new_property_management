import { ReactNode, createContext, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { decodeToken } from 'react-jwt';

import { useAuthenticateUserMutation } from 'services/api/auth';

import { LoadingDots } from 'components/loading';

import { Notify } from 'core-ui/toast';

import { getPathBasedRole, getReadableError, getUserAccountType, protectString } from 'utils/functions';

import { ICurrentUser } from 'interfaces/IAvatar';
import { IAuthToken, ISidebarRoutes } from 'interfaces/IRoutes';

import { adminRoutes, tenantRoutes } from 'routes/sidebar';

interface AuthContextInterface {
  authenticated?: boolean;
  handleLogin: (param: boolean, token?: string, cUser?: ICurrentUser) => void;
  handleLogout: () => void;
  sidebarLinks: (SecondarySidebar?: ISidebarRoutes[]) => ISidebarRoutes[];
  isAccessible: (path: string) => boolean;

  routes: ISidebarRoutes[];
  userID: number | null;

  user?: ICurrentUser | null;
  activeRoute: 'LOG_OUT' | 'TENANT' | 'ADMIN';
}

interface Props {
  children?: ReactNode;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);
const AuthProvider = ({ children }: Props) => {
  const [userID, setUserID] = useState<number | null>(null);
  const [routes, setRoutes] = useState<Array<ISidebarRoutes>>([]);

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthentication] = useState<boolean | undefined>();
  const [user, setUser] = useState<ICurrentUser | undefined>();

  const [authenticate] = useAuthenticateUserMutation();

  const activeRoute = useMemo(() => {
    const newActiveRoute = (() => {
      if (user && authenticated) {
        const accountType = getUserAccountType(user);

        if (accountType === 'ADMIN' || accountType === 'SUPER_ADMIN') return 'ADMIN';
        if (accountType === 'TENANT') return 'TENANT';
      }
      return 'LOG_OUT';
    })();
    console.log('activeRoute changed to:', newActiveRoute);
    return newActiveRoute;
  }, [user, authenticated]);

  const handleLogin = useCallback((state?: boolean, token?: string, currentUser?: ICurrentUser) => {
    if (token) {
      const decoded = decodeToken(token) as Partial<IAuthToken>;
      setUserID(decoded.user_id as number);
    }

    if (currentUser) {
      const accountType = getUserAccountType(currentUser);
      if (accountType === 'ADMIN' || accountType === 'SUPER_ADMIN')
        localStorage.setItem('_R_0L', protectString('ADMIN', 'Encrypt'));
      if (accountType === 'TENANT') localStorage.setItem('_R_0L', protectString('TENANT', 'Encrypt'));

      setUser(currentUser);
      if (state) {
        setRoutes(() => (accountType === 'ADMIN' || accountType === 'SUPER_ADMIN' ? adminRoutes : tenantRoutes));
      }
    }

    setAuthentication(state);
  }, []);

  const handleLogout = useCallback((error?: string, ErrorType?: string) => {
    const pathname = window.location.pathname;
    let path = getPathBasedRole('LOG_OUT');

    if (error && ErrorType) {
      path += `?error=${error}&type=${ErrorType}&fallback=${pathname}`;
    } else {
      path += '?logout=success';
    }

    localStorage.removeItem('ppm-session');
    localStorage.removeItem('ppm-session-ref');

    window.location.replace(path);
    if (pathname !== '/') localStorage.removeItem('_R_0L');
  }, []);

  useLayoutEffect(() => {
    const access = localStorage.getItem('ppm-session');
    if (access) {
      const refresh = localStorage.getItem('ppm-session-ref');
      setLoading(true);
      authenticate({ access, refresh })
        .unwrap()
        .then(result => {
          let token = localStorage.getItem('ppm-session') as string;
          if (result.access) {
            localStorage.setItem('ppm-session', result.access);
            if (result.refresh) {
              localStorage.setItem('ppm-session-ref', result.refresh);
            }
            token = result.access;
          }

          handleLogin(true, token, result);
          return;
        })
        .catch(error => {
          handleLogout(getReadableError(error, true), 'Token Verification Failed');
        })
        .finally(() => setLoading(false));

      return;
    }

    handleLogin(false);
    setLoading(false);
  }, [authenticate, handleLogin, handleLogout]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('type');
    const detail = params.get('error');
    if (title && detail) {
      Notify.show({
        title,
        type: 'danger',
        description: detail,
      });
    }
  }, []);

  const sidebarLinks = useCallback(
    (secondaryLinks?: ISidebarRoutes[]) => {
      const sidebar = secondaryLinks && secondaryLinks.length > 0 ? secondaryLinks : routes;
      if (user && authenticated) {
        const is_superuser = getUserAccountType(user) === 'SUPER_ADMIN';
        if (is_superuser) return sidebar;
        return sidebar
          .filter(route => {
            if (route.key) {
              return route.key.split(',').some(g => (user.group_names ?? []).includes(g));
            }
            return true;
          })
          .filter(route => (is_superuser && route.subscription) || !route.subscription);
      }

      return [];
    },
    [user, authenticated, routes]
  );

  const isAccessible = useCallback(
    (group: string) => {
      const is_superuser = user && getUserAccountType(user) === 'SUPER_ADMIN';
      if (user && !is_superuser && authenticated) {
        return group.split(',').some(g => (user.group_names ?? []).includes(g));
      }
      return true;
    },
    [user, authenticated]
  );

  const values: AuthContextInterface = {
    authenticated,
    handleLogin,
    handleLogout,
    sidebarLinks,
    isAccessible,
    activeRoute,
    userID,
    routes,
    user,
  };

  return <AuthContext.Provider value={values}>{loading ? <LoadingDots /> : children}</AuthContext.Provider>;
};

export default AuthProvider;
