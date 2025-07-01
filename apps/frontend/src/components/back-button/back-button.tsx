import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import { clsx } from 'clsx';

import { ArrowBack } from 'core-ui/icons';

import { useAuthState } from 'hooks/useAuthState';

import { getPathBasedRole, protectString } from 'utils/functions';

export interface IBackButton {
  title?: string;
  backToSavedPath?: boolean;
  className?: string;
  returnBack?: boolean;
}

const BackButton = ({ title = 'Back', className = '', backToSavedPath = false, returnBack = false }: IBackButton) => {
  const navigate = useNavigate();
  const { activeRoute } = useAuthState();
  const { key: keyLocation } = useLocation();

  const handleGoBack = () => {
    if (returnBack) navigate(-1);

    const from_path = decodeURIComponent(sessionStorage.getItem('__FROM_PATH__') || '');
    if (from_path && backToSavedPath) {
      sessionStorage.removeItem('__FROM_PATH__');
      navigate(from_path, { replace: true });
      return;
    }

    let path = getPathBasedRole(activeRoute);
    if (path !== '/') {
      path = `${path}/dashboard`;
    }

    const breadcrumb = document.querySelectorAll(".breadcrumb-item:not([data-key=''])");
    if (breadcrumb && breadcrumb.length) {
      const _key = breadcrumb[0].getAttribute('data-key');
      if (_key) {
        path = protectString(_key, 'Decrypt').replaceAll('~', '/');
      }
    }

    const isInitialLocation: boolean = keyLocation === 'default';

    // eslint-disable-next-line
    const to: any = isInitialLocation ? path : -1;
    navigate(to, { replace: true });
  };

  return (
    <Button
      className={clsx(
        'p-0 shadow-none btn btn-link text-primary bg-transparent text-decoration-none d-inline-flex align-items-center',
        className
      )}
      onClick={handleGoBack}
    >
      <ArrowBack />
      <span className="mx-1">{title}</span>
    </Button>
  );
};

export default BackButton;
