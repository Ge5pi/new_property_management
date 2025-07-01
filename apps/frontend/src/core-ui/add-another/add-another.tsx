import { Fragment } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

import { clsx } from 'clsx';

import { AddIcon } from 'core-ui/icons';

import { useAuthState } from 'hooks/useAuthState';

import './add-another.styles.css';

interface IProps extends ButtonProps {
  loading?: boolean;
  permission?: string;
}

const AddBtn = ({ className, permission, children = 'Add another', loading, ...props }: IProps) => {
  const { isAccessible } = useAuthState();
  if (permission && !isAccessible(permission)) {
    return null;
  }

  return (
    <Button
      {...props}
      size="sm"
      variant="light"
      className={clsx('btn-add p-1 border-0 d-inline-flex align-items-center', className)}
    >
      {loading ? (
        <span className="btn-loading">
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
        </span>
      ) : (
        <Fragment>
          <AddIcon />
          {children && <span className="mx-1">{children}</span>}
        </Fragment>
      )}
    </Button>
  );
};

export default AddBtn;
