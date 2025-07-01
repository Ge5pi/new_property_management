import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useRedirect = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const modifyCurrentPath = useCallback(
    (path: string, expression: string) => {
      return pathname.replace(new RegExp(`/${expression}(/.*)?$`, 'g'), path).replace(/([^:]\/)\/+/g, '$1');
    },
    [pathname]
  );

  const redirect = useCallback(
    (path: string | -1, replace = false, expression?: string) => {
      if (path === -1) {
        navigate(path);
        return;
      }

      if (expression && expression !== '') {
        navigate(modifyCurrentPath(path, expression), { replace });
        return;
      }

      const redirectPath = `${pathname}/${path}`.replace(/([^:]\/)\/+/g, '$1');
      navigate(redirectPath, { replace });
      return;
    },
    [navigate, pathname, modifyCurrentPath]
  );

  return { redirect, modifyCurrentPath, currentPath: pathname };
};
