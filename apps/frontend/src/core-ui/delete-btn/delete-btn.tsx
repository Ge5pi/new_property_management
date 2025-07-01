import { Button, ButtonProps } from 'react-bootstrap';

import { clsx } from 'clsx';

import { TrashIcon } from 'core-ui/icons';

import { useAuthState } from 'hooks/useAuthState';

import './delete-btn.styles.css';

interface IProps extends ButtonProps {
  showText?: boolean;
  resetCSS?: boolean;
  permission?: string;
}

const DeleteBtn = ({ resetCSS, permission, showText = false, className, ...props }: IProps) => {
  const { isAccessible } = useAuthState();
  if (permission && !isAccessible(permission)) {
    return null;
  }

  return (
    <Button
      {...props}
      size="sm"
      variant="outline-danger"
      className={clsx('d-inline-flex align-items-center', className, resetCSS ? 'btn-delete-reset' : 'btn-delete')}
    >
      <TrashIcon />
      {showText && <small className="ms-1">Delete</small>}
    </Button>
  );
};

export default DeleteBtn;
