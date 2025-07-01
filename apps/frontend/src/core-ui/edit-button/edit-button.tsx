import { Button, ButtonProps } from 'react-bootstrap';

import { clsx } from 'clsx';

import { EditIcon } from 'core-ui/icons';

import { useAuthState } from 'hooks/useAuthState';

import './edit-button.styles.css';

interface IProps extends ButtonProps {
  showText?: boolean;
  permission?: string;
}

const EditBtn = ({ permission, className = '', showText = true, ...props }: IProps) => {
  const { isAccessible } = useAuthState();
  if (permission && !isAccessible(permission)) {
    return null;
  }

  return (
    <Button
      {...props}
      size={'sm'}
      variant={'outline-light'}
      className={clsx('d-inline-flex align-items-center btn-edit', className)}
    >
      <EditIcon size="16" />
      {showText && <span className="ms-1">Edit</span>}
    </Button>
  );
};

export default EditBtn;
